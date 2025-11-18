import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Download } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Visit {
  id: string;
  occurred_at: string;
  path: string | null;
  referrer: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  country: string | null;
  region: string | null;
  city: string | null;
  device: string | null;
  browser: string | null;
  ip_hash: string | null;
  session_id: string | null;
}

interface Lead {
  id: string;
  created_at: string;
  contact_method: string;
  country: string | null;
  region: string | null;
  city: string | null;
}

type DateRange = "today" | "7d" | "30d";

const AnalyticsTab = () => {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>("7d");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const getDateRangeFilter = useCallback(() => {
    const now = new Date();
    if (dateRange === "today") {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      return today.toISOString();
    } else if (dateRange === "7d") {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return weekAgo.toISOString();
    } else {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return monthAgo.toISOString();
    }
  }, [dateRange]);

  const loadData = useCallback(async () => {
    setLoading(true);
    const dateFilter = getDateRangeFilter();

    // Load visits
    const { data: visitsData, error: visitsError } = await supabase
      .from("visits")
      .select("*")
      .gte("occurred_at", dateFilter)
      .order("occurred_at", { ascending: false });

    if (visitsError) {
      toast({
        title: "Error",
        description: "Failed to load visits data",
        variant: "destructive",
      });
    } else {
      setVisits(visitsData || []);
    }

    // Load leads from both tables
    const [oldLeadsResult, newLeadsResult] = await Promise.all([
      supabase
        .from("leads")
        .select("id, created_at, contact_method, country, region, city")
        .gte("created_at", dateFilter),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (supabase as any)
        .from("contact_submissions")
        .select("id, created_at, contact_method, country, region, city")
        .gte("created_at", dateFilter),
    ]);

    // Combine results
    const leadsData: Array<{ id: string; created_at: string; contact_method: string; country: string | null; region: string | null; city: string | null }> = [];
    if (oldLeadsResult.data) {
      leadsData.push(...oldLeadsResult.data);
    }
    if (newLeadsResult.data) {
      leadsData.push(...newLeadsResult.data);
    }

    const leadsError = oldLeadsResult.error || newLeadsResult.error;

    if (leadsError) {
      toast({
        title: "Error",
        description: "Failed to load leads data",
        variant: "destructive",
      });
    } else {
      setLeads(leadsData || []);
    }

    setLoading(false);
  }, [getDateRangeFilter, toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getKPIs = () => {
    // Count unique visitors by ip_hash (excluding null/undefined)
    const uniqueVisitorHashes = new Set(
      visits
        .map(v => v.ip_hash)
        .filter(hash => hash && hash.trim() !== '')
    );
    const uniqueVisitors = uniqueVisitorHashes.size;
    const totalLeads = leads.length;
    const conversionRate = uniqueVisitors > 0 ? ((totalLeads / uniqueVisitors) * 100).toFixed(2) : "0.00";

    return { uniqueVisitors, totalLeads, conversionRate };
  };

  const getBreakdownData = () => {
    const countryData: Record<string, { visitors: number; leads: number }> = {};
    const deviceData: Record<string, { visitors: number; leads: number }> = {};
    const referrerData: Record<string, { visitors: number }> = {};
    const contactMethodData: Record<string, number> = {};

    visits.forEach(visit => {
      if (visit.country) {
        countryData[visit.country] = countryData[visit.country] || { visitors: 0, leads: 0 };
        countryData[visit.country].visitors++;
      }
      if (visit.device) {
        deviceData[visit.device] = deviceData[visit.device] || { visitors: 0, leads: 0 };
        deviceData[visit.device].visitors++;
      }
      if (visit.referrer) {
        referrerData[visit.referrer] = referrerData[visit.referrer] || { visitors: 0 };
        referrerData[visit.referrer].visitors++;
      }
    });

    leads.forEach(lead => {
      if (lead.country) {
        countryData[lead.country] = countryData[lead.country] || { visitors: 0, leads: 0 };
        countryData[lead.country].leads++;
      }
      if (lead.contact_method) {
        contactMethodData[lead.contact_method] = (contactMethodData[lead.contact_method] || 0) + 1;
      }
    });

    const countryBreakdown = Object.entries(countryData)
      .map(([country, data]) => ({
        country,
        ...data,
        conversion: data.visitors > 0 ? ((data.leads / data.visitors) * 100).toFixed(2) : "0.00"
      }))
      .sort((a, b) => b.visitors - a.visitors)
      .slice(0, 5);

    const deviceBreakdown = Object.entries(deviceData)
      .map(([device, data]) => ({ device, ...data }))
      .sort((a, b) => b.visitors - a.visitors);

    const referrerBreakdown = Object.entries(referrerData)
      .map(([referrer, data]) => ({ referrer, ...data }))
      .sort((a, b) => b.visitors - a.visitors)
      .slice(0, 5);

    const contactMethodBreakdown = Object.entries(contactMethodData)
      .map(([method, count]) => ({ method, count }))
      .sort((a, b) => b.count - a.count);

    return { countryBreakdown, deviceBreakdown, referrerBreakdown, contactMethodBreakdown };
  };

  const exportVisitorsCSV = () => {
    if (visits.length === 0) {
      toast({
        title: "No data",
        description: "No visitors to export",
        variant: "destructive",
      });
      return;
    }

    const headers = ["Session ID", "Path", "Referrer", "Country", "Region", "City (Approx)", "Device", "Browser", "Occurred At (PH Time)"];
    const rows = visits.map(visit => [
      visit.session_id || "",
      visit.path || "",
      visit.referrer || "",
      visit.country || "",
      visit.region || "",
      visit.city || "",
      visit.device || "",
      visit.browser || "",
      new Date(visit.occurred_at).toLocaleString("en-PH", { timeZone: "Asia/Manila" }),
    ]);

    const csvContent = [
      headers.map(h => `"${h}"`).join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(",")),
    ].join("\n");

    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const now = new Date();
    const filename = `visitors-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}-${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}-PH.csv`;

    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();

    toast({
      title: "Export successful",
      description: `Downloaded ${visits.length} visitor records`,
    });
  };

  const kpis = getKPIs();
  const breakdowns = getBreakdownData();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-lg">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Date Range Selector */}
      <div className="flex justify-between items-center">
        <Select value={dateRange} onValueChange={(v: DateRange) => setDateRange(v)}>
          <SelectTrigger className="w-[180px] border-gray-300">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
          </SelectContent>
        </Select>
        <Button 
          onClick={exportVisitorsCSV} 
          variant="outline"
          className="border-black text-black hover:bg-black hover:text-white"
        >
          <Download className="w-4 h-4 mr-2" />
          Export Visitors CSV
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border border-gray-200 p-6 rounded-lg bg-white">
          <p className="text-sm text-gray-600 mb-1">Unique Visitors</p>
          <p className="text-3xl font-bold text-black">{kpis.uniqueVisitors}</p>
        </div>
        <div className="border border-gray-200 p-6 rounded-lg bg-white">
          <p className="text-sm text-gray-600 mb-1">Leads</p>
          <p className="text-3xl font-bold text-black">{kpis.totalLeads}</p>
        </div>
        <div className="border border-gray-200 p-6 rounded-lg bg-white">
          <p className="text-sm text-gray-600 mb-1">Conversion Rate</p>
          <p className="text-3xl font-bold text-black">{kpis.conversionRate}%</p>
        </div>
      </div>

      {/* Breakdowns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Country Breakdown */}
        <div className="border border-gray-200 rounded-lg bg-white p-6">
          <h3 className="text-lg font-semibold text-black mb-4">By Country</h3>
          <table className="w-full">
            <thead className="text-left text-sm text-gray-600 border-b">
              <tr>
                <th className="pb-2">Country</th>
                <th className="pb-2">Visitors</th>
                <th className="pb-2">Leads</th>
                <th className="pb-2">Conv %</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {breakdowns.countryBreakdown.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-gray-500">
                    No data available
                  </td>
                </tr>
              ) : (
                breakdowns.countryBreakdown.map((item, idx) => (
                  <tr key={idx} className="border-b last:border-0">
                    <td className="py-2 text-gray-900">{item.country}</td>
                    <td className="py-2 text-gray-700">{item.visitors}</td>
                    <td className="py-2 text-gray-700">{item.leads}</td>
                    <td className="py-2 text-gray-700">{item.conversion}%</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Device Breakdown */}
        <div className="border border-gray-200 rounded-lg bg-white p-6">
          <h3 className="text-lg font-semibold text-black mb-4">By Device</h3>
          <table className="w-full">
            <thead className="text-left text-sm text-gray-600 border-b">
              <tr>
                <th className="pb-2">Device</th>
                <th className="pb-2">Visitors</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {breakdowns.deviceBreakdown.length === 0 ? (
                <tr>
                  <td colSpan={2} className="py-4 text-center text-gray-500">
                    No data available
                  </td>
                </tr>
              ) : (
                breakdowns.deviceBreakdown.map((item, idx) => (
                  <tr key={idx} className="border-b last:border-0">
                    <td className="py-2 text-gray-900 capitalize">{item.device}</td>
                    <td className="py-2 text-gray-700">{item.visitors}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Referrer Breakdown */}
        <div className="border border-gray-200 rounded-lg bg-white p-6">
          <h3 className="text-lg font-semibold text-black mb-4">Top Referrers</h3>
          <table className="w-full">
            <thead className="text-left text-sm text-gray-600 border-b">
              <tr>
                <th className="pb-2">Referrer</th>
                <th className="pb-2">Visitors</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {breakdowns.referrerBreakdown.length === 0 ? (
                <tr>
                  <td colSpan={2} className="py-4 text-center text-gray-500">
                    No data available
                  </td>
                </tr>
              ) : (
                breakdowns.referrerBreakdown.map((item, idx) => (
                  <tr key={idx} className="border-b last:border-0">
                    <td className="py-2 text-gray-900">{item.referrer}</td>
                    <td className="py-2 text-gray-700">{item.visitors}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Contact Method Breakdown */}
        <div className="border border-gray-200 rounded-lg bg-white p-6">
          <h3 className="text-lg font-semibold text-black mb-4">Leads by Contact Method</h3>
          <table className="w-full">
            <thead className="text-left text-sm text-gray-600 border-b">
              <tr>
                <th className="pb-2">Method</th>
                <th className="pb-2">Count</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {breakdowns.contactMethodBreakdown.length === 0 ? (
                <tr>
                  <td colSpan={2} className="py-4 text-center text-gray-500">
                    No data available
                  </td>
                </tr>
              ) : (
                breakdowns.contactMethodBreakdown.map((item, idx) => (
                  <tr key={idx} className="border-b last:border-0">
                    <td className="py-2 text-gray-900 capitalize">{item.method}</td>
                    <td className="py-2 text-gray-700">{item.count}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTab;
