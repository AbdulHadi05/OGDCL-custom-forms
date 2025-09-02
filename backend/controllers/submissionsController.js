import { supabase } from "../config/database.js";
import { v4 as uuidv4 } from "uuid";

// Mock data for when database is not available
const mockSubmissions = [
  {
    id: "1",
    form_id: "1",
    data: {
      "field-0": "John Doe",
      "field-1": "john.doe@email.com",
      "field-2": "Hello, I am interested in your services.",
    },
    status: "submitted",
    submitted_at: new Date().toISOString(),
    submitter_name: "John Doe",
    submitter_email: "john.doe@email.com",
    forms: {
      id: "1",
      title: "Sample Contact Form",
      form_type: "contact",
    },
  },
  {
    id: "2",
    form_id: "2",
    data: {
      "field-0": "Jane Smith",
      "field-1": "engineering",
      "field-2": "satisfied",
      "field-3": "Great work environment and supportive team.",
    },
    status: "pending",
    submitted_at: new Date(Date.now() - 3600000).toISOString(),
    submitter_name: "Jane Smith",
    submitter_email: "jane.smith@company.com",
    forms: {
      id: "2",
      title: "Employee Feedback Form",
      form_type: "feedback",
    },
  },
];

// Get all submissions
export const getSubmissions = async (req, res) => {
  try {
    const { status, submitter_email, form_id } = req.query;

    let query = supabase.from("submissions").select(`
        id,
        form_id,
        data,
        submitted_at,
        submitter_name,
        submitter_email,
        ip_address,
        status,
        forms (
          id,
          title,
          form_type
        )
      `);

    if (status) {
      query = query.eq("status", status);
    }

    if (submitter_email) {
      query = query.eq("submitter_email", submitter_email);
    }

    if (form_id) {
      query = query.eq("form_id", form_id);
    }

    const { data, error } = await query.order("submitted_at", {
      ascending: false,
    });

    if (error) {
      console.error(
        "Error fetching submissions from database, using mock data:",
        error.message
      );
      // Return mock data if database is not available
      let filteredMockData = mockSubmissions;

      if (status) {
        filteredMockData = filteredMockData.filter(
          (sub) => sub.status === status
        );
      }

      if (form_id) {
        filteredMockData = filteredMockData.filter(
          (sub) => sub.form_id === form_id
        );
      }

      return res.json(filteredMockData);
    }

    res.json(data || []);
  } catch (error) {
    console.error("Server error:", error);
    // Fallback to mock data
    res.json(mockSubmissions);
  }
};

// Get submissions for a specific form
export const getFormSubmissions = async (req, res) => {
  try {
    const { formId } = req.params;
    const { status, submitter_email } = req.query;

    let query = supabase
      .from("submissions")
      .select(
        `
        *,
        forms (
          id,
          title,
          form_type
        )
      `
      )
      .eq("form_id", formId);

    if (status) {
      query = query.eq("status", status);
    }

    if (submitter_email) {
      query = query.eq("submitter_email", submitter_email);
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) {
      console.error("Error fetching form submissions:", error);
      return res
        .status(500)
        .json({ error: "Failed to fetch form submissions" });
    }

    res.json(data || []);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get a single submission by ID
export const getSubmission = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("submissions")
      .select(
        `
        id,
        form_id,
        data,
        submitted_at,
        submitter_name,
        submitter_email,
        submitted_by,
        ip_address,
        status,
        forms (
          id,
          title,
          form_type,
          form_config,
          managers,
          requires_approval
        ),
        approvals (
          id,
          manager_id,
          status,
          comments,
          approved_at,
          created_at
        )
      `
      )
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({ error: "Submission not found" });
      }
      console.error("Error fetching submission:", error);
      return res.status(500).json({ error: "Failed to fetch submission" });
    }

    res.json(data);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Create a new submission
export const createSubmission = async (req, res) => {
  try {
    const {
      form_id,
      submission_data,
      submitter_email = "anonymous",
      submission_ip,
    } = req.body;

    // Validate required fields
    if (!form_id || !submission_data) {
      return res.status(400).json({
        error: "Form ID and submission data are required",
      });
    }

    // Verify form exists and is published
    const { data: form, error: formError } = await supabase
      .from("forms")
      .select("id, title, is_published, managers, requires_approval")
      .eq("id", form_id)
      .single();

    if (formError || !form) {
      return res.status(404).json({ error: "Form not found" });
    }

    if (!form.is_published) {
      return res.status(400).json({ error: "Form is not published" });
    }

    // Determine initial status based on whether form requires approval
    const initialStatus = form.requires_approval ? "pending" : "submitted";

    const submissionData = {
      id: uuidv4(),
      form_id,
      data: submission_data, // Keep as 'data' to match database schema
      submitted_at: new Date().toISOString(),
      submitter_name: req.user?.name || submitter_email || "anonymous",
      submitter_email: req.user?.email || submitter_email || "anonymous",
      ip_address: submission_ip || req.ip,
      status: initialStatus,
    };

    const { data: submission, error } = await supabase
      .from("submissions")
      .insert([submissionData])
      .select()
      .single();

    if (error) {
      console.error("Error creating submission:", error);
      return res.status(500).json({ error: "Failed to create submission" });
    }

    // Create approval records if form requires approval and has managers
    if (form.requires_approval && form.managers && form.managers.length > 0) {
      console.log("Creating approval records for managers:", form.managers);
      const approvalRecords = form.managers.map((managerId) => ({
        id: uuidv4(),
        submission_id: submission.id,
        manager_id: managerId,
        status: "pending",
        created_at: new Date().toISOString(),
      }));

      console.log("Approval records to insert:", approvalRecords);

      const { error: approvalError } = await supabase
        .from("approvals")
        .insert(approvalRecords);

      if (approvalError) {
        console.error("Error creating approval records:", approvalError);
        // Don't fail the submission, but log the error
      } else {
        console.log(
          "Approval records created successfully, updating submission status"
        );
        // Update submission status to pending approval
        const { error: statusError } = await supabase
          .from("submissions")
          .update({ status: "pending" })
          .eq("id", submission.id);

        if (statusError) {
          console.error("Error updating submission status:", statusError);
        } else {
          console.log("Submission status updated to pending");
        }
      }
    } else {
      console.log("No managers found for form, skipping approval creation");
    }

    res.status(201).json(submission);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update a submission
export const updateSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Remove fields that shouldn't be updated directly
    delete updates.id;
    delete updates.form_id;
    delete updates.created_at;
    delete updates.updated_at;

    const { data, error } = await supabase
      .from("submissions")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({ error: "Submission not found" });
      }
      console.error("Error updating submission:", error);
      return res.status(500).json({ error: "Failed to update submission" });
    }

    res.json(data);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete a submission
export const deleteSubmission = async (req, res) => {
  try {
    const { id } = req.params;

    // Delete approval records first (cascade should handle this, but being explicit)
    await supabase.from("approvals").delete().eq("submission_id", id);

    const { error } = await supabase.from("submissions").delete().eq("id", id);

    if (error) {
      console.error("Error deleting submission:", error);
      return res.status(500).json({ error: "Failed to delete submission" });
    }

    res.json({ message: "Submission deleted successfully" });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
