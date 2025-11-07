import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { authService, rolesService } from "@/lib/dataService";
import { LogOut, Settings } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LeadsTab from "@/components/admin/LeadsTab";
import AnalyticsTab from "@/components/admin/AnalyticsTab";
import NotificationBell from "@/components/admin/NotificationBell";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("leads");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { session } = await authService.getSession();
    if (!session?.user) {
      navigate("/admin");
      return;
    }

    const isAdmin = await rolesService.checkIfAdmin(session.user.id);
    if (!isAdmin) {
      toast({
        title: "Access denied",
        description: "You do not have admin privileges",
        variant: "destructive",
      });
      navigate("/admin");
      return;
    }

    setLoading(false);
  };

  const handleLogout = async () => {
    await authService.signOut();
    navigate("/admin");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-[1600px] mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-black">Admin Dashboard</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-600">Technofy</span>
            <NotificationBell />
            <Button 
              onClick={() => navigate("/admin/settings")} 
              variant="outline"
              size="icon"
              className="border-gray-200 hover:bg-gray-100"
            >
              <Settings className="w-5 h-5" />
            </Button>
            <Button 
              onClick={handleLogout} 
              variant="outline"
              className="border-black text-black hover:bg-black hover:text-white"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-gray-100 border border-gray-200 mb-8">
            <TabsTrigger 
              value="leads"
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
          </TabsList>

          <TabsContent value="leads" className="mt-0">
            <LeadsTab />
          </TabsContent>

          <TabsContent value="analytics" className="mt-0">
            <AnalyticsTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
