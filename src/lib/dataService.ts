import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";
import { z } from "zod";

// ========================================
// VALIDATION SCHEMAS
// ========================================
export const contactSchema = z.object({
  name: z.string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters")
    .regex(/^[a-zA-Z\s\-'.]+$/, "Name contains invalid characters"),
  email: z.string()
    .email("Invalid email address")
    .max(255, "Email must be less than 255 characters")
    .optional(),
  phone: z.string()
    .regex(/^[+]?[0-9\s\-()]+$/, "Phone number contains invalid characters")
    .min(7, "Phone number is too short")
    .max(20, "Phone number is too long")
    .optional(),
  message: z.string()
    .trim()
    .min(1, "Message is required")
    .max(2000, "Message must be less than 2000 characters"),
  where_did_you_find_us: z.string()
    .max(100, "Source must be less than 100 characters")
    .optional(),
  contact_method: z.enum(["whatsapp", "viber", "messenger", "email", "phone"]),
});

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
  country: string | null;
  region: string | null;
  city: string | null;
  geo_source: string | null;
};

export type LeadInsert = {
  name: string;
  phone?: string;
  message: string;
  where_did_you_find_us?: string;
  contact_method: "whatsapp" | "viber" | "messenger" | "email";
  country?: string;
  region?: string;
  city?: string;
  geo_source?: string;
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

  async getSession(): Promise<{ session: Session | null; error: Error | null }> {
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
    // Validate input before database operation
    try {
      contactSchema.parse({
        name: lead.name,
        phone: lead.phone,
        message: lead.message,
        where_did_you_find_us: lead.where_did_you_find_us,
        contact_method: lead.contact_method,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { data: null, error: new Error(error.errors[0].message) };
      }
      return { data: null, error: error as Error };
    }

    // Ensure we're using anon role for anonymous inserts
    // Check current session - if authenticated, we might need to use anon client
    const { data: sessionData } = await supabase.auth.getSession();
    if (sessionData?.session) {
      console.warn('⚠️ User is authenticated. For contact form, we should use anon role.');
      // For contact form submissions, we want to use anon role
      // But since the policy allows both anon and authenticated, this should still work
    }

    console.log('💾 Attempting to insert lead:', {
      name: lead.name,
      contact_method: lead.contact_method,
      hasPhone: !!lead.phone,
    });

    // Log Supabase configuration for debugging
    const { data: { session } } = await supabase.auth.getSession();
    console.log('🔑 Supabase session:', {
      hasSession: !!session,
      userId: session?.user?.id || 'none',
      role: 'anon (for contact form)',
    });

    // Prepare the data to insert
    const insertData = {
      name: lead.name.trim().slice(0, 100),
      phone: lead.phone?.trim().slice(0, 20) || null,
      message: lead.message.trim().slice(0, 2000),
      where_did_you_find_us: lead.where_did_you_find_us?.trim().slice(0, 100) || null,
      contact_method: lead.contact_method,
      country: lead.country || null,
      region: lead.region || null,
      city: lead.city || null,
      geo_source: lead.geo_source || 'ip',
    };

    console.log('📤 Inserting lead data:', JSON.stringify(insertData, null, 2));

    const { data, error } = await supabase
      .from("leads")
      .insert(insertData)
      .select()
      .single();
    
    // Improve error handling - extract better error messages
    if (error) {
      console.error('Supabase error saving lead:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Error details:', error.details);
      console.error('Error hint:', error.hint);
      // Supabase errors can have different structures, extract message properly
      const errorMessage = error.message || error.details || 'Failed to save lead to database';
      return { 
        data: null, 
        error: new Error(errorMessage) 
      };
    }
    
    // Create notification manually (non-blocking) if lead was saved successfully
    // This replaces the database trigger which was causing RLS issues
    if (data) {
      // Fire and forget - don't block the response
      // Import dynamically to avoid circular dependencies
      setTimeout(() => {
        import('@/lib/notificationService')
          .then(({ notifyNewLead }) => {
            // notifyNewLead doesn't return a promise, so just call it
            notifyNewLead(data.name, data.id);
          })
          .catch(() => {
            // Ignore import errors - notifications are optional
          });
      }, 0);
    }
    
    return { data, error: null };
  },

  async getAllLeads(): Promise<{ data: Lead[] | null; error: Error | null }> {
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

  async getLeadById(id: string): Promise<{ data: Lead | null; error: Error | null }> {
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
