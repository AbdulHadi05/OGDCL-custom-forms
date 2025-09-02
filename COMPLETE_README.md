# OGDCL Form Generator - Complete Documentation

A comprehensive form management platform built with React.js frontend and Node.js backend, featuring Azure AD authentication, multi-role access, and approval workflows.

## 🚀 Features Overview

### Core Functionality
- **Dynamic Form Builder**: Professional drag-and-drop interface with real-time preview
- **Multi-Role Access**: Separate portals for Admin, Manager, and End Users
- **Approval Workflows**: Built-in approval system with notifications and audit trails
- **Azure AD Integration**: Secure authentication with Microsoft Azure Active Directory
- **Real-time Updates**: Live notifications for submissions and approvals
- **File Uploads**: Support for multiple file types with validation
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS

### User Roles & Portals

#### Admin Portal (`/admin`)
- Complete form management (create, edit, delete, publish)
- User administration and role management
- System settings and configuration
- Comprehensive analytics and reporting
- Database management tools

#### Manager Portal (`/manager`) - **Main Portal**
- Review and approve/reject form submissions
- Enhanced approval modal with form details preview
- Workflow management and delegation
- Team oversight and reporting
- Submission tracking and analytics

#### End User Portal (`/submit`)
- Browse and submit available forms
- Track submission status and history
- Profile management
- Document uploads and attachments

## 📋 Tech Stack

### Frontend
- **React.js 18** - Modern UI framework
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Icon library
- **React DnD** - Drag and drop functionality
- **Axios** - HTTP client
- **MSAL React** - Azure AD authentication

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Supabase/PostgreSQL** - Database
- **JSON Web Tokens** - Authentication
- **Multer** - File upload handling
- **CORS** - Cross-origin requests

## 🛠️ Quick Start

### Prerequisites
- Node.js 16+ and npm/yarn
- PostgreSQL database (or Supabase account)
- Azure AD application registration

### 1. Clone & Setup
```bash
git clone <repository-url>
cd OGDCL-Form-Generator
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your configuration

# Initialize database
npm run setup-db

# Start backend server
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install

# Create .env file  
cp .env.example .env
# Edit .env with your configuration

# Start frontend server
npm run dev
```

### 4. Access the Application
- **Main Application**: http://localhost:3000 (Manager Dashboard)
- **Admin Portal**: http://localhost:3000/admin
- **End User Portal**: http://localhost:3000/submit

## 🏗️ Project Structure

```
OGDCL-Form-Generator/
├── frontend/
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── FormBuilder/     # Form builder components
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── FormCanvas.jsx
│   │   │   │   ├── FormField.jsx
│   │   │   │   ├── FieldRenderer.jsx
│   │   │   │   ├── FieldSettings.jsx
│   │   │   │   └── Toolbar.jsx
│   │   │   ├── portals/         # Portal-specific components
│   │   │   │   ├── AdminPortal.jsx
│   │   │   │   ├── ManagerPortal.jsx
│   │   │   │   └── EndUserPortal.jsx
│   │   │   ├── Dashboard.jsx    # Admin dashboard
│   │   │   ├── ManagerDashboard.jsx  # Manager approval interface
│   │   │   ├── EndUserHome.jsx  # End user form browsing
│   │   │   ├── FormsList.jsx    # Form management
│   │   │   ├── FormBuilderPage.jsx
│   │   │   ├── FormPreviewPage.jsx
│   │   │   ├── FormSubmissionPage.jsx
│   │   │   ├── SubmissionsList.jsx
│   │   │   ├── UserProfile.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── ManagerLogin.jsx
│   │   │   ├── PortalSelection.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── ErrorBoundary.jsx
│   │   ├── contexts/            # React contexts
│   │   │   └── AuthContext.jsx
│   │   ├── services/            # API services
│   │   │   └── api.js
│   │   ├── config/              # Configuration files
│   │   │   ├── api.js
│   │   │   └── authConfig.js
│   │   ├── utils/               # Utility functions
│   │   │   ├── helpers.js
│   │   │   └── constants.js
│   │   ├── App.jsx              # Main app component
│   │   ├── main.jsx            # Entry point
│   │   └── index.css           # Global styles
│   ├── public/                  # Static assets
│   ├── .gitignore              # Git ignore rules
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
├── backend/
│   ├── controllers/             # Route controllers
│   │   ├── formsController.js
│   │   ├── submissionsController.js
│   │   ├── approvalsController.js
│   │   └── usersController.js
│   ├── routes/                  # API routes
│   │   ├── forms.js
│   │   ├── submissions.js
│   │   ├── approvals.js
│   │   ├── users.js
│   │   └── test.js
│   ├── middleware/              # Custom middleware
│   │   └── auth.js
│   ├── config/                  # Configuration files
│   │   └── database.js
│   ├── database/                # Database scripts
│   │   ├── init-database.sql
│   │   └── sample-data.sql
│   ├── .gitignore              # Git ignore rules
│   ├── package.json
│   ├── server.js               # Main server file
│   ├── setup-database.js       # Database setup script
│   ├── test-api.js            # API testing
│   └── test-approval-update.js # Approval testing
├── README.md                    # This file
├── IMPLEMENTATION_SUMMARY.md    # Implementation details
└── AZURE_AUTH_README.md        # Azure AD setup guide
```

