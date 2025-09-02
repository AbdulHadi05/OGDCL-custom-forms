import { supabase } from "./config/database.js";
import dotenv from "dotenv";

dotenv.config();

console.log("Testing database connection...");

async function testConnection() {
  try {
    // Test basic connection
    const { data, error } = await supabase
      .from('forms')
      .select('count(*)')
      .limit(1);
    
    if (error) {
      console.error("❌ Database connection error:", error);
    } else {
      console.log("✅ Database connection successful");
      console.log("Forms table exists and is accessible");
    }

    // Test insert operation with minimal data
    console.log("\nTesting form creation...");
    const testForm = {
      title: "Test Form",
      description: "Test Description",
      form_config: {
        fields: [{
          id: "test-field",
          type: "text",
          label: "Test Field"
        }]
      },
      created_by: "test-user"
    };

    const { data: insertData, error: insertError } = await supabase
      .from('forms')
      .insert([testForm])
      .select()
      .single();

    if (insertError) {
      console.error("❌ Form creation error:", insertError);
      console.error("Error details:", {
        code: insertError.code,
        message: insertError.message,
        details: insertError.details,
        hint: insertError.hint
      });
    } else {
      console.log("✅ Test form created successfully:", insertData.id);
      
      // Clean up - delete the test form
      await supabase.from('forms').delete().eq('id', insertData.id);
      console.log("✅ Test form cleaned up");
    }

  } catch (error) {
    console.error("❌ Unexpected error:", error);
  }
}

testConnection();
