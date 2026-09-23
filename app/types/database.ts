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
      teachers: {
        Row: {
          id: string
          name: string
          email: string
          local_id: string
          role: string
          contact: string
          userId: string
          created_at?: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          local_id: string
          role: string
          contact?: string
          userId?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          local_id?: string
          role?: string
          contact?: string
          userId?: string
          created_at?: string
        }
      }
      adult_visitors: {
        Row: {
          id: string
          first_name: string
          last_name: string
          email: string | null
          phone: string | null
          visit_date: string
          first_time_guest: boolean
          address: string | null
          occupation: string | null
          how_heard: string | null
          interested_in: string[]
          assigned_to: string | null
          follow_up_status: 'new' | 'contacted' | 'scheduled' | 'completed' | 'no_response'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          first_name: string
          last_name: string
          email?: string | null
          phone?: string | null
          visit_date?: string
          first_time_guest?: boolean
          address?: string | null
          occupation?: string | null
          how_heard?: string | null
          interested_in?: string[]
          assigned_to?: string | null
          follow_up_status?: 'new' | 'contacted' | 'scheduled' | 'completed' | 'no_response'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          email?: string | null
          phone?: string | null
          visit_date?: string
          first_time_guest?: boolean
          address?: string | null
          occupation?: string | null
          how_heard?: string | null
          interested_in?: string[]
          assigned_to?: string | null
          follow_up_status?: 'new' | 'contacted' | 'scheduled' | 'completed' | 'no_response'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      announcements: {
        Row: {
          id: string
          title: string
          content: string
          image_url: string | null
          author_id: string | null
          published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          image_url?: string | null
          author_id?: string | null
          published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          image_url?: string | null
          author_id?: string | null
          published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      soul_teams: {
        Row: {
          id: string
          name: string
          color_tag: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          color_tag?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          color_tag?: string
          created_at?: string
        }
      }
      soul_winners: {
        Row: {
          id: string
          full_name: string
          team_id: string
          phone: string | null
          created_at: string
        }
        Insert: {
          id?: string
          full_name: string
          team_id: string
          phone?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          team_id?: string
          phone?: string | null
          created_at?: string
        }
      }
      souls: {
        Row: {
          id: string
          full_name: string
          phone: string | null
          location: string | null
          date_won: string
          status: 'new' | 'contacted' | 'in_discipleship' | 'baptized' | 'integrated'
          won_by: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          full_name: string
          phone?: string | null
          location?: string | null
          date_won?: string
          status?: 'new' | 'contacted' | 'in_discipleship' | 'baptized' | 'integrated'
          won_by: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          phone?: string | null
          location?: string | null
          date_won?: string
          status?: 'new' | 'contacted' | 'in_discipleship' | 'baptized' | 'integrated'
          won_by?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      soul_targets: {
        Row: {
          id: number
          target_count: number
          monthly_target: number
          project_title: string
        }
        Insert: {
          id?: number
          target_count?: number
          monthly_target?: number
          project_title?: string
        }
        Update: {
          id?: number
          target_count?: number
          monthly_target?: number
          project_title?: string
        }
      }
    }
  }
}

export type Session = Database['public']['Tables']['sessions']['Row']
export type Kid = Database['public']['Tables']['kids']['Row']
export type Teacher = Database['public']['Tables']['teachers']['Row']
export type SessionKid = Database['public']['Tables']['session_kids']['Row']
export type Attendance = Database['public']['Tables']['attendance']['Row']
export type AdultVisitor = Database['public']['Tables']['adult_visitors']['Row']
export type Announcement = Database['public']['Tables']['announcements']['Row']
export type SoulTeam = Database['public']['Tables']['soul_teams']['Row']
export type SoulWinner = Database['public']['Tables']['soul_winners']['Row']
export type Soul = Database['public']['Tables']['souls']['Row']
export type SoulTarget = Database['public']['Tables']['soul_targets']['Row']
export type SoulStatus = 'new' | 'contacted' | 'in_discipleship' | 'baptized' | 'integrated'

export interface locals {
  name: string,
  location: string,
  created_at: Date
  id: string
}