## 🔧 Key Components

### Frontend Components

#### **Core Application**
- **App.jsx** - Main application with routing (routes to Manager Dashboard by default)
- **Header.jsx** - Navigation header with user info and role-based menus
- **HomePage.jsx** - Feature-rich landing page
- **ErrorBoundary.jsx** - Error handling and recovery

#### **Portal Components**
- **PortalSelection.jsx** - Portal selection interface (available but not used by default)
- **AdminPortal.jsx** - Complete admin application wrapper
- **ManagerPortal.jsx** - Manager-focused application wrapper  
- **EndUserPortal.jsx** - End user application wrapper

#### **Dashboard Components**
- **Dashboard.jsx** - Admin dashboard with comprehensive analytics
- **ManagerDashboard.jsx** - Manager approval interface with enhanced modal
- **EndUserHome.jsx** - End user form browsing and submission tracking

#### **Form Management**
- **FormBuilderPage.jsx** - Professional drag-and-drop form builder
- **FormsList.jsx** - Form management interface with CRUD operations
- **FormPreviewPage.jsx** - Form preview with publishing controls
- **FormSubmissionPage.jsx** - End user form submission interface

#### **Form Builder Components**
- **Sidebar.jsx** - Draggable field components palette
- **FormCanvas.jsx** - Drop zone for building forms
- **FormField.jsx** - Individual form field wrapper
- **FieldRenderer.jsx** - Field type rendering logic
- **FieldSettings.jsx** - Field property configuration
- **Toolbar.jsx** - Form actions and publishing controls

#### **User Management**
- **UserProfile.jsx** - User profile management
- **SubmissionsList.jsx** - Submission management and tracking
- **LoginPage.jsx** - Azure AD login interface
- **ProtectedRoute.jsx** - Route protection wrapper

### Backend Controllers

#### **API Controllers**
- **formsController.js** - Form CRUD, publishing, and management
- **submissionsController.js** - Submission handling and processing
- **approvalsController.js** - Approval workflow management
- **usersController.js** - User management and profile operations

#### **Middleware**
- **auth.js** - Azure AD token validation and role checking

## 🚦 API Endpoints

### Forms Management
```
GET    /api/forms              # List all forms (with pagination)
POST   /api/forms              # Create new form
GET    /api/forms/:id          # Get specific form details
PUT    /api/forms/:id          # Update form configuration
DELETE /api/forms/:id          # Delete form
POST   /api/forms/:id/publish  # Publish/unpublish form
GET    /api/forms/published    # Get published forms only
```

### Submissions Management
```
GET    /api/submissions        # List submissions (with filtering)
POST   /api/submissions        # Create new submission
GET    /api/submissions/:id    # Get specific submission
PUT    /api/submissions/:id    # Update submission
DELETE /api/submissions/:id    # Delete submission
GET    /api/submissions/my     # Get current user's submissions
GET    /api/submissions/stats  # Get submission statistics
```

