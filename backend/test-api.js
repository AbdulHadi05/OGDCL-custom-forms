import { supabase } from "./config/database.js";
import fetch from "node-fetch";

async function testAPIEndpoints() {
  console.log("🧪 Testing API endpoints...\n");

  const testManagerEmail = "abdulahadakram2005@gmail.com";
  const baseURL = "http://localhost:5000/api";

  // Mock user token - you would get this from actual authentication
  const mockToken = "test-token";

  try {
    // Test 1: Manager Forms endpoint
    console.log("1️⃣ Testing /forms/manager endpoint...");
    const managerFormsResponse = await fetch(`${baseURL}/forms/manager`, {
      headers: {
        Authorization: `Bearer ${mockToken}`,
        "Content-Type": "application/json",
      },
    });

    if (managerFormsResponse.ok) {
      const managerForms = await managerFormsResponse.json();
      console.log(
        `✅ Manager forms response: ${managerForms.length} forms found`
      );
    } else {
      console.log(
        `❌ Manager forms failed: ${managerFormsResponse.status} - ${managerFormsResponse.statusText}`
      );
    }

    // Test 2: Forms requiring approval endpoint
    console.log("\n2️⃣ Testing /forms/requiring-approval endpoint...");
    const approvalFormsResponse = await fetch(
      `${baseURL}/forms/requiring-approval`,
      {
        headers: {
          Authorization: `Bearer ${mockToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (approvalFormsResponse.ok) {
      const approvalForms = await approvalFormsResponse.json();
      console.log(
        `✅ Forms requiring approval: ${approvalForms.length} forms found`
      );
    } else {
      console.log(
        `❌ Forms requiring approval failed: ${approvalFormsResponse.status} - ${approvalFormsResponse.statusText}`
      );
    }

    // Test 3: Pending approvals endpoint
    console.log("\n3️⃣ Testing /approvals/pending endpoint...");
    const pendingApprovalsResponse = await fetch(
      `${baseURL}/approvals/pending`,
      {
        headers: {
          Authorization: `Bearer ${mockToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (pendingApprovalsResponse.ok) {
      const pendingApprovals = await pendingApprovalsResponse.json();
      console.log(
        `✅ Pending approvals: ${pendingApprovals.length} approvals found`
      );
    } else {
      console.log(
        `❌ Pending approvals failed: ${pendingApprovalsResponse.status} - ${pendingApprovalsResponse.statusText}`
      );
    }

    // Direct database test to compare
    console.log("\n📊 Direct database comparison:");
    const { data: dbManagerForms } = await supabase
      .from("forms")
      .select("*")
      .contains("managers", [testManagerEmail])
      .eq("requires_approval", true);

    console.log(`📋 Direct DB manager forms: ${dbManagerForms?.length || 0}`);

    // Check approvals without joins first
    const { data: simpleApprovals } = await supabase
      .from("approvals")
      .select("*")
      .eq("status", "pending")
      .eq("manager_id", testManagerEmail);

    console.log(`📋 Simple approvals query: ${simpleApprovals?.length || 0}`);
    if (simpleApprovals && simpleApprovals.length > 0) {
      console.log(
        "📝 Simple approval IDs:",
        simpleApprovals.map((a) => a.id)
      );
    }

    const { data: dbPendingApprovals, error: approvalError } = await supabase
      .from("approvals")
      .select(
        `
        id,
        submission_id,
        manager_id,
        status,
        submissions (
          id,
          data,
          submitter_name,
          forms (
            title
          )
        )
      `
      )
      .eq("status", "pending")
      .eq("manager_id", testManagerEmail);

    if (approvalError) {
      console.error("❌ Approval query error:", approvalError);
    }

    console.log(
      `📋 Direct DB pending approvals: ${dbPendingApprovals?.length || 0}`
    );
    if (dbPendingApprovals && dbPendingApprovals.length > 0) {
      console.log("� Pending approval details:");
      dbPendingApprovals.forEach((approval) => {
        console.log(
          `  - ${approval.submissions?.forms?.title || "Unknown Form"} from ${
            approval.submissions?.submitter_name
          }`
        );
      });
    }

    if (dbPendingApprovals && dbPendingApprovals.length > 0) {
      console.log("📝 Pending approval details:");
      dbPendingApprovals.forEach((approval) => {
        console.log(
          `  - ${approval.submissions?.forms?.title || "Unknown Form"} from ${
            approval.submissions?.submitter_name
          }`
        );
      });
    }
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

testAPIEndpoints().catch(console.error);
