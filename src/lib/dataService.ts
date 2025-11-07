import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

// ========================================
// TYPES
// ========================================
export type Lead = {
  id: string;
  name: string;
  phone: string | null;
  message: string;
  where_did_you_find_us: string | null;
  contact_method: "whatsapp" | "viber" | "messenger" | "email";
  status: "New" | "Follow Up" | "Closed";
  notes: string | null;
  created_at: string;
};

export type LeadInsert = {
  name: string;
  phone?: string;
  message: string;
  where_did_you_find_us?: string;
  contact_method: "whatsapp" | "viber" | "messenger" | "email";
};

export type LeadUpdate = {
  status?: "New" | "Follow Up" | "Closed";
  notes?: string;
};

// ========================================
// AUTH FUNCTIONS
// ========================================
export const authService = {
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async getSession(): Promise<{ session: Session | null; error: any }> {
    const { data, error } = await supabase.auth.getSession();
    return { session: data.session, error };
  },

  async updatePassword(newPassword: string) {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    return { data, error };
  },

  onAuthStateChange(callback: (session: Session | null, user: User | null) => void) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        callback(session, session?.user ?? null);
      }
    );
    return subscription;
  },
};

// ========================================
// LEADS FUNCTIONS
// ========================================
export const leadsService = {
  async createLead(lead: LeadInsert) {
    const { data, error } = await supabase
      .from("leads")
      .insert({
        name: lead.name,
        phone: lead.phone || null,
        message: lead.message,
        where_did_you_find_us: lead.where_did_you_find_us || null,
        contact_method: lead.contact_method,
      })
      .select()
      .single();
    return { data, error };
  },

  async getAllLeads(): Promise<{ data: Lead[] | null; error: any }> {
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    return { data: data as Lead[] | null, error };
  },

  async updateLead(id: string, updates: LeadUpdate) {
    const { data, error } = await supabase
      .from("leads")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    return { data, error };
  },

  async getLeadById(id: string): Promise<{ data: Lead | null; error: any }> {
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .eq("id", id)
      .single();
    return { data: data as Lead | null, error };
  },
};

// ========================================
// ROLES FUNCTIONS
// ========================================
export const rolesService = {
  async checkIfAdmin(userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    
    if (error || !data) return false;
    return true;
  },
};
