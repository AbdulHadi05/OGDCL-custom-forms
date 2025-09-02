import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { formsAPI, submissionsAPI } from "../services/api";
import {
  Search,
  Filter,
  Eye,
  Download,
  Calendar,
  User,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  MoreVertical,
} from "lucide-react";

const SubmissionsList = () => {
  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [formFilter, setFormFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [forms, setForms] = useState([]);

  useEffect(() => {
    fetchSubmissions();
    fetchForms();
  }, []);

  useEffect(() => {
    filterSubmissions();
  }, [submissions, searchTerm, statusFilter, formFilter]);

  const fetchSubmissions = async () => {
    try {
      const data = await submissionsAPI.getAll();
      setSubmissions(data);
    } catch (error) {
      console.error("Error fetching submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchForms = async () => {
    try {
      const data = await formsAPI.getAll();
      setForms(data);
    } catch (error) {
      console.error("Error fetching forms:", error);
    }
  };

  const filterSubmissions = () => {
    let filtered = submissions;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (submission) =>
          submission.form_title
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          submission.submitter_name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (submission) => submission.status === statusFilter
      );
    }

    // Form filter
    if (formFilter !== "all") {
      filtered = filtered.filter(
        (submission) => submission.form_id === formFilter
      );
    }

    setFilteredSubmissions(filtered);
  };

  const handleExport = () => {
    // In a real implementation, this would generate and download a CSV/Excel file
    console.log("Exporting submissions...");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      approved: "bg-green-100 text-green-800 border-green-200",
      rejected: "bg-red-100 text-red-800 border-red-200",
      submitted: "bg-blue-100 text-blue-800 border-blue-200",
    };

    const icons = {
      pending: Clock,
      approved: CheckCircle,
      rejected: XCircle,
      submitted: FileText,
    };

    const Icon = icons[status] || AlertCircle;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
          badges[status] || "bg-gray-100 text-gray-800 border-gray-200"
        }`}
      >
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading submissions...</p>
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
                <h1 className="text-3xl font-bold text-gray-900">
                  Submissions
                </h1>
                <p className="mt-2 text-gray-600">
                  View and manage form submissions
                </p>
              </div>
              <button
                onClick={handleExport}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by form name or submitter..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              {/* Status Filter */}
              <div className="md:w-40">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <select
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="submitted">Submitted</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {/* Form Filter */}
              <div className="md:w-48">
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  value={formFilter}
                  onChange={(e) => setFormFilter(e.target.value)}
                >
                  <option value="all">All Forms</option>
                  {forms.map((form) => (
                    <option key={form.id} value={form.id}>
                      {form.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Submissions Table */}
        {filteredSubmissions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {submissions.length === 0
                ? "No submissions yet"
                : "No submissions match your filters"}
            </h3>
            <p className="text-gray-500">
              {submissions.length === 0
                ? "Submissions will appear here once users start filling out your forms."
                : "Try adjusting your search criteria or filters."}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Form & Submitter
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Updated
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSubmissions.map((submission) => (
                    <tr key={submission.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 flex items-center justify-center bg-blue-100 rounded-lg">
                              <FileText className="h-5 w-5 text-blue-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {submission.form_title || "Untitled Form"}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <User className="h-3 w-3 mr-1" />
                              {submission.submitter_name || "Anonymous"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(submission.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(submission.submitted_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {submission.updated_at
                          ? formatDate(submission.updated_at)
                          : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            to={`/submissions/${submission.id}`}
                            className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Link>

                          {/* More actions dropdown */}
                          <div className="relative group">
                            <button className="p-1 rounded-full hover:bg-gray-100">
                              <MoreVertical className="h-4 w-4 text-gray-400" />
                            </button>

                            <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                              <div className="py-1">
                                <Link
                                  to={`/submissions/${submission.id}`}
                                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </Link>
                                <button
                                  onClick={() =>
                                    console.log(
                                      "Export submission:",
                                      submission.id
                                    )
                                  }
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  <Download className="h-4 w-4 mr-2" />
                                  Export
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination would go here */}
        {filteredSubmissions.length > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {filteredSubmissions.length} of {submissions.length}{" "}
              submissions
            </div>
            {/* Pagination controls would be implemented here */}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmissionsList;
