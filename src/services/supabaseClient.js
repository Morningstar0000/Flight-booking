import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kfzwlxsnwpbmzfqfytjs.supabase.co' // Get from your Supabase project settings
const supabaseAnonKey = 'sb_publishable_B4ijhtn1B9Mu41RhWq23fQ_3_XSqUV_' // Get from your Supabase project settings

export const supabase = createClient(supabaseUrl, supabaseAnonKey)