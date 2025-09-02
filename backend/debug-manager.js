import { supabase } from "./config/database.js";

async function debugManagerDashboard() {
  console.log("🔍 COMPREHENSIVE MANAGER DASHBOARD DEBUG");
  console.log("==========================================\n");

  const testManagerEmail = "abdulahadakram2005@gmail.com";
  console.log(`🎯 Testing for manager email: ${testManagerEmail}\n`);

  // Step 1: Check forms where user is a manager
  console.log("📝 STEP 1: Check forms where user is a manager");
  console.log("---------------------------------------------");

  const { data: managerForms, error: managerFormsError } = await supabase
    .from("forms")
    .select("id, title, managers, requires_approval, is_published")
    .contains("managers", [testManagerEmail])
    .eq("requires_approval", true);

  if (managerFormsError) {
    console.error("❌ Manager forms query error:", managerFormsError);
    return;
  }

  console.log(
    `✅ Found ${managerForms?.length || 0} forms where you are a manager:`
  );
  managerForms?.forEach((form, index) => {
    console.log(
      `   ${index + 1}. ${form.title} (ID: ${form.id.slice(0, 8)}...)`
    );
    console.log(`      - Managers: [${form.managers?.join(", ")}]`);
    console.log(`      - Requires approval: ${form.requires_approval}`);
    console.log(`      - Published: ${form.is_published}\n`);
  });

  // Step 2: Check submissions requiring approval for each form
  console.log("📋 STEP 2: Check submissions requiring approval");
  console.log("---------------------------------------------");

  let totalSubmissions = 0;

  if (managerForms && managerForms.length > 0) {
    for (const form of managerForms) {
      console.log(`\n🔍 Checking submissions for form: ${form.title}`);

      // Get submissions for this specific form
      const { data: formSubmissions, error: submissionsError } = await supabase
        .from("submissions")
        .select("id, submitter_name, submitted_at, status")
        .eq("form_id", form.id)
        .eq("status", "pending");

      if (submissionsError) {
        console.error(
          `❌ Error getting submissions for ${form.title}:`,
          submissionsError
        );
        continue;
      }

      console.log(
        `   📊 Found ${formSubmissions?.length || 0} pending submissions:`
      );
      formSubmissions?.forEach((sub, index) => {
        console.log(
          `      ${index + 1}. From: ${sub.submitter_name} (${
            sub.submitted_at
          })`
        );
        totalSubmissions++;
      });
    }
  }

  // Step 3: Check approvals table
  console.log("\n🔍 STEP 3: Check approvals table");
  console.log("-------------------------------");

  const { data: allApprovals, error: allApprovalsError } = await supabase
    .from("approvals")
    .select("*")
    .eq("manager_id", testManagerEmail);

  if (allApprovalsError) {
    console.error("❌ All approvals error:", allApprovalsError);
  } else {
    console.log(
      `✅ Found ${allApprovals?.length || 0} approval records for your email:`
    );
    allApprovals?.forEach((approval, index) => {
      console.log(
        `   ${index + 1}. Status: ${
          approval.status
        }, Submission ID: ${approval.submission_id?.slice(0, 8)}...`
      );
    });
  }

  // Step 4: Test the exact query used by getPendingApprovals
  console.log("\n🔍 STEP 4: Test getPendingApprovals query");
  console.log("----------------------------------------");

  const { data: pendingApprovals, error: pendingError } = await supabase
    .from("approvals")
    .select(
      `
      id,
      submission_id,
      manager_id,
      status,
      comments,
      approved_at,
      created_at,
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
    .eq("manager_id", testManagerEmail)
    .order("created_at", { ascending: false });

  if (pendingError) {
    console.error("❌ Pending approvals query error:", pendingError);
  } else {
    console.log(
      `✅ getPendingApprovals would return ${
        pendingApprovals?.length || 0
      } records:`
    );
    pendingApprovals?.forEach((approval, index) => {
      console.log(
        `   ${index + 1}. Form: ${
          approval.submissions?.forms?.title || "Unknown"
        }`
      );
      console.log(
        `      Submitter: ${approval.submissions?.submitter_name || "Unknown"}`
      );
      console.log(
        `      Submitted: ${approval.submissions?.submitted_at || "Unknown"}`
      );
      console.log(`      Approval ID: ${approval.id?.slice(0, 8)}...\n`);
    });
  }

  // Step 5: Test getFormsRequiringApproval query
  console.log("🔍 STEP 5: Test getFormsRequiringApproval query");
  console.log("---------------------------------------------");

  const { data: formsRequiringApproval, error: formsRequiringError } =
    await supabase
      .from("submissions")
      .select(
        `
      id,
      form_id,
      data,
      submitted_at,
      submitter_name,
      submitter_email,
      status,
      forms!inner(
        id,
        title,
        managers,
        requires_approval
      )
    `
      )
      .eq("forms.requires_approval", true)
      .contains("forms.managers", [testManagerEmail])
      .eq("status", "pending")
      .order("submitted_at", { ascending: false });

  if (formsRequiringError) {
    console.error(
      "❌ Forms requiring approval query error:",
      formsRequiringError
    );
  } else {
    console.log(
      `✅ getFormsRequiringApproval would return ${
        formsRequiringApproval?.length || 0
      } records:`
    );
    formsRequiringApproval?.forEach((submission, index) => {
      console.log(
        `   ${index + 1}. Form: ${submission.forms?.title || "Unknown"}`
      );
      console.log(`      Submitter: ${submission.submitter_name || "Unknown"}`);
      console.log(`      Status: ${submission.status}`);
      console.log(
        `      Form managers: [${
          submission.forms?.managers?.join(", ") || "None"
        }]\n`
      );
    });
  }

  // Step 6: Check exact email matching
  console.log("🔍 STEP 6: Check exact email matching issues");
  console.log("------------------------------------------");

  const { data: allForms } = await supabase
    .from("forms")
    .select("id, title, managers, requires_approval")
    .eq("requires_approval", true);

  console.log("📊 All forms requiring approval:");
  allForms?.forEach((form, index) => {
    const hasManager = form.managers?.includes(testManagerEmail);
    console.log(`   ${index + 1}. ${form.title}`);
    console.log(`      Managers: ${JSON.stringify(form.managers)}`);
    console.log(
      `      Contains your email: ${hasManager ? "✅ YES" : "❌ NO"}`
    );

    if (form.managers && form.managers.length > 0) {
      form.managers.forEach((manager) => {
        console.log(
          `      Manager "${manager}" === "${testManagerEmail}": ${
            manager === testManagerEmail ? "✅" : "❌"
          }`
        );
      });
    }
    console.log("");
  });

  console.log("\n🎯 SUMMARY");
  console.log("----------");
  console.log(`Manager forms found: ${managerForms?.length || 0}`);
  console.log(`Pending approvals found: ${pendingApprovals?.length || 0}`);
  console.log(
    `Forms requiring approval found: ${formsRequiringApproval?.length || 0}`
  );
  console.log(`Total pending submissions: ${totalSubmissions}`);
}

debugManagerDashboard().catch(console.error);
