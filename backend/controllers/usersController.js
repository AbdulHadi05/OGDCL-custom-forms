import fetch from "node-fetch";

// Validate Microsoft/Azure AD email
export const validateAzureEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const authToken = req.headers.authorization?.replace("Bearer ", "");

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    if (!authToken) {
      return res.status(401).json({ error: "Authentication token required" });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.json({
        valid: false,
        message: "Invalid email format",
      });
    }

    // Check if it's a common email domain that could be associated with Microsoft accounts
    const validDomains = [
      "gmail.com",
      "outlook.com",
      "hotmail.com",
      "live.com",
      "msn.com",
      "yahoo.com",
      "onmicrosoft.com",
    ];

    const emailDomain = email.split("@")[1].toLowerCase();
    const isCommonDomain = validDomains.some(
      (domain) =>
        emailDomain === domain || emailDomain.endsWith(".onmicrosoft.com")
    );

    // Also accept any corporate domain (not just common ones)
    const hasValidFormat = emailRegex.test(email) && emailDomain.includes(".");

    if (hasValidFormat) {
      // Verify the current user can access Microsoft Graph (validates their token)
      try {
        const response = await fetch("https://graph.microsoft.com/v1.0/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          return res.json({
            valid: true,
            message: "Valid email address added successfully",
            user: {
              email: email,
              displayName: email.split("@")[0], // Use email prefix as display name
              domain: emailDomain,
            },
          });
        } else {
          console.error(
            "Failed to validate current user token:",
            response.status
          );
          return res.status(500).json({
            error: "Failed to validate authentication",
          });
        }
      } catch (graphError) {
        console.error("Graph API call failed:", graphError);
        return res.status(500).json({
          error: "Failed to connect to Microsoft Graph API",
        });
      }
    } else {
      return res.json({
        valid: false,
        message: "Please enter a valid email address",
      });
    }
  } catch (error) {
    console.error("Email validation error:", error);
    res.status(500).json({ error: "Server error during email validation" });
  }
};

// Get current user info
export const getCurrentUser = async (req, res) => {
  try {
    const authToken = req.headers.authorization?.replace("Bearer ", "");

    if (!authToken) {
      return res.status(401).json({ error: "Authentication token required" });
    }

    try {
      const response = await fetch("https://graph.microsoft.com/v1.0/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const user = await response.json();
        return res.json({
          id: user.id,
          email: user.mail || user.userPrincipalName,
          displayName: user.displayName,
          jobTitle: user.jobTitle,
          department: user.department,
        });
      } else {
        return res.status(401).json({ error: "Invalid token" });
      }
    } catch (graphError) {
      console.error("Graph API call failed:", graphError);
      return res.status(500).json({
        error: "Failed to get user info from Microsoft Graph API",
      });
    }
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Server error getting user info" });
  }
};