### Approvals Workflow
```
GET    /api/approvals          # List pending approvals
POST   /api/approvals/:id      # Approve/reject submission
PUT    /api/approvals/:id      # Update approval status
GET    /api/approvals/pending  # Get pending approvals count
GET    /api/approvals/history  # Get approval history
```

### User Management
```
GET    /api/users              # List users (admin only)
POST   /api/users              # Create user (admin only)
GET    /api/users/profile      # Get current user profile
PUT    /api/users/profile      # Update current user profile
GET    /api/users/managers     # Get list of managers
```

## 🔐 Authentication & Security

### Azure AD Integration
- **MSAL (Microsoft Authentication Library)** implementation
- **Role-based access control** with JWT tokens
- **Token validation middleware** for API protection
- **Secure redirect handling** for authentication flows

### Security Features
- **JWT token authentication** with expiration handling
- **Input validation and sanitization** on all endpoints
- **CORS configuration** for secure cross-origin requests
- **File upload restrictions** with type and size validation
- **SQL injection prevention** with parameterized queries
- **XSS protection** with content sanitization

### Environment Configuration
```env
# Azure AD Configuration
AZURE_TENANT_ID=your_tenant_id
AZURE_CLIENT_ID=your_client_id
AZURE_CLIENT_SECRET=your_client_secret

# Database Configuration
DATABASE_URL=your_postgresql_connection_string
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Security
JWT_SECRET=your_jwt_secret_key
ENCRYPTION_KEY=your_encryption_key
```

## 📱 User Guide

### For Administrators
1. **Access**: Navigate to `/admin` or login with admin credentials
2. **Form Management**: 
   - Use the drag-and-drop builder to create forms
   - Configure field types, validations, and settings
   - Preview forms before publishing
   - Manage form lifecycle (draft → published → archived)
3. **User Management**: 
   - Create and manage user accounts
   - Assign roles and permissions
   - Monitor user activity
4. **Analytics**: 
   - View submission statistics
   - Generate reports
   - Monitor system performance

### For Managers  
1. **Access**: Root URL automatically loads Manager Dashboard
2. **Approval Workflow**:
   - View pending submissions in dashboard
   - Click on submissions to see enhanced modal with form details
   - Preview form data above approve/reject buttons
   - Use "View Full Details" for complete submission view
   - Add comments when approving/rejecting
   - Track approval history and analytics
3. **Team Management**:
   - Monitor team submission metrics
   - Delegate approval responsibilities
   - Generate team reports

### For End Users
1. **Access**: Navigate to `/submit` 
2. **Form Submission**:
   - Browse available published forms
   - Fill out forms with validation feedback
   - Upload files and attachments
   - Submit forms for approval
3. **Tracking**:
   - Monitor submission status
   - View approval comments and feedback
   - Track submission history
   - Update profile information

## 🔄 Development Guide

### Adding New Form Field Types
1. **Update Constants**: Add field type to `utils/constants.js`
```javascript
export const FIELD_TYPES = {
  // ... existing types
  NEW_TYPE: 'new_type'
};
```

2. **Add Field Icon**: Update `FIELD_ICONS` mapping
```javascript
export const FIELD_ICONS = {
  // ... existing icons
  [FIELD_TYPES.NEW_TYPE]: 'IconName'
};
```

3. **Create Field Component**: Add to `FormBuilder/FieldRenderer.jsx`
```javascript
case FIELD_TYPES.NEW_TYPE:
  return <NewTypeField {...fieldProps} />;
```

4. **Update Sidebar**: Add to draggable fields in `FormBuilder/Sidebar.jsx`

