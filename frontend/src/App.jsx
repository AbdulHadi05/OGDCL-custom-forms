import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "./config/authConfig";
import { AuthProvider } from "./contexts/AuthContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";

// Import all components
import Dashboard from "./components/Dashboard";
import FormBuilderPage from "./components/FormBuilderPage";
import FormPreviewPage from "./components/FormPreviewPage";
import FormSubmissionPage from "./components/FormSubmissionPage";
import FormsList from "./components/FormsList";
import LandingPage from "./components/LandingPage";
import EndUserHome from "./components/EndUserHome";
import ManagerDashboard from "./components/ManagerDashboard";
import UserProfile from "./components/UserProfile";
import { FileText, User, ChevronDown } from "lucide-react";
import { useAuth } from "./contexts/AuthContext";
import { useState } from "react";

// Create MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);

// Standalone Header Component for Submit Form and Manager Dashboard
const StandaloneHeader = () => {
  const { user, userProfile, isAuthenticated } = useAuth();
  const [showProfile, setShowProfile] = useState(false);

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold text-gray-900">
                    OGDCL Form System
                  </span>
                  <div className="text-xs text-gray-500">
                    Powered by Microsoft Azure
                  </div>
                </div>
              </div>
            </div>

            {/* User Profile Section */}
            {isAuthenticated && (
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <button
                    onClick={() => setShowProfile(true)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="hidden lg:block">
                      {userProfile?.displayName || user?.name || "User"}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* User Profile Sidebar */}
      <UserProfile isOpen={showProfile} onClose={() => setShowProfile(false)} />
    </>
  );
};

function AppRoutes() {
  const location = useLocation();

  // Check if we're on admin pages that should hide header
  const hideHeader =
    location.pathname.includes("/admin/forms/edit") ||
    location.pathname.includes("/admin/forms/new");

  return (
    <div className="min-h-screen bg-gray-50">
      <ErrorBoundary>
        <Routes>
          {/* Landing Page - No Auth Required */}
          <Route path="/" element={<LandingPage />} />

          {/* Submit Form Routes - Standalone with Auth */}
          <Route
            path="/submit-form/*"
            element={
              <ProtectedRoute>
                <StandaloneHeader />
                <main>
                  <Routes>
                    <Route path="/" element={<EndUserHome />} />
                    <Route path="/:formId" element={<FormSubmissionPage />} />
                  </Routes>
                </main>
              </ProtectedRoute>
            }
          />

          {/* Manager Dashboard Routes - Standalone with Auth */}
          <Route
            path="/manager-dashboard/*"
            element={
              <ProtectedRoute>
                <StandaloneHeader />
                <main>
                  <Routes>
                    <Route path="/" element={<ManagerDashboard />} />
                    <Route path="/:managerId" element={<ManagerDashboard />} />
                  </Routes>
                </main>
              </ProtectedRoute>
            }
          />

          {/* Admin Routes - Full Admin Panel with Auth and Header */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                {!hideHeader && <Header />}
                <main className={hideHeader ? "h-screen" : ""}>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/forms" element={<FormsList />} />
                    <Route path="/forms/new" element={<FormBuilderPage />} />
                    <Route
                      path="/forms/:id/edit"
                      element={<FormBuilderPage />}
                    />
                    <Route
                      path="/forms/:id/preview"
                      element={<FormPreviewPage />}
                    />
                  </Routes>
                </main>
              </ProtectedRoute>
            }
          />

          {/* Legacy Redirects */}
          <Route
            path="/submit"
            element={<Navigate to="/submit-form" replace />}
          />
          <Route
            path="/manager"
            element={<Navigate to="/manager-dashboard" replace />}
          />
          <Route
            path="/approvals"
            element={<Navigate to="/manager-dashboard" replace />}
          />
          <Route
            path="/user"
            element={<Navigate to="/submit-form" replace />}
          />
          <Route
            path="/manager-login"
            element={<Navigate to="/manager-dashboard" replace />}
          />
          <Route
            path="/submissions"
            element={<Navigate to="/manager-dashboard" replace />}
          />
          <Route
            path="/form/edit/:id"
            element={<Navigate to="/admin/forms/:id/edit" replace />}
          />
          <Route
            path="/forms"
            element={<Navigate to="/admin/forms" replace />}
          />

          {/* 404 fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ErrorBoundary>
    </div>
  );
}

function App() {
  return (
    <MsalProvider instance={msalInstance}>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </MsalProvider>
  );
}

export default App;
