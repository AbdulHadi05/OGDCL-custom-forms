import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  FileText,
  Send,
  Users,
  Settings,
  BarChart3,
  User,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import UserProfile from "./UserProfile";

const Header = () => {
  const location = useLocation();
  const { user, userProfile, isAuthenticated } = useAuth();
  const [showProfile, setShowProfile] = useState(false);

  const isActive = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <Link to="/admin" className="flex items-center space-x-2">
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
              </Link>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              <Link
                to="/admin"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/admin")
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>

              <Link
                to="/admin/forms"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/admin/forms")
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <FileText className="h-4 w-4" />
                <span>Forms</span>
              </Link>
            </nav>

            {/* Actions and User Profile */}
            <div className="flex items-center space-x-3">
              <Link
                to="/admin/forms/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <FileText className="h-4 w-4 mr-2" />
                New Form
              </Link>

              {/* User Profile Button */}
              {isAuthenticated && (
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
              )}
            </div>
          </div>
        </div>
      </header>

      {/* User Profile Sidebar */}
      <UserProfile isOpen={showProfile} onClose={() => setShowProfile(false)} />
    </>
  );
};

export default Header;
