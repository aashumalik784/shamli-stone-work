// ============================================
// SUPABASE CONFIGURATION
// ============================================

const SUPABASE_URL = 'https://vvhimouzkjhmlnymbcvp.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_3Gbq1P749E0T8I8QJuog7A_6XSBpYiT';

// Initialize Supabase client
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Check if user is authenticated
async function checkAuth() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    return session;
}
