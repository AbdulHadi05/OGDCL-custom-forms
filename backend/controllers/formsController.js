import { supabase } from "../config/database.js";
import { v4 as uuidv4 } from "uuid";

// Mock data for when database is not available
const mockForms = [
  {
    id: "1",
    title: "Sample Contact Form",
    description: "A simple contact form for gathering user information",
    fields: [
      {
        id: "field-1",
        type: "text",
        label: "Full Name",
        required: true,
        placeholder: "Enter your full name",
      },
      {
        id: "field-2",
        type: "email",
        label: "Email Address",
        required: true,
        placeholder: "Enter your email address",
      },
      {
        id: "field-3",
        type: "textarea",
        label: "Message",
        required: true,
        placeholder: "Enter your message",
        rows: 4,
      },
    ],
    settings: {},
    status: "published",
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: "system",
    category: "Contact",
    estimated_time: 3,
    required_fields: ["Full Name", "Email Address", "Message"],
  },
  {
    id: "2",
    title: "Employee Feedback Form",
    description: "Collect feedback from employees about workplace satisfaction",
    fields: [
      {
        id: "field-4",
        type: "text",
        label: "Employee Name",
        required: true,
        placeholder: "Enter your name",
      },
      {
        id: "field-5",
        type: "select",
        label: "Department",
        required: true,
        options: [
          { label: "Engineering", value: "engineering" },
          { label: "Marketing", value: "marketing" },
          { label: "Sales", value: "sales" },
          { label: "HR", value: "hr" },
        ],
      },
      {
        id: "field-6",
        type: "radio",
        label: "Overall Satisfaction",
        required: true,
        options: [
          { label: "Very Satisfied", value: "very_satisfied" },
          { label: "Satisfied", value: "satisfied" },
          { label: "Neutral", value: "neutral" },
          { label: "Dissatisfied", value: "dissatisfied" },
          { label: "Very Dissatisfied", value: "very_dissatisfied" },
        ],
      },
      {
        id: "field-7",
        type: "textarea",
        label: "Additional Comments",
        required: false,
        placeholder: "Share any additional feedback...",
        rows: 3,
      },
    ],
    settings: {},
    status: "published",
    is_published: true,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    created_by: "system",
    category: "Feedback",
    estimated_time: 5,
    required_fields: ["Employee Name", "Department", "Overall Satisfaction"],
  },
  {
    id: "3",
    title: "Employee Onboarding Form",
    description:
      "Complete onboarding form for new employees with organized sections",
    fields: [
      {
        id: "section-1",
        type: "section",
        label: "Personal Information",
        required: false,
      },
      {
        id: "field-8",
        type: "text",
        label: "Full Name",
        required: true,
        placeholder: "Enter your full legal name",
      },
      {
        id: "field-9",
        type: "email",
        label: "Personal Email",
        required: true,
        placeholder: "your.personal@email.com",
      },
      {
        id: "field-10",
        type: "tel",
        label: "Phone Number",
        required: true,
        placeholder: "+1 (555) 123-4567",
      },
      {
        id: "section-2",
        type: "section",
        label: "Office Details",
        required: false,
      },
      {
        id: "field-11",
        type: "select",
        label: "Department",
        required: true,
        options: [
          { label: "Engineering", value: "engineering" },
          { label: "Marketing", value: "marketing" },
          { label: "Sales", value: "sales" },
          { label: "HR", value: "hr" },
          { label: "Finance", value: "finance" },
        ],
      },
      {
        id: "field-12",
        type: "text",
        label: "Job Title",
        required: true,
        placeholder: "Enter your job title",
      },
      {
        id: "field-13",
        type: "date",
        label: "Start Date",
        required: true,
      },
    ],
    settings: {},
    status: "published",
    is_published: true,
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 172800000).toISOString(),
    created_by: "system",
    category: "Onboarding",
    estimated_time: 8,
    required_fields: [
      "Full Name",
      "Personal Email",
      "Phone Number",
      "Department",
      "Job Title",
      "Start Date",
    ],
  },
];

