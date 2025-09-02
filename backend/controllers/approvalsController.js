import { supabase } from "../config/database.js";

// Get all approvals
export const getApprovals = async (req, res) => {
  try {
    // Return empty array since approval workflow is removed
    res.json([]);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get pending approvals
export const getPendingApprovals = async (req, res) => {
  try {
    // Get current user email from the request (set by auth middleware)
    const userEmail =
      req.user?.email || req.user?.mail || req.user?.userPrincipalName;

    if (!userEmail) {
      console.log("❌ No user email found in pending approvals request");
      return res.status(401).json({ error: "User email not found" });
    }

    console.log(`🔍 Getting pending approvals for manager: ${userEmail}`);

    let query = supabase
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
      .eq("manager_id", userEmail) // Filter by current user's email
      .order("created_at", { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching pending approvals:", error);
      return res
        .status(500)
        .json({ error: "Failed to fetch pending approvals" });
    }

    console.log(
      `✅ Found ${data?.length || 0} pending approvals for ${userEmail}`
    );
    res.json(data || []);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get approvals for a specific manager
export const getManagerApprovals = async (req, res) => {
  try {
    const { managerId } = req.params;
    const { status } = req.query;

    let query = supabase
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
      .eq("manager_id", managerId);

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) {
      console.error("Error fetching manager approvals:", error);
      return res
        .status(500)
        .json({ error: "Failed to fetch manager approvals" });
    }

    res.json(data || []);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get a single approval by ID
export const getApproval = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("approvals")
      .select(
        `
        *,
        submissions (
          id,
          data,
          submitter_email,
          created_at,
          forms (
            id,
            title,
            form_type,
            form_config
          )
        )
      `
      )
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({ error: "Approval not found" });
      }
      console.error("Error fetching approval:", error);
      return res.status(500).json({ error: "Failed to fetch approval" });
    }

    res.json(data);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Approve a submission
export const approveSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params; // This is actually the approval ID from the frontend
    const { comments = "" } = req.body;

    // Get current user email from the request (set by auth middleware)
    const managerEmail =
      req.user?.email || req.user?.mail || req.user?.userPrincipalName;
    const managerName = req.user?.displayName || req.user?.name || managerEmail;

    if (!managerEmail) {
      return res.status(401).json({ error: "Manager authentication required" });
    }

    console.log(
      `Manager ${managerEmail} approving approval record ${submissionId}`
    );

    // First, get the approval record to find the actual submission ID
    const { data: existingApproval, error: getError } = await supabase
      .from("approvals")
      .select("id, submission_id, manager_id")
      .eq("id", submissionId) // submissionId is actually the approval ID
      .eq("manager_id", managerEmail)
      .single();

    if (getError || !existingApproval) {
      console.error("Error finding approval:", getError);
      return res
        .status(404)
        .json({ error: "Approval not found or not authorized" });
    }

    const actualSubmissionId = existingApproval.submission_id;
    console.log(`Found approval for submission ${actualSubmissionId}`);

    // Update the approval record
    const { data: approval, error: approvalError } = await supabase
      .from("approvals")
      .update({
        status: "approved",
        comments,
        approved_at: new Date().toISOString(),
        approved_by: managerName, // Store manager name for display
      })
      .eq("id", submissionId) // Use the approval ID directly
      .eq("manager_id", managerEmail) // Ensure manager authorization
      .select()
      .single();

    if (approvalError) {
      console.error("Error updating approval:", approvalError);
      return res.status(500).json({ error: "Failed to approve submission" });
    }

    // Check if all required approvals are now approved
    const { data: allApprovals, error: allApprovalsError } = await supabase
      .from("approvals")
      .select("status")
      .eq("submission_id", actualSubmissionId);

    if (allApprovalsError) {
      console.error("Error checking all approvals:", allApprovalsError);
      return res.status(500).json({ error: "Failed to check approval status" });
    }

    // If all approvals are approved, update submission status
    const allApproved = allApprovals.every((app) => app.status === "approved");

    if (allApproved) {
      console.log(
        `All approvals completed for submission ${actualSubmissionId}, updating status`
      );
      await supabase
        .from("submissions")
        .update({ status: "approved" })
        .eq("id", actualSubmissionId);
    }

    res.json({
      ...approval,
      submission_fully_approved: allApproved,
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Reject a submission
export const rejectSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { comments = "" } = req.body;

    // Get current user email from the request (set by auth middleware)
    const managerEmail =
      req.user?.email || req.user?.mail || req.user?.userPrincipalName;
    const managerName = req.user?.displayName || req.user?.name || managerEmail;

    if (!managerEmail) {
      return res.status(401).json({ error: "Manager authentication required" });
    }

    if (!comments.trim()) {
      return res
        .status(400)
        .json({ error: "Comments are required for rejection" });
    }

    console.log(
      `Manager ${managerEmail} rejecting approval record ${submissionId}`
    );

    // First, get the approval record to find the actual submission ID
    const { data: existingApproval, error: getError } = await supabase
      .from("approvals")
      .select("id, submission_id, manager_id")
      .eq("id", submissionId) // submissionId is actually the approval ID
      .eq("manager_id", managerEmail)
      .single();

    if (getError || !existingApproval) {
      console.error("Error finding approval:", getError);
      return res
        .status(404)
        .json({ error: "Approval not found or not authorized" });
    }

    const actualSubmissionId = existingApproval.submission_id;
    console.log(`Found approval for submission ${actualSubmissionId}`);

    // Update the approval record
    const { data: approval, error: approvalError } = await supabase
      .from("approvals")
      .update({
        status: "rejected",
        comments,
        approved_at: new Date().toISOString(),
        approved_by: managerName, // Store manager name for display
      })
      .eq("id", submissionId) // Use the approval ID directly
      .eq("manager_id", managerEmail) // Ensure manager authorization
      .select()
      .single();

    if (approvalError) {
      console.error("Error updating approval:", approvalError);
      return res.status(500).json({ error: "Failed to reject submission" });
    }

    // Update submission status to rejected (any rejection rejects the whole submission)
    console.log(
      `Rejection processed for submission ${actualSubmissionId}, updating status`
    );
    await supabase
      .from("submissions")
      .update({ status: "rejected" })
      .eq("id", actualSubmissionId);

    res.json(approval);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
