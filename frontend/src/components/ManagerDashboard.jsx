import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  ArrowLeft,
  MessageSquare,
  FileText,
  Calendar,
  User,
  Send,
  AlertCircle,
  Download,
} from "lucide-react";
import { approvalsAPI, formsAPI } from "../services/api";

const ManagerDashboard = () => {
  const { managerId } = useParams();
  const navigate = useNavigate();
  const [selectedForm, setSelectedForm] = useState(null);
  const [forms, setForms] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formStats, setFormStats] = useState({});
  const [showApprovalModal, setShowApprovalModal] = useState(null);
  const [approvalComments, setApprovalComments] = useState("");
  const [processingApproval, setProcessingApproval] = useState(false);
  const [showSubmissionDetails, setShowSubmissionDetails] = useState(null);
  useEffect(() => {
    fetchFormsWithStats();
  }, [managerId]);

  useEffect(() => {
    if (selectedForm) {
      fetchFormSubmissions();
    }
  }, [selectedForm, managerId]);

  const fetchFormsWithStats = async () => {
    try {
      setLoading(true);
      console.log("🔍 Fetching manager forms and submissions...");

      // Get forms where current user is a manager
      const managerForms = await formsAPI.getManagerForms();
      console.log("📝 Manager forms:", managerForms);

      // Get submissions requiring approval for current user
      const submissionsRequiringApproval =
        await formsAPI.getFormsRequiringApproval();
      console.log(
        "📋 Submissions requiring approval:",
        submissionsRequiringApproval
      );

      // Group approvals by form and calculate stats
      const statsPerForm = {};

      // Initialize stats for all manager forms
      managerForms.forEach((form) => {
        statsPerForm[form.id] = {
          pending: 0,
          approved: 0,
          rejected: 0,
          total: 0,
        };
      });

      // Count submissions per form based on submissions requiring approval
      submissionsRequiringApproval.forEach((submission) => {
        const formId = submission.forms?.id;
        console.log(
          `📊 Processing submission for form ID: ${formId}, status: ${submission.status}`
        );
        if (formId && statsPerForm[formId]) {
          statsPerForm[formId][submission.status] += 1;
          statsPerForm[formId].total += 1;
        } else {
          console.log(
            `⚠️ Form ID ${formId} not found in manager forms or no stats initialized`
          );
        }
      });

      console.log("📈 Final stats per form:", statsPerForm);

      // Show ALL manager forms, not just ones with submissions
      // This was the bug - filtering out forms without submissions
      setForms(managerForms);
      setFormStats(statsPerForm);

      console.log(`✅ Set ${managerForms.length} forms for display`);
    } catch (error) {
      console.error("Error fetching forms:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFormSubmissions = async () => {
    if (!selectedForm) return;

    try {
      console.log(
        `🔍 Fetching submissions for form: ${selectedForm.title} (ID: ${selectedForm.id})`
      );

      // Get all pending approvals for the current user
      const response = await approvalsAPI.getPendingApprovals();
      console.log("📋 All pending approvals:", response.data);

      // Filter approvals for the selected form
      const formSubmissions = response.data.filter(
        (approval) => approval.submissions?.forms?.id === selectedForm.id
      );

      console.log(
        `📊 Filtered submissions for ${selectedForm.title}:`,
        formSubmissions
      );

      setSubmissions(formSubmissions);
    } catch (error) {
      console.error("Error fetching submissions:", error);
    }
  };

  const getFieldDisplayValue = (field, value, formStructure) => {
    // Skip layout elements that shouldn't be displayed
    const layoutTypes = [
      "section",
      "page-break",
      "spacer",
      "heading",
      "paragraph",
    ];
    if (layoutTypes.includes(field.type)) {
      return null;
    }

    // Find the corresponding field in form structure to get the label
    const fieldInStructure =
      formStructure?.form_config?.fields?.find((f) => f.id === field.id) ||
      formStructure?.fields?.find((f) => f.id === field.id);
    
    // If field not found in structure, try to extract type from field id
    let fieldType = fieldInStructure?.type || field.type || "text";
    
    // Check if this is a password field and hide it
    if (fieldType === "password" || field.id?.toLowerCase().includes("password")) {
      return null; // Don't display password fields
    }
    
    const fieldLabel =
      fieldInStructure?.label || field.label || formatFieldLabel(field.id);

    // Format values based on field type
    let displayValue = value;
    if (fieldType === "checkbox" && Array.isArray(value)) {
      displayValue = value.join(", ");
    } else if (fieldType === "file" && value) {
      displayValue = value.name || value;
    } else if (!value && value !== 0) {
      displayValue = "Not provided";
    }

    return { label: fieldLabel, value: displayValue };
  };

  // Helper function to format field IDs into readable labels
  const formatFieldLabel = (fieldId) => {
    if (!fieldId) return "Unknown Field";
    
    // Convert field-0, field-1, etc. to readable names
    const commonFieldMappings = {
      'field-0': 'Name',
      'field-1': 'Email',
      'field-2': 'Phone',
      'field-3': 'Message',
      'field-4': 'Subject',
      'field-5': 'Address',
      'name': 'Name',
      'email': 'Email',
      'phone': 'Phone',
      'message': 'Message',
      'subject': 'Subject',
      'address': 'Address',
      'company': 'Company',
      'position': 'Position',
      'department': 'Department'
    };
    
    // Check if we have a predefined mapping
    if (commonFieldMappings[fieldId]) {
      return commonFieldMappings[fieldId];
    }
    
    // Convert camelCase or snake_case to title case
    return fieldId
      .replace(/[-_]/g, ' ')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const handleApproval = async (approvalId, action, comments = "") => {
    try {
      setProcessingApproval(true);
      const approvalData = {
        comments,
        // manager_id is now automatically handled by backend using logged-in user
      };

      let response;
      if (action === "approve") {
        response = await approvalsAPI.approveSubmission(
          approvalId,
          approvalData
        );
      } else if (action === "reject") {
        response = await approvalsAPI.rejectSubmission(
          approvalId,
          approvalData
        );
      }

      if (response) {
        // Refresh data
        await fetchFormSubmissions();
        await fetchFormsWithStats();
        setShowApprovalModal(null);
        setApprovalComments("");
      }
    } catch (error) {
      console.error("Error processing approval:", error);
      alert("Failed to process approval. Please try again.");
    } finally {
      setProcessingApproval(false);
    }
  };

  const handleExportCSV = async (form) => {
    try {
      const response = await formsAPI.exportFormSubmissions(form.id);

      // Create blob and download link
      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // Generate filename
      const formName = form.title.replace(/[^a-zA-Z0-9]/g, "_");
      const date = new Date().toISOString().split("T")[0];
      link.download = `${formName}_submissions_${date}.csv`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting CSV:", error);
      alert("Failed to export submissions. Please try again.");
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      approved: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      rejected: { color: "bg-red-100 text-red-800", icon: XCircle },
    };

    const { color, icon: Icon } = statusConfig[status] || statusConfig.pending;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}
      >
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {selectedForm && (
                  <button
                    onClick={() => setSelectedForm(null)}
                    className="mr-4 p-2 text-gray-500 hover:text-gray-700"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                )}
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {selectedForm ? selectedForm.title : "Manager Dashboard"}
                  </h1>
                  <p className="mt-2 text-gray-600">
                    {selectedForm
                      ? "Review and approve form submissions"
                      : "Select a form to review its submissions"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {!selectedForm ? (
          /* Forms List */
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Forms Awaiting Your Review
              </h2>
              {forms.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    No forms require your approval at this time.
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {forms.map((form) => {
                const stats = formStats[form.id] || {};
                return (
                  <div
                    key={form.id}
                    className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div
                      className="p-6 cursor-pointer"
                      onClick={() => setSelectedForm(form)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {form.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                            {form.description || "No description available"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex space-x-4 text-sm">
                          <div className="flex items-center text-yellow-600">
                            <Clock className="h-4 w-4 mr-1" />
                            <span className="font-medium">
                              {stats.pending || 0}
                            </span>
                            <span className="ml-1 text-gray-500">pending</span>
                          </div>
                          <div className="flex items-center text-green-600">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            <span className="font-medium">
                              {stats.approved || 0}
                            </span>
                            <span className="ml-1 text-gray-500">approved</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">
                            {stats.total || 0} submissions
                          </div>
                          <div className="text-xs text-gray-500">
                            Category: {form.category}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Export Button */}
                    <div className="px-6 pb-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExportCSV(form);
                        }}
                        className="w-full flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export Submissions (CSV)
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Submissions List for Selected Form */
          <div>
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Submissions for {selectedForm.title}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {submissions.length} submissions requiring your review
                  </p>
                </div>
              </div>
            </div>

            {submissions.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No submissions for this form.</p>
              </div>
            ) : (
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {submissions.map((approval) => {
                    const submission = approval.submissions;
                    return (
                      <li key={approval.id} className="px-6 py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    {submission?.submitter_name || "Anonymous"}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    Submitted on{" "}
                                    {formatDate(submission?.submitted_at)}
                                  </p>
                                </div>
                                {getStatusBadge(approval.status)}
                              </div>

                              <div className="flex items-center space-x-2">
                                {approval.status === "pending" && (
                                  <>
                                    <button
                                      onClick={() =>
                                        setShowApprovalModal({
                                          ...approval,
                                          action: "approve",
                                        })
                                      }
                                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                    >
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                      Approve
                                    </button>
                                    <button
                                      onClick={() =>
                                        setShowApprovalModal({
                                          ...approval,
                                          action: "reject",
                                        })
                                      }
                                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                    >
                                      <XCircle className="h-4 w-4 mr-1" />
                                      Reject
                                    </button>
                                  </>
                                )}

                                <button
                                  onClick={() =>
                                    setShowSubmissionDetails(submission)
                                  }
                                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  View Details
                                </button>
                              </div>
                            </div>

                            {approval.comments && (
                              <div className="mt-2 text-sm text-gray-600">
                                <MessageSquare className="h-4 w-4 inline mr-1" />
                                Comments: {approval.comments}
                              </div>
                            )}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Approval Modal */}
      {showApprovalModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div
                className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${
                  showApprovalModal.action === "approve"
                    ? "bg-green-100"
                    : "bg-red-100"
                }`}
              >
                {showApprovalModal.action === "approve" ? (
                  <CheckCircle className={`h-6 w-6 text-green-600`} />
                ) : (
                  <XCircle className={`h-6 w-6 text-red-600`} />
                )}
              </div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">
                {showApprovalModal.action === "approve" ? "Approve" : "Reject"}{" "}
                Submission
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500 mb-4">
                  Are you sure you want to {showApprovalModal.action} this
                  submission from{" "}
                  {showApprovalModal.submissions?.submitter_name}?
                </p>

                <textarea
                  value={approvalComments}
                  onChange={(e) => setApprovalComments(e.target.value)}
                  className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
                  rows="3"
                  placeholder={`Add comments for your ${showApprovalModal.action} decision...`}
                />
              </div>
              <div className="flex items-center px-4 py-3 space-x-4">
                <button
                  onClick={() => {
                    setShowApprovalModal(null);
                    setApprovalComments("");
                  }}
                  className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  disabled={processingApproval}
                >
                  Cancel
                </button>
                <button
                  onClick={() =>
                    handleApproval(
                      showApprovalModal.id,
                      showApprovalModal.action,
                      approvalComments
                    )
                  }
                  className={`px-4 py-2 text-white text-base font-medium rounded-md w-full shadow-sm focus:outline-none focus:ring-2 ${
                    showApprovalModal.action === "approve"
                      ? "bg-green-600 hover:bg-green-700 focus:ring-green-300"
                      : "bg-red-600 hover:bg-red-700 focus:ring-red-300"
                  }`}
                  disabled={processingApproval}
                >
                  {processingApproval ? (
                    <span className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </span>
                  ) : (
                    `Confirm ${
                      showApprovalModal.action === "approve"
                        ? "Approval"
                        : "Rejection"
                    }`
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submission Details Modal */}
      {showSubmissionDetails && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-6 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Submission Details
              </h3>
              <button
                onClick={() => setShowSubmissionDetails(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div className="border-b pb-4">
                <p className="text-sm text-gray-600">
                  <strong>Submitted by:</strong>{" "}
                  {showSubmissionDetails.submitter_name || "Anonymous"}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Submitted on:</strong>{" "}
                  {formatDate(showSubmissionDetails.submitted_at)}
                </p>
              </div>

              <div className="space-y-3">
                {showSubmissionDetails.data &&
                  Object.entries(showSubmissionDetails.data).map(
                    ([fieldKey, value]) => {
                      // Skip empty values and system fields
                      if (!value || fieldKey.startsWith("_")) return null;
                      
                      // Skip password fields completely
                      if (fieldKey.toLowerCase().includes("password")) return null;

                      // Try to get proper field info from form structure
                      const fieldInfo = getFieldDisplayValue(
                        { id: fieldKey, type: "text" }, // fallback field object
                        value,
                        selectedForm
                      );

                      if (!fieldInfo) return null;

                      return (
                        <div
                          key={fieldKey}
                          className="border-l-4 border-blue-200 pl-4"
                        >
                          <dt className="text-sm font-medium text-gray-900">
                            {fieldInfo.label}
                          </dt>
                          <dd className="mt-1 text-sm text-gray-700">
                            {fieldInfo.value}
                          </dd>
                        </div>
                      );
                    }
                  )}

                {!showSubmissionDetails.data && (
                  <p className="text-gray-500 text-center py-4">
                    No submission data available
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowSubmissionDetails(null)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerDashboard;