// Get all forms (published and unpublished based on query params)
export const getForms = async (req, res) => {
  try {
    const { published, created_by, form_type } = req.query;

    // Try to fetch from database first
    let query = supabase.from("forms").select("*");

    if (published !== undefined) {
      query = query.eq("is_published", published === "true");
    }

    if (created_by) {
      query = query.eq("created_by", created_by);
    }

    if (form_type) {
      query = query.eq("form_type", form_type);
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) {
      console.error(
        "Error fetching forms from database, using mock data:",
        error.message
      );
      // Return mock data if database is not available
      let filteredMockData = mockForms;

      if (published !== undefined) {
        filteredMockData = filteredMockData.filter(
          (form) => form.is_published === (published === "true")
        );
      }

      return res.json(filteredMockData);
    }

    // Transform data to ensure consistency - handle both fields and form_config
    const transformedData = data.map((form) => ({
      ...form,
      fields: form.form_config?.fields || form.fields || [],
      form_config: form.form_config || { fields: form.fields || [] },
    }));

    res.json(transformedData);
  } catch (error) {
    console.error("Server error:", error);
    // Fallback to mock data
    res.json(mockForms);
  }
};

// Get a single form by ID
export const getForm = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("forms")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(
        "Error fetching form from database, checking mock data:",
        error.message
      );
      // Fallback to mock data
      const mockForm = mockForms.find((form) => form.id === id);
      if (mockForm) {
        return res.json(mockForm);
      }
      return res.status(404).json({ error: "Form not found" });
    }

    res.json(data);
  } catch (error) {
    console.error("Server error:", error);
    // Fallback to mock data
    const mockForm = mockForms.find((form) => form.id === req.params.id);
    if (mockForm) {
      return res.json(mockForm);
    }
    res.status(404).json({ error: "Form not found" });
  }
};

// Get all published forms (for public access)
export const getPublishedForms = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("forms")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(
        "Error fetching published forms from database, using mock data:",
        error.message
      );
      // Return only published mock forms
      const publishedMockForms = mockForms.filter((form) => form.is_published);
      return res.json(publishedMockForms);
    }

    res.json(data || []);
  } catch (error) {
    console.error("Server error:", error);
    // Fallback to published mock data
    const publishedMockForms = mockForms.filter((form) => form.is_published);
    res.json(publishedMockForms);
  }
};

// Create a new form
export const createForm = async (req, res) => {
  try {
    const {
      title,
      description,
      form_type = "custom",
      form_config,
      managers = [],
      created_by,
      is_published = false,
    } = req.body;

    // Validate required fields
    if (!title || !form_config) {
      return res.status(400).json({
        error: "Title and form configuration are required",
      });
    }

    // Validate form_config structure
    if (!form_config.fields || !Array.isArray(form_config.fields)) {
      return res.status(400).json({
        error: "Form configuration must include a fields array",
      });
    }

    const formData = {
      id: uuidv4(),
      title: title.trim(),
      description: description?.trim() || "",
      form_type,
      form_config,
      fields: form_config.fields, // Keep for backward compatibility
      managers,
      created_by: req.user?.email || req.user?.name || "anonymous",
      is_published,
      status: is_published ? "published" : "draft",
      category: "Custom",
      estimated_time: 5,
    };

    console.log("Creating form with data:", JSON.stringify(formData, null, 2));

    const { data, error } = await supabase
      .from("forms")
      .insert([formData])
      .select()
      .single();

    if (error) {
      console.error("Error creating form:", error);

      // Provide more specific error messages
      if (error.code === "42501") {
        return res.status(403).json({
          error: "Database permissions error. Please check your RLS policies.",
          details: "Row Level Security is preventing the insert operation.",
        });
      }

      return res.status(500).json({
        error: "Failed to create form",
        details: error.message,
      });
    }

    console.log("Form created successfully:", data);
    res.status(201).json(data);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
};

// Update a form
export const updateForm = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Remove fields that shouldn't be updated directly
    delete updates.id;
    delete updates.created_at;
    delete updates.updated_at;

    // Validate form_config if provided
    if (
      updates.form_config &&
      (!updates.form_config.fields ||
        !Array.isArray(updates.form_config.fields))
    ) {
      return res.status(400).json({
        error: "Form configuration must include a fields array",
      });
    }

    // Ensure status is consistent with is_published
    if (updates.is_published !== undefined) {
      updates.status = updates.is_published ? "published" : "draft";
    }

    // Also update the legacy fields array for backward compatibility
    if (updates.form_config && updates.form_config.fields) {
      updates.fields = updates.form_config.fields;
    }

    console.log(
      "Updating form with ID:",
      id,
      "Updates:",
      JSON.stringify(updates, null, 2)
    );

    const { data, error } = await supabase
      .from("forms")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating form:", error);

      if (error.code === "PGRST116") {
        return res.status(404).json({ error: "Form not found" });
      }

      if (error.code === "42501") {
        return res.status(403).json({
          error: "Database permissions error. Please check your RLS policies.",
          details: "Row Level Security is preventing the update operation.",
        });
      }

      return res.status(500).json({
        error: "Failed to update form",
        details: error.message,
      });
    }

    console.log("Form updated successfully:", data);
    res.json(data);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
};

