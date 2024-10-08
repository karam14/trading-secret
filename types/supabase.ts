export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      attachments: {
        Row: {
          course_id: string | null
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
          url: string
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
          url: string
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "attachments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      chapters: {
        Row: {
          course_id: string | null
          created_at: string | null
          description: string | null
          id: string
          is_free: boolean | null
          is_published: boolean | null
          position: number
          title: string
          updated_at: string | null
          video_name: string | null
          video_url: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_free?: boolean | null
          is_published?: boolean | null
          position: number
          title: string
          updated_at?: string | null
          video_name?: string | null
          video_url?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_free?: boolean | null
          is_published?: boolean | null
          position?: number
          title?: string
          updated_at?: string | null
          video_name?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chapters_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      cloudinary_data: {
        Row: {
          chapter_id: string | null
          created_at: string
          id: number
          public_id: string | null
        }
        Insert: {
          chapter_id?: string | null
          created_at?: string
          id?: number
          public_id?: string | null
        }
        Update: {
          chapter_id?: string | null
          created_at?: string
          id?: number
          public_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cloudinary_data_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          badge: string | null
          categoryId: string | null
          created_at: string | null
          description: string | null
          id: string
          imageUrl: string | null
          is_published: boolean | null
          price: number | null
          title: string
          tsvector_column: unknown | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          badge?: string | null
          categoryId?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          imageUrl?: string | null
          is_published?: boolean | null
          price?: number | null
          title: string
          tsvector_column?: unknown | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          badge?: string | null
          categoryId?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          imageUrl?: string | null
          is_published?: boolean | null
          price?: number | null
          title?: string
          tsvector_column?: unknown | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "courses_category_id_fkey"
            columns: ["categoryId"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      leaderboard: {
        Row: {
          id: string
          provider_id: string | null
          score: number
          win_ratio: number
        }
        Insert: {
          id?: string
          provider_id?: string | null
          score: number
          win_ratio: number
        }
        Update: {
          id?: string
          provider_id?: string | null
          score?: number
          win_ratio?: number
        }
        Relationships: [
          {
            foreignKeyName: "leaderboard_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      live_signals: {
        Row: {
          closing_price: number | null
          description: string | null
          entry_price: number
          id: string
          pair: string
          provider_id: string | null
          sl: number
          status: string
          timestamp: string | null
          tp1: number | null
          tp2: number | null
          tp3: number | null
          type: string
        }
        Insert: {
          closing_price?: number | null
          description?: string | null
          entry_price: number
          id?: string
          pair: string
          provider_id?: string | null
          sl: number
          status: string
          timestamp?: string | null
          tp1?: number | null
          tp2?: number | null
          tp3?: number | null
          type: string
        }
        Update: {
          closing_price?: number | null
          description?: string | null
          entry_price?: number
          id?: string
          pair?: string
          provider_id?: string | null
          sl?: number
          status?: string
          timestamp?: string | null
          tp1?: number | null
          tp2?: number | null
          tp3?: number | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "live_signals_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      logging: {
        Row: {
          body: string | null
          created_at: string | null
          error_message: string | null
          id: string
          method: string
          response: string | null
          status_code: number | null
          url: string
        }
        Insert: {
          body?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          method: string
          response?: string | null
          status_code?: number | null
          url: string
        }
        Update: {
          body?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          method?: string
          response?: string | null
          status_code?: number | null
          url?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          bio: string | null
          created_at: string | null
          id: string
          image_url: string | null
          name: string | null
          stream_display_name: string | null
          stream_key: string | null
          stream_url: string | null
          updated_at: string | null
          vip: boolean | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          id: string
          image_url?: string | null
          name?: string | null
          stream_display_name?: string | null
          stream_key?: string | null
          stream_url?: string | null
          updated_at?: string | null
          vip?: boolean | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          name?: string | null
          stream_display_name?: string | null
          stream_key?: string | null
          stream_url?: string | null
          updated_at?: string | null
          vip?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      providers: {
        Row: {
          id: string
          is_super: boolean | null
          profile_id: string | null
          score: number
          win_ratio: number
        }
        Insert: {
          id?: string
          is_super?: boolean | null
          profile_id?: string | null
          score: number
          win_ratio: number
        }
        Update: {
          id?: string
          is_super?: boolean | null
          profile_id?: string | null
          score?: number
          win_ratio?: number
        }
        Relationships: [
          {
            foreignKeyName: "providers_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profile_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "providers_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      purchases: {
        Row: {
          course_id: string | null
          created_at: string | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchases_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      stream_interactions: {
        Row: {
          created_at: string | null
          id: string
          message: string | null
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message?: string | null
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string | null
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stream_interactions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "stream_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stream_interactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profile_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stream_interactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      stream_sessions: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          room_name: string | null
          session_end: string | null
          session_start: string | null
          stream_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          room_name?: string | null
          session_end?: string | null
          session_start?: string | null
          stream_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          room_name?: string | null
          session_end?: string | null
          session_start?: string | null
          stream_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stream_sessions_stream_id_fkey"
            columns: ["stream_id"]
            isOneToOne: false
            referencedRelation: "streams"
            referencedColumns: ["id"]
          },
        ]
      }
      streams: {
        Row: {
          created_at: string | null
          creator_id: string | null
          date: string
          description: string | null
          id: string
          is_live: boolean | null
          stream_key: string
          title: string
          type: string | null
        }
        Insert: {
          created_at?: string | null
          creator_id?: string | null
          date: string
          description?: string | null
          id?: string
          is_live?: boolean | null
          stream_key: string
          title: string
          type?: string | null
        }
        Update: {
          created_at?: string | null
          creator_id?: string | null
          date?: string
          description?: string | null
          id?: string
          is_live?: boolean | null
          stream_key?: string
          title?: string
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "streams_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profile_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "streams_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      stripe_customers: {
        Row: {
          created_at: string | null
          id: string
          stripe_customer_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          stripe_customer_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          stripe_customer_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stripe_customers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_course_progress: {
        Row: {
          completed: boolean | null
          course_id: string | null
          created_at: string
          id: number
          user_id: string | null
        }
        Insert: {
          completed?: boolean | null
          course_id?: string | null
          created_at?: string
          id?: number
          user_id?: string | null
        }
        Update: {
          completed?: boolean | null
          course_id?: string | null
          created_at?: string
          id?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_course_progress_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_course_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          chapter_id: string | null
          created_at: string | null
          id: string
          is_completed: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          chapter_id?: string | null
          created_at?: string | null
          id?: string
          is_completed?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          chapter_id?: string | null
          created_at?: string | null
          id?: string
          is_completed?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: number
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: number
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: number
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      profile_view: {
        Row: {
          id: string | null
          image_url: string | null
          name: string | null
          vip: boolean | null
        }
        Insert: {
          id?: string | null
          image_url?: string | null
          name?: string | null
          vip?: boolean | null
        }
        Update: {
          id?: string | null
          image_url?: string | null
          name?: string | null
          vip?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      authorize_coach: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      custom_access_token_hook: {
        Args: {
          event: Json
        }
        Returns: Json
      }
      verify_user_password: {
        Args: {
          password: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "coach"
      role: "coach"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

