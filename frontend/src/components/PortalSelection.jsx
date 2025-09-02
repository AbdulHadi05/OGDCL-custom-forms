import React from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Users, UserCheck, Building2 } from "lucide-react";

const PortalSelection = () => {
  const navigate = useNavigate();

  const portals = [
    {
      id: "admin",
      title: "Admin Portal",
      description: "Full system administration and form management",
      icon: Shield,
      color: "bg-red-500",
      hoverColor: "hover:bg-red-600",
      path: "/admin",
      features: ["Manage all forms", "User administration", "System settings", "Analytics & reports"]
    },
    {
      id: "manager",
      title: "Manager Portal",
      description: "Approve submissions and manage workflows",
      icon: UserCheck,
      color: "bg-blue-500",
      hoverColor: "hover:bg-blue-600",
      path: "/manager",
      features: ["Approve submissions", "Review workflows", "Team management", "Reports"]
    },
    {
      id: "enduser",
      title: "End User Portal",
      description: "Submit forms and track your submissions",
      icon: Users,
      color: "bg-green-500",
      hoverColor: "hover:bg-green-600",
      path: "/submit",
      features: ["Submit forms", "Track submissions", "View history", "Profile management"]
    }
  ];

  const handlePortalSelect = (portal) => {
    navigate(portal.path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Building2 className="h-16 w-16 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            OGDCL Form Generator
          </h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            Choose your portal to access the appropriate features and functionality
          </p>
        </div>

        {/* Portal Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {portals.map((portal) => {
            const IconComponent = portal.icon;
            return (
              <div
                key={portal.id}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer transform hover:scale-105"
                onClick={() => handlePortalSelect(portal)}
              >
                <div className="text-center mb-6">
                  <div className={`inline-flex p-4 rounded-full ${portal.color} mb-4`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {portal.title}
                  </h2>
                  <p className="text-blue-200">
                    {portal.description}
                  </p>
                </div>

                <div className="space-y-2 mb-6">
                  {portal.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-blue-100">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  className={`w-full py-3 px-6 rounded-lg ${portal.color} ${portal.hoverColor} text-white font-semibold transition-colors duration-200`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePortalSelect(portal);
                  }}
                >
                  Enter {portal.title}
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center mt-16">
          <p className="text-blue-200">
            Need help? Contact your system administrator
          </p>
        </div>
      </div>
    </div>
  );
};

export default PortalSelection;
