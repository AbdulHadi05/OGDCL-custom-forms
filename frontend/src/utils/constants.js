// Application constants

// Form Field Types
export const FIELD_TYPES = {
  TEXT: 'text',
  EMAIL: 'email', 
  PASSWORD: 'password',
  NUMBER: 'number',
  PHONE: 'phone',
  URL: 'url',
  TEXTAREA: 'textarea',
  SELECT: 'select',
  CHECKBOX: 'checkbox',
  RADIO: 'radio',
  DATE: 'date',
  TIME: 'time',
  DATETIME: 'datetime-local',
  FILE: 'file',
  HEADING: 'heading',
  PARAGRAPH: 'paragraph',
  DIVIDER: 'divider'
};

// Form Submission Status
export const SUBMISSION_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  REQUIRES_CHANGES: 'requires_changes'
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  END_USER: 'end_user',
  VIEWER: 'viewer'
};

// Priority Levels
export const PRIORITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
};

// Form Status
export const FORM_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
  DISABLED: 'disabled'
};

// Approval Actions
export const APPROVAL_ACTIONS = {
  APPROVE: 'approve',
  REJECT: 'reject',
  REQUEST_CHANGES: 'request_changes',
  DELEGATE: 'delegate'
};

// Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// API Endpoints
export const API_ENDPOINTS = {
  FORMS: '/forms',
  SUBMISSIONS: '/submissions',
  APPROVALS: '/approvals',
  USERS: '/users',
  AUTH: '/auth',
  UPLOAD: '/upload'
};

// Local Storage Keys
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'ogdcl_user_preferences',
  FORM_DRAFT: 'ogdcl_form_draft',
  AUTH_TOKEN: 'ogdcl_auth_token',
  LAST_LOGIN: 'ogdcl_last_login'
};

// Form Builder
export const DRAG_TYPES = {
  FIELD: 'field',
  EXISTING_FIELD: 'existing_field'
};

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 25, 50, 100]
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  DATETIME_DISPLAY: 'MMM dd, yyyy HH:mm',
  API: 'yyyy-MM-dd',
  DATETIME_API: 'yyyy-MM-dd HH:mm:ss'
};

// Validation Rules
export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[\+]?[\s\-\(\)]*([0-9][\s\-\(\)]*){10,}$/,
  URL: /^https?:\/\/.+/,
  PASSWORD: {
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SPECIAL: true
  }
};

// Theme Colors
export const THEME_COLORS = {
  PRIMARY: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    900: '#1e3a8a'
  },
  SUCCESS: {
    100: '#dcfce7',
    500: '#22c55e',
    600: '#16a34a'
  },
  WARNING: {
    100: '#fef3c7',
    500: '#f59e0b',
    600: '#d97706'
  },
  ERROR: {
    100: '#fee2e2',
    500: '#ef4444',
    600: '#dc2626'
  }
};

// Form Field Icons (Lucide React)
export const FIELD_ICONS = {
  [FIELD_TYPES.TEXT]: 'Type',
  [FIELD_TYPES.EMAIL]: 'Mail',
  [FIELD_TYPES.PASSWORD]: 'Lock',
  [FIELD_TYPES.NUMBER]: 'Hash',
  [FIELD_TYPES.PHONE]: 'Phone',
  [FIELD_TYPES.URL]: 'Link',
  [FIELD_TYPES.TEXTAREA]: 'FileText',
  [FIELD_TYPES.SELECT]: 'ChevronDown',
  [FIELD_TYPES.CHECKBOX]: 'CheckSquare',
  [FIELD_TYPES.RADIO]: 'Circle',
  [FIELD_TYPES.DATE]: 'Calendar',
  [FIELD_TYPES.TIME]: 'Clock',
  [FIELD_TYPES.DATETIME]: 'CalendarClock',
  [FIELD_TYPES.FILE]: 'Upload',
  [FIELD_TYPES.HEADING]: 'Heading',
  [FIELD_TYPES.PARAGRAPH]: 'FileText',
  [FIELD_TYPES.DIVIDER]: 'Minus'
};

// Default Field Properties
export const DEFAULT_FIELD_PROPS = {
  [FIELD_TYPES.TEXT]: {
    label: 'Text Field',
    placeholder: 'Enter text...',
    required: false,
    maxLength: 100
  },
  [FIELD_TYPES.EMAIL]: {
    label: 'Email Address',
    placeholder: 'Enter email address...',
    required: false
  },
  [FIELD_TYPES.NUMBER]: {
    label: 'Number Field',
    placeholder: 'Enter number...',
    required: false,
    min: undefined,
    max: undefined,
    step: 1
  },
  [FIELD_TYPES.TEXTAREA]: {
    label: 'Text Area',
    placeholder: 'Enter text...',
    required: false,
    rows: 4,
    maxLength: 500
  },
  [FIELD_TYPES.SELECT]: {
    label: 'Select Field',
    required: false,
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' }
    ]
  },
  [FIELD_TYPES.CHECKBOX]: {
    label: 'Checkbox',
    required: false,
    text: 'Check this box'
  },
  [FIELD_TYPES.RADIO]: {
    label: 'Radio Group',
    required: false,
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' }
    ]
  }
};

// Error Messages
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PHONE: 'Please enter a valid phone number',
  INVALID_URL: 'Please enter a valid URL',
  FILE_TOO_LARGE: 'File size exceeds maximum limit',
  INVALID_FILE_TYPE: 'File type not allowed',
  NETWORK_ERROR: 'Network error. Please try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please fix the validation errors and try again'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  FORM_SAVED: 'Form saved successfully',
  FORM_PUBLISHED: 'Form published successfully',
  SUBMISSION_CREATED: 'Form submitted successfully',
  SUBMISSION_UPDATED: 'Submission updated successfully',
  APPROVAL_GRANTED: 'Approval granted successfully',
  APPROVAL_REJECTED: 'Submission rejected successfully',
  USER_CREATED: 'User created successfully',
  PROFILE_UPDATED: 'Profile updated successfully'
};
