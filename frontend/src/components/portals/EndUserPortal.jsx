import React from "react";
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthProvider from "../../contexts/AuthContext";
import ProtectedRoute from "../ProtectedRoute";
import Header from "../Header";
import EndUserHome from "../EndUserHome";
import FormSubmissionPage from "../FormSubmissionPage";
import UserProfile from "../UserProfile";
import FormPreviewPage from "../FormPreviewPage";
import SubmissionsList from "../SubmissionsList";
import ErrorBoundary from "../ErrorBoundary";

// MSAL configuration for End User Portal
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

const EndUserPortal = () => {
  return (
    <MsalProvider instance={msalInstance}>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <ErrorBoundary>
            <ProtectedRoute>
              <Header />
              <main>
                <Routes>
                  {/* End User Home */}
                  <Route path="/" element={<EndUserHome />} />
                  <Route path="/submit" element={<EndUserHome />} />
                  
                  {/* Form Submission */}
                  <Route path="/submit/:formId" element={<FormSubmissionPage />} />
                  
                  {/* Form Preview */}
                  <Route path="/forms/:id/preview" element={<FormPreviewPage />} />
                  
                  {/* User's Submissions */}
                  <Route path="/my-submissions" element={<SubmissionsList />} />
                  
                  {/* Profile Management */}
                  <Route path="/profile" element={<UserProfile />} />
                  
                  {/* Redirect any unmatched routes to end user home */}
                  <Route path="*" element={<Navigate to="/submit" replace />} />
                </Routes>
              </main>
            </ProtectedRoute>
          </ErrorBoundary>
        </div>
      </AuthProvider>
    </MsalProvider>
  );
};

export default EndUserPortal;
