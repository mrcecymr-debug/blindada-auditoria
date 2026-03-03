import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Platform } from 'react-native'

const supabaseUrl = 'https://guczydknusnhpooaxvtb.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd1Y3p5ZGtudXNuaHBvb2F4dnRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzMzM0NTgsImV4cCI6MjA4NjkwOTQ1OH0.1LbtGWDL79v04gogWdWTw118TdncwpPEXIxzjYKlLME'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: Platform.OS === 'web',
  },
})
