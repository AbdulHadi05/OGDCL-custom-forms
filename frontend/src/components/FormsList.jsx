import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { formsAPI } from "../services/api";
import {
  Plus,
  Search,
  Filter,
  Edit3,
  Eye,
  Trash2,
  Copy,
  Share2,
  Calendar,
  FileText,
  Users,
  MoreVertical,
} from "lucide-react";

const FormsList = () => {
  const [forms, setForms] = useState([]);
  const [filteredForms, setFilteredForms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchForms();
  }, []);

  useEffect(() => {
    filterForms();
  }, [forms, searchTerm, statusFilter]);

  const fetchForms = async () => {
    try {
      const data = await formsAPI.getAll();
      setForms(data);
    } catch (error) {
      console.error("Error fetching forms:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterForms = () => {
    let filtered = forms;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (form) =>
          form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          form.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((form) => form.status === statusFilter);
    }

    setFilteredForms(filtered);
  };

  const handleDelete = async (formId) => {
    if (deleteLoading) return; // Prevent multiple clicks

    setDeleteLoading(true);
    try {
      await formsAPI.delete(formId);
      setForms(forms.filter((form) => form.id !== formId));
      setShowDeleteModal(null);
      // Show success message
      alert(
        "Form and all associated submissions have been deleted successfully."
      );
    } catch (error) {
      console.error("Error deleting form:", error);
      alert(`Failed to delete form: ${error.message}`);
      setShowDeleteModal(null);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDuplicate = async (form) => {
    try {
      const formData = {
        ...form,
        title: `${form.title} (Copy)`,
        id: undefined,
        created_at: undefined,
        updated_at: undefined,
      };

      await formsAPI.create(formData);
      fetchForms(); // Refresh the list
    } catch (error) {
      console.error("Error duplicating form:", error);
    }
  };

  const copyShareLink = (formId) => {
    const shareUrl = `${window.location.origin}/submit/${formId}`;
    navigator.clipboard.writeText(shareUrl);
    // You could show a toast notification here
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      draft: "bg-gray-100 text-gray-800",
      published: "bg-green-100 text-green-800",
      archived: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          badges[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading forms...</p>
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
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Forms</h1>
                <p className="mt-2 text-gray-600">
                  Manage your forms and submissions
                </p>
              </div>
              <Link
                to="/admin/forms/new"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Form
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search forms..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="md:w-48">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Forms Grid */}
        {filteredForms.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {forms.length === 0
                ? "No forms created yet"
                : "No forms match your search"}
            </h3>
            <p className="text-gray-500 mb-6">
              {forms.length === 0
                ? "Get started by creating your first form."
                : "Try adjusting your search criteria or filters."}
            </p>
            {forms.length === 0 && (
              <Link
                to="/admin/forms/new"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Form
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredForms.map((form) => (
              <div
                key={form.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-3">{getStatusBadge(form.status)}</div>
                    </div>

                    <div className="relative group">
                      <button className="p-1 rounded-full hover:bg-gray-100">
                        <MoreVertical className="h-4 w-4 text-gray-400" />
                      </button>

                      {/* Dropdown Menu */}
                      <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                        <div className="py-1">
                          <Link
                            to={`/admin/forms/${form.id}/edit`}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Edit3 className="h-4 w-4 mr-2" />
                            Edit
                          </Link>
                          <Link
                            to={`/admin/forms/${form.id}/preview`}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                          </Link>
                          <button
                            onClick={() => handleDuplicate(form)}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicate
                          </button>
                          <button
                            onClick={() => copyShareLink(form.id)}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <Share2 className="h-4 w-4 mr-2" />
                            Copy Share Link
                          </button>
                          <hr className="my-1" />
                          <button
                            onClick={() => setShowDeleteModal(form.id)}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <Link to={`/admin/forms/${form.id}/edit`} className="block">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                      {form.title}
                    </h3>

                    {form.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {form.description}
                      </p>
                    )}
                  </Link>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{form.submission_count || 0} submissions</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{formatDate(form.created_at)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Link
                      to={`/admin/forms/${form.id}/edit`}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Edit3 className="h-4 w-4 mr-1" />
                      Edit
                    </Link>
                    <Link
                      to={`/admin/forms/${form.id}/preview`}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Preview
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Delete Form
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this form? This action cannot be
              undone and will also delete all associated submissions.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteModal)}
                disabled={deleteLoading}
                className={`flex-1 px-4 py-2 rounded-md text-white ${
                  deleteLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {deleteLoading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Deleting...
                  </span>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormsList;
