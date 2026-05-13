export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      brands: {
        Row: {
          accent_color: string
          address: string | null
          company_name: string
          created_at: string
          email: string | null
          id: string
          is_default: boolean
          logo_path: string | null
          name: string
          phone: string | null
          primary_color: string
          updated_at: string
          user_id: string
          watermark_text: string | null
          website: string | null
        }
        Insert: {
          accent_color?: string
          address?: string | null
          company_name?: string
          created_at?: string
          email?: string | null
          id?: string
          is_default?: boolean
          logo_path?: string | null
          name?: string
          phone?: string | null
          primary_color?: string
          updated_at?: string
          user_id: string
          watermark_text?: string | null
          website?: string | null
        }
        Update: {
          accent_color?: string
          address?: string | null
          company_name?: string
          created_at?: string
          email?: string | null
          id?: string
          is_default?: boolean
          logo_path?: string | null
          name?: string
          phone?: string | null
          primary_color?: string
          updated_at?: string
          user_id?: string
          watermark_text?: string | null
          website?: string | null
        }
        Relationships: []
      }
      business_documents: {
        Row: {
          accent_color: string
          brand_id: string | null
          created_at: string
          currency: string
          discount: number
          doc_number: string
          doc_type: string
          due_date: string | null
          from_party: Json
          id: string
          issue_date: string | null
          items: Json
          notes: string
          primary_color: string
          signature_data: string | null
          signature_name: string
          signature_title: string
          status: string
          tax_rate: number
          template: string
          terms: string
          title: string
          to_party: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          accent_color?: string
          brand_id?: string | null
          created_at?: string
          currency?: string
          discount?: number
          doc_number?: string
          doc_type?: string
          due_date?: string | null
          from_party?: Json
          id?: string
          issue_date?: string | null
          items?: Json
          notes?: string
          primary_color?: string
          signature_data?: string | null
          signature_name?: string
          signature_title?: string
          status?: string
          tax_rate?: number
          template?: string
          terms?: string
          title?: string
          to_party?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          accent_color?: string
          brand_id?: string | null
          created_at?: string
          currency?: string
          discount?: number
          doc_number?: string
          doc_type?: string
          due_date?: string | null
          from_party?: Json
          id?: string
          issue_date?: string | null
          items?: Json
          notes?: string
          primary_color?: string
          signature_data?: string | null
          signature_name?: string
          signature_title?: string
          status?: string
          tax_rate?: number
          template?: string
          terms?: string
          title?: string
          to_party?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      letterhead_shares: {
        Row: {
          allow_download: boolean
          created_at: string
          expires_at: string | null
          id: string
          letterhead_id: string
          token: string
          user_id: string
          view_count: number
        }
        Insert: {
          allow_download?: boolean
          created_at?: string
          expires_at?: string | null
          id?: string
          letterhead_id: string
          token: string
          user_id: string
          view_count?: number
        }
        Update: {
          allow_download?: boolean
          created_at?: string
          expires_at?: string | null
          id?: string
          letterhead_id?: string
          token?: string
          user_id?: string
          view_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "letterhead_shares_letterhead_id_fkey"
            columns: ["letterhead_id"]
            isOneToOne: false
            referencedRelation: "letterheads"
            referencedColumns: ["id"]
          },
        ]
      }
      letterheads: {
        Row: {
          accent_color: string
          body: string | null
          brand_id: string | null
          created_at: string
          folder: string
          font_family: string
          font_size: number
          id: string
          letter_date: string | null
          margin_mm: number
          page_format: string
          page_orientation: string
          primary_color: string
          recipient: string | null
          show_qr: boolean
          signature_data: string | null
          signature_name: string | null
          signature_title: string | null
          subject: string | null
          template: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          accent_color?: string
          body?: string | null
          brand_id?: string | null
          created_at?: string
          folder?: string
          font_family?: string
          font_size?: number
          id?: string
          letter_date?: string | null
          margin_mm?: number
          page_format?: string
          page_orientation?: string
          primary_color?: string
          recipient?: string | null
          show_qr?: boolean
          signature_data?: string | null
          signature_name?: string | null
          signature_title?: string | null
          subject?: string | null
          template?: string
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          accent_color?: string
          body?: string | null
          brand_id?: string | null
          created_at?: string
          folder?: string
          font_family?: string
          font_size?: number
          id?: string
          letter_date?: string | null
          margin_mm?: number
          page_format?: string
          page_orientation?: string
          primary_color?: string
          recipient?: string | null
          show_qr?: boolean
          signature_data?: string | null
          signature_name?: string | null
          signature_title?: string | null
          subject?: string | null
          template?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "letterheads_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
        }
        Relationships: []
      }
      user_templates: {
        Row: {
          created_at: string
          id: string
          name: string
          snapshot: Json
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          snapshot: Json
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          snapshot?: Json
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_shared_letterhead: { Args: { _token: string }; Returns: Json }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
