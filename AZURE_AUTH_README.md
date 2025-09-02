# OGDCL Form System - Azure Authentication Setup

## 🔐 Authentication Overview

This application now uses **Microsoft Azure Active Directory (Entra ID)** for secure authentication. Users must sign in with their Microsoft accounts to access the form builder system.

## 🚀 Quick Start with Authentication

### Prerequisites

- Node.js (v16 or higher)
- Supabase account and project
- Microsoft Azure account with app registration
- Git

### 1. Azure App Registration

The application is already configured with the following Azure credentials:

- **Application (client) ID**: `b9a88302-8326-435f-8879-2dd8f4e9021b`
- **Directory (tenant) ID**: `ff6badc4-a1a9-458e-95e8-9088884c7ec9`
- **Display Name**: OGDCL Form System

### 2. Backend Setup

**Install Dependencies:**

```bash
cd backend
npm install
```

**Environment Configuration:**
The `.env` file is already configured with:

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Database Configuration
DATABASE_URL=postgresql://[your_supabase_connection_string]
SUPABASE_ANON_KEY=[your_supabase_anon_key]

# Azure AD Configuration
AZURE_CLIENT_ID=b9a88302-8326-435f-8879-2dd8f4e9021b
AZURE_TENANT_ID=ff6badc4-a1a9-458e-95e8-9088884c7ec9

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

**Database Setup:**

```bash
# Initialize database only
npm run setup-db

# Or initialize with sample data
npm run setup-db-with-samples
```

**Start Backend Server:**

```bash
npm run dev
```

### 3. Frontend Setup

**Install Dependencies:**

```bash
cd ../frontend
npm install
```

**Environment Configuration:**
The `.env` file includes:

```env
VITE_API_URL=http://localhost:5000/api
VITE_AZURE_CLIENT_ID=b9a88302-8326-435f-8879-2dd8f4e9021b
VITE_AZURE_TENANT_ID=ff6badc4-a1a9-458e-95e8-9088884c7ec9
VITE_AZURE_REDIRECT_URI=http://localhost:3000
```

**Start Frontend:**

```bash
npm run dev
```

### 4. Access the Application

1. Open your browser and navigate to `http://localhost:3000`
2. You'll be redirected to the Microsoft login page
3. Sign in with your Microsoft account
4. After successful authentication, you'll be redirected back to the application

## 🔑 Authentication Features

### User Authentication

- **Microsoft Azure AD Integration**: Secure authentication using Microsoft's enterprise-grade security
- **Automatic Token Management**: Access tokens are automatically handled and refreshed
- **Role-based Access**: Future-ready for role-based permissions

### User Profile

- **Comprehensive Profile Display**: Shows user information from Microsoft Graph API
- **Profile Sidebar**: Click on your profile in the header to view detailed information
- **Secure Logout**: Properly clears tokens and redirects to Microsoft logout

### API Security

- **Token Validation**: All API endpoints validate Azure AD tokens
- **User Context**: API calls include authenticated user information
- **Automatic Cleanup**: Expired tokens are automatically handled

## 🛡️ Security Features

### Frontend Security

- **Protected Routes**: All pages require authentication
- **Token Storage**: Secure token storage in session storage
- **Automatic Redirects**: Unauthenticated users are redirected to login
- **Token Refresh**: Automatic token renewal without user intervention

### Backend Security

- **JWT Validation**: All protected endpoints validate Azure AD tokens
- **JWKS Integration**: Uses Microsoft's public keys for token verification
- **User Context**: API operations include authenticated user information
- **Rate Limiting**: Built-in rate limiting for API security

## 📱 User Interface Updates

### Header Navigation

- **User Profile Button**: Shows authenticated user's name and avatar
- **Profile Sidebar**: Comprehensive user information panel
- **Azure Branding**: Updated branding to show "Powered by Microsoft Azure"

### Authentication Pages

- **Professional Login Page**: Modern, branded login interface
- **Loading States**: Smooth loading indicators during authentication
- **Error Handling**: User-friendly error messages

## 🔧 Technical Implementation

### Frontend Technologies

- **@azure/msal-react**: Microsoft Authentication Library for React
- **@azure/msal-browser**: Browser-specific MSAL implementation
- **React Context**: Centralized authentication state management

### Backend Technologies

- **jsonwebtoken**: JWT token validation
- **jwks-client**: Microsoft public key retrieval
- **Express Middleware**: Custom authentication middleware

### Database Integration

- **User Tracking**: Forms and submissions track authenticated users
- **Audit Trail**: Complete audit trail of user actions
- **Data Security**: User data is properly associated and secured

## 🚀 Deployment Notes

### Production Configuration

- Update redirect URIs in Azure app registration for production URLs
- Configure production environment variables
- Enable proper HTTPS for all endpoints
- Set up proper CORS policies

### Azure App Registration Requirements

- **Redirect URIs**: Must include your production and development URLs
- **API Permissions**: Microsoft Graph permissions for user profile access
- **Token Configuration**: Proper token lifetimes and refresh settings

## 📊 Monitoring and Analytics

### Authentication Metrics

- User login/logout tracking
- Token refresh statistics
- Authentication failure monitoring
- User activity analytics

### Security Monitoring

- Failed authentication attempts
- Token validation errors
- Suspicious activity detection
- Access pattern analysis

## 🆘 Troubleshooting

### Common Issues

1. **Authentication Popup Blocked**

   - Ensure popup blockers are disabled
   - Try using redirect instead of popup authentication

2. **Token Validation Errors**

   - Verify Azure app registration configuration
   - Check tenant ID and client ID values
   - Ensure proper redirect URIs are configured

3. **CORS Issues**

   - Verify FRONTEND_URL in backend .env
   - Check CORS configuration in server.js
   - Ensure redirect URIs match exactly

4. **Profile Information Missing**
   - Verify Microsoft Graph API permissions
   - Check admin consent for the application
   - Ensure proper scopes are requested

## 🔄 Future Enhancements

- **Role-based Access Control**: Implement user roles and permissions
- **Single Sign-On**: Integrate with other Microsoft services
- **Multi-tenant Support**: Support multiple organizations
- **Advanced Analytics**: Detailed user behavior analytics

---

**Note**: This application uses Microsoft Azure Active Directory for authentication. All users must have valid Microsoft accounts to access the system.
