import { supabase } from "./config/database.js";

async function checkDatabase() {
  console.log("🔍 Checking database structure and content...");

  try {
    // Check submissions
    console.log("\n📋 Checking submissions...");
    const { data: submissions, error: subError } = await supabase
      .from("submissions")
      .select("id, form_id, status, submitter_name, submitted_at, data")
      .order("submitted_at", { ascending: false })
      .limit(5);

    if (subError) {
      console.error("❌ Submissions query failed:", subError.message);
    } else {
      console.log(`✅ Found ${submissions?.length || 0} recent submissions:`);
      submissions?.forEach((sub) => {
        console.log(
          `  - ID: ${sub.id.slice(0, 8)}..., Form: ${sub.form_id?.slice(
            0,
            8
          )}..., Status: ${sub.status}, By: ${sub.submitter_name}`
        );
      });
    }

    // Check approvals
    console.log("\n🔍 Checking approvals...");
    const { data: approvals, error: appError } = await supabase
      .from("approvals")
      .select("id, submission_id, manager_id, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5);

    if (appError) {
      console.error("❌ Approvals query failed:", appError.message);
    } else {
      console.log(`✅ Found ${approvals?.length || 0} approval records:`);
      approvals?.forEach((app) => {
        console.log(
          `  - Approval: ${app.id.slice(
            0,
            8
          )}..., Submission: ${app.submission_id?.slice(0, 8)}..., Manager: ${
            app.manager_id
          }, Status: ${app.status}`
        );
      });
    }

    // Check forms with managers
    console.log("\n📝 Checking forms...");
    const { data: forms, error: formError } = await supabase
      .from("forms")
      .select("id, title, managers, requires_approval, is_published")
      .eq("requires_approval", true)
      .limit(5);

    if (formError) {
      console.error("❌ Forms query failed:", formError.message);
    } else {
      console.log(`✅ Found ${forms?.length || 0} forms requiring approval:`);
      forms?.forEach((form) => {
        console.log(
          `  - ${form.title}: managers=[${
            form.managers?.join(", ") || "none"
          }], published=${form.is_published}`
        );
      });
    }

    // Test specific manager query
    const testManagerEmail = "abdulahadakram2005@gmail.com"; // Replace with your actual email
    console.log(
      `\n🎯 Testing manager-specific queries for: ${testManagerEmail}`
    );

    const { data: managerForms, error: managerError } = await supabase
      .from("forms")
      .select("*")
      .contains("managers", [testManagerEmail])
      .eq("requires_approval", true);

    if (managerError) {
      console.error("❌ Manager forms query failed:", managerError.message);
    } else {
      console.log(
        `✅ Found ${managerForms?.length || 0} forms where you are a manager:`
      );
      managerForms?.forEach((form) => {
        console.log(`  - ${form.title}`);
      });
    }

    // Test pending approvals for manager
    const { data: pendingApprovals, error: pendingError } = await supabase
      .from("approvals")
      .select(
        `
        *,
        submissions (
          id,
          data,
          submitter_name,
          submitted_at,
          forms (
            id,
            title,
            form_type
          )
        )
      `
      )
      .eq("status", "pending")
      .eq("manager_id", testManagerEmail);

    if (pendingError) {
      console.error("❌ Pending approvals query failed:", pendingError.message);
    } else {
      console.log(
        `✅ Found ${pendingApprovals?.length || 0} pending approvals for you:`
      );
      pendingApprovals?.forEach((approval) => {
        console.log(
          `  - Submission from: ${approval.submissions?.submitter_name}, Form: ${approval.submissions?.forms?.title}`
        );
      });
    }
  } catch (error) {
    console.error("❌ Database check failed:", error.message);
    console.error("Stack:", error.stack);
  }
}

checkDatabase().catch(console.error);
