-- Sample data insertion script for the Form Builder
-- Run this after running init-database.sql

-- Insert sample forms
INSERT INTO forms (
  title, 
  description, 
  form_type,
  form_config,
  fields, 
  managers,
  status, 
  is_published, 
  category, 
  estimated_time,
  created_by
) VALUES 
(
  'Sample Employee Onboarding Form',
  'A comprehensive form for new employee onboarding process',
  'custom',
  '{
    "title": "Employee Onboarding Form",
    "description": "Please provide your information for the onboarding process",
    "fields": [
      {
        "id": "name",
        "type": "text",
        "label": "Full Name",
        "required": true,
        "placeholder": "Enter your full name"
      },
      {
        "id": "email",
        "type": "email",
        "label": "Email Address",
        "required": true,
        "placeholder": "Enter your email address"
      },
      {
        "id": "department",
        "type": "select",
        "label": "Department",
        "required": true,
        "options": ["Engineering", "Marketing", "Sales", "HR", "Finance"]
      },
      {
        "id": "position",
        "type": "text",
        "label": "Position/Title",
        "required": true,
        "placeholder": "Your job title"
      },
      {
        "id": "start-date",
        "type": "date",
        "label": "Start Date",
        "required": true
      },
      {
        "id": "emergency-contact",
        "type": "text",
        "label": "Emergency Contact",
        "required": true,
        "placeholder": "Name and phone number"
      }
    ]
  }',
  '[
    {
      "id": "name",
      "type": "text",
      "label": "Full Name",
      "required": true,
      "placeholder": "Enter your full name"
    },
    {
      "id": "email",
      "type": "email",
      "label": "Email Address",
      "required": true,
      "placeholder": "Enter your email address"
    },
    {
      "id": "department",
      "type": "select",
      "label": "Department",
      "required": true,
      "options": ["Engineering", "Marketing", "Sales", "HR", "Finance"]
    },
    {
      "id": "position",
      "type": "text",
      "label": "Position/Title",
      "required": true,
      "placeholder": "Your job title"
    },
    {
      "id": "start-date",
      "type": "date",
      "label": "Start Date",
      "required": true
    },
    {
      "id": "emergency-contact",
      "type": "text",
      "label": "Emergency Contact",
      "required": true,
      "placeholder": "Name and phone number"
    }
  ]',
  '["abdulahadakram2005@gmail.com", "john.smith@company.com", "alice.johnson@company.com"]',
  'published',
  true,
  'HR',
  8,
  'system'
),
(
  'Customer Feedback Form',
  'Collect valuable feedback from our customers',
  'custom',
  '{
    "title": "Customer Feedback Form",
    "description": "Help us improve our services by sharing your feedback",
    "fields": [
      {
        "id": "customer-name",
        "type": "text",
        "label": "Customer Name",
        "required": true,
        "placeholder": "Enter your name"
      },
      {
        "id": "email",
        "type": "email",
        "label": "Email Address",
        "required": true,
        "placeholder": "your@email.com"
      },
      {
        "id": "service-rating",
        "type": "radio",
        "label": "How would you rate our service?",
        "required": true,
        "options": ["Excellent", "Good", "Average", "Poor", "Very Poor"]
      },
      {
        "id": "recommend",
        "type": "radio",
        "label": "Would you recommend us to others?",
        "required": true,
        "options": ["Yes, definitely", "Yes, probably", "Not sure", "Probably not", "Definitely not"]
      },
      {
        "id": "comments",
        "type": "textarea",
        "label": "Additional Comments",
        "required": false,
        "placeholder": "Please share any additional feedback..."
      }
    ]
  }',
  '[
    {
      "id": "customer-name",
      "type": "text",
      "label": "Customer Name",
      "required": true,
      "placeholder": "Enter your name"
    },
    {
      "id": "email",
      "type": "email",
      "label": "Email Address",
      "required": true,
      "placeholder": "your@email.com"
    },
    {
      "id": "service-rating",
      "type": "radio",
      "label": "How would you rate our service?",
      "required": true,
      "options": ["Excellent", "Good", "Average", "Poor", "Very Poor"]
    },
    {
      "id": "recommend",
      "type": "radio",
      "label": "Would you recommend us to others?",
      "required": true,
      "options": ["Yes, definitely", "Yes, probably", "Not sure", "Probably not", "Definitely not"]
    },
    {
      "id": "comments",
      "type": "textarea",
      "label": "Additional Comments",
      "required": false,
      "placeholder": "Please share any additional feedback..."
    }
  ]',
  '["sarah.johnson@company.com", "mike.davis@company.com", "abdulahadakram2005@gmail.com"]',
  'published',
  true,
  'Customer Service',
  5,
  'system'
),
(
  'Contact Information Form',
  'Basic contact information collection',
  'custom',
  '{
    "title": "Contact Information",
    "description": "Please provide your contact details",
    "fields": [
      {
        "id": "full-name",
        "type": "text",
        "label": "Full Name",
        "required": true,
        "placeholder": "Enter your full name"
      },
      {
        "id": "email",
        "type": "email",
        "label": "Email Address",
        "required": true,
        "placeholder": "your@email.com"
      },
      {
        "id": "phone",
        "type": "tel",
        "label": "Phone Number",
        "required": true,
        "placeholder": "+1 (555) 123-4567"
      },
      {
        "id": "subject",
        "type": "text",
        "label": "Subject",
        "required": true,
        "placeholder": "What is this regarding?"
      },
      {
        "id": "message",
        "type": "textarea",
        "label": "Message",
        "required": true,
        "placeholder": "Please describe your inquiry..."
      }
    ]
  }',
  '[
    {
      "id": "full-name",
      "type": "text",
      "label": "Full Name",
      "required": true,
      "placeholder": "Enter your full name"
    },
    {
      "id": "email",
      "type": "email",
      "label": "Email Address",
      "required": true,
      "placeholder": "your@email.com"
    },
    {
      "id": "phone",
      "type": "tel",
      "label": "Phone Number",
      "required": true,
      "placeholder": "+1 (555) 123-4567"
    },
    {
      "id": "subject",
      "type": "text",
      "label": "Subject",
      "required": true,
      "placeholder": "What is this regarding?"
    },
    {
      "id": "message",
      "type": "textarea",
      "label": "Message",
      "required": true,
      "placeholder": "Please describe your inquiry..."
    }
  ]',
  '["abdulahadakram2005@gmail.com", "john.smith@company.com"]',
  'draft',
  false,
  'General',
  3,
  'system'
);

