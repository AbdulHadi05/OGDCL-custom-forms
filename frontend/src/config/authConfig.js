// Azure AD authentication configuration for MSAL
import { LogLevel } from "@azure/msal-browser";

// Configuration object to be passed to MSAL instance on creation
export const msalConfig = {
  auth: {
    clientId: "2a9e92c3-8012-4012-acdd-0b5b49d0bad5", // Your app registration client ID
    authority:
      "https://login.microsoftonline.com/f32c90a1-d49d-4f12-843b-20e8affe4fc3", // Allow any Microsoft account
    redirectUri: "http://localhost:3000", // Your redirect URI
  },
  cache: {
    cacheLocation: "sessionStorage", // This configures where your cache will be stored
    storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          case LogLevel.Info:
            console.info(message);
            return;
          case LogLevel.Verbose:
            console.debug(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
          default:
            return;
        }
      },
    },
  },
};

// Add scopes here for ID token to be used at Microsoft Graph API endpoints.
export const loginRequest = {
  scopes: ["User.Read", "openid", "profile", "email"],
};

// Add the endpoints here for Microsoft Graph API services you'd like to use.
export const graphConfig = {
  graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
};
