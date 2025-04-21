import { createClient } from "@supabase/supabase-js"


const supabaseUrl = "https://kmunxaxnpveekgtulzjd.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttdW54YXhucHZlZWtndHVsempkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxNzcyNTgsImV4cCI6MjA2MDc1MzI1OH0.QN7YfjJ1tSjoF5awnLXPTKEY5pF68vwtTcX6Kjm0bzk"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
