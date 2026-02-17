import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://guczydknusnhpooaxvtb.supabase.co'
const supabaseAnonKey = 'sb_publishable_8uImfk4wAb_UqW4BqlhuAg_J3RsLHsy'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
