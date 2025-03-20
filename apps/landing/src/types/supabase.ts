export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          title: string
          description: string
          image: string | null
          url: string | null
          github: string | null
          tags: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          image?: string | null
          url?: string | null
          github?: string | null
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          image?: string | null
          url?: string | null
          github?: string | null
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

declare global {
  type Tables = Database['public']['Tables']
  type Enums = Database['public']['Enums']

  interface SupabaseProcedures {
    setup_migrations: {
      args: void
      returns: void
    }
    run_migration_contacts: {
      args: {
        migration_sql: string
      }
      returns: void
    }
  }
}
