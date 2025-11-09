import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNotifications } from "@/hooks/useNotifications";
import { ArrowLeft, CheckCheck, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

const AdminNotifications = () => {
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    formatNotificationTime,
    loading,
  } = useNotifications();
  
  const [activeTab, setActiveTab] = useState<string>("all");

  const filteredNotifications =
    activeTab === "all"
      ? notifications
      : notifications.filter((n) => n.type === activeTab);

  const unreadNotifications = notifications.filter((n) => !n.read);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "lead":
        return "👤";
      case "analytics":
        return "📊";
      case "account":
        return "🔐";
      case "system":
        return "⚙️";
      default:
        return "🔔";
    }
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      lead: "bg-blue-100 text-blue-700",
      analytics: "bg-purple-100 text-purple-700",
      account: "bg-green-100 text-green-700",
      system: "bg-gray-100 text-gray-700",
    };
    return colors[type as keyof typeof colors] || colors.system;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-lg">Loading notifications...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-[1200px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/admin/dashboard")}
                className="hover:bg-gray-100"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-black">Notifications</h1>
                {unreadCount > 0 && (
                  <p className="text-sm text-gray-600 mt-1">
                    {unreadCount} unread notification{unreadCount > 1 ? "s" : ""}
                  </p>
                )}
              </div>
            </div>
            {unreadCount > 0 && (
              <Button
                onClick={markAllAsRead}
                variant="outline"
                className="border-black text-black hover:bg-black hover:text-white"
              >
                <CheckCheck className="w-4 h-4 mr-2" />
                Mark all as read
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1200px] mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-gray-100 border border-gray-200 mb-6">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-black data-[state=active]:text-white"
            >
              All
              {notifications.length > 0 && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {notifications.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="lead"
              className="data-[state=active]:bg-black data-[state=active]:text-white"
            >
              Leads
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-black data-[state=active]:text-white"
            >
              Analytics
            </TabsTrigger>
            <TabsTrigger
              value="account"
              className="data-[state=active]:bg-black data-[state=active]:text-white"
            >
              Account
            </TabsTrigger>
            <TabsTrigger
              value="system"
              className="data-[state=active]:bg-black data-[state=active]:text-white"
            >
              System
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            {filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Bell className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No notifications
                </h3>
                <p className="text-sm text-gray-500">
                  {activeTab === "all"
                    ? "You're all caught up!"
                    : `No ${activeTab} notifications yet`}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all",
                      !notification.read && "bg-blue-50/30 border-blue-200"
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-3xl flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900">
                              {notification.title}
                            </h3>
                            <Badge
                              className={cn("text-xs", getTypeBadge(notification.type))}
                            >
                              {notification.type}
                            </Badge>
                            {!notification.read && (
                              <Badge variant="default" className="text-xs">
                                Unread
                              </Badge>
                            )}
                          </div>
                          {!notification.read && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => markAsRead(notification.id)}
                              className="hover:bg-gray-100 text-xs"
                            >
                              Mark as read
                            </Button>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 mb-2">
                          {notification.message}
                        </p>
                        <span className="text-xs text-gray-500">
                          {formatNotificationTime(notification.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminNotifications;
