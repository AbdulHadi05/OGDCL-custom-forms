import React, { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { formsAPI } from "../services/api";

// Import form builder components
import Sidebar from "./FormBuilder/Sidebar";
import FormCanvas from "./FormBuilder/FormCanvas";
import Toolbar from "./FormBuilder/Toolbar";

const FormBuilderPage = () => {
  const { id: formId } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(formId);

  // Form state
  const [formFields, setFormFields] = useState([]);
  const [selectedField, setSelectedField] = useState(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [formTitle, setFormTitle] = useState("Untitled Form");
  const [formDescription, setFormDescription] = useState("");
  const [formType, setFormType] = useState("custom");
  const [managers, setManagers] = useState([]);
  const [requiresApproval, setRequiresApproval] = useState(true);
  const [isPublished, setIsPublished] = useState(false);

  // UI state
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [lastSaved, setLastSaved] = useState(null);

  // Load existing form if editing
  useEffect(() => {
    if (isEditing && formId) {
      loadForm(formId);
    }
  }, [formId, isEditing]);

  const loadForm = async (id) => {
    try {
      setLoading(true);
      setError(null);

      const response = await formsAPI.getForm(id);
      const form = response.data;

      setFormTitle(form.title || "Untitled Form");
      setFormDescription(form.description || "");
      setFormType(form.form_type || "custom");

      // Handle both new format (form_config.fields) and legacy format (fields)
      let loadedFields = form.form_config?.fields || form.fields || [];

      // Ensure all fields have unique IDs for the form builder
      loadedFields = loadedFields.map((field, index) => ({
        ...field,
        id: field.id || uuidv4(),
        // Ensure required properties exist
        label: field.label || `Field ${index + 1}`,
        type: field.type || "text",
      }));

      setFormFields(loadedFields);
      setManagers(form.managers || []);
      setRequiresApproval(form.requires_approval !== false);
      setIsPublished(form.is_published || false);

      console.log("Loaded form:", form);
      console.log("Loaded fields:", loadedFields);
    } catch (error) {
      console.error("Error loading form:", error);
      setError("Failed to load form. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const saveForm = async (shouldPublish = false) => {
    try {
      setSaving(true);
      setError(null);

      const formData = {
        title: formTitle.trim() || "Untitled Form",
        description: formDescription.trim(),
        form_type: formType,
        form_config: {
          title: formTitle.trim() || "Untitled Form",
          description: formDescription.trim(),
          fields: formFields,
        },
        managers,
        requires_approval: requiresApproval,
        is_published: shouldPublish || isPublished,
        created_by: "current_user", // Replace with actual user ID when auth is implemented
      };

      let response;
      if (isEditing) {
        response = await formsAPI.updateForm(formId, formData);
      } else {
        response = await formsAPI.createForm(formData);
      }

      setLastSaved(new Date());

      if (!isEditing) {
        // Navigate to edit mode for newly created form
        navigate(`/forms/${response.data.id}/edit`, { replace: true });
      }

      if (shouldPublish) {
        setIsPublished(true);
      }

      return response.data;
    } catch (error) {
      console.error("Error saving form:", error);
      setError("Failed to save form. Please try again.");
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const publishForm = async () => {
    try {
      if (formFields.length === 0) {
        alert("Please add at least one field before publishing.");
        return;
      }

      // Always save the form first, then publish it
      await saveForm(true);
      setIsPublished(true);
      alert(
        "Form saved and published successfully! Users can now submit this form."
      );
    } catch (error) {
      console.error("Error saving and publishing form:", error);
      alert("Failed to save and publish form. Please try again.");
    }
  };

  const unpublishForm = async () => {
    try {
      await formsAPI.unpublishForm(formId);
      setIsPublished(false);
      alert("Form unpublished successfully.");
    } catch (error) {
      console.error("Error unpublishing form:", error);
      alert("Failed to unpublish form. Please try again.");
    }
  };

  // Field management functions
  const addField = useCallback((fieldType, position = null) => {
    const newField = {
      id: uuidv4(),
      type: fieldType,
      label: getDefaultLabel(fieldType),
      placeholder: getDefaultPlaceholder(fieldType),
      required: false,
      options: ["select", "radio", "checkbox"].includes(fieldType)
        ? ["Option 1", "Option 2", "Option 3"]
        : [],
      validation: {},
      style: {},
      value: fieldType === "signature" ? null : "",
      content:
        fieldType === "paragraph"
          ? "This is a paragraph. You can edit this content in the field settings."
          : undefined,
    };

    setFormFields((prev) => {
      if (position !== null && position >= 0 && position <= prev.length) {
        const newFields = [...prev];
        newFields.splice(position, 0, newField);
        return newFields;
      }
      return [...prev, newField];
    });

    setSelectedField(newField.id);
  }, []);

  const updateField = useCallback((fieldId, updates) => {
    setFormFields((prev) =>
      prev.map((field) =>
        field.id === fieldId ? { ...field, ...updates } : field
      )
    );
  }, []);

  const deleteField = useCallback(
    (fieldId) => {
      setFormFields((prev) => prev.filter((field) => field.id !== fieldId));
      if (selectedField === fieldId) {
        setSelectedField(null);
      }
    },
    [selectedField]
  );

  const duplicateField = useCallback(
    (fieldId) => {
      const fieldToDuplicate = formFields.find((field) => field.id === fieldId);
      if (fieldToDuplicate) {
        const duplicatedField = {
          ...fieldToDuplicate,
          id: uuidv4(),
          label: fieldToDuplicate.label + " (Copy)",
        };

        const fieldIndex = formFields.findIndex(
          (field) => field.id === fieldId
        );
        const newFields = [...formFields];
        newFields.splice(fieldIndex + 1, 0, duplicatedField);
        setFormFields(newFields);
        setSelectedField(duplicatedField.id);
      }
    },
    [formFields]
  );

  const moveField = useCallback(
    (fieldId, direction, steps = 1) => {
      const fieldIndex = formFields.findIndex((field) => field.id === fieldId);
      if (fieldIndex === -1) return;

      let newIndex;
      if (direction === "up") {
        newIndex = Math.max(0, fieldIndex - steps);
      } else {
        newIndex = Math.min(formFields.length - 1, fieldIndex + steps);
      }

      if (newIndex === fieldIndex) return;

      const newFields = [...formFields];
      const [movedField] = newFields.splice(fieldIndex, 1);
      newFields.splice(newIndex, 0, movedField);
      setFormFields(newFields);
    },
    [formFields]
  );

  // Helper functions
  const getDefaultLabel = (fieldType) => {
    const labels = {
      text: "Text Field",
      email: "Email Address",
      password: "Password",
      number: "Number",
      tel: "Phone Number",
      url: "Website URL",
      textarea: "Text Area",
      select: "Dropdown",
      radio: "Radio Group",
      checkbox: "Checkbox Group",
      file: "File Upload",
      date: "Date",
      time: "Time",
      datetime: "Date & Time",
      range: "Range Slider",
      signature: "Digital Signature",
      heading: "Heading",
      paragraph: "Paragraph",
      section: "Section",
      divider: "Divider",
      image: "Image",
      spacer: "Spacer",
    };
    return labels[fieldType] || "Field";
  };

  const getDefaultPlaceholder = (fieldType) => {
    const placeholders = {
      text: "Enter text here...",
      email: "your.email@example.com",
      password: "Enter your password",
      number: "0",
      tel: "+1 (555) 123-4567",
      url: "https://example.com",
      textarea: "Enter your message here...",
      file: "Choose file...",
      date: "Select date",
      time: "Select time",
      datetime: "Select date and time",
    };
    return placeholders[fieldType] || "";
  };

  // Auto-save functionality
  useEffect(() => {
    if (!isEditing || formFields.length === 0) return;

    // Don't auto-save immediately after loading
    if (loading) return;

    // Only auto-save if the form has been modified (has a title and fields)
    if (!formTitle.trim() || formFields.length === 0) return;

    const timeoutId = setTimeout(() => {
      saveForm().catch((error) => {
        console.error("Auto-save failed:", error);
        // Don't show error for auto-save failures to avoid annoying users
      });
    }, 3000); // Increased delay to 3 seconds

    return () => clearTimeout(timeoutId);
  }, [
    formFields,
    formTitle,
    formDescription,
    managers,
    requiresApproval,
    loading,
  ]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading mb-4"></div>
          <p className="text-gray-600">Loading form builder...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="form-builder-container">
      {/* Sidebar */}
      <Sidebar
        addField={addField}
        selectedField={selectedField}
        formFields={formFields}
        updateField={updateField}
      />

      {/* Main Content */}
      <div className="main-content">
        {/* Toolbar */}
        <Toolbar
          formTitle={formTitle}
          setFormTitle={setFormTitle}
          formDescription={formDescription}
          setFormDescription={setFormDescription}
          isPreviewMode={isPreviewMode}
          setIsPreviewMode={setIsPreviewMode}
          onSave={() => saveForm()}
          onPublish={publishForm}
          onUnpublish={unpublishForm}
          saving={saving}
          isPublished={isPublished}
          lastSaved={lastSaved}
          managers={managers}
          setManagers={setManagers}
          requiresApproval={requiresApproval}
          setRequiresApproval={setRequiresApproval}
        />

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-6 mt-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => setError(null)}
                  className="text-red-400 hover:text-red-600"
                >
                  <span className="sr-only">Dismiss</span>
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Form Canvas */}
        <FormCanvas
          formFields={formFields}
          selectedField={selectedField}
          setSelectedField={setSelectedField}
          addField={addField}
          updateField={updateField}
          deleteField={deleteField}
          moveField={moveField}
          duplicateField={duplicateField}
          formTitle={formTitle}
          formDescription={formDescription}
          isPreviewMode={isPreviewMode}
        />
      </div>
    </div>
  );
};

export default FormBuilderPage;
