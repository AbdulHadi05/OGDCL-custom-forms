import { supabase } from "./config/database.js";

async function testApprovalUpdate() {
  console.log("🔧 TESTING EXACT UPDATE QUERY");
  console.log("=============================\n");

  const testApprovalId = "1aa383b1-ce3a-47b8-a244-00d9b01698db";
  const testManagerEmail = "abdulahadakram2005@gmail.com";

  console.log("Testing the EXACT update query from the controller...\n");

  // Test without .single() first
  const { data: updateTest1, error: error1 } = await supabase
    .from("approvals")
    .update({
      status: "approved",
      comments: "TEST UPDATE",
      approved_at: new Date().toISOString(),
    })
    .eq("id", testApprovalId)
    .eq("manager_id", testManagerEmail)
    .select();

  console.log("📊 Update without .single():");
  console.log("   Error:", error1);
  console.log("   Data:", updateTest1);
  console.log("   Rows affected:", updateTest1?.length || 0);

  if (updateTest1 && updateTest1.length > 0) {
    // Test with .single()
    const { data: updateTest2, error: error2 } = await supabase
      .from("approvals")
      .update({
        status: "pending", // revert
        comments: null,
        approved_at: null,
      })
      .eq("id", testApprovalId)
      .eq("manager_id", testManagerEmail)
      .select()
      .single();

    console.log("\n📊 Update with .single():");
    console.log("   Error:", error2);
    console.log("   Data:", updateTest2);
  }

  // Check schema by getting a sample record
  console.log("\n🗂️ CHECKING APPROVALS TABLE SCHEMA:");
  const { data: sampleApproval } = await supabase
    .from("approvals")
    .select("*")
    .limit(1);

  if (sampleApproval && sampleApproval[0]) {
    console.log("📋 Sample approval record fields:");
    Object.keys(sampleApproval[0]).forEach((key) => {
      console.log(`   - ${key}: ${typeof sampleApproval[0][key]}`);
    });
  }

  // Test if the issue is with the approved_by field
  console.log("\n🧪 TESTING SIMPLIFIED UPDATE:");
  const { data: simpleUpdate, error: simpleError } = await supabase
    .from("approvals")
    .update({
      status: "approved",
    })
    .eq("id", testApprovalId)
    .eq("manager_id", testManagerEmail)
    .select();

  console.log("   Simple update error:", simpleError);
  console.log("   Simple update data:", simpleUpdate);

  // Revert
  if (simpleUpdate && simpleUpdate.length > 0) {
    await supabase
      .from("approvals")
      .update({ status: "pending" })
      .eq("id", testApprovalId);
    console.log("   🔄 Reverted to pending");
  }
}

testApprovalUpdate().catch(console.error);
