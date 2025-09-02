// Middleware for validating Microsoft Azure AD tokens
import fetch from "node-fetch";

// Azure AD configuration
const AZURE_TENANT_ID =
  process.env.CUSTOM_TENANT_ID || "f32c90a1-d49d-4f12-843b-20e8affe4fc3";
const AZURE_CLIENT_ID =
  process.env.CUSTOM_CLIENT_ID || "2a9e92c3-8012-4012-acdd-0b5b49d0bad5";

// Cache for validated tokens (simple in-memory cache)
const tokenCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Function to normalize Microsoft external user emails
function normalizeEmail(email) {
  if (!email) return email;

  // Handle external user format: user_domain.com#EXT#@tenant.onmicrosoft.com
  // Convert to: user@domain.com
  if (email.includes("#EXT#@")) {
    const beforeExt = email.split("#EXT#@")[0];
    if (beforeExt.includes("_")) {
      const lastUnderscore = beforeExt.lastIndexOf("_");
      const userPart = beforeExt.substring(0, lastUnderscore);
      const domainPart = beforeExt.substring(lastUnderscore + 1);
      return `${userPart}@${domainPart}`;
    }
  }

  return email;
}

// Function to validate token with Microsoft Graph
async function validateTokenWithMicrosoft(accessToken) {
  try {
    const response = await fetch("https://graph.microsoft.com/v1.0/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const userInfo = await response.json();
      const rawEmail = userInfo.mail || userInfo.userPrincipalName;
      const normalizedEmail = normalizeEmail(rawEmail);

      console.log(`🔍 Raw email: ${rawEmail}`);
      console.log(`✅ Normalized email: ${normalizedEmail}`);

      return {
        valid: true,
        user: {
          id: userInfo.id,
          name: userInfo.displayName,
          email: normalizedEmail, // Use normalized email
          rawEmail: rawEmail, // Keep original for reference
          tenantId: AZURE_TENANT_ID,
          jobTitle: userInfo.jobTitle,
          department: userInfo.department,
          officeLocation: userInfo.officeLocation,
        },
      };
    } else {
      console.error("Microsoft Graph validation failed:", response.status);
      return { valid: false };
    }
  } catch (error) {
    console.error("Error validating token with Microsoft:", error);
    return { valid: false };
  }
}

// Middleware to validate Azure AD tokens
export const validateAzureToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix

  // Check cache first
  const cached = tokenCache.get(token);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    req.user = cached.user;
    return next();
  }

  try {
    // Validate token with Microsoft Graph
    const validation = await validateTokenWithMicrosoft(token);

    if (validation.valid) {
      // Cache the result
      tokenCache.set(token, {
        user: validation.user,
        timestamp: Date.now(),
      });

      // Add user information to request
      req.user = validation.user;
      next();
    } else {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({ error: "Authentication failed" });
  }
};

// Optional middleware - allows requests without authentication (for public endpoints)
export const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // No token provided, continue without user info
    req.user = null;
    return next();
  }

  const token = authHeader.substring(7);

  // Check cache first
  const cached = tokenCache.get(token);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    req.user = cached.user;
    return next();
  }

  try {
    // Validate token with Microsoft Graph
    const validation = await validateTokenWithMicrosoft(token);

    if (validation.valid) {
      // Cache the result
      tokenCache.set(token, {
        user: validation.user,
        timestamp: Date.now(),
      });

      req.user = validation.user;
    } else {
      req.user = null;
    }

    next();
  } catch (error) {
    // Continue without user info if there's an error
    req.user = null;
    next();
  }
};

// Clean up expired cache entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [token, data] of tokenCache.entries()) {
    if (now - data.timestamp >= CACHE_DURATION) {
      tokenCache.delete(token);
    }
  }
}, CACHE_DURATION); // Clean up every 5 minutes