-- Insert form templates with proper field structure for form builder
INSERT INTO form_templates (name, description, category, fields, form_config, is_public, created_by) VALUES
(
    'OGDCL Email Access Form',
    'Systems Department - Request for email address access',
    'IT',
    '[
        {
            "id": "section-1",
            "type": "section",
            "label": "REQUEST FOR NEW EMAIL ADDRESS",
            "required": false
        },
        {
            "id": "emp-no-1",
            "type": "text",
            "label": "Employee No.",
            "required": true,
            "placeholder": "Enter employee number"
        },
        {
            "id": "name-1",
            "type": "text",
            "label": "Name",
            "required": true,
            "placeholder": "Enter full name"
        },
        {
            "id": "designation-1",
            "type": "text",
            "label": "Designation",
            "required": true,
            "placeholder": "Enter designation"
        },
        {
            "id": "department-1",
            "type": "text",
            "label": "Department",
            "required": true,
            "placeholder": "Enter department"
        },
        {
            "id": "location-1",
            "type": "text",
            "label": "Location/Floor",
            "required": true,
            "placeholder": "Enter location"
        },
        {
            "id": "section-name-1",
            "type": "text",
            "label": "Section",
            "required": true,
            "placeholder": "Enter section"
        },
        {
            "id": "tel-1",
            "type": "text",
            "label": "Tel No./Extn.",
            "required": false,
            "placeholder": "Enter telephone number"
        },
        {
            "id": "cell-1",
            "type": "text",
            "label": "Cell No.",
            "required": false,
            "placeholder": "Enter cell number"
        },
        {
            "id": "email-proposed",
            "type": "email",
            "label": "Proposed Email ID (Depending on availability)",
            "required": true,
            "placeholder": "Enter proposed email ID"
        }
    ]',
    '{
        "title": "OGDCL Email Access Form",
        "description": "Systems Department - Request for email address access",
        "fields": [
            {
                "id": "section-1",
                "type": "section",
                "label": "REQUEST FOR NEW EMAIL ADDRESS",
                "required": false
            },
            {
                "id": "emp-no-1",
                "type": "text",
                "label": "Employee No.",
                "required": true,
                "placeholder": "Enter employee number"
            },
            {
                "id": "name-1",
                "type": "text",
                "label": "Name",
                "required": true,
                "placeholder": "Enter full name"
            },
            {
                "id": "designation-1",
                "type": "text",
                "label": "Designation",
                "required": true,
                "placeholder": "Enter designation"
            },
            {
                "id": "department-1",
                "type": "text",
                "label": "Department",
                "required": true,
                "placeholder": "Enter department"
            },
            {
                "id": "location-1",
                "type": "text",
                "label": "Location/Floor",
                "required": true,
                "placeholder": "Enter location"
            },
            {
                "id": "section-name-1",
                "type": "text",
                "label": "Section",
                "required": true,
                "placeholder": "Enter section"
            },
            {
                "id": "tel-1",
                "type": "text",
                "label": "Tel No./Extn.",
                "required": false,
                "placeholder": "Enter telephone number"
            },
            {
                "id": "cell-1",
                "type": "text",
                "label": "Cell No.",
                "required": false,
                "placeholder": "Enter cell number"
            },
            {
                "id": "email-proposed",
                "type": "email",
                "label": "Proposed Email ID (Depending on availability)",
                "required": true,
                "placeholder": "Enter proposed email ID"
            }
        ]
    }',
    true,
    'system'
),
(
    'Contact Information Form',
    'Simple contact form for general inquiries',
    'General',
    '[
        {
            "id": "full-name",
            "type": "text",
            "label": "Full Name",
            "required": true,
            "placeholder": "Enter your full name"
        },
        {
            "id": "email",
            "type": "email",
            "label": "Email Address",
            "required": true,
            "placeholder": "your@email.com"
        },
        {
            "id": "phone",
            "type": "tel",
            "label": "Phone Number",
            "required": false,
            "placeholder": "+1 (555) 123-4567"
        },
        {
            "id": "subject",
            "type": "text",
            "label": "Subject",
            "required": true,
            "placeholder": "What is this regarding?"
        },
        {
            "id": "message",
            "type": "textarea",
            "label": "Message",
            "required": true,
            "placeholder": "Please describe your inquiry...",
            "rows": 5
        }
    ]',
    '{
        "title": "Contact Information Form",
        "description": "Please fill out this form to get in touch with us",
        "fields": [
            {
                "id": "full-name",
                "type": "text",
                "label": "Full Name",
                "required": true,
                "placeholder": "Enter your full name"
            },
            {
                "id": "email",
                "type": "email",
                "label": "Email Address",
                "required": true,
                "placeholder": "your@email.com"
            },
            {
                "id": "phone",
                "type": "tel",
                "label": "Phone Number",
                "required": false,
                "placeholder": "+1 (555) 123-4567"
            },
            {
                "id": "subject",
                "type": "text",
                "label": "Subject",
                "required": true,
                "placeholder": "What is this regarding?"
            },
            {
                "id": "message",
                "type": "textarea",
                "label": "Message",
                "required": true,
                "placeholder": "Please describe your inquiry...",
                "rows": 5
            }
        ]
    }',
    true,
    'system'
);

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Sample data insertion completed successfully!';
    RAISE NOTICE 'Inserted: 3 sample forms and 2 form templates';
    RAISE NOTICE 'You can now test the form builder with the sample data';
END $$;
