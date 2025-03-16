import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fteskqdgpnqbftehybvh.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0ZXNrcWRncG5xYmZ0ZWh5YnZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIwNzI5MTMsImV4cCI6MjA1NzY0ODkxM30.U1CkgaEJM3FCCpWebkToJ0vuZBX1PSSlFGY8MjMR9F8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
