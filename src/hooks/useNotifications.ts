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
let audioContextInitialized = false;

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

// Initialize audio context with user interaction
const initializeAudioContext = async () => {
  if (audioContextInitialized) return;
  
  const context = getAudioContext();
  if (!context) return;
  
  try {
    // Resume context if suspended (required for autoplay policy)
    if (context.state === 'suspended') {
      await context.resume();
    }
    audioContextInitialized = true;
    console.log('Audio context initialized');
  } catch (e) {
    console.error('Failed to initialize audio context:', e);
  }
};

const playNotificationBeep = async () => {
  try {
    const context = getAudioContext();
    if (!context) {
      console.log('Audio context not available');
      return;
    }

    // Ensure context is initialized and resumed
    if (!audioContextInitialized || context.state === 'suspended') {
      await initializeAudioContext();
    }

    // Double-check state after initialization
    if (context.state === 'suspended') {
      console.log('Audio context still suspended, cannot play sound');
      return;
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

  // Show desktop notification with universal fallback for all browsers
  const showDesktopNotification = async (title: string, message: string) => {
    if (!settings.desktop_push || isInDNDMode()) {
      return;
    }

    // Try native browser notifications first (if supported)
    if ("Notification" in window) {
      try {
        // Check permission and request if needed
        if (Notification.permission === "default") {
          try {
            const permission = await Notification.requestPermission();
            if (permission === "granted") {
              // Permission granted, show native notification
              await showNativeNotification(title, message);
              return;
            }
            // If permission denied or still default, fall through to fallback
          } catch (error) {
            console.log('Error requesting notification permission:', error);
            // Fall through to fallback
          }
        } else if (Notification.permission === "granted") {
          // Permission already granted, show native notification
          await showNativeNotification(title, message);
          return;
        }
        // If permission is "denied", fall through to fallback
      } catch (error) {
        console.log('Native notification failed, using fallback:', error);
        // Fall through to fallback
      }
    }

    // Universal fallback: Always show toast notification for all browsers
    // This ensures notifications work everywhere, just using different methods
    showFallbackNotification(title, message);
  };

  // Show native browser notification
  const showNativeNotification = async (title: string, message: string) => {
    try {
      const notificationOptions: NotificationOptions = {
        body: message,
        tag: "admin-notification",
        requireInteraction: false,
      };

      // Add icon and badge (gracefully handle unsupported options)
      try {
        notificationOptions.icon = "/favicon.ico";
        notificationOptions.badge = "/favicon.ico";
      } catch (e) {
        // Some browsers don't support all options, continue without them
      }

      const notification = new Notification(title, notificationOptions);
      
      // Auto-close notification after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);

      // Handle notification click
      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    } catch (error) {
      console.error('Failed to create native notification:', error);
      throw error; // Re-throw to trigger fallback
    }
  };

  // Fallback notification method (works on all browsers)
  const showFallbackNotification = (title: string, message: string) => {
    // Use toast notification as universal fallback
    // This works on ALL browsers including iOS Safari
    // Determine icon based on title/message content for consistency
    let icon = "🔔";
    if (title.includes("Lead") || message.includes("lead")) icon = "👤";
    else if (title.includes("Analytics") || message.includes("analytics")) icon = "📊";
    else if (title.includes("Account") || message.includes("account")) icon = "🔐";
    else if (title.includes("System") || message.includes("system")) icon = "⚙️";
    
    toast(title, {
      description: message,
      icon: icon,
      duration: 6000, // Longer duration for desktop notifications
      position: "top-right",
      style: {
        background: "white",
        border: "1px solid #e5e7eb",
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
      },
    });
  };

  // Show toast notification (this is the main notification display)
  const showToast = async (notification: Notification) => {
    if (isInDNDMode()) return;

    const typeConfig = {
      lead: { icon: "👤", variant: "default" as const },
      analytics: { icon: "📊", variant: "default" as const },
      account: { icon: "🔐", variant: "default" as const },
      system: { icon: "⚙️", variant: "default" as const },
    };

    const config = typeConfig[notification.type];
    
    // Play sound
    playSound();
    
    // If desktop notifications are enabled, use desktop notification system
    // (which will show native if available, otherwise fallback toast)
    // Otherwise, show regular toast
    if (settings.desktop_push) {
      await showDesktopNotification(notification.title, notification.message);
    } else {
      // Desktop notifications disabled, show regular toast
      toast(notification.title, {
        description: notification.message,
        icon: config.icon,
        duration: 4000,
      });
    }
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

  // Check if notifications are supported
  const isNotificationSupported = () => {
    // Check if Notification API exists
    if (!("Notification" in window)) {
      return false;
    }
    
    // iOS Safari doesn't support notifications well
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    
    // Safari desktop has limited support (requires user gesture and may need service worker)
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    
    // Mobile browsers generally have limited notification support
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Notifications work best on desktop Chrome, Firefox, Edge
    // Safari and mobile have limitations
    return !isIOS; // iOS doesn't support web notifications well
  };

  // Get notification support status with details
  const getNotificationSupportStatus = () => {
    const supported = isNotificationSupported();
    const hasNotificationAPI = "Notification" in window;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    return {
      supported,
      hasNotificationAPI,
      isIOS,
      isSafari,
      isMobile,
      reason: !hasNotificationAPI 
        ? "Your browser doesn't support notifications"
        : isIOS 
        ? "iOS Safari doesn't support web notifications. Please use Chrome or Firefox on iOS."
        : isSafari && isMobile
        ? "Mobile Safari has limited notification support. Please use Chrome or Firefox."
        : isSafari
        ? "Safari requires a user gesture to request notification permission"
        : !supported
        ? "Notifications may not work on this device/browser"
        : null
    };
  };

  // Request desktop notification permission - works on all browsers
  // Returns true if native notifications are available, false otherwise
  // But notifications will still work via fallback method
  const requestDesktopPermission = async () => {
    // Try to request native notification permission
    if ("Notification" in window) {
      try {
        if (Notification.permission === "default") {
          const permission = await Notification.requestPermission();
          return permission === "granted";
        }
        return Notification.permission === "granted";
      } catch (error) {
        console.log('Error requesting notification permission:', error);
        // Return false but notifications will still work via fallback
        return false;
      }
    }
    
    // No native notifications, but fallback will work
    return false;
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
      
      // Initialize audio context on component mount (user has interacted with page)
      if (typeof window !== 'undefined') {
        // Initialize audio context when user interacts with the page
        const initAudio = async () => {
          await initializeAudioContext();
        };
        
        // Try to initialize on any user interaction
        const events = ['click', 'touchstart', 'keydown'];
        const initOnce = () => {
          initAudio();
          events.forEach(e => document.removeEventListener(e, initOnce));
        };
        events.forEach(e => document.addEventListener(e, initOnce, { once: true }));
        
        // Also try immediately if page is already interactive
        if (document.readyState === 'complete') {
          initAudio();
        }
      }
      
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
    isNotificationSupported,
    getNotificationSupportStatus,
  };
};
