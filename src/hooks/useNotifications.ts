import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { toZonedTime } from "date-fns-tz";

export type NotificationType = "lead" | "analytics" | "account" | "system";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  created_at: string;
  read: boolean;
  meta?: any;
}

export interface NotificationSettings {
  sound_enabled: boolean;
  desktop_push: boolean;
  dnd_enabled: boolean;
  dnd_start: string;
  dnd_end: string;
  timezone: string;
}

// Create a simple notification beep using Web Audio API
let audioContext: AudioContext | null = null;

const getAudioContext = () => {
  if (!audioContext && typeof window !== 'undefined') {
    try {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      console.error('Failed to create audio context:', e);
    }
  }
  return audioContext;
};

const playNotificationBeep = async () => {
  try {
    const context = getAudioContext();
    if (!context) {
      console.log('Audio context not available');
      return;
    }

    // Resume context if suspended (required for autoplay policy)
    if (context.state === 'suspended') {
      await context.resume();
    }

    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    
    // Pleasant notification beep (two tones)
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, context.currentTime);
    oscillator.frequency.setValueAtTime(1000, context.currentTime + 0.1);
    
    // Volume envelope
    gainNode.gain.setValueAtTime(0, context.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.2, context.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.25);
    
    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + 0.25);
    
    console.log('Notification sound played');
  } catch (e) {
    console.error('Failed to play notification sound:', e);
  }
};

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [settings, setSettings] = useState<NotificationSettings>({
    sound_enabled: true,
    desktop_push: false,
    dnd_enabled: false,
    dnd_start: "22:00",
    dnd_end: "07:00",
    timezone: "Asia/Manila",
  });
  const [loading, setLoading] = useState(true);

  // Check if we're in DND mode
  const isInDNDMode = () => {
    if (!settings.dnd_enabled) return false;
    
    const now = new Date();
    const timezone = settings.timezone;
    const zonedNow = toZonedTime(now, timezone);
    const hours = zonedNow.getHours();
    const minutes = zonedNow.getMinutes();
    const currentTime = hours * 60 + minutes;
    
    const [startHour, startMin] = settings.dnd_start.split(":").map(Number);
    const [endHour, endMin] = settings.dnd_end.split(":").map(Number);
    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;
    
    if (startTime < endTime) {
      return currentTime >= startTime && currentTime < endTime;
    } else {
      return currentTime >= startTime || currentTime < endTime;
    }
  };

  // Play notification sound
  const playSound = async () => {
    if (settings.sound_enabled && !isInDNDMode()) {
      console.log('Attempting to play notification sound...');
      await playNotificationBeep();
    } else {
      console.log('Sound disabled or in DND mode');
    }
  };

  // Show desktop notification
  const showDesktopNotification = (title: string, message: string) => {
    if (settings.desktop_push && !isInDNDMode() && "Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification(title, {
          body: message,
          icon: "/favicon.ico",
        });
      }
    }
  };

  // Show toast notification
  const showToast = (notification: Notification) => {
    if (isInDNDMode()) return;

    const typeConfig = {
      lead: { icon: "👤", variant: "default" as const },
      analytics: { icon: "📊", variant: "default" as const },
      account: { icon: "🔐", variant: "default" as const },
      system: { icon: "⚙️", variant: "default" as const },
    };

    const config = typeConfig[notification.type];
    
    toast(notification.title, {
      description: notification.message,
      icon: config.icon,
      duration: 4000,
    });

    playSound();
    showDesktopNotification(notification.title, notification.message);
  };

  // Fetch notifications
  const fetchNotifications = async () => {
    const { data, error } = await supabase
      .from("admin_notifications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching notifications:", error);
      return;
    }

    setNotifications((data || []) as Notification[]);
    setUnreadCount(data?.filter((n) => !n.read).length || 0);
  };

  // Fetch settings
  const fetchSettings = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("admin_settings")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching settings:", error);
      return;
    }

    if (data) {
      setSettings({
        sound_enabled: data.sound_enabled,
        desktop_push: data.desktop_push,
        dnd_enabled: data.dnd_enabled,
        dnd_start: data.dnd_start,
        dnd_end: data.dnd_end,
        timezone: data.timezone,
      });
    } else {
      // Create default settings
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("admin_settings").insert({
          user_id: user.id,
          sound_enabled: true,
          desktop_push: false,
          dnd_enabled: false,
          dnd_start: "22:00",
          dnd_end: "07:00",
          timezone: "Asia/Manila",
        });
      }
    }
  };

  // Mark as read
  const markAsRead = async (id: string) => {
    const { error } = await supabase
      .from("admin_notifications")
      .update({ read: true })
      .eq("id", id);

    if (error) {
      console.error("Error marking notification as read:", error);
      return;
    }

    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  // Mark all as read
  const markAllAsRead = async () => {
    const { error } = await supabase
      .from("admin_notifications")
      .update({ read: true })
      .eq("read", false);

    if (error) {
      console.error("Error marking all as read:", error);
      return;
    }

    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  // Update settings
  const updateSettings = async (newSettings: Partial<NotificationSettings>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("admin_settings")
      .update(newSettings)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error updating settings:", error);
      toast.error("Failed to save settings");
      return;
    }

    setSettings((prev) => ({ ...prev, ...newSettings }));
    toast.success("Settings saved successfully");
  };

  // Request desktop notification permission
  const requestDesktopPermission = async () => {
    if ("Notification" in window && Notification.permission === "default") {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    }
    return Notification.permission === "granted";
  };

  // Format time with timezone
  const formatNotificationTime = (timestamp: string) => {
    const zonedTime = toZonedTime(new Date(timestamp), settings.timezone);
    return formatDistanceToNow(zonedTime, { addSuffix: true });
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchSettings();
      await fetchNotifications();
      setLoading(false);
    };

    init();

    // Subscribe to realtime changes
    const channel = supabase
      .channel("admin_notifications_changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "admin_notifications",
        },
        (payload) => {
          const newNotification = payload.new as Notification;
          setNotifications((prev) => [newNotification, ...prev]);
          setUnreadCount((prev) => prev + 1);
          showToast(newNotification);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "admin_notifications",
        },
        (payload) => {
          const updated = payload.new as Notification;
          setNotifications((prev) =>
            prev.map((n) => (n.id === updated.id ? updated : n))
          );
          setUnreadCount((prev) => {
            const oldRead = (payload.old as Notification).read;
            if (!oldRead && updated.read) return Math.max(0, prev - 1);
            if (oldRead && !updated.read) return prev + 1;
            return prev;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [settings.sound_enabled, settings.desktop_push, settings.dnd_enabled]);

  return {
    notifications,
    unreadCount,
    settings,
    loading,
    markAsRead,
    markAllAsRead,
    updateSettings,
    requestDesktopPermission,
    formatNotificationTime,
    fetchNotifications,
  };
};
