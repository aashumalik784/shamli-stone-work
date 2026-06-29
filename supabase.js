// ============================================
// SUPABASE CONFIGURATION
// ============================================
// IMPORTANT: Yahan apni Supabase details dalein

const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co';  // Apna URL dalein
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY_HERE';  // Apna anon key dalein

// Initialize Supabase client
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Check if user is authenticated
async function checkAuth() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    return session;
}
