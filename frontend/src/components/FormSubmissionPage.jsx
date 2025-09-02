import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { formsAPI, submissionsAPI } from "../services/api";
import {
  Send,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Upload,
  X,
  Calendar,
  Clock,
  User,
  Users,
  FileText,
} from "lucide-react";

const FormSubmissionPage = () => {
  const { formId, id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);

  useEffect(() => {
    if (id) {
      // View existing submission
      setIsViewMode(true);
      fetchSubmission();
    } else if (formId) {
      // New submission
      fetchForm();
    }
  }, [formId, id]);

  const fetchForm = async () => {
    try {
      const data = await formsAPI.getById(formId);
      setForm(data);
      initializeFormData(data.fields);
    } catch (error) {
      console.error("Form not found:", error);
      navigate("/submit");
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmission = async () => {
    try {
      const data = await submissionsAPI.getById(id);
      setSubmission(data);
      setForm({ ...data.form, fields: data.form.fields || [] });
      setFormData(data.data || {});
    } catch (error) {
      console.error("Submission not found:", error);
      navigate("/submit");
    } finally {
      setLoading(false);
    }
  };

  const initializeFormData = (fields) => {
    const initialData = {};
    fields?.forEach((field, index) => {
      const fieldKey = `field-${index}`;
      if (field.type === "checkbox") {
        initialData[fieldKey] = [];
      } else {
        initialData[fieldKey] = "";
      }
    });
    setFormData(initialData);
  };

  const validateForm = () => {
    const newErrors = {};

    form.fields?.forEach((field, index) => {
      const fieldKey = `field-${index}`;
      const value = formData[fieldKey];

      if (field.required) {
        if (!value || (Array.isArray(value) && value.length === 0)) {
          newErrors[fieldKey] = `${field.label} is required`;
        }
      }

      // Type-specific validations
      if (value && field.type === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          newErrors[fieldKey] = "Please enter a valid email address";
        }
      }

      if (value && field.type === "url") {
        try {
          new URL(value);
        } catch {
          newErrors[fieldKey] = "Please enter a valid URL";
        }
      }

      if (value && field.type === "number") {
        const num = Number(value);
        if (field.min !== undefined && num < field.min) {
          newErrors[fieldKey] = `Value must be at least ${field.min}`;
        }
        if (field.max !== undefined && num > field.max) {
          newErrors[fieldKey] = `Value must be no more than ${field.max}`;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (fieldKey, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldKey]: value,
    }));

    // Clear error when user starts typing
    if (errors[fieldKey]) {
      setErrors((prev) => ({
        ...prev,
        [fieldKey]: null,
      }));
    }
  };

  const handleCheckboxChange = (fieldKey, optionValue, checked) => {
    setFormData((prev) => {
      const currentValues = prev[fieldKey] || [];
      if (checked) {
        return {
          ...prev,
          [fieldKey]: [...currentValues, optionValue],
        };
      } else {
        return {
          ...prev,
          [fieldKey]: currentValues.filter((val) => val !== optionValue),
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      const submissionData = {
        form_id: formId,
        submission_data: formData,
        submitter_email: formData["submitter_email"] || formData["submitter_name"] || "Anonymous",
      };

      await submissionsAPI.create(submissionData);
      setSuccess(true);
      setTimeout(() => {
        navigate("/submit");
      }, 3000);
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors({
        submit: error.message || "Network error. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (field, index) => {
    const fieldKey = `field-${index}`;
    const value = formData[fieldKey] || "";
    const error = errors[fieldKey];
    const disabled = isViewMode || submitting;

    const commonClasses = `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
      error ? "border-red-300" : "border-gray-300"
    } ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"}`;

    switch (field.type) {
      case "section":
        return (
          <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              {field.label}
            </h3>
            {field.description && (
              <p className="text-sm text-blue-700">{field.description}</p>
            )}
          </div>
        );

      case "text":
      case "email":
      case "password":
      case "tel":
      case "url":
        return (
          <>
            <input
              type={field.type}
              value={value}
              onChange={(e) => handleInputChange(fieldKey, e.target.value)}
              placeholder={field.placeholder || `Enter ${field.label}`}
              className={commonClasses}
              disabled={disabled}
              required={field.required}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </>
        );

      case "number":
        return (
          <>
            <input
              type="number"
              value={value}
              onChange={(e) => handleInputChange(fieldKey, e.target.value)}
              placeholder={field.placeholder || `Enter ${field.label}`}
              min={field.min}
              max={field.max}
              step={field.step}
              className={commonClasses}
              disabled={disabled}
              required={field.required}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </>
        );

      case "textarea":
        return (
          <>
            <textarea
              value={value}
              onChange={(e) => handleInputChange(fieldKey, e.target.value)}
              placeholder={field.placeholder || `Enter ${field.label}`}
              rows={field.rows || 3}
              className={commonClasses}
              disabled={disabled}
              required={field.required}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </>
        );

      case "select":
        return (
          <>
            <select
              value={value}
              onChange={(e) => handleInputChange(fieldKey, e.target.value)}
              className={commonClasses}
              disabled={disabled}
              required={field.required}
            >
              <option value="">Select an option</option>
              {field.options?.map((option, optIndex) => {
                // Handle both string options and object options
                const optionValue =
                  typeof option === "string" ? option : option.value;
                const optionLabel =
                  typeof option === "string" ? option : option.label;
                return (
                  <option key={optIndex} value={optionValue}>
                    {optionLabel}
                  </option>
                );
              })}
            </select>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </>
        );

      case "radio":
        return (
          <>
            <div className="space-y-2">
              {field.options?.map((option, optIndex) => {
                // Handle both string options and object options
                const optionValue =
                  typeof option === "string" ? option : option.value;
                const optionLabel =
                  typeof option === "string" ? option : option.label;
                return (
                  <label key={optIndex} className="flex items-center">
                    <input
                      type="radio"
                      name={fieldKey}
                      value={optionValue}
                      checked={value === optionValue}
                      onChange={(e) =>
                        handleInputChange(fieldKey, e.target.value)
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      disabled={disabled}
                      required={field.required}
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {optionLabel}
                    </span>
                  </label>
                );
              })}
            </div>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </>
        );

      case "checkbox":
        return (
          <>
            <div className="space-y-2">
              {field.options?.map((option, optIndex) => {
                // Handle both string options and object options
                const optionValue =
                  typeof option === "string" ? option : option.value;
                const optionLabel =
                  typeof option === "string" ? option : option.label;
                return (
                  <label key={optIndex} className="flex items-center">
                    <input
                      type="checkbox"
                      value={optionValue}
                      checked={
                        Array.isArray(value) && value.includes(optionValue)
                      }
                      onChange={(e) =>
                        handleCheckboxChange(
                          fieldKey,
                          optionValue,
                          e.target.checked
                        )
                      }
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      disabled={disabled}
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {optionLabel}
                    </span>
                  </label>
                );
              })}
            </div>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </>
        );

      case "date":
      case "time":
        return (
          <>
            <input
              type={field.type === "datetime" ? "datetime-local" : field.type}
              value={value}
              onChange={(e) => handleInputChange(fieldKey, e.target.value)}
              className={commonClasses}
              disabled={disabled}
              required={field.required}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </>
        );

      case "file":
        return (
          <>
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center ${
                error ? "border-red-300" : "border-gray-300"
              } ${disabled ? "bg-gray-50" : "hover:border-gray-400"}`}
            >
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                {disabled
                  ? "File upload (view only)"
                  : "Click to upload or drag and drop"}
              </p>
              {field.accept && (
                <p className="text-xs text-gray-500 mt-1">
                  Accepted formats: {field.accept}
                </p>
              )}
            </div>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </>
        );

      case "range":
        return (
          <>
            <div>
              <input
                type="range"
                value={value}
                onChange={(e) => handleInputChange(fieldKey, e.target.value)}
                min={field.min || 0}
                max={field.max || 100}
                step={field.step || 1}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                disabled={disabled}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{field.min || 0}</span>
                <span className="font-medium">{value || field.min || 0}</span>
                <span>{field.max || 100}</span>
              </div>
            </div>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </>
        );

      case "heading":
        const HeadingTag = `h${field.level || 2}`;
        return (
          <HeadingTag
            className={`font-bold text-gray-900 ${
              field.level === 1
                ? "text-3xl"
                : field.level === 2
                ? "text-2xl"
                : field.level === 3
                ? "text-xl"
                : field.level === 4
                ? "text-lg"
                : field.level === 5
                ? "text-base"
                : "text-sm"
            }`}
          >
            {field.text || "Heading"}
          </HeadingTag>
        );

      case "paragraph":
        return (
          <p className="text-gray-700 leading-relaxed">
            {field.text || "Paragraph text"}
          </p>
        );

      case "divider":
        return <hr className="border-gray-300" />;

      case "spacer":
        return <div style={{ height: field.height || 20 }} />;

      default:
        return (
          <div className="p-3 bg-gray-100 rounded-lg text-gray-500 text-sm">
            Unsupported field type: {field.type}
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {isViewMode ? "Loading submission..." : "Loading form..."}
          </p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Form Submitted Successfully!
          </h2>
          <p className="text-gray-600 mb-6">
            Thank you for your submission. You will be redirected shortly.
          </p>
          <div className="flex justify-center">
            <button
              onClick={() => navigate("/submit")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Submit Another Form
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={() => navigate(isViewMode ? "/manager" : "/submit")}
                  className="mr-4 text-gray-400 hover:text-gray-600"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {form?.title}
                  </h1>
                  <p className="mt-1 text-sm text-gray-600">
                    {isViewMode
                      ? "Submission Details"
                      : "Fill out the form below"}
                  </p>
                </div>
              </div>

              {isViewMode && submission && (
                <div className="text-right text-sm text-gray-500">
                  <div className="flex items-center mb-1">
                    <User className="h-3 w-3 mr-1" />
                    {submission.submitter_name || "Anonymous"}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(submission.submitted_at).toLocaleDateString()}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="px-8 py-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {form?.title}
            </h2>
            {form?.description && (
              <p className="text-gray-600 mb-4">{form.description}</p>
            )}

            {/* Show form managers if form requires approval */}
            {form?.requires_approval &&
              form?.managers &&
              form.managers.length > 0 && (
                <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start">
                    <Users className="h-5 w-5 text-amber-600 mt-0.5 mr-2" />
                    <div>
                      <h3 className="font-medium text-amber-900 mb-2">
                        Form Managers
                      </h3>
                      <p className="text-sm text-amber-800 mb-2">
                        This form requires approval. Your submission will be
                        reviewed by:
                      </p>
                      <div className="space-y-1">
                        {form.managers.map((manager, index) => (
                          <div
                            key={index}
                            className="flex items-center text-sm text-amber-800"
                          >
                            <User className="h-3 w-3 mr-2" />
                            {manager}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

            {isViewMode && submission && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-blue-600 mr-2" />
                  <div>
                    <p className="font-medium text-blue-900">
                      Status:{" "}
                      {submission.status.charAt(0).toUpperCase() +
                        submission.status.slice(1)}
                    </p>
                    <p className="text-sm text-blue-700">
                      Submitted on{" "}
                      {new Date(submission.submitted_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="px-8 py-6">
            {form?.fields && form.fields.length > 0 ? (
              <div className="space-y-6">
                {form.fields.map((field, index) => (
                  <div key={index} className="space-y-2">
                    {!["heading", "paragraph", "divider", "spacer"].includes(
                      field.type
                    ) && (
                      <label className="block text-sm font-medium text-gray-700">
                        {field.label}
                        {field.required && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </label>
                    )}

                    {field.description &&
                      !["heading", "paragraph"].includes(field.type) && (
                        <p className="text-sm text-gray-500">
                          {field.description}
                        </p>
                      )}

                    {renderField(field, index)}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p>This form has no fields.</p>
              </div>
            )}

            {errors.submit && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                  <p className="text-red-700">{errors.submit}</p>
                </div>
              </div>
            )}

            {!isViewMode && (
              <div className="mt-8 flex justify-between items-center">
                <p className="text-sm text-gray-500">* Required fields</p>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Form
                    </>
                  )}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormSubmissionPage;
