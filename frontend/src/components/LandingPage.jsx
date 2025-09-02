import React from "react";
import { Link } from "react-router-dom";
import { FileText, Users, BarChart3, ArrowRight } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-white rounded-xl shadow-lg flex items-center justify-center">
              <FileText className="h-10 w-10 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            OGDCL Form System
          </h1>
          <p className="text-xl text-blue-100 mb-2">
            Powered by Microsoft Azure
          </p>
          <p className="text-lg text-blue-200">
            Choose your access type to continue
          </p>
        </div>

        {/* Options */}
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Submit Form Option */}
          <Link
            to="/submit-form"
            className="bg-white rounded-2xl shadow-2xl p-8 hover:shadow-3xl transform hover:scale-105 transition-all duration-300 group"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-xl mx-auto mb-6 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Submit Form
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Access available forms to submit your information. Perfect for
                end users who need to fill out and submit forms.
              </p>
              <div className="flex items-center justify-center text-blue-600 font-semibold group-hover:text-blue-700 transition-colors">
                <span>Access Forms</span>
                <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Manager Dashboard Option */}
          <Link
            to="/manager-dashboard"
            className="bg-white rounded-2xl shadow-2xl p-8 hover:shadow-3xl transform hover:scale-105 transition-all duration-300 group"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-xl mx-auto mb-6 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <BarChart3 className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Manager Dashboard
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Review and approve form submissions. Access detailed analytics
                and manage approval workflows for your assigned forms.
              </p>
              <div className="flex items-center justify-center text-green-600 font-semibold group-hover:text-green-700 transition-colors">
                <span>Access Dashboard</span>
                <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </div>

        {/* Admin Link */}
        <div className="text-center mt-12">
          <p className="text-blue-200 mb-4">
            Looking to create and manage forms?
          </p>
          <Link
            to="/admin"
            className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all duration-200"
          >
            <FileText className="h-5 w-5 mr-2" />
            Admin Panel
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center mt-16">
          <p className="text-blue-300 text-sm">
            © 2025 OGDCL Form System - Secure form management powered by
            Microsoft Azure
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
