import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNotifications } from "@/hooks/useNotifications";
import { ArrowLeft, Bell, Volume2 } from "lucide-react";
import { toast } from "sonner";
import { createNotification } from "@/lib/notificationService";

const AdminSettings = () => {
  const navigate = useNavigate();
  const {
    settings,
    updateSettings,
    requestDesktopPermission,
    loading,
    isNotificationSupported,
    getNotificationSupportStatus,
  } = useNotifications();

  const [localSettings, setLocalSettings] = useState(settings);
  const [notificationStatus, setNotificationStatus] = useState<ReturnType<typeof getNotificationSupportStatus> | null>(null);

  // Sync localSettings with settings from hook when settings are loaded/updated
  // Only update if settings are actually loaded (not loading) and have valid data
  useEffect(() => {
    if (!loading && settings && Object.keys(settings).length > 0) {
      setLocalSettings(settings);
    }
  }, [settings, loading]);

  // Check notification support on mount and when permission changes
  useEffect(() => {
    if (isNotificationSupported && getNotificationSupportStatus) {
      setNotificationStatus(getNotificationSupportStatus());
    }
  }, [isNotificationSupported, getNotificationSupportStatus]);

  // Update status when permission changes
  useEffect(() => {
    const checkPermission = () => {
      if (getNotificationSupportStatus) {
        setNotificationStatus(getNotificationSupportStatus());
      }
    };
    
    // Check immediately
    checkPermission();
    
    // Listen for focus events (user might have changed permission in another tab)
    window.addEventListener('focus', checkPermission);
    
    return () => {
      window.removeEventListener('focus', checkPermission);
    };
  }, [getNotificationSupportStatus]);

  const handleSave = async () => {
    await updateSettings(localSettings);
    // Settings will be updated in the hook, which will trigger the useEffect above to sync localSettings
  };

  const handleTestNotification = async () => {
    await createNotification({
      type: "system",
      title: "Test Notification",
      message: "This is a test notification. If you can see this, notifications are working!",
    });
    toast.success("Test notification sent!");
  };

  const handleTestSound = async () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Resume if suspended (required for autoplay policy)
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }
      
      // Wait a bit to ensure context is ready
      if (audioContext.state === 'suspended') {
        toast.error("Audio context is suspended. Please interact with the page first.");
        return;
      }
      
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.25);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.25);
      
      toast.success("Test sound played!");
    } catch (e) {
      console.error('Test sound error:', e);
      toast.error("Failed to play sound: " + (e as Error).message);
    }
  };

  const handleDesktopPushToggle = async (enabled: boolean) => {
    if (enabled) {
      // First time: Request permission when toggle is turned ON
      // This will show browser's permission popup
      const granted = await requestDesktopPermission();
      
      // Always enable the setting - notifications will work via native or fallback
      setLocalSettings({ ...localSettings, desktop_push: true });
      
      // Show brief notification - just "Desktop notifications enabled"
      toast.success("Desktop notifications enabled", {
        duration: 400, // 1 second - brief notification
      });
    } else {
      setLocalSettings({ ...localSettings, desktop_push: false });
      // Show brief notification - just "Desktop notifications disabled"
      toast.success("Desktop notifications disabled", {
        duration: 400, // 1 second - brief notification
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-lg">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-[1200px] mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/admin/dashboard")}
              className="hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-black">Notification Settings</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[800px] mx-auto px-6 py-8">
        <div className="space-y-6">
          {/* Sound Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="h-5 w-5" />
                Sound Notifications
              </CardTitle>
              <CardDescription>
                Play a sound when you receive a notification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="sound-enabled" className="cursor-pointer">
                  Enable notification sound
                </Label>
                <Switch
                  id="sound-enabled"
                  checked={localSettings.sound_enabled}
                  onCheckedChange={(checked) =>
                    setLocalSettings({ ...localSettings, sound_enabled: checked })
                  }
                />
              </div>
              <Button
                variant="outline"
                onClick={handleTestSound}
                className="w-full"
              >
                Play test sound
              </Button>
            </CardContent>
          </Card>

          {/* Desktop Push Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Desktop Notifications
              </CardTitle>
              <CardDescription>
                Show desktop notifications even when the browser tab is not active
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label htmlFor="desktop-push" className="cursor-pointer">
                    Enable desktop notifications
                  </Label>
                </div>
                <Switch
                  id="desktop-push"
                  checked={localSettings.desktop_push}
                  onCheckedChange={handleDesktopPushToggle}
                />
              </div>
              {notificationStatus && notificationStatus.supported && Notification.permission === "denied" && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                  <p className="font-medium mb-1">ℹ️ Native Notifications Blocked</p>
                  <p className="text-xs">
                    Native browser notifications are blocked, but you'll still receive in-app notifications. 
                    To enable native notifications, update your browser settings:
                  </p>
                  <ul className="text-xs mt-2 list-disc list-inside space-y-1">
                    <li><strong>Chrome:</strong> Settings → Privacy → Site Settings → Notifications</li>
                    <li><strong>Firefox:</strong> Preferences → Privacy → Permissions → Notifications</li>
                    <li><strong>Safari:</strong> Preferences → Websites → Notifications</li>
                  </ul>
                </div>
              )}
              {notificationStatus && !notificationStatus.supported && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                  <p className="font-medium mb-1">ℹ️ In-App Notifications</p>
                  <p className="text-xs">
                    Native browser notifications aren't available on this device, but you'll receive in-app notifications 
                    that work on all browsers and devices.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Do Not Disturb */}
          <Card>
            <CardHeader>
              <CardTitle>Do Not Disturb</CardTitle>
              <CardDescription>
                Mute sounds and desktop notifications during specific hours (Asia/Manila time)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="dnd-enabled" className="cursor-pointer">
                  Enable Do Not Disturb
                </Label>
                <Switch
                  id="dnd-enabled"
                  checked={localSettings.dnd_enabled}
                  onCheckedChange={(checked) =>
                    setLocalSettings({ ...localSettings, dnd_enabled: checked })
                  }
                />
              </div>
              {localSettings.dnd_enabled && (
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="space-y-2">
                    <Label htmlFor="dnd-start">Start time</Label>
                    <Input
                      id="dnd-start"
                      type="time"
                      value={localSettings.dnd_start}
                      onChange={(e) =>
                        setLocalSettings({ ...localSettings, dnd_start: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dnd-end">End time</Label>
                    <Input
                      id="dnd-end"
                      type="time"
                      value={localSettings.dnd_end}
                      onChange={(e) =>
                        setLocalSettings({ ...localSettings, dnd_end: e.target.value })
                      }
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Test Notification */}
          <Card>
            <CardHeader>
              <CardTitle>Test Notifications</CardTitle>
              <CardDescription>
                Send a test notification to verify everything is working
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                onClick={handleTestNotification}
                className="w-full"
              >
                Send test notification
              </Button>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => navigate("/admin/dashboard")}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-black text-white hover:bg-gray-800"
            >
              Save settings
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminSettings;
