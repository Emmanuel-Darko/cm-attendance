export interface Database {
  public: {
    Tables: {
      attendance: {
        Row: {
          id?: number
          kid_id: string
          timestamp: string
          created_at?: string
        }
        Insert: {
          id?: number
          kid_id: string
          timestamp: string
          created_at?: string
        }
        Update: {
          id?: number
          kid_id?: string
          timestamp?: string
          created_at?: string
        }
      }
      sessions: {
        Row: {
          id: string
          title: string
          date: string | null
          is_open: boolean
          created_at?: string
        }
        Insert: {
          id?: string
          title: string
          date?: string | null
          is_open?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          date?: string | null
          is_open?: boolean
          created_at?: string
        }
      }
      kids: {
        Row: {
          id: string
          full_name: string
          dob: number
          gender: string
          local_id: string
          avatar_url: string
          guardian_name: string | null
          guardian_contact: string | null
          created_at?: string
        }
        Insert: {
          id?: string
          full_name: string
          dob: number
          gender: string
          local_id: string
          avatar_url: string
          guardian_name?: string | null
          guardian_contact?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          dob?: number
          gender?: string
          local_id?: string
          avatar_url?: string
          guardian_name?: string | null
          guardian_contact?: string | null
          created_at?: string
        }
      }
      session_kids: {
        Row: {
          id?: string
          session_id: string
          kid_id: string
          source: string
          created_at?: string
        }
        Insert: {
          id?: string
          session_id: string
          kid_id: string
          source: string
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          kid_id?: string
          source?: string
          created_at?: string
        }
      }
    }
  }
} 

export interface locals {
  name: string,
  location: string,
  created_at: Date
  id: string
}