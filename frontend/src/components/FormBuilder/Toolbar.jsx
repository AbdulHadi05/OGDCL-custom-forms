import React, { useState } from "react";
import { Link } from "react-router-dom";
import { usersAPI } from "../../services/api";
import {
  Save,
  Eye,
  EyeOff,
  Settings,
  Users,
  Globe,
  Globe2,
  ArrowLeft,
  Clock,
  CheckCircle,
  AlertCircle,
  UserCheck,
  Loader,
} from "lucide-react";

const Toolbar = ({
  formTitle,
  setFormTitle,
  formDescription,
  setFormDescription,
  isPreviewMode,
  setIsPreviewMode,
  onSave,
  onPublish,
  onUnpublish,
  saving,
  isPublished,
  lastSaved,
  managers,
  setManagers,
  requiresApproval,
  setRequiresApproval,
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [newManager, setNewManager] = useState("");
  const [validatingEmail, setValidatingEmail] = useState(false);
  const [emailValidationMessage, setEmailValidationMessage] = useState("");

  const handleAddManager = async () => {
    const email = newManager.trim();
    if (!email) return;

    // Check if already in list
    if (managers.includes(email)) {
      setEmailValidationMessage("Email already in managers list");
      return;
    }

    setValidatingEmail(true);
    setEmailValidationMessage("");

    try {
      const result = await usersAPI.validateEmail(email);

      if (result.valid) {
        setManagers([...managers, email]);
        setNewManager("");
        setEmailValidationMessage("✓ Valid Microsoft user added successfully");
        // Clear success message after 3 seconds
        setTimeout(() => setEmailValidationMessage(""), 3000);
      } else {
        setEmailValidationMessage(
          result.message || "User not found in Microsoft directory"
        );
      }
    } catch (error) {
      console.error("Email validation error:", error);
      setEmailValidationMessage(
        "Failed to validate email. Please check your connection and try again."
      );
    } finally {
      setValidatingEmail(false);
    }
  };

  const handleRemoveManager = (manager) => {
    setManagers(managers.filter((m) => m !== manager));
  };

  const formatLastSaved = (date) => {
    if (!date) return "";
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return "Just saved";
    if (diff < 3600) return `Saved ${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `Saved ${Math.floor(diff / 3600)}h ago`;
    return `Saved ${date.toLocaleDateString()}`;
  };

  return (
    <>
      <div className="toolbar">
        {/* Left Section */}
        <div className="toolbar-left">
          <Link to="/forms" className="toolbar-button">
            <ArrowLeft size={16} />
            Back to Forms
          </Link>

          <div className="form-title-input">
            <input
              type="text"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="Form Title"
              className="text-lg font-semibold bg-transparent border-none outline-none min-w-0 flex-1"
            />
          </div>
        </div>

        {/* Center Section */}
        <div className="toolbar-center">
          {/* Save Status */}
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            {saving ? (
              <>
                <div className="loading w-4 h-4"></div>
                <span>Saving...</span>
              </>
            ) : lastSaved ? (
              <>
                <CheckCircle size={16} className="text-green-500" />
                <span>{formatLastSaved(lastSaved)}</span>
              </>
            ) : null}
          </div>
        </div>

        {/* Right Section */}
        <div className="toolbar-right">
          {/* Form Settings */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="toolbar-button"
            title="Form Settings"
          >
            <Settings size={16} />
            Settings
          </button>

          {/* Preview Toggle */}
          <button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className={`toolbar-button ${isPreviewMode ? "primary" : ""}`}
          >
            {isPreviewMode ? <EyeOff size={16} /> : <Eye size={16} />}
            {isPreviewMode ? "Exit Preview" : "Preview"}
          </button>

          {/* Save Button */}
          <button
            onClick={onSave}
            disabled={saving}
            className="toolbar-button primary"
          >
            {saving ? (
              <div className="loading w-4 h-4"></div>
            ) : (
              <Save size={16} />
            )}
            Save
          </button>

          {/* Publish/Unpublish Button */}
          {isPublished ? (
            <button
              onClick={onUnpublish}
              className="toolbar-button"
              title="Unpublish form"
            >
              <EyeOff size={16} />
              Unpublish
            </button>
          ) : (
            <button
              onClick={onPublish}
              className="toolbar-button success"
              title="Save and publish form"
            >
              <Globe size={16} />
              Save & Publish
            </button>
          )}

          {/* Publish Status Indicator */}
          <div
            className={`px-2 py-1 rounded text-xs font-medium ${
              isPublished
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {isPublished ? "Published" : "Draft"}
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Form Settings
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Settings */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">
                  Basic Information
                </h4>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Form Title
                    </label>
                    <input
                      type="text"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter form title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Form Description
                    </label>
                    <textarea
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Optional description for your form"
                    />
                  </div>
                </div>
              </div>

              {/* Approval Settings */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">
                  Approval Workflow
                </h4>

                <div className="space-y-3">
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={requiresApproval}
                        onChange={(e) => setRequiresApproval(e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Require approval for submissions
                      </span>
                    </label>
                  </div>

                  {requiresApproval && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Users size={16} className="inline mr-1" />
                        Approval Managers
                      </label>

                      {/* Add Manager Input */}
                      <div className="space-y-2 mb-2">
                        <div className="flex space-x-2">
                          <input
                            type="email"
                            value={newManager}
                            onChange={(e) => {
                              setNewManager(e.target.value);
                              setEmailValidationMessage("");
                            }}
                            onKeyPress={(e) =>
                              e.key === "Enter" &&
                              !validatingEmail &&
                              handleAddManager()
                            }
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                            placeholder="Enter Microsoft email address"
                            disabled={validatingEmail}
                          />
                          <button
                            onClick={handleAddManager}
                            disabled={validatingEmail || !newManager.trim()}
                            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                          >
                            {validatingEmail ? (
                              <>
                                <Loader
                                  size={14}
                                  className="animate-spin mr-1"
                                />
                                Validating
                              </>
                            ) : (
                              <>
                                <UserCheck size={14} className="mr-1" />
                                Add
                              </>
                            )}
                          </button>
                        </div>

                        {/* Validation Message */}
                        {emailValidationMessage && (
                          <div
                            className={`text-xs px-2 py-1 rounded flex items-center ${
                              emailValidationMessage.includes("not found") ||
                              emailValidationMessage.includes("Failed") ||
                              emailValidationMessage.includes("already in")
                                ? "bg-red-50 text-red-700 border border-red-200"
                                : emailValidationMessage.includes("✓")
                                ? "bg-green-50 text-green-700 border border-green-200"
                                : "bg-blue-50 text-blue-700 border border-blue-200"
                            }`}
                          >
                            {emailValidationMessage.includes("✓") ? (
                              <CheckCircle
                                size={12}
                                className="mr-1 flex-shrink-0"
                              />
                            ) : (
                              <AlertCircle
                                size={12}
                                className="mr-1 flex-shrink-0"
                              />
                            )}
                            {emailValidationMessage}
                          </div>
                        )}

                        <div className="text-xs text-gray-500">
                          Enter email addresses from your organization domain
                        </div>
                      </div>

                      {/* Managers List */}
                      {managers.length > 0 && (
                        <div className="space-y-1">
                          {managers.map((manager) => (
                            <div
                              key={manager}
                              className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded text-sm"
                            >
                              <span>{manager}</span>
                              <button
                                onClick={() => handleRemoveManager(manager)}
                                className="text-red-600 hover:text-red-800"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {managers.length === 0 && (
                        <div className="text-sm text-gray-500 bg-yellow-50 border border-yellow-200 rounded p-2">
                          <AlertCircle size={16} className="inline mr-1" />
                          Add at least one manager to enable approval workflow
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Form URL Preview */}
            {isPublished && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">
                  📋 Form Published Successfully!
                </h4>
                <p className="text-green-700 text-sm mb-2">
                  Your form is now live and accepting submissions.
                </p>
                <div className="bg-white border border-green-200 rounded px-3 py-2">
                  <code className="text-sm text-green-800">
                    {window.location.origin}/submit/[form-id]
                  </code>
                </div>
              </div>
            )}

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Close Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Toolbar;
