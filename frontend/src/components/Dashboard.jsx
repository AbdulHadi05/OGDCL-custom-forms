import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PlusIcon, EyeIcon, PencilIcon, TrashIcon } from "lucide-react";
import { formsAPI, submissionsAPI } from "../services/api";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalForms: 0,
    publishedForms: 0,
    totalSubmissions: 0,
    pendingApprovals: 0,
  });

  const [recentForms, setRecentForms] = useState([]);
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch forms data
      const formsResponse = await formsAPI.getForms();
      const allForms = formsResponse.data;
      const publishedForms = allForms.filter((form) => form.is_published);

      // Fetch submissions data
      const submissionsResponse = await submissionsAPI.getSubmissions();
      const allSubmissions = submissionsResponse.data;
      const pendingSubmissions = allSubmissions.filter(
        (sub) => sub.status === "pending_approval"
      );

      // Update stats
      setStats({
        totalForms: allForms.length,
        publishedForms: publishedForms.length,
        totalSubmissions: allSubmissions.length,
        pendingApprovals: pendingSubmissions.length,
      });

      // Set recent data (last 5)
      setRecentForms(allForms.slice(0, 5));
      setRecentSubmissions(allSubmissions.slice(0, 5));
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteForm = async (formId) => {
    if (!confirm("Are you sure you want to delete this form?")) return;

    try {
      await formsAPI.deleteForm(formId);
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error("Error deleting form:", error);
      alert("Failed to delete form. It may have existing submissions.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Form Builder Dashboard
              </h1>
              <p className="mt-1 text-gray-600">
                Manage your forms and submissions
              </p>
            </div>
            <div className="flex space-x-3">
              <Link
                to="/admin/forms/new"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <PlusIcon className="w-4 h-4" />
                Create New Form
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Total Forms</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalForms}
                </p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">
                  Published Forms
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.publishedForms}
                </p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">
                  Total Submissions
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalSubmissions}
                </p>
              </div>
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">
                  Pending Approvals
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.pendingApprovals}
                </p>
              </div>
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Forms */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  Recent Forms
                </h3>
                <Link
                  to="/admin/forms"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View All
                </Link>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {recentForms.length === 0 ? (
                <div className="px-6 py-8 text-center text-gray-500">
                  <p>No forms created yet</p>
                  <Link
                    to="/admin/forms/new"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Create your first form
                  </Link>
                </div>
              ) : (
                recentForms.map((form) => (
                  <div key={form.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {form.title}
                          </p>
                          <span
                            className={`ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              form.is_published
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {form.is_published ? "Published" : "Draft"}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 truncate mt-1">
                          {form.description || "No description"}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Created{" "}
                          {new Date(form.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Link
                          to={`/admin/forms/${form.id}/preview`}
                          className="text-gray-400 hover:text-gray-600"
                          title="Preview"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/admin/forms/${form.id}/edit`}
                          className="text-blue-400 hover:text-blue-600"
                          title="Edit"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteForm(form.id)}
                          className="text-red-400 hover:text-red-600"
                          title="Delete"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Submissions */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  Recent Submissions
                </h3>
                <Link
                  to="/manager-dashboard"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View All
                </Link>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {recentSubmissions.length === 0 ? (
                <div className="px-6 py-8 text-center text-gray-500">
                  <p>No submissions yet</p>
                </div>
              ) : (
                recentSubmissions.map((submission) => (
                  <div key={submission.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {submission.forms?.title || "Unknown Form"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Submitted by: {submission.submitter_email || submission.submitter_name || "Anonymous"}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(submission.created_at).toLocaleDateString()}{" "}
                          at{" "}
                          {new Date(submission.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                            submission.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : submission.status === "rejected"
                              ? "bg-red-100 text-red-800"
                              : submission.status === "pending_approval"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {submission.status.replace("_", " ")}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/admin/forms/new"
              className="block p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <div className="flex items-center">
                <PlusIcon className="w-6 h-6 text-blue-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Create Form</p>
                  <p className="text-sm text-gray-600">
                    Build a new custom form
                  </p>
                </div>
              </div>
            </Link>

            <Link
              to="/submit-form"
              className="block p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
            >
              <div className="flex items-center">
                <svg
                  className="w-6 h-6 text-green-600 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <div>
                  <p className="font-medium text-gray-900">Submit Forms</p>
                  <p className="text-sm text-gray-600">
                    Fill out published forms
                  </p>
                </div>
              </div>
            </Link>

            <Link
              to="/manager-dashboard"
              className="block p-4 border border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
            >
              <div className="flex items-center">
                <svg
                  className="w-6 h-6 text-purple-600 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
                <div>
                  <p className="font-medium text-gray-900">Approvals</p>
                  <p className="text-sm text-gray-600">
                    Review pending submissions
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
