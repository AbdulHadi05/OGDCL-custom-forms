import React from "react";
import { Link } from "react-router-dom";
import { 
  FileText, 
  Users, 
  BarChart3, 
  ArrowRight, 
  Shield, 
  UserCheck,
  Building2,
  Zap,
  Clock,
  Globe
} from "lucide-react";

const HomePage = () => {
  const features = [
    {
      icon: FileText,
      title: "Dynamic Form Builder",
      description: "Create complex forms with drag-and-drop interface, custom fields, and real-time preview.",
      color: "text-blue-500"
    },
    {
      icon: Users,
      title: "Multi-Role Access",
      description: "Separate portals for admins, managers, and end users with role-based permissions.",
      color: "text-green-500"
    },
    {
      icon: UserCheck,
      title: "Approval Workflows",
      description: "Built-in approval system with notifications, comments, and audit trails.",
      color: "text-purple-500"
    },
    {
      icon: BarChart3,
      title: "Analytics & Reports",
      description: "Comprehensive reporting with submission statistics and performance metrics.",
      color: "text-orange-500"
    },
    {
      icon: Shield,
      title: "Azure AD Integration",
      description: "Secure authentication with Microsoft Azure Active Directory.",
      color: "text-red-500"
    },
    {
      icon: Zap,
      title: "Real-time Updates",
      description: "Live updates and notifications for form submissions and approvals.",
      color: "text-yellow-500"
    }
  ];

  const stats = [
    { label: "Forms Created", value: "1,000+", icon: FileText },
    { label: "Active Users", value: "500+", icon: Users },
    { label: "Submissions", value: "10,000+", icon: BarChart3 },
    { label: "Uptime", value: "99.9%", icon: Clock }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Building2 className="h-20 w-20 text-white" />
          </div>
          <h1 className="text-6xl font-bold text-white mb-6">
            OGDCL Form Generator
          </h1>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto mb-8">
            Powerful, flexible, and secure form management platform designed for modern organizations. 
            Build, manage, and approve forms with enterprise-grade features.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/manager"
              className="bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200 flex items-center justify-center"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/submit"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition-colors duration-200 flex items-center justify-center"
            >
              Submit a Form
              <FileText className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="text-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                  <IconComponent className="h-8 w-8 text-white mx-auto mb-3" />
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-blue-200 text-sm">{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Features Section */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-white text-center mb-4">
            Powerful Features
          </h2>
          <p className="text-blue-200 text-center mb-12 max-w-2xl mx-auto">
            Everything you need to create, manage, and process forms efficiently
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                  <IconComponent className={`h-12 w-12 ${feature.color} mb-4`} />
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-blue-200 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-12 border border-white/20">
          <Globe className="h-16 w-16 text-white mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-blue-200 mb-8 max-w-2xl mx-auto">
            Join thousands of organizations already using OGDCL Form Generator to streamline their form processes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/manager"
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center"
            >
              <Shield className="mr-2 h-5 w-5" />
              Manager Portal
            </Link>
            <Link
              to="/admin"
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center"
            >
              <Users className="mr-2 h-5 w-5" />
              Admin Portal
            </Link>
            <Link
              to="/submit"
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center"
            >
              <FileText className="mr-2 h-5 w-5" />
              Submit Forms
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-white/20">
          <p className="text-blue-200">
            © 2025 OGDCL Form Generator. Built with security and performance in mind.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
