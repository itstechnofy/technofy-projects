import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { authService, rolesService, leadsService, type Lead } from "@/lib/dataService";
import { LogOut, Search, Download, Mail, MessageCircle, Send, ExternalLink } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const AdminDashboard = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"New" | "Follow Up" | "Closed">("New");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuthAndLoadLeads();
  }, []);

  useEffect(() => {
    filterLeads();
  }, [leads, searchQuery, statusFilter, sourceFilter]);

  const checkAuthAndLoadLeads = async () => {
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

    await loadLeads();
  };

  const loadLeads = async () => {
    setLoading(true);
    const { data, error } = await leadsService.getAllLeads();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load leads",
        variant: "destructive",
      });
    } else if (data) {
      setLeads(data);
    }
    setLoading(false);
  };

  const filterLeads = () => {
    let filtered = leads;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (lead) =>
          lead.name.toLowerCase().includes(query) ||
          (lead.phone && lead.phone.toLowerCase().includes(query))
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((lead) => lead.status === statusFilter);
    }

    if (sourceFilter !== "all") {
      filtered = filtered.filter((lead) => lead.where_did_you_find_us === sourceFilter);
    }

    setFilteredLeads(filtered);
  };

  const handleLogout = async () => {
    await authService.signOut();
    navigate("/admin");
  };

  const openLeadDetails = (lead: Lead) => {
    setSelectedLead(lead);
    setNotes(lead.notes || "");
    setStatus(lead.status);
    setSheetOpen(true);
  };

  const handleUpdateLead = async () => {
    if (!selectedLead) return;

    const { error } = await leadsService.updateLead(selectedLead.id, {
      status,
      notes,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update lead",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Lead updated successfully",
      });
      setSheetOpen(false);
      await loadLeads();
    }
  };

  const handleContactClick = (lead: Lead) => {
    const encodedMessage = encodeURIComponent(
      `Hi ${lead.name}, following up on your inquiry.`
    );

    // Format phone number for international use (add + and country code if missing)
    const formatPhoneForUrl = (phone: string | null): string => {
      if (!phone) return "";
      // Remove all non-numeric characters except +
      let cleaned = phone.replace(/[^\d+]/g, "");
      // If doesn't start with +, add +63 (Philippines country code)
      if (!cleaned.startsWith("+")) {
        cleaned = "+63" + cleaned;
      }
      return cleaned;
    };

    let url = "";
    switch (lead.contact_method) {
      case "whatsapp":
        const whatsappPhone = formatPhoneForUrl(lead.phone);
        url = `https://api.whatsapp.com/send?phone=${whatsappPhone}&text=${encodedMessage}`;
        break;
      case "viber":
        const viberPhone = formatPhoneForUrl(lead.phone).replace("+", "%2B");
        url = `viber://chat?number=${viberPhone}`;
        break;
      case "email":
        url = `mailto:technofyph@gmail.com?subject=Re: Your Inquiry&body=${encodedMessage}`;
        break;
      case "messenger":
        url = `https://m.me/yourpageusername`;
        break;
    }

    if (url) {
      window.open(url, "_blank");
    }
  };

  const exportToCSV = () => {
    if (filteredLeads.length === 0) {
      toast({
        title: "No data",
        description: "No leads to export",
        variant: "destructive",
      });
      return;
    }

    const headers = [
      "ID",
      "Name",
      "Phone",
      "Message",
      "Where Found",
      "Contact Method",
      "Status",
      "Created At (UTC)",
      "Created At (PH Time)",
    ];

    const rows = filteredLeads.map((lead) => {
      const utcDate = new Date(lead.created_at);
      const phDate = new Date(utcDate.getTime() + 8 * 60 * 60 * 1000); // UTC+8
      return [
        lead.id,
        lead.name,
        lead.phone || "",
        lead.message.replace(/"/g, '""'),
        lead.where_did_you_find_us || "",
        lead.contact_method,
        lead.status,
        utcDate.toISOString(),
        phDate.toLocaleString("en-PH", { timeZone: "Asia/Manila" }),
      ];
    });

    const csvContent = [
      headers.map((h) => `"${h}"`).join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const now = new Date();
    const filename = `leads-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}-${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}-PH.csv`;
    
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();

    toast({
      title: "Export successful",
      description: `Downloaded ${filteredLeads.length} leads`,
    });
  };

  const getStats = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

    const todayCount = leads.filter((l) => new Date(l.created_at) >= today).length;
    const weekCount = leads.filter((l) => new Date(l.created_at) >= weekAgo).length;
    const monthCount = leads.filter((l) => new Date(l.created_at) >= monthAgo).length;

    const sources: Record<string, number> = {};
    leads.forEach((lead) => {
      if (lead.where_did_you_find_us) {
        sources[lead.where_did_you_find_us] = (sources[lead.where_did_you_find_us] || 0) + 1;
      }
    });

    const topSources = Object.entries(sources)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    return { todayCount, weekCount, monthCount, topSources };
  };

  const stats = getStats();
  const uniqueSources = Array.from(new Set(leads.map((l) => l.where_did_you_find_us).filter(Boolean)));

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const phDate = new Date(date.getTime() + 8 * 60 * 60 * 1000);
    return phDate.toLocaleString("en-PH", { 
      timeZone: "Asia/Manila",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card p-6 rounded-lg shadow-sm border">
            <p className="text-sm text-muted-foreground">Today</p>
            <p className="text-3xl font-bold">{stats.todayCount}</p>
          </div>
          <div className="bg-card p-6 rounded-lg shadow-sm border">
            <p className="text-sm text-muted-foreground">This Week</p>
            <p className="text-3xl font-bold">{stats.weekCount}</p>
          </div>
          <div className="bg-card p-6 rounded-lg shadow-sm border">
            <p className="text-sm text-muted-foreground">This Month</p>
            <p className="text-3xl font-bold">{stats.monthCount}</p>
          </div>
          <div className="bg-card p-6 rounded-lg shadow-sm border">
            <p className="text-sm text-muted-foreground mb-2">Top Sources</p>
            {stats.topSources.map(([source, count]) => (
              <p key={source} className="text-sm">
                {source}: <span className="font-semibold">{count}</span>
              </p>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card p-4 rounded-lg shadow-sm border space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Follow Up">Follow Up</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                {uniqueSources.map((source) => (
                  <SelectItem key={source} value={source!}>
                    {source}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={exportToCSV} variant="outline" className="w-full md:w-auto">
            <Download className="w-4 h-4 mr-2" />
            Export to CSV
          </Button>
        </div>

        {/* Table */}
        <div className="bg-card rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Phone</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Where Found</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Method</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Created</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    onClick={() => openLeadDetails(lead)}
                    className="border-t hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3 text-sm">{lead.name}</td>
                    <td className="px-4 py-3 text-sm">{lead.phone || "—"}</td>
                    <td className="px-4 py-3 text-sm">{lead.where_did_you_find_us || "—"}</td>
                    <td className="px-4 py-3 text-sm capitalize">{lead.contact_method}</td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          lead.status === "New"
                            ? "bg-blue-100 text-blue-800"
                            : lead.status === "Follow Up"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">{formatDate(lead.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredLeads.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                No leads found
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lead Detail Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          {selectedLead && (
            <>
              <SheetHeader>
                <SheetTitle>Lead Details</SheetTitle>
                <SheetDescription>
                  View and update lead information
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-6 mt-6">
                <div>
                  <Label className="text-sm font-semibold">Name</Label>
                  <p className="text-lg mt-1">{selectedLead.name}</p>
                </div>

                {selectedLead.phone && (
                  <div>
                    <Label className="text-sm font-semibold">Phone</Label>
                    <p className="text-lg mt-1">{selectedLead.phone}</p>
                  </div>
                )}

                <div>
                  <Label className="text-sm font-semibold">Message</Label>
                  <p className="mt-1 whitespace-pre-wrap">{selectedLead.message}</p>
                </div>

                {selectedLead.where_did_you_find_us && (
                  <div>
                    <Label className="text-sm font-semibold">Where Found</Label>
                    <p className="mt-1">{selectedLead.where_did_you_find_us}</p>
                  </div>
                )}

                <div>
                  <Label className="text-sm font-semibold">Contact Method</Label>
                  <p className="mt-1 capitalize">{selectedLead.contact_method}</p>
                </div>

                <div>
                  <Label className="text-sm font-semibold">Created At</Label>
                  <p className="mt-1">{formatDate(selectedLead.created_at)}</p>
                </div>

                <div className="pt-4 border-t">
                  <Button
                    onClick={() => handleContactClick(selectedLead)}
                    variant="outline"
                    className="w-full"
                  >
                    {selectedLead.contact_method === "whatsapp" && <MessageCircle className="w-4 h-4 mr-2" />}
                    {selectedLead.contact_method === "viber" && <MessageCircle className="w-4 h-4 mr-2" />}
                    {selectedLead.contact_method === "messenger" && <Send className="w-4 h-4 mr-2" />}
                    {selectedLead.contact_method === "email" && <Mail className="w-4 h-4 mr-2" />}
                    Open {selectedLead.contact_method}
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={status} onValueChange={(v: any) => setStatus(v)}>
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="New">New</SelectItem>
                      <SelectItem value="Follow Up">Follow Up</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Admin Only)</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add internal notes..."
                    rows={4}
                  />
                </div>

                <Button onClick={handleUpdateLead} className="w-full">
                  Update Lead
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AdminDashboard;
