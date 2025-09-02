## Form Builder - Merged Project Setup Guide

This is a comprehensive form builder application that merges the best features from both your previous projects.

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- Supabase account and project
- Git

### 1. Environment Setup

**Backend Setup:**

```bash
cd backend
npm install
```

Copy `.env.example` to `.env` and update with your Supabase credentials:

```env
DATABASE_URL=your_supabase_connection_string
SUPABASE_ANON_KEY=your_supabase_anon_key
PORT=5001
FRONTEND_URL=http://localhost:3000
```

**Frontend Setup:**

```bash
cd ../frontend
npm install
```

### 2. Database Setup

Run the database initialization script:

```bash
cd backend
# Initialize database only
npm run setup-db

# Or initialize with sample data
npm run setup-db-with-samples
```

### 3. Start the Application

**Start Backend:**

```bash
cd backend
npm run dev
```

**Start Frontend (in another terminal):**

```bash
cd frontend
npm run dev
```

Visit `http://localhost:3000` to access the form builder.

## Issues Fixed

### ✅ Scrolling Problem

- Fixed vertical scrolling in form builder canvas
- Forms with many fields now properly scroll
- Preview mode also has proper scrolling support

### ✅ Database Row Level Security

- Fixed RLS policies to allow form creation and updates
- Separated database initialization from sample data
- Added proper error handling for database operations

### ✅ Auto-save Error on Form Edit

- Fixed auto-save triggering immediately after form load
- Improved error handling to not show errors for auto-save failures
- Added loading state checks to prevent premature saves

### ✅ Better Routing and Navigation

- Added proper header with navigation
- Improved routing structure
- Added back button in form builder
- Better UX with header hiding in full-screen modes

### ✅ Database Scripts

- `database/init-database.sql` - Clean database initialization
- `database/sample-data.sql` - Sample forms and templates
- `setup-database.js` - Automated setup script with error handling

## Features

### ✨ Advanced Form Builder

- **Drag & Drop Interface**: Intuitive field placement with react-dnd
- **Rich Field Types**: Text, email, file upload, signature, layout elements
- **Field Settings**: Comprehensive validation and styling options
- **Preview Mode**: Real-time form preview with proper scrolling
- **Auto-save**: Automatic form saving during editing (improved)

### 🔒 Approval Workflow

- **Manager Assignment**: Assign forms to specific managers
- **Approval Process**: Configurable approval requirements
- **Status Tracking**: Track submission status through approval pipeline
- **Comments System**: Managers can add comments during approval

### 🚀 Publishing & Sharing

- **Form Publishing**: Publish forms for public access
- **Direct Links**: Shareable form URLs
- **Form Gallery**: Browse available forms for submission
- **Template System**: Create forms from predefined templates

### 📊 Dashboard & Analytics

- **Admin Dashboard**: Overview of forms and submissions
- **Manager Dashboard**: Approval queue and history
- **Statistics**: Form usage and submission metrics
- **Export Options**: Export submission data

## Architecture

### Frontend (React + Vite)

- **React 18** with modern hooks and context
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React DnD** for drag-and-drop functionality
- **React Router** for navigation
- **Axios** for API communication

### Backend (Node.js + Express)

- **Express.js** REST API server
- **Supabase** for database and real-time features
- **UUID** for unique form identification
- **CORS** enabled for frontend communication

### Database (PostgreSQL via Supabase)

- **Forms**: Store form configurations and metadata
- **Submissions**: Store form submission data
- **Approvals**: Handle approval workflow
- **Templates**: Predefined form templates

## API Endpoints

### Forms

- `GET /api/forms` - Get all forms
- `GET /api/forms/:id` - Get specific form
- `POST /api/forms` - Create new form
- `PUT /api/forms/:id` - Update form
- `DELETE /api/forms/:id` - Delete form
- `PATCH /api/forms/:id/publish` - Publish form
- `PATCH /api/forms/:id/unpublish` - Unpublish form

### Submissions

- `GET /api/submissions` - Get all submissions
- `POST /api/submissions` - Create new submission
- `GET /api/submissions/:id` - Get specific submission

### Approvals

- `GET /api/approvals` - Get pending approvals
- `POST /api/approvals/:id/approve` - Approve submission
- `POST /api/approvals/:id/reject` - Reject submission

## Troubleshooting

### Common Issues

1. **Database Connection Errors**

   - Verify your DATABASE_URL and SUPABASE_ANON_KEY in .env
   - Make sure your Supabase project is active
   - Run the database setup script again

2. **Form Creation Fails**

   - Check browser console for errors
   - Verify database policies are correctly set
   - Check backend logs for detailed error messages

3. **Scrolling Issues**

   - Clear browser cache
   - Check that the latest CSS changes are applied
   - Verify container heights in developer tools

4. **Auto-save Problems**
   - Ensure the form has a title before editing fields
   - Check network tab for API call errors
   - Look for console errors in browser

## Development

### Adding New Field Types

