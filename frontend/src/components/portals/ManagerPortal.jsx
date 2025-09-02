import React from "react";
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthProvider from "../../contexts/AuthContext";
import ProtectedRoute from "../ProtectedRoute";
import Header from "../Header";
import ManagerDashboard from "../ManagerDashboard";
import SubmissionsList from "../SubmissionsList";
import UserProfile from "../UserProfile";
import FormPreviewPage from "../FormPreviewPage";
import ErrorBoundary from "../ErrorBoundary";

// MSAL configuration for Manager Portal
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

const ManagerPortal = () => {
  return (
    <MsalProvider instance={msalInstance}>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <ErrorBoundary>
            <ProtectedRoute>
              <Header />
              <main>
                <Routes>
                  {/* Manager Dashboard */}
                  <Route path="/" element={<ManagerDashboard />} />
                  <Route path="/manager" element={<ManagerDashboard />} />
                  <Route path="/manager/:managerId" element={<ManagerDashboard />} />
                  
                  {/* Approvals and Submissions */}
                  <Route path="/approvals" element={<ManagerDashboard />} />
                  <Route path="/submissions" element={<SubmissionsList />} />
                  
                  {/* Form Preview for approvals */}
                  <Route path="/forms/:id/preview" element={<FormPreviewPage />} />
                  
                  {/* Profile Management */}
                  <Route path="/profile" element={<UserProfile />} />
                  
                  {/* Redirect any unmatched routes to manager dashboard */}
                  <Route path="*" element={<Navigate to="/manager" replace />} />
                </Routes>
              </main>
            </ProtectedRoute>
          </ErrorBoundary>
        </div>
      </AuthProvider>
    </MsalProvider>
  );
};

export default ManagerPortal;
