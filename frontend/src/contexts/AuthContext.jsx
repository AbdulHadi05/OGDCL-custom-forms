// Authentication context and hooks for Azure AD integration
import React, { createContext, useContext, useState, useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest, graphConfig } from "../config/authConfig";
import { setAuthTokenGetter } from "../services/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const { instance, accounts, inProgress } = useMsal();
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated
  const isAuthenticated = accounts.length > 0;

  // Function to get fresh access token
  const getAccessToken = async () => {
    try {
      const account = accounts[0];
      if (!account) return null;

      const response = await instance.acquireTokenSilent({
        ...loginRequest,
        account: account,
      });

      // Update stored token
      localStorage.setItem("authToken", response.accessToken);
      return response.accessToken;
    } catch (error) {
      console.error("Error getting access token:", error);
      // Try to get token from storage as fallback
      return localStorage.getItem("authToken");
    }
  };

  // Register the token getter with API service
  useEffect(() => {
    setAuthTokenGetter(getAccessToken);
  }, [accounts]);

  useEffect(() => {
    console.log("AuthContext - useEffect triggered");
    console.log("isAuthenticated:", isAuthenticated);
    console.log("accounts:", accounts);
    console.log("accounts[0]:", accounts[0]);
    
    if (isAuthenticated && accounts[0]) {
      setUser(accounts[0]);
      fetchUserProfile();
    } else {
      setUser(null);
      setUserProfile(null);
    }
    setLoading(false);
  }, [accounts, isAuthenticated]);

  const fetchUserProfile = async () => {
    try {
      const account = accounts[0];
      if (!account) return;

      // Get access token for Microsoft Graph
      const response = await instance.acquireTokenSilent({
        ...loginRequest,
        account: account,
      });

      // Fetch user profile from Microsoft Graph
      const graphResponse = await fetch(graphConfig.graphMeEndpoint, {
        headers: {
          Authorization: `Bearer ${response.accessToken}`,
        },
      });

      if (graphResponse.ok) {
        const profileData = await graphResponse.json();
        setUserProfile(profileData);

        // Store token in localStorage for API calls
        localStorage.setItem("authToken", response.accessToken);
        localStorage.setItem("userProfile", JSON.stringify(profileData));
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const login = async () => {
    try {
      await instance.loginRedirect(loginRequest);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userProfile");
    instance.logoutRedirect();
  };

  const value = {
    user,
    userProfile,
    isAuthenticated,
    loading,
    login,
    logout,
    getAccessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