1. Add field type to `Sidebar.jsx`
2. Implement rendering in `FieldRenderer.jsx`
3. Add settings in `FieldSettings.jsx`
4. Update validation in form submission

### Customizing Styles

- Main styles in `src/index.css`
- Component-specific styles use Tailwind classes
- Form builder layout uses CSS Grid and Flexbox

### Database Changes

- Create migration files for schema changes
- Test changes in development first
- Update both init-database.sql and sample-data.sql

## Support

For issues or questions:

1. Check the troubleshooting section above
2. Review browser console and network tabs
3. Check backend logs for API errors
4. Verify database connection and policies

## License

This project is for educational and development purposes.

- **File upload** support with validation
- **CORS** enabled for cross-origin requests

### Database (Supabase PostgreSQL)

- **Forms**: Store form configurations and metadata
- **Submissions**: Store user form submissions
- **Approvals**: Track approval workflow
- **Templates**: Predefined form templates

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- Supabase account and project

### Backend Setup

1. Navigate to backend directory:

   ```bash
   cd merged-form-builder/backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create environment file:

   ```bash
   cp .env.example .env
   ```

4. Configure environment variables in `.env`:

   ```env
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   SUPABASE_ANON_KEY=your_anon_key
   ```

5. Set up database schema:

   - Go to your Supabase project dashboard
   - Open the SQL Editor
   - Copy and run the contents of `database/schema.sql`

6. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to frontend directory:

   ```bash
   cd merged-form-builder/frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create environment file:

   ```bash
   echo "VITE_API_URL=http://localhost:5000/api" > .env
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Supabase Configuration

1. **Create a new Supabase project** at https://supabase.com
2. **Get your credentials** from Project Settings > API
3. **Run the database schema** from `backend/database/schema.sql`
4. **Configure Row Level Security** policies as needed
5. **Update environment variables** with your Supabase credentials

## Usage

### Creating Forms

1. Access the admin dashboard at `http://localhost:3000`
2. Click "Create New Form"
3. Use the drag-and-drop interface to add fields
4. Configure field settings in the sidebar
5. Save and publish your form

### Form Submissions

1. Access the end-user interface at `http://localhost:3000/submit`
2. Browse available published forms
3. Fill out and submit forms
4. Track submission status

### Managing Approvals

1. Access the manager dashboard at `http://localhost:3000/manager`
2. Review pending submissions
3. Approve or reject with comments
4. Track approval history

## API Endpoints

### Forms

- `GET /api/forms` - List all forms
- `GET /api/forms/:id` - Get specific form
- `POST /api/forms` - Create new form
- `PUT /api/forms/:id` - Update form
- `DELETE /api/forms/:id` - Delete form
- `PATCH /api/forms/:id/publish` - Publish form
- `PATCH /api/forms/:id/unpublish` - Unpublish form

### Submissions

- `GET /api/submissions` - List all submissions
- `GET /api/submissions/form/:formId` - Get form submissions
- `POST /api/submissions` - Create submission
- `PUT /api/submissions/:id` - Update submission
- `DELETE /api/submissions/:id` - Delete submission

### Approvals

- `GET /api/approvals` - List all approvals
- `GET /api/approvals/pending` - Get pending approvals
- `GET /api/approvals/manager/:managerId` - Get manager approvals
- `POST /api/approvals/:submissionId/approve` - Approve submission
- `POST /api/approvals/:submissionId/reject` - Reject submission

## Project Structure

```
merged-form-builder/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── FormBuilder/         # Form builder components
│   │   │   ├── Dashboard.jsx        # Admin dashboard
│   │   │   ├── EndUserHome.jsx      # End user interface
│   │   │   └── ManagerDashboard.jsx # Manager interface
│   │   ├── services/
│   │   │   └── api.js              # API service layer
│   │   └── App.jsx                 # Main app component
│   ├── package.json
│   └── tailwind.config.js
├── backend/
│   ├── config/
│   │   └── database.js             # Supabase configuration
│   ├── controllers/                # API controllers
│   ├── routes/                     # API routes
│   ├── server.js                   # Express server
│   └── package.json
└── database/
    └── schema.sql                  # Database schema
```

## Customization

### Adding New Field Types

1. Add field type to `Sidebar.jsx` fieldTypes object
2. Implement rendering in `FieldRenderer.jsx`
3. Add settings in `FieldSettings.jsx`
4. Update default labels and placeholders

### Styling Customization

- Modify `tailwind.config.js` for theme changes
- Update `index.css` for custom styles
- Component styles are in Tailwind classes

### Database Customization

- Modify `schema.sql` for database changes
- Update API controllers for new fields
- Adjust frontend models accordingly

## Deployment

### Frontend (Vercel/Netlify)

1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Set environment variables in deployment platform

### Backend (Railway/Heroku)

1. Configure production environment variables
2. Deploy backend to hosting service
3. Update frontend API URL to production backend

### Database (Supabase)

- Already hosted on Supabase cloud
- Configure production security policies
- Set up backups and monitoring

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please check the documentation or create an issue in the project repository.
