import { supabase } from "@/integrations/supabase/client";

export type NotificationType = "lead" | "analytics" | "account" | "system";

interface CreateNotificationParams {
  type: NotificationType;
  title: string;
  message: string;
  meta?: any;
}

export const createNotification = async ({
  type,
  title,
  message,
  meta = {},
}: CreateNotificationParams) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  const { error } = await supabase.from("admin_notifications").insert({
    type,
    title,
    message,
    meta,
    user_id: user?.id,
    read: false,
  });

  if (error) {
    console.error("Error creating notification:", error);
  }
};

// Lead notifications
export const notifyNewLead = (leadName: string, leadId: string) => {
  createNotification({
    type: "lead",
    title: "New Lead Received",
    message: `${leadName} submitted a contact form`,
    meta: { lead_id: leadId },
  });
};

export const notifyLeadStatusChanged = (
  leadName: string,
  oldStatus: string,
  newStatus: string,
  leadId: string
) => {
  createNotification({
    type: "lead",
    title: "Lead Status Updated",
    message: `${leadName}: ${oldStatus} → ${newStatus}`,
    meta: { lead_id: leadId, old_status: oldStatus, new_status: newStatus },
  });
};

export const notifyLeadNoteAdded = (leadName: string, leadId: string) => {
  createNotification({
    type: "lead",
    title: "Note Added",
    message: `Note added to ${leadName}'s lead`,
    meta: { lead_id: leadId },
  });
};

export const notifyLeadMarkedSpam = (leadName: string, leadId: string) => {
  createNotification({
    type: "lead",
    title: "Lead Marked as Spam",
    message: `${leadName} marked as spam`,
    meta: { lead_id: leadId },
  });
};

export const notifyLeadsExportComplete = (rowCount: number) => {
  createNotification({
    type: "lead",
    title: "Export Complete",
    message: `${rowCount} leads exported successfully`,
    meta: { row_count: rowCount },
  });
};

// Analytics notifications
export const notifyNewVisitors = (count: number, timeframe: string) => {
  createNotification({
    type: "analytics",
    title: "New Visitors",
    message: `${count} new visitor${count > 1 ? "s" : ""} in the last ${timeframe}`,
    meta: { count, timeframe },
  });
};

export const notifyAnalyticsExportComplete = (rowCount: number) => {
  createNotification({
    type: "analytics",
    title: "Export Complete",
    message: `${rowCount} analytics records exported successfully`,
    meta: { row_count: rowCount },
  });
};

export const notifyAnalyticsDateRangeApplied = (range: string) => {
  createNotification({
    type: "analytics",
    title: "Analytics Updated",
    message: `Date range applied: ${range}`,
    meta: { range },
  });
};

// Account notifications
export const notifyAdminLogin = (email: string) => {
  createNotification({
    type: "account",
    title: "Admin Login",
    message: `${email} logged in successfully`,
    meta: { email },
  });
};

export const notifyAdminLogout = (email: string) => {
  createNotification({
    type: "account",
    title: "Admin Logout",
    message: `${email} logged out`,
    meta: { email },
  });
};

export const notifyPasswordChanged = () => {
  createNotification({
    type: "account",
    title: "Password Changed",
    message: "Your password was changed successfully",
  });
};

export const notifySettingsSaved = () => {
  createNotification({
    type: "account",
    title: "Settings Saved",
    message: "Notification settings updated successfully",
  });
};

// System notifications
export const notifyConnectionLost = () => {
  createNotification({
    type: "system",
    title: "Connection Lost",
    message: "Real-time connection to server lost. Attempting to reconnect...",
  });
};

export const notifyConnectionRestored = () => {
  createNotification({
    type: "system",
    title: "Connection Restored",
    message: "Real-time connection to server restored",
  });
};

export const notifySystemError = (errorMessage: string) => {
  createNotification({
    type: "system",
    title: "System Error",
    message: errorMessage,
  });
};
