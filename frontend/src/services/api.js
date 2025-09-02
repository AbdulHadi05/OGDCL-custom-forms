import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Store reference to auth context getter (will be set by AuthProvider)
let getAuthToken = null;

// Function to set the auth token getter
export const setAuthTokenGetter = (getter) => {
  getAuthToken = getter;
};

// Request interceptor for adding auth headers if needed
api.interceptors.request.use(
  async (config) => {
    // Try to get fresh token from auth context first
    if (getAuthToken) {
      try {
        const token = await getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          return config;
        }
      } catch (error) {
        console.error("Error getting fresh token:", error);
      }
    }

    // Fallback to stored token
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - clear token and let ProtectedRoute handle redirect
      localStorage.removeItem("authToken");
      localStorage.removeItem("userProfile");
      console.warn("Authentication expired, please login again");
    }

    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Forms API
export const formsAPI = {
  // Get all forms
  getAll: () => api.get("/forms").then((res) => res.data),
  getForms: (params = {}) => api.get("/forms", { params }),

  // Get single form
  getById: (id) => api.get(`/forms/${id}`).then((res) => res.data),
  getForm: (id) => api.get(`/forms/${id}`),

  // Get published forms
  getPublishedForms: (params = {}) => api.get("/forms/published", { params }),

  // Get manager forms (forms where current user is a manager)
  getManagerForms: () => api.get("/forms/manager").then((res) => res.data),

  // Get forms requiring approval for current user
  getFormsRequiringApproval: () =>
    api.get("/forms/requiring-approval").then((res) => res.data),

  // Export form submissions as CSV
  exportFormSubmissions: (formId) =>
    api.get(`/forms/${formId}/export`, { responseType: "blob" }),

  // Create form
  create: (formData) => api.post("/forms", formData).then((res) => res.data),
  createForm: (formData) => api.post("/forms", formData),

  // Update form
  update: (id, formData) =>
    api.put(`/forms/${id}`, formData).then((res) => res.data),
  updateForm: (id, formData) => api.put(`/forms/${id}`, formData),

  // Delete form
  delete: (id) => api.delete(`/forms/${id}`).then((res) => res.data),
  deleteForm: (id) => api.delete(`/forms/${id}`),

  // Publish form
  publishForm: (id) => api.patch(`/forms/${id}/publish`),

  // Unpublish form
  unpublishForm: (id) => api.patch(`/forms/${id}/unpublish`),

  // Get templates
  getTemplates: (params = {}) => api.get("/forms/templates", { params }),

  // Create form from template
  createFromTemplate: (templateId, formData) =>
    api.post(`/forms/from-template/${templateId}`, formData),
};

// Submissions API
export const submissionsAPI = {
  // Get all submissions
  getAll: () => api.get("/submissions").then((res) => res.data),
  getSubmissions: (params = {}) => api.get("/submissions", { params }),

  // Get submissions for a form
  getFormSubmissions: (formId, params = {}) =>
    api.get(`/submissions/form/${formId}`, { params }),

  // Get single submission
  getById: (id) => api.get(`/submissions/${id}`).then((res) => res.data),
  getSubmission: (id) => api.get(`/submissions/${id}`),

  // Create submission
  create: (submissionData) =>
    api.post("/submissions", submissionData).then((res) => res.data),
  createSubmission: (submissionData) =>
    api.post("/submissions", submissionData),

  // Update submission
  update: (id, submissionData) =>
    api.put(`/submissions/${id}`, submissionData).then((res) => res.data),
  updateSubmission: (id, submissionData) =>
    api.put(`/submissions/${id}`, submissionData),

  // Delete submission
  delete: (id) => api.delete(`/submissions/${id}`).then((res) => res.data),
  deleteSubmission: (id) => api.delete(`/submissions/${id}`),
};

// Approvals API
export const approvalsAPI = {
  // Get all approvals
  getApprovals: (params = {}) => api.get("/approvals", { params }),

  // Get pending approvals
  getPendingApprovals: (params = {}) =>
    api.get("/approvals/pending", { params }),

  // Get manager approvals
  getManagerApprovals: (managerId, params = {}) =>
    api.get(`/approvals/manager/${managerId}`, { params }),

  // Get single approval
  getApproval: (id) => api.get(`/approvals/${id}`),

  // Approve submission
  approveSubmission: (submissionId, approvalData) =>
    api.post(`/approvals/${submissionId}/approve`, approvalData),

  // Reject submission
  rejectSubmission: (submissionId, approvalData) =>
    api.post(`/approvals/${submissionId}/reject`, approvalData),
};

// Users API
export const usersAPI = {
  // Validate Microsoft email
  validateEmail: (email) =>
    api.post("/users/validate-email", { email }).then((res) => res.data),

  // Get current user info
  getCurrentUser: () => api.get("/users/me").then((res) => res.data),
};

// Health check
export const healthCheck = () => api.get("/health");

export default api;
