import React from "react";
import { useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";

const ManagerLogin = () => {
  const navigate = useNavigate();

  const handleAccessDashboard = () => {
    // Direct access to manager dashboard without authentication
    navigate("/manager-dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <div className="bg-white rounded-full p-3 shadow-lg">
              <Shield className="h-12 w-12 text-blue-600" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-white">Manager Portal</h2>
          <p className="mt-2 text-sm text-blue-100">
            Access the form approval dashboard
          </p>
        </div>

        {/* Access Card */}
        <div className="bg-white rounded-xl shadow-2xl p-8">
          <div className="space-y-6">
            <button
              onClick={handleAccessDashboard}
              className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Access Manager Dashboard
            </button>

            {/* Features List */}
            <div className="border-t pt-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Manager Dashboard Features:
              </h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-center">
                  <div className="h-1.5 w-1.5 bg-blue-600 rounded-full mr-2"></div>
                  Review and approve form submissions
                </li>
                <li className="flex items-center">
                  <div className="h-1.5 w-1.5 bg-blue-600 rounded-full mr-2"></div>
                  View detailed submission data with field labels
                </li>
                <li className="flex items-center">
                  <div className="h-1.5 w-1.5 bg-blue-600 rounded-full mr-2"></div>
                  Add approval comments and feedback
                </li>
                <li className="flex items-center">
                  <div className="h-1.5 w-1.5 bg-blue-600 rounded-full mr-2"></div>
                  Track approval statistics and metrics
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerLogin;
