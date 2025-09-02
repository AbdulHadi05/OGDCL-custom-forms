#!/usr/bin/env node

/**
 * Database Setup Script for Form Builder
 * This script initializes the database with tables and sample data
 */

import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.DATABASE_URL
  ? extractSupabaseUrl(process.env.DATABASE_URL)
  : null;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing DATABASE_URL or SUPABASE_ANON_KEY in .env file");
  process.exit(1);
}

function extractSupabaseUrl(connectionString) {
  try {
    const url = new URL(connectionString);
    const projectRef = url.username.split(".")[1];
    return `https://${projectRef}.supabase.co`;
  } catch (error) {
    console.error("❌ Invalid DATABASE_URL format:", error.message);
    process.exit(1);
  }
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runSQLFile(filename) {
  console.log(`📄 Running ${filename}...`);

  const filePath = path.join(__dirname, "database", filename);

  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    return false;
  }

  const sql = fs.readFileSync(filePath, "utf8");

  try {
    const { error } = await supabase.rpc("exec_sql", { sql });

    if (error) {
      console.error(`❌ Error running ${filename}:`, error);
      return false;
    }

    console.log(`✅ Successfully executed ${filename}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to execute ${filename}:`, error.message);
    return false;
  }
}

async function main() {
  console.log("🚀 Starting database setup...");
  console.log(`🔗 Connecting to: ${supabaseUrl}`);

  // Test connection
  try {
    const { data, error } = await supabase.from("forms").select("id").limit(1);

    if (error && error.code !== "PGRST116") {
      // PGRST116 = table doesn't exist yet, which is OK
      console.error("❌ Connection test failed:", error);
      process.exit(1);
    }

    console.log("✅ Connection successful");
  } catch (error) {
    console.error("❌ Connection failed:", error.message);
    process.exit(1);
  }

  // Run initialization script
  const initSuccess = await runSQLFile("init-database.sql");
  if (!initSuccess) {
    console.error("❌ Database initialization failed");
    process.exit(1);
  }

  // Ask if user wants to add sample data
  const addSampleData =
    process.argv.includes("--sample-data") || process.argv.includes("-s");

  if (addSampleData) {
    console.log("📊 Adding sample data...");
    const sampleSuccess = await runSQLFile("sample-data.sql");
    if (!sampleSuccess) {
      console.warn(
        "⚠️  Sample data insertion failed, but database is still functional"
      );
    }
  } else {
    console.log(
      "ℹ️  Skipping sample data. Run with --sample-data flag to include sample forms"
    );
  }

  console.log("\n🎉 Database setup completed successfully!");
  console.log("\nNext steps:");
  console.log("1. Start the backend server: npm run dev");
  console.log("2. Start the frontend: cd ../frontend && npm run dev");
  console.log("3. Visit http://localhost:3000 to use the form builder");

  if (addSampleData) {
    console.log("\n📝 Sample forms have been added to your database");
    console.log("You can view them in the Forms section of your dashboard");
  }
}

// Handle uncaught errors
process.on("unhandledRejection", (error) => {
  console.error("❌ Unhandled error:", error);
  process.exit(1);
});

main().catch(console.error);
