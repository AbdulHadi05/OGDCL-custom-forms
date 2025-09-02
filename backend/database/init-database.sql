-- Database initialization script for Supabase
-- Run this in your Supabase SQL editor to set up the database schema

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create forms table
CREATE TABLE IF NOT EXISTS forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  form_type VARCHAR(50) DEFAULT 'custom',
  form_config JSONB NOT NULL DEFAULT '{"fields": []}',
  fields JSONB NOT NULL DEFAULT '[]', -- Keep for backward compatibility
  managers TEXT[] DEFAULT '{}',
  requires_approval BOOLEAN DEFAULT true,
  settings JSONB DEFAULT '{}',
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by VARCHAR(255),
  category VARCHAR(100),
  estimated_time INTEGER,
  required_fields TEXT[]
);

-- Create submissions table
CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id UUID NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
  data JSONB NOT NULL DEFAULT '{}',
  status VARCHAR(20) DEFAULT 'submitted' CHECK (status IN ('submitted', 'approved', 'rejected', 'pending')),
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  submitter_name VARCHAR(255),
  submitter_email VARCHAR(255),
  ip_address INET,
  user_agent TEXT
);

-- Create approvals table
CREATE TABLE IF NOT EXISTS approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  manager_id VARCHAR(255),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  comments TEXT,
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create form_templates table
DROP TABLE IF EXISTS form_templates CASCADE;
CREATE TABLE form_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  fields JSONB NOT NULL DEFAULT '[]',
  form_config JSONB NOT NULL DEFAULT '{"fields": []}',
  category VARCHAR(100),
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by VARCHAR(255)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_forms_status ON forms(status);
CREATE INDEX IF NOT EXISTS idx_forms_is_published ON forms(is_published);
CREATE INDEX IF NOT EXISTS idx_forms_created_at ON forms(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_forms_created_by ON forms(created_by);
CREATE INDEX IF NOT EXISTS idx_submissions_form_id ON submissions(form_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_submitted_at ON submissions(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_approvals_submission_id ON approvals(submission_id);
CREATE INDEX IF NOT EXISTS idx_approvals_status ON approvals(status);
CREATE INDEX IF NOT EXISTS idx_form_templates_category ON form_templates(category);
CREATE INDEX IF NOT EXISTS idx_form_templates_is_public ON form_templates(is_public);

-- Create function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_forms_updated_at ON forms;
CREATE TRIGGER update_forms_updated_at 
    BEFORE UPDATE ON forms 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_templates ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow all operations on forms" ON forms;
DROP POLICY IF EXISTS "Allow all operations on submissions" ON submissions;
DROP POLICY IF EXISTS "Allow all operations on approvals" ON approvals;
DROP POLICY IF EXISTS "Allow all operations on form_templates" ON form_templates;

-- Create permissive policies for development (you should restrict these in production)
-- Allow all operations on forms
CREATE POLICY "Allow all operations on forms" ON forms
  FOR ALL USING (true) WITH CHECK (true);

-- Allow all operations on submissions  
CREATE POLICY "Allow all operations on submissions" ON submissions
  FOR ALL USING (true) WITH CHECK (true);

-- Allow all operations on approvals
CREATE POLICY "Allow all operations on approvals" ON approvals
  FOR ALL USING (true) WITH CHECK (true);

-- Allow all operations on form_templates
CREATE POLICY "Allow all operations on form_templates" ON form_templates
  FOR ALL USING (true) WITH CHECK (true);

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Database initialization completed successfully!';
    RAISE NOTICE 'Tables created: forms, submissions, approvals, form_templates';
    RAISE NOTICE 'Indexes and triggers created';
    RAISE NOTICE 'Row Level Security policies configured';
END $$;
