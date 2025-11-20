import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { leadsService, type Lead } from "@/lib/dataService";
import { Search, Download, Mail, MessageCircle, Send, ExternalLink, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { notifyLeadStatusChanged, notifyLeadNoteAdded, notifyLeadsExportComplete } from "@/lib/notificationService";
import { supabase } from "@/integrations/supabase/client";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const LeadsTab = () => {
  console.log('🎯 LeadsTab component rendering...');
  
  const [leads, setLeads] = useState<Lead[]>([]);
  const [allLeads, setAllLeads] = useState<Lead[]>([]); // For stats and sources
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"New" | "Follow Up" | "Closed">("New");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalCount, setTotalCount] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const loadLeads = useCallback(async () => {
    // Check authentication first
    const { data: { session } } = await supabase.auth.getSession();
    console.log('🔐 Admin session check:', {
      hasSession: !!session,
      userId: session?.user?.id,
      email: session?.user?.email
    });

    // Fetch from both tables and combine
    console.log('🔍 Loading leads from both tables...');
    const [oldLeadsResult, newLeadsResult] = await Promise.all([
      supabase
        .from("leads")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (supabase as any)
        .from("contact_submissions")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false }),
    ]);

    console.log('📊 Leads query results:', {
      oldLeads: {
        data: oldLeadsResult.data?.length || 0,
        error: oldLeadsResult.error,
        count: oldLeadsResult.count
      },
      newLeads: {
        data: newLeadsResult.data?.length || 0,
        error: newLeadsResult.error,
        count: newLeadsResult.count
      }
    });

    // Combine results
    const allLeads: Lead[] = [];
    let totalCount = 0;

    if (oldLeadsResult.data) {
      console.log('✅ Old leads data received:', oldLeadsResult.data.length, 'records');
      allLeads.push(...(oldLeadsResult.data as Lead[]));
      totalCount += oldLeadsResult.count || 0;
    } else {
      console.log('⚠️ Old leads data is null or undefined');
    }

    if (newLeadsResult.data) {
      console.log('✅ New leads (contact_submissions) data received:', newLeadsResult.data.length, 'records');
      allLeads.push(...(newLeadsResult.data as Lead[]));
      totalCount += newLeadsResult.count || 0;
    } else {
      console.log('⚠️ New leads (contact_submissions) data is null or undefined');
      if (newLeadsResult.error) {
        console.error('❌ Contact submissions error:', newLeadsResult.error);
      }
    }

    // Apply filters to combined data
    let filteredLeads = allLeads;

    if (searchQuery) {
      const search = searchQuery.toLowerCase();
      filteredLeads = filteredLeads.filter(
        (lead) =>
          lead.name.toLowerCase().includes(search) ||
          (lead.phone && lead.phone.toLowerCase().includes(search))
      );
    }

    if (statusFilter !== "all") {
      filteredLeads = filteredLeads.filter((lead) => lead.status === statusFilter);
    }

    if (sourceFilter !== "all") {
      filteredLeads = filteredLeads.filter(
        (lead) => lead.where_did_you_find_us === sourceFilter
      );
    }

    // Sort by created_at descending
    filteredLeads.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    // Apply pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    const paginatedLeads = filteredLeads.slice(from, to);

    if (oldLeadsResult.error || newLeadsResult.error) {
      console.error('Error loading leads:', {
        oldLeadsError: oldLeadsResult.error,
        newLeadsError: newLeadsResult.error
      });
      toast({
        title: "Error",
        description: `Failed to load leads: ${oldLeadsResult.error?.message || newLeadsResult.error?.message || 'Unknown error'}`,
        variant: "destructive",
      });
    } else {
      console.log('✅ Successfully loaded leads:', {
        totalCombined: allLeads.length,
        filtered: filteredLeads.length,
        paginated: paginatedLeads.length,
        totalCount: filteredLeads.length
      });
      setLeads(paginatedLeads);
      setTotalCount(filteredLeads.length);
    }
  }, [page, pageSize, searchQuery, statusFilter, sourceFilter, toast]);

  const loadAllLeads = useCallback(async () => {
    // Fetch from both tables
    console.log('🔍 Loading all leads for stats...');
    const [oldLeadsResult, newLeadsResult] = await Promise.all([
      supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (supabase as any)
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false }),
    ]);

    console.log('📊 All leads query results:', {
      oldLeads: {
        data: oldLeadsResult.data?.length || 0,
        error: oldLeadsResult.error
      },
      newLeads: {
        data: newLeadsResult.data?.length || 0,
        error: newLeadsResult.error
      }
    });

    // Combine results
    const allLeads: Lead[] = [];

    if (oldLeadsResult.data) {
      allLeads.push(...(oldLeadsResult.data as Lead[]));
    }

    if (newLeadsResult.data) {
      allLeads.push(...(newLeadsResult.data as Lead[]));
    }

    // Sort by created_at descending
    allLeads.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    if (oldLeadsResult.error || newLeadsResult.error) {
      console.error('Error loading all leads:', {
        oldLeadsError: oldLeadsResult.error,
        newLeadsError: newLeadsResult.error
      });
    } else {
      setAllLeads(allLeads);
    }
  }, []);

  // Load data on mount and when dependencies change
  useEffect(() => {
    console.log('🚀 LeadsTab useEffect triggered');
    loadLeads();
    loadAllLeads();
  }, [loadLeads, loadAllLeads]);

  useEffect(() => {
    // Reset to page 1 when filters change
    setPage(1);
  }, [searchQuery, statusFilter, sourceFilter]);

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

    const formatPhoneForUrl = (phone: string | null): string => {
      if (!phone) return "";
      let cleaned = phone.replace(/[^\d+]/g, "");
      if (!cleaned.startsWith("+")) {
        cleaned = "+63" + cleaned;
      }
      return cleaned;
    };

    let url = "";
    switch (lead.contact_method) {
      case "whatsapp": {
        const whatsappPhone = formatPhoneForUrl(lead.phone);
        url = `https://wa.me/${whatsappPhone}?text=${encodedMessage}`;
        break;
      }
      case "viber": {
        const viberPhone = formatPhoneForUrl(lead.phone).replace("+", "%2B");
        url = `viber://contact?number=${viberPhone}`;
        break;
      }
      case "email":
        url = `mailto:technofyph@gmail.com?subject=Re: Your Inquiry&body=${encodedMessage}`;
        break;
      case "messenger":
        url = `https://m.me/Technofyph`;
        break;
    }

    if (url) {
      window.open(url, "_blank");
    }
  };

  const exportToCSV = async () => {
    // Fetch from both tables
    const [oldLeadsResult, newLeadsResult] = await Promise.all([
      supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (supabase as any)
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false }),
    ]);

    // Combine results
    const allLeads: Lead[] = [];
    if (oldLeadsResult.data) {
      allLeads.push(...(oldLeadsResult.data as Lead[]));
    }
    if (newLeadsResult.data) {
      allLeads.push(...(newLeadsResult.data as Lead[]));
    }

    // Apply filters
    let filteredLeads = allLeads;

    if (searchQuery) {
      const search = searchQuery.toLowerCase();
      filteredLeads = filteredLeads.filter(
        (lead) =>
          lead.name.toLowerCase().includes(search) ||
          (lead.phone && lead.phone.toLowerCase().includes(search))
      );
    }

    if (statusFilter !== "all") {
      filteredLeads = filteredLeads.filter((lead) => lead.status === statusFilter);
    }

    if (sourceFilter !== "all") {
      filteredLeads = filteredLeads.filter(
        (lead) => lead.where_did_you_find_us === sourceFilter
      );
    }

    // Sort by created_at descending
    filteredLeads.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    const allFilteredLeads = filteredLeads;
    const error = oldLeadsResult.error || newLeadsResult.error;

    if (error || !allFilteredLeads || allFilteredLeads.length === 0) {
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
      "Country",
      "Region",
      "City",
      "Created At (PH Time)",
    ];

    const rows = allFilteredLeads.map((lead) => {
      const phDate = new Date(lead.created_at).toLocaleString("en-PH", { timeZone: "Asia/Manila" });
      
      return [
        lead.id,
        lead.name,
        lead.phone || "", // Phone will be formatted in CSV generation
        lead.message.replace(/"/g, '""'),
        lead.where_did_you_find_us || "",
        lead.contact_method,
        lead.status,
        lead.country || "",
        lead.region || "",
        lead.city || "",
        phDate,
      ];
    });

    // Generate CSV with proper phone number formatting
    // Phone numbers need special handling to prevent scientific notation
    const csvContent = [
      headers.map((h) => `"${h}"`).join(","),
      ...rows.map((row) => 
        row.map((cell, cellIndex) => {
          // Format phone number (3rd column, index 2) to prevent scientific notation
          // Use zero-width space (U+200B) - completely invisible, forces text format
          if (cellIndex === 2 && cell && typeof cell === 'string' && cell.length > 0) {
            // Phone number column - prefix with zero-width space (completely invisible)
            return `"\u200B${cell}"`;
          }
          // Other columns - normal formatting
          return `"${cell}"`;
        }).join(",")
      ),
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
      description: `Downloaded ${allFilteredLeads.length} leads`,
    });
  };

  const handleDeleteClick = (lead: Lead, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the detail sheet
    setLeadToDelete(lead);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!leadToDelete) return;

    setIsDeleting(true);
    
    // Try deleting from new table first, then old table
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let error = (await (supabase as any)
      .from("contact_submissions")
      .delete()
      .eq("id", leadToDelete.id)).error;

    // If not found in new table, try old table
    if (error) {
      error = (await supabase
        .from("leads")
        .delete()
        .eq("id", leadToDelete.id)).error;
    }

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete lead",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Lead deleted",
        description: "Lead has been permanently deleted",
      });

      // If we deleted the last item on the current page, go back one page
      if (leads.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        await loadLeads();
        await loadAllLeads();
      }
    }

    setIsDeleting(false);
    setDeleteDialogOpen(false);
    setLeadToDelete(null);
  };

  const getStats = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

    const todayCount = allLeads.filter((l) => new Date(l.created_at) >= today).length;
    const weekCount = allLeads.filter((l) => new Date(l.created_at) >= weekAgo).length;
    const monthCount = allLeads.filter((l) => new Date(l.created_at) >= monthAgo).length;

    const sources: Record<string, number> = {};
    allLeads.forEach((lead) => {
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
  const uniqueSources = Array.from(new Set(allLeads.map((l) => l.where_did_you_find_us).filter(Boolean)));
  const totalPages = Math.ceil(totalCount / pageSize);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-PH", { 
      timeZone: "Asia/Manila",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Debug: Log component render
  console.log('🎯 LeadsTab render - leads count:', leads.length, 'allLeads count:', allLeads.length);

  return (
    <div className="space-y-6">
      {/* Debug indicator - remove after testing */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-yellow-100 border border-yellow-400 p-2 text-xs">
          🔍 Debug: LeadsTab loaded | Leads: {leads.length} | AllLeads: {allLeads.length} | TotalCount: {totalCount}
        </div>
      )}
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="border border-gray-200 p-6 rounded-lg bg-white">
          <p className="text-sm text-gray-600 mb-1">Today</p>
          <p className="text-3xl font-bold text-black">{stats.todayCount}</p>
        </div>
        <div className="border border-gray-200 p-6 rounded-lg bg-white">
          <p className="text-sm text-gray-600 mb-1">This Week</p>
          <p className="text-3xl font-bold text-black">{stats.weekCount}</p>
        </div>
        <div className="border border-gray-200 p-6 rounded-lg bg-white">
          <p className="text-sm text-gray-600 mb-1">This Month</p>
          <p className="text-3xl font-bold text-black">{stats.monthCount}</p>
        </div>
        <div className="border border-gray-200 p-6 rounded-lg bg-white">
          <p className="text-sm text-gray-600 mb-2">Top Sources</p>
          {stats.topSources.map(([source, count]) => (
            <p key={source} className="text-xs text-gray-700">
              {source}: <span className="font-semibold">{count}</span>
            </p>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="border border-gray-200 p-4 rounded-lg bg-white space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by name or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-gray-300"
              />
            </div>
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="border-gray-300">
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
            <SelectTrigger className="border-gray-300">
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

        <Button 
          onClick={exportToCSV} 
          variant="outline" 
          className="w-full md:w-auto border-black text-black hover:bg-black hover:text-white"
        >
          <Download className="w-4 h-4 mr-2" />
          Export to CSV
        </Button>
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-black">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-black">Phone</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-black">Location</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-black">Source</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-black">Method</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-black">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-black">Created</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-black">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr
                  key={lead.id}
                  onClick={() => openLeadDetails(lead)}
                  className="border-t border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-gray-900">{lead.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{lead.phone || "—"}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {(() => {
                      if (lead.city && lead.country) {
                        return lead.region 
                          ? `${lead.city}, ${lead.region}, ${lead.country}`
                          : `${lead.city}, ${lead.country}`;
                      }
                      if (lead.country) {
                        return lead.region ? `${lead.region}, ${lead.country}` : lead.country;
                      }
                      return "—";
                    })()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{lead.where_did_you_find_us || "—"}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 capitalize">{lead.contact_method}</td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        lead.status === "New"
                          ? "bg-gray-100 text-gray-800"
                          : lead.status === "Follow Up"
                          ? "bg-gray-200 text-gray-900"
                          : "bg-black text-white"
                      }`}
                    >
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{formatDate(lead.created_at)}</td>
                  <td className="px-4 py-3 text-sm">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleDeleteClick(lead, e)}
                      disabled={isDeleting}
                      className="hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {leads.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No leads found
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 0 && (
          <div className="border-t border-gray-200 px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Page {page} of {totalPages} ({totalCount} total)
              </span>
              <Select value={pageSize.toString()} onValueChange={(v) => { setPageSize(Number(v)); setPage(1); }}>
                <SelectTrigger className="w-[120px] border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 per page</SelectItem>
                  <SelectItem value="20">20 per page</SelectItem>
                  <SelectItem value="50">50 per page</SelectItem>
                  <SelectItem value="100">100 per page</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="border-gray-300"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="border-gray-300"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
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

                {(selectedLead.city || selectedLead.country) && (
                  <div>
                    <Label className="text-sm font-semibold">Location (IP-based)</Label>
                    <p className="mt-1 text-sm">
                      {selectedLead.city && selectedLead.region
                        ? `${selectedLead.city}, ${selectedLead.region}, ${selectedLead.country}`
                        : selectedLead.country}
                      <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">Approx</span>
                    </p>
                  </div>
                )}

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
                    className="w-full border-black text-black hover:bg-black hover:text-white"
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
                  <Select value={status} onValueChange={(v: "New" | "Follow Up" | "Closed") => setStatus(v)}>
                    <SelectTrigger id="status" className="border-gray-300">
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
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add notes about this lead..."
                    rows={4}
                    className="border-gray-300"
                  />
                </div>

                <Button 
                  onClick={handleUpdateLead} 
                  className="w-full bg-black text-white hover:bg-gray-800"
                >
                  Update Lead
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this lead permanently?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the lead from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default LeadsTab;
