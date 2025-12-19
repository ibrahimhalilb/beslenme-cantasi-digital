export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            daily_plans: {
                Row: {
                    id: string
                    user_id: string
                    day_of_week: string
                    week_start_date: string
                    notes: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    day_of_week: string
                    week_start_date: string
                    notes?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    day_of_week?: string
                    week_start_date?: string
                    notes?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            general_notes: {
                Row: {
                    id: string
                    user_id: string
                    content: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    content: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    content?: string
                    created_at?: string
                    updated_at?: string
                }
            }
            reminders: {
                Row: {
                    id: string
                    user_id: string
                    target_day: string
                    reminder_time: string
                    message: string
                    is_active: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    target_day: string
                    reminder_time: string
                    message: string
                    is_active?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    target_day?: string
                    reminder_time?: string
                    message?: string
                    is_active?: boolean
                    created_at?: string
                }
            }
        }
    }
}

export type DailyPlan = Database['public']['Tables']['daily_plans']['Row']
export type GeneralNote = Database['public']['Tables']['general_notes']['Row']
export type Reminder = Database['public']['Tables']['reminders']['Row']
