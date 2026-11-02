import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://iznagxiqpsqvtdstkgkw.supabase.co'
const supabaseAnonKey = 'sb_publishable_fuBJAQq_jQH5YdO8dvjvzA_9sccaUG3' // <- Tu llave publishable copiada

export const supabase = createClient(supabaseUrl, supabaseAnonKey)