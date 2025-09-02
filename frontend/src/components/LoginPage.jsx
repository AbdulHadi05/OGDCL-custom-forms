import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useLocation } from "react-router-dom";
import {
  LogIn,
  Shield,
  Users,
  FileText,
  CheckCircle,
  BarChart3,
  Settings,
} from "lucide-react";

const LoginPage = () => {
  const { login } = useAuth();
  const location = useLocation();

  const handleLogin = () => {
    login();
  };

  // Determine context based on the intended route
  const getContextInfo = () => {
    const path = location.pathname;

    if (path.startsWith("/submit-form")) {
      return {
        title: "Submit Forms",
        subtitle: "Sign in to access and fill out available forms",
        features: [
          "Access published forms",
          "Submit form data securely",
          "Track your submissions",
          "Save drafts and continue later",
        ],
        icon: Users,
        color: "blue",
      };
    } else if (path.startsWith("/manager-dashboard")) {
      return {
        title: "Manager Dashboard",
        subtitle: "Sign in to review and approve form submissions",
        features: [
          "Review form submissions",
          "Approve or reject submissions",
          "View submission analytics",
          "Manage approval workflows",
        ],
        icon: BarChart3,
        color: "green",
      };
    } else {
      return {
        title: "Admin Panel",
        subtitle: "Sign in to access the full form management system",
        features: [
          "Create and manage custom forms",
          "Set up approval workflows",
          "Access detailed analytics and reports",
          "Manage user permissions",
        ],
        icon: Settings,
        color: "purple",
      };
    }
  };

  const contextInfo = getContextInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <div className="bg-white rounded-full p-3 shadow-lg">
              <contextInfo.icon className="h-12 w-12 text-blue-600" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-white">
            {contextInfo.title}
          </h2>
          <p className="mt-2 text-sm text-blue-100">{contextInfo.subtitle}</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-xl shadow-2xl p-8">
          <div className="space-y-6">
            <button
              onClick={handleLogin}
              className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <LogIn className="h-5 w-5 mr-2" />
              Sign in with Microsoft
            </button>

            {/* Features List */}
            <div className="border-t pt-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                What you can do:
              </h3>
              <ul className="text-sm text-gray-600 space-y-2">
                {contextInfo.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Security Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex">
                <Shield className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-blue-900">
                    Secure Authentication
                  </h4>
                  <p className="text-xs text-blue-700 mt-1">
                    This application uses Microsoft Azure Active Directory for
                    secure authentication. Your credentials are never stored by
                    our application.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-blue-200">
            OGDCL Form System - Powered by Microsoft Azure
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
