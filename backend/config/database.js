// Database configuration using PostgreSQL connection string
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

// Get configuration from environment
const databaseUrl = process.env.DATABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!databaseUrl) {
  console.error("❌ Missing DATABASE_URL configuration.");
  console.error(
    "Please update your .env file with your actual Supabase connection string"
  );
  process.exit(1);
}

if (!supabaseAnonKey || supabaseAnonKey === "your_supabase_anon_key_here") {
  console.error("❌ Missing SUPABASE_ANON_KEY configuration.");
  console.error(
    "Please update your .env file with your actual Supabase anon key"
  );
  process.exit(1);
}

// Extract Supabase URL from connection string
const extractSupabaseUrl = (connectionString) => {
  try {
    const url = new URL(connectionString);
    const projectRef = url.username.split(".")[1];
    return `https://${projectRef}.supabase.co`;
  } catch (error) {
    console.error("❌ Invalid DATABASE_URL format:", error.message);
    process.exit(1);
  }
};

const supabaseUrl = extractSupabaseUrl(databaseUrl);

console.log(
  `🔗 Connecting to Supabase project: ${
    supabaseUrl.split("//")[1].split(".")[0]
  }`
);
console.log(`🌐 Supabase URL: ${supabaseUrl}`);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Test database connection
export const testConnection = async () => {
  try {
    const { data, error } = await supabase.from("forms").select("id").limit(1);

    if (error) {
      console.error("❌ Supabase connection error:", error.message);
      return false;
    }

    console.log("✅ Supabase connection successful");
    return true;
  } catch (error) {
    console.error("❌ Supabase connection failed:", error.message);
    return false;
  }
};
