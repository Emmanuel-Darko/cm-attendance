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
    }
  }
} 