// Delete a form
export const deleteForm = async (req, res) => {
  try {
    const { id } = req.params;

    // First, get all submissions for this form to delete their approvals
    const { data: submissions, error: submissionsError } = await supabase
      .from("submissions")
      .select("id")
      .eq("form_id", id);

    if (submissionsError) {
      console.error("Error fetching submissions:", submissionsError);
      return res
        .status(500)
        .json({ error: "Failed to check form submissions" });
    }

    // Delete all approvals for submissions of this form
    if (submissions && submissions.length > 0) {
      const submissionIds = submissions.map((s) => s.id);
      const { error: approvalsError } = await supabase
        .from("approvals")
        .delete()
        .in("submission_id", submissionIds);

      if (approvalsError) {
        console.error("Error deleting approvals:", approvalsError);
        return res
          .status(500)
          .json({ error: "Failed to delete form approvals" });
      }
    }

    // Delete all submissions for this form
    const { error: deleteSubmissionsError } = await supabase
      .from("submissions")
      .delete()
      .eq("form_id", id);

    if (deleteSubmissionsError) {
      console.error("Error deleting submissions:", deleteSubmissionsError);
      return res
        .status(500)
        .json({ error: "Failed to delete form submissions" });
    }

    // Finally, delete the form itself
    const { error } = await supabase.from("forms").delete().eq("id", id);

    if (error) {
      console.error("Error deleting form:", error);
      return res.status(500).json({ error: "Failed to delete form" });
    }

    res.json({
      message: "Form deleted successfully",
      deletedSubmissions: submissions ? submissions.length : 0,
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Publish a form
export const publishForm = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("forms")
      .update({ is_published: true })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({ error: "Form not found" });
      }
      console.error("Error publishing form:", error);
      return res.status(500).json({ error: "Failed to publish form" });
    }

    res.json(data);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Unpublish a form
export const unpublishForm = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("forms")
      .update({ is_published: false })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({ error: "Form not found" });
      }
      console.error("Error unpublishing form:", error);
      return res.status(500).json({ error: "Failed to unpublish form" });
    }

    res.json(data);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get form templates
