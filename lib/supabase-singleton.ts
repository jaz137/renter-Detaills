import { createClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"


const supabaseUrl = "https://ocdxigkvzppqxcgcqajn.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jZHhpZ2t2enBwcXhjZ2NxYWpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyNzcyOTEsImV4cCI6MjA2MDg1MzI5MX0.XizXwo8rcsasXJxQ7OJEAqXwnN9XL2tL4GpynNlwvVo"


export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  }
  
})



