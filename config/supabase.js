/**
 * Supabase Client Configuration
 */

// 1. Substitua pela sua URL (já está correta)
const supabaseUrl = 'https://lllwgfcassnovowzvfxq.supabase.co';

// 2. SUBSTITUA esta chave abaixo pela "anon public key" (aquela que começa com eyJ...)
const supabaseKey = 'sb_publishable_OUx9C-eTGBnQ5hsMLDIgwg_SeDYMQz9';

const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

window.supabaseClient = _supabase;