export const getFormTemplates = async (req, res) => {
  try {
    const { category, active } = req.query;

    let query = supabase.from("form_templates").select("*");

    if (category) {
      query = query.eq("category", category);
    }

    if (active !== undefined) {
      query = query.eq("is_active", active === "true");
    }

    const { data, error } = await query.order("name");

    if (error) {
      console.error("Error fetching templates:", error);
      return res.status(500).json({ error: "Failed to fetch templates" });
    }

    res.json(data || []);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Create a form from template
export const createFormFromTemplate = async (req, res) => {
  try {
    const { templateId } = req.params;
    const { title, created_by, managers = [] } = req.body;

    // Get the template
    const { data: template, error: templateError } = await supabase
      .from("form_templates")
      .select("*")
      .eq("id", templateId)
      .single();

    if (templateError || !template) {
      return res.status(404).json({ error: "Template not found" });
    }

    // Create form from template
    const formData = {
      id: uuidv4(),
      title: title || template.name,
      description: template.description || "",
      form_type: "template",
      form_config: template.template_config,
      managers,
      created_by: created_by || "anonymous",
      is_published: false,
    };

    const { data, error } = await supabase
      .from("forms")
      .insert([formData])
      .select()
      .single();

    if (error) {
      console.error("Error creating form from template:", error);
      return res
        .status(500)
        .json({ error: "Failed to create form from template" });
    }

    res.status(201).json(data);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get forms where the current user is a manager
export const getManagerForms = async (req, res) => {
  try {
    // Get current user email from the request (set by auth middleware)
    const userEmail =
      req.user?.email || req.user?.mail || req.user?.userPrincipalName;

    if (!userEmail) {
      console.log("❌ No user email found in request");
      return res.status(401).json({ error: "User email not found" });
    }

    console.log(`🔍 Getting manager forms for user: ${userEmail}`);

    // Try to fetch from database first
    const { data, error } = await supabase
      .from("forms")
      .select("*")
      .contains("managers", [userEmail])
      .eq("requires_approval", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(
        "Error fetching manager forms from database:",
        error.message
      );
      // Return mock data filtered for this manager
      const filteredMockData = mockForms.filter(
        (form) => form.managers && form.managers.includes(userEmail)
      );
      console.log(`📝 Returning ${filteredMockData.length} mock forms`);
      return res.json(filteredMockData);
    }

    console.log(`✅ Found ${data?.length || 0} forms where user is a manager`);
    res.json(data || []);
  } catch (error) {
    console.error("Error fetching manager forms:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get forms that require approval for the current user
export const getFormsRequiringApproval = async (req, res) => {
  try {
    // Get current user email from the request (set by auth middleware)
    const userEmail =
      req.user?.email || req.user?.mail || req.user?.userPrincipalName;

    if (!userEmail) {
      return res.status(401).json({ error: "User email not found" });
    }

    console.log(`Getting forms requiring approval for manager: ${userEmail}`);

    // Get submissions that need approval from this manager
    const { data: submissions, error: submissionsError } = await supabase
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
      .contains("forms.managers", [userEmail])
      .eq("status", "pending")
      .order("submitted_at", { ascending: false });

    if (submissionsError) {
      console.error(
        "Error fetching submissions requiring approval:",
        submissionsError.message
      );
      return res
        .status(500)
        .json({ error: "Failed to fetch submissions requiring approval" });
    }

    console.log(
      `Found ${submissions?.length || 0} submissions requiring approval`
    );
    res.json(submissions || []);
  } catch (error) {
    console.error("Error fetching forms requiring approval:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Export form submissions as CSV
export const exportFormSubmissions = async (req, res) => {
  try {
    const { id } = req.params;
    const userEmail =
      req.user?.email || req.user?.mail || req.user?.userPrincipalName;

    if (!userEmail) {
      return res.status(401).json({ error: "User email not found" });
    }

    // First, verify that the user is a manager of this form
    const { data: form, error: formError } = await supabase
      .from("forms")
      .select("id, title, managers, fields")
      .eq("id", id)
      .single();

    if (formError || !form) {
      return res.status(404).json({ error: "Form not found" });
    }

    // Check if user is a manager of this form
    if (!form.managers || !form.managers.includes(userEmail)) {
      return res
        .status(403)
        .json({ error: "Access denied. You are not a manager of this form." });
    }

    // Get all submissions for this form
    const { data: submissions, error: submissionsError } = await supabase
      .from("submissions")
      .select("*")
      .eq("form_id", id)
      .order("submitted_at", { ascending: false });

    if (submissionsError) {
      console.error("Error fetching submissions:", submissionsError);
      return res.status(500).json({ error: "Failed to fetch submissions" });
    }

    // Prepare CSV data
    const csvRows = [];
    const headers = [
      "Submission ID",
      "Submitter Name",
      "Submitter Email",
      "Status",
      "Submitted At",
    ];

    // Add field headers from form structure
    if (form.fields && form.fields.length > 0) {
      form.fields.forEach((field) => {
        if (
          field.label &&
          !["section", "page-break", "spacer", "heading", "paragraph"].includes(
            field.type
          )
        ) {
          headers.push(field.label);
        }
      });
    }

    csvRows.push(headers);

    // Add submission data rows
    submissions.forEach((submission) => {
      const row = [
        submission.id,
        submission.submitter_name || "Anonymous",
        submission.submitter_email || "",
        submission.status,
        new Date(submission.submitted_at).toLocaleString(),
      ];

      // Add field data
      if (form.fields && form.fields.length > 0) {
        form.fields.forEach((field) => {
          if (
            field.label &&
            ![
              "section",
              "page-break",
              "spacer",
              "heading",
              "paragraph",
            ].includes(field.type)
          ) {
            const fieldData = submission.data?.[field.id] || "";
            // Handle arrays (like multi-select)
            const cellValue = Array.isArray(fieldData)
              ? fieldData.join("; ")
              : String(fieldData);
            row.push(cellValue);
          }
        });
      }

      csvRows.push(row);
    });

    // Convert to CSV string
    const csvContent = csvRows
      .map((row) =>
        row
          .map((cell) => {
            // Escape quotes and wrap in quotes if contains comma, quote, or newline
            const cellStr = String(cell || "");
            if (
              cellStr.includes(",") ||
              cellStr.includes('"') ||
              cellStr.includes("\n")
            ) {
              return '"' + cellStr.replace(/"/g, '""') + '"';
            }
            return cellStr;
          })
          .join(",")
      )
      .join("\n");

    // Set headers for file download
    const fileName = `${form.title.replace(/[^a-zA-Z0-9]/g, "_")}_submissions_${
      new Date().toISOString().split("T")[0]
    }.csv`;

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

    res.send(csvContent);
  } catch (error) {
    console.error("Error exporting submissions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
