// ============================================
// SUPABASE CONFIGURATION
// ============================================

const SUPABASE_URL = 'https://vvhimouzkjhmlnymbcvp.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_qoevFwRBS5ER0p6xTrcwLw_U1T2XxhD';

// Initialize Supabase client
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Check if user is authenticated
async function checkAuth() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    return session;
}