### Adding New API Endpoints
1. **Create Controller Function**:
```javascript
// controllers/newController.js
export const newFunction = async (req, res) => {
  try {
    // Implementation
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

2. **Add Route Definition**:
```javascript
// routes/newRoutes.js
import { newFunction } from '../controllers/newController.js';
router.post('/new-endpoint', authMiddleware, newFunction);
```

3. **Update Frontend Service**:
```javascript
// services/api.js
export const newAPI = {
  newAction: (data) => api.post('/new-endpoint', data)
};
```

### Database Schema Updates
1. **Update SQL Script**: Modify `database/init-database.sql`
2. **Create Migration**: Add migration script for existing databases
3. **Update Controllers**: Modify relevant controllers for new schema
4. **Test**: Use `test-api.js` for validation

## 🧪 Testing

### Frontend Testing
```bash
cd frontend
npm run test              # Run all tests
npm run test:watch        # Run tests in watch mode
npm run test:coverage     # Generate coverage report
```

### Backend Testing
```bash
cd backend
npm run test              # Run all tests
node test-api.js          # Test API endpoints
node test-approval-update.js  # Test approval workflow
```

### Manual Testing Checklist
- [ ] Form builder drag-and-drop functionality
- [ ] Form submission and validation
- [ ] Approval workflow (approve/reject)
- [ ] File upload and download
- [ ] Authentication flows
- [ ] Role-based access control
- [ ] Responsive design on mobile
- [ ] Error handling and recovery

## 📦 Deployment

### Production Build
```bash
# Frontend production build
cd frontend
npm run build
# Files will be in dist/ directory

# Backend preparation
cd backend
# Ensure environment variables are set
# Run database migrations if needed
```

### Environment Variables (Production)
```env
# Frontend (.env.production)
VITE_API_URL=https://your-api-domain.com/api
VITE_AZURE_TENANT_ID=production_tenant_id
VITE_AZURE_CLIENT_ID=production_client_id

# Backend (.env.production)
NODE_ENV=production
DATABASE_URL=production_database_url
AZURE_TENANT_ID=production_tenant_id
AZURE_CLIENT_ID=production_client_id
AZURE_CLIENT_SECRET=production_client_secret
JWT_SECRET=production_jwt_secret
```

### Deployment Checklist
- [ ] Update all environment variables
- [ ] Configure production database
- [ ] Set up Azure AD production app registration
- [ ] Configure CORS for production domains
- [ ] Set up SSL certificates
- [ ] Configure file upload limits
- [ ] Test authentication flows
- [ ] Verify API endpoints
- [ ] Check responsive design
- [ ] Monitor error logs

## 🤝 Contributing

### Development Workflow
1. **Fork Repository**: Create your own fork
2. **Create Branch**: `git checkout -b feature/amazing-feature`
3. **Make Changes**: Follow coding standards
4. **Test Thoroughly**: Run all tests and manual testing
5. **Commit Changes**: `git commit -m 'Add amazing feature'`
6. **Push Branch**: `git push origin feature/amazing-feature`
7. **Create Pull Request**: Submit for review

### Coding Standards
- **JavaScript**: ES6+ syntax, async/await for promises
- **React**: Functional components with hooks
- **CSS**: Tailwind CSS utilities, minimal custom CSS
- **Comments**: JSDoc for functions, inline for complex logic
- **Naming**: camelCase for variables, PascalCase for components

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support & Documentation

### Additional Documentation
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - Detailed implementation notes
- **[AZURE_AUTH_README.md](AZURE_AUTH_README.md)** - Azure AD setup guide
- **API Documentation** - Available at `/api/docs` when server is running

### Getting Help
- **Issues**: Create GitHub issues for bugs and feature requests
- **Development**: Check implementation summary for detailed technical notes
- **Azure AD**: Refer to Azure authentication documentation

## 🗺️ Roadmap

### Version 1.x (Current)
- [x] Core form builder functionality
- [x] Multi-role portal architecture
- [x] Azure AD authentication
- [x] Basic approval workflows
- [x] Enhanced approval modal with form preview
- [x] Direct manager dashboard access

### Version 2.0 (Planned)
- [ ] Advanced analytics dashboard
- [ ] Email notifications for approvals
- [ ] Form templates library
- [ ] Bulk operations for submissions
- [ ] Advanced reporting with exports
- [ ] Mobile app development
- [ ] Integration with external systems (SharePoint, Teams)
- [ ] Multi-language support
- [ ] Advanced workflow automation

### Version 3.0 (Future)
- [ ] AI-powered form suggestions
- [ ] Advanced data visualization
- [ ] Workflow automation with conditions
- [ ] Integration marketplace
- [ ] White-label solutions
- [ ] Enterprise SSO support

---

**Built with ❤️ for OGDCL by the Development Team**

*For technical implementation details, see [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)*
