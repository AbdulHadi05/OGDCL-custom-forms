import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { formsAPI } from "../services/api";
import {
  Eye,
  Edit3,
  Share2,
  Download,
  ArrowLeft,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";

const FormPreviewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (id) {
      fetchForm();
    }
  }, [id]);

  const fetchForm = async () => {
    try {
      const data = await formsAPI.getById(id);
      setForm(data);
    } catch (error) {
      console.error("Error fetching form:", error);
      navigate("/forms");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyShareLink = async () => {
    const shareUrl = `${window.location.origin}/submit/${form.id}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const renderField = (field, index) => {
    const commonClasses =
      "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent";

    switch (field.type) {
      case "section":
        return (
          <div
            key={index}
            className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg"
          >
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
          <input
            key={index}
            type={field.type}
            placeholder={field.placeholder || `Enter ${field.label}`}
            className={commonClasses}
            disabled
          />
        );

      case "number":
        return (
          <input
            key={index}
            type="number"
            placeholder={field.placeholder || `Enter ${field.label}`}
            min={field.min}
            max={field.max}
            step={field.step}
            className={commonClasses}
            disabled
          />
        );

      case "textarea":
        return (
          <textarea
            key={index}
            placeholder={field.placeholder || `Enter ${field.label}`}
            rows={field.rows || 3}
            className={commonClasses}
            disabled
          />
        );

      case "select":
        return (
          <select key={index} className={commonClasses} disabled>
            <option value="">Select an option</option>
            {field.options?.map((option, optIndex) => (
              <option key={optIndex} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case "radio":
        return (
          <div key={index} className="space-y-2">
            {field.options?.map((option, optIndex) => (
              <label key={optIndex} className="flex items-center">
                <input
                  type="radio"
                  name={`field-${index}`}
                  value={option.value}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  disabled
                />
                <span className="ml-2 text-sm text-gray-700">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        );

      case "checkbox":
        return (
          <div key={index} className="space-y-2">
            {field.options?.map((option, optIndex) => (
              <label key={optIndex} className="flex items-center">
                <input
                  type="checkbox"
                  value={option.value}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  disabled
                />
                <span className="ml-2 text-sm text-gray-700">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        );

      case "date":
      case "time":
      case "datetime":
        return (
          <input
            key={index}
            type={field.type === "datetime" ? "datetime-local" : field.type}
            className={commonClasses}
            disabled
          />
        );

      case "file":
        return (
          <div
            key={index}
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center"
          >
            <div className="text-gray-500">
              <p className="text-sm">Click to upload or drag and drop</p>
              {field.accept && (
                <p className="text-xs mt-1">Accepted formats: {field.accept}</p>
              )}
            </div>
          </div>
        );

      case "range":
        return (
          <div key={index}>
            <input
              type="range"
              min={field.min || 0}
              max={field.max || 100}
              step={field.step || 1}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              disabled
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{field.min || 0}</span>
              <span>{field.max || 100}</span>
            </div>
          </div>
        );

      case "heading":
        const HeadingTag = `h${field.level || 2}`;
        return (
          <HeadingTag
            key={index}
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
          <p key={index} className="text-gray-700 leading-relaxed">
            {field.text || "Paragraph text"}
          </p>
        );

      case "divider":
        return <hr key={index} className="border-gray-300" />;

      case "spacer":
        return <div key={index} style={{ height: field.height || 20 }} />;

      default:
        return (
          <div
            key={index}
            className="p-3 bg-gray-100 rounded-lg text-gray-500 text-sm"
          >
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
          <p className="text-gray-600">Loading form preview...</p>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Form not found
          </h2>
          <p className="text-gray-600 mb-4">
            The form you're looking for doesn't exist.
          </p>
          <Link
            to="/forms"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Forms
          </Link>
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
                <Link
                  to="/forms"
                  className="mr-4 text-gray-400 hover:text-gray-600"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {form.title}
                  </h1>
                  <p className="mt-1 text-sm text-gray-600">
                    Preview • {form.fields?.length || 0} fields
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={handleCopyShareLink}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Share Link
                    </>
                  )}
                </button>

                <Link
                  to={`/submit-form/${form.id}`}
                  target="_blank"
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Live Form
                </Link>

                <Link
                  to={`/admin/forms/${form.id}/edit`}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Form
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg">
          {/* Form Header */}
          <div className="px-8 py-6 border-b border-gray-200">
            <div className="flex items-center mb-4">
              <Eye className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm text-gray-500">Form Preview</span>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {form.title}
            </h2>
            {form.description && (
              <p className="text-gray-600">{form.description}</p>
            )}
          </div>

          {/* Form Fields */}
          <div className="px-8 py-6">
            {form.fields && form.fields.length > 0 ? (
              <div className="space-y-6">
                {form.fields.map((field, index) => (
                  <div key={index} className="space-y-2">
                    {/* Field Label */}
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

                    {/* Field Description */}
                    {field.description &&
                      !["heading", "paragraph"].includes(field.type) && (
                        <p className="text-sm text-gray-500">
                          {field.description}
                        </p>
                      )}

                    {/* Field Input */}
                    {renderField(field, index)}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p>No fields added to this form yet.</p>
              </div>
            )}
          </div>

          {/* Form Footer */}
          <div className="px-8 py-6 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">* Required fields</p>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled
              >
                Submit Form (Preview Mode)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormPreviewPage;
