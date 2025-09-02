import React from "react";
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthProvider from "../../contexts/AuthContext";
import ProtectedRoute from "../ProtectedRoute";
import Header from "../Header";
import Dashboard from "../Dashboard";
import FormsList from "../FormsList";
import FormBuilderPage from "../FormBuilderPage";
import FormPreviewPage from "../FormPreviewPage";
import UserProfile from "../UserProfile";
import SubmissionsList from "../SubmissionsList";
import ErrorBoundary from "../ErrorBoundary";

// MSAL configuration for Admin Portal
const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID || "your-client-id",
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_AZURE_TENANT_ID}`,
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
};

const msalInstance = new PublicClientApplication(msalConfig);

const AdminPortal = () => {
  return (
    <MsalProvider instance={msalInstance}>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <ErrorBoundary>
            <ProtectedRoute>
              <Header />
              <main>
                <Routes>
                  {/* Admin Dashboard */}
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/admin" element={<Dashboard />} />
                  
                  {/* Form Management */}
                  <Route path="/forms" element={<FormsList />} />
                  <Route path="/forms/new" element={<FormBuilderPage />} />
                  <Route path="/forms/:id/edit" element={<FormBuilderPage />} />
                  <Route path="/forms/:id/preview" element={<FormPreviewPage />} />
                  
                  {/* Submissions Management */}
                  <Route path="/submissions" element={<SubmissionsList />} />
                  
                  {/* User Management */}
                  <Route path="/profile" element={<UserProfile />} />
                  
                  {/* Redirect any unmatched routes to admin dashboard */}
                  <Route path="*" element={<Navigate to="/admin" replace />} />
                </Routes>
              </main>
            </ProtectedRoute>
          </ErrorBoundary>
        </div>
      </AuthProvider>
    </MsalProvider>
  );
};

export default AdminPortal;
