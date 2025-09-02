import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  User,
  Mail,
  Building2,
  MapPin,
  Phone,
  Calendar,
  ChevronDown,
  ChevronUp,
  LogOut,
  X,
} from "lucide-react";

const UserProfile = ({ isOpen, onClose }) => {
  const { user, userProfile, logout, isAuthenticated } = useAuth();
  const [showFullProfile, setShowFullProfile] = useState(false);

  if (!isOpen || !isAuthenticated) return null;

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-end">
      <div className="bg-white shadow-2xl w-96 h-full overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Profile</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-6">
          {/* User Avatar and Basic Info */}
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-10 w-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              {userProfile?.displayName || user?.name || "User"}
            </h3>
            <p className="text-gray-600">
              {userProfile?.mail || user?.username}
            </p>
          </div>

          {/* Basic Info Cards */}
          <div className="space-y-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Email</p>
                  <p className="text-sm text-gray-600">
                    {userProfile?.mail ||
                      userProfile?.userPrincipalName ||
                      "Not available"}
                  </p>
                </div>
              </div>
            </div>

            {userProfile?.jobTitle && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center">
                  <Building2 className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Job Title
                    </p>
                    <p className="text-sm text-gray-600">
                      {userProfile.jobTitle}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {userProfile?.department && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center">
                  <Building2 className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Department
                    </p>
                    <p className="text-sm text-gray-600">
                      {userProfile.department}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Show More Details Toggle */}
          <button
            onClick={() => setShowFullProfile(!showFullProfile)}
            className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors mb-4"
          >
            {showFullProfile ? (
              <>
                <ChevronUp className="h-4 w-4 mr-2" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-2" />
                Show More Details
              </>
            )}
          </button>

          {/* Extended Profile Info */}
          {showFullProfile && userProfile && (
            <div className="space-y-4 mb-6">
              {userProfile.officeLocation && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-blue-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Office Location
                      </p>
                      <p className="text-sm text-gray-600">
                        {userProfile.officeLocation}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {userProfile.businessPhones &&
                userProfile.businessPhones.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-blue-600 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Business Phone
                        </p>
                        <p className="text-sm text-gray-600">
                          {userProfile.businessPhones[0]}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">User ID</p>
                    <p className="text-xs text-gray-600 font-mono">
                      {userProfile.id}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Tenant ID
                    </p>
                    <p className="text-xs text-gray-600 font-mono">
                      {user?.tenantId || "ff6badc4-a1a9-458e-95e8-9088884c7ec9"}
                    </p>
                  </div>
                </div>
              </div>

              {userProfile.preferredLanguage && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <Building2 className="h-5 w-5 text-blue-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Preferred Language
                      </p>
                      <p className="text-sm text-gray-600">
                        {userProfile.preferredLanguage}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center py-3 px-4 border border-red-300 rounded-lg text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 transition-colors"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
