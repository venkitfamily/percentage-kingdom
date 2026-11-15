// Supabase public browser configuration. Never place a service-role key here.
const SUPABASE_URL = "https://xzwmmkdzcydldvlkbvtr.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_76i2qeItCPiewP99Ei9egg_l7fa6jnT";
let supabaseClient = null;
try {
  if (window.supabase && !SUPABASE_URL.includes("YOUR_PROJECT_REF") && !SUPABASE_ANON_KEY.startsWith("YOUR_")) {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { flowType: "pkce", detectSessionInUrl: false, persistSession: true, autoRefreshToken: true }
    });
  }
} catch (e) { console.error("Supabase setup error", e); }
