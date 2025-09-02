import React from "react";
import { Trash2, Plus } from "lucide-react";

const FieldSettings = ({ field, updateField }) => {
  const handleBasicChange = (property, value) => {
    updateField(field.id, { [property]: value });
  };

  const handleValidationChange = (rule, value) => {
    updateField(field.id, {
      validation: { ...field.validation, [rule]: value },
    });
  };

  const handleStyleChange = (property, value) => {
    updateField(field.id, {
      style: { ...field.style, [property]: value },
    });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...(field.options || [])];
    newOptions[index] = value;
    updateField(field.id, { options: newOptions });
  };

  const addOption = () => {
    const newOptions = [
      ...(field.options || []),
      `Option ${(field.options?.length || 0) + 1}`,
    ];
    updateField(field.id, { options: newOptions });
  };

  const removeOption = (index) => {
    const newOptions = field.options?.filter((_, i) => i !== index) || [];
    updateField(field.id, { options: newOptions });
  };

  const renderBasicSettings = () => (
    <div className="settings-group">
      <h4>Basic Settings</h4>

      <div className="mb-3">
        <label className="settings-label">Field Label</label>
        <input
          type="text"
          className="settings-input"
          value={field.label || ""}
          onChange={(e) => handleBasicChange("label", e.target.value)}
          placeholder="Enter field label"
        />
      </div>

      {field.type !== "section" && (
        <div className="mb-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="settings-checkbox"
              checked={field.belongsToSection !== false}
              onChange={(e) =>
                handleBasicChange("belongsToSection", e.target.checked)
              }
            />
            <span className="settings-label mb-0 ml-2">
              Belongs to section (if any section exists above)
            </span>
          </label>
        </div>
      )}

      {[
        "text",
        "email",
        "password",
        "number",
        "tel",
        "url",
        "textarea",
      ].includes(field.type) && (
        <div className="mb-3">
          <label className="settings-label">Placeholder</label>
          <input
            type="text"
            className="settings-input"
            value={field.placeholder || ""}
            onChange={(e) => handleBasicChange("placeholder", e.target.value)}
            placeholder="Enter placeholder text"
          />
        </div>
      )}

      {field.type === "paragraph" && (
        <div className="mb-3">
          <label className="settings-label">Content</label>
          <textarea
            className="settings-input"
            rows="4"
            value={field.content || ""}
            onChange={(e) => handleBasicChange("content", e.target.value)}
            placeholder="Enter paragraph content"
          />
        </div>
      )}

      {field.type === "heading" && (
        <div className="mb-3">
          <label className="settings-label">Heading Level</label>
          <select
            className="settings-input"
            value={field.headingLevel || "h2"}
            onChange={(e) => handleBasicChange("headingLevel", e.target.value)}
          >
            <option value="h1">H1 - Large</option>
            <option value="h2">H2 - Medium</option>
            <option value="h3">H3 - Small</option>
          </select>
        </div>
      )}

      <div className="settings-row">
        <label className="flex items-center">
          <input
            type="checkbox"
            className="settings-checkbox"
            checked={field.required || false}
            onChange={(e) => handleBasicChange("required", e.target.checked)}
          />
          Required field
        </label>
      </div>
    </div>
  );

  const renderOptionsSettings = () => (
    <div className="settings-group">
      <h4>Options</h4>

      <div className="option-list">
        {field.options?.map((option, index) => (
          <div key={index} className="option-item">
            <input
              type="text"
              className="option-input"
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              placeholder={`Option ${index + 1}`}
            />
            {field.options.length > 1 && (
              <button
                type="button"
                onClick={() => removeOption(index)}
                className="option-remove"
                title="Remove option"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        ))}
      </div>

      <button type="button" onClick={addOption} className="add-option">
        <Plus size={14} />
        Add Option
      </button>
    </div>
  );

  const renderValidationSettings = () => (
    <div className="settings-group">
      <h4>Validation</h4>

      {field.type === "text" && (
        <>
          <div className="mb-3">
            <label className="settings-label">Min Length</label>
            <input
              type="number"
              className="settings-input"
              value={field.validation?.minLength || ""}
              onChange={(e) =>
                handleValidationChange(
                  "minLength",
                  e.target.value ? parseInt(e.target.value) : undefined
                )
              }
              placeholder="0"
              min="0"
            />
          </div>
          <div className="mb-3">
            <label className="settings-label">Max Length</label>
            <input
              type="number"
              className="settings-input"
              value={field.validation?.maxLength || ""}
              onChange={(e) =>
                handleValidationChange(
                  "maxLength",
                  e.target.value ? parseInt(e.target.value) : undefined
                )
              }
              placeholder="No limit"
              min="1"
            />
          </div>
        </>
      )}

      {field.type === "number" && (
        <>
          <div className="mb-3">
            <label className="settings-label">Minimum Value</label>
            <input
              type="number"
              className="settings-input"
              value={field.validation?.min || ""}
              onChange={(e) =>
                handleValidationChange(
                  "min",
                  e.target.value ? parseFloat(e.target.value) : undefined
                )
              }
              placeholder="No minimum"
            />
          </div>
          <div className="mb-3">
            <label className="settings-label">Maximum Value</label>
            <input
              type="number"
              className="settings-input"
              value={field.validation?.max || ""}
              onChange={(e) =>
                handleValidationChange(
                  "max",
                  e.target.value ? parseFloat(e.target.value) : undefined
                )
              }
              placeholder="No maximum"
            />
          </div>
        </>
      )}

      {field.type === "file" && (
        <>
          <div className="mb-3">
            <label className="settings-label">Accepted File Types</label>
            <input
              type="text"
              className="settings-input"
              value={field.validation?.acceptedTypes || ""}
              onChange={(e) =>
                handleValidationChange("acceptedTypes", e.target.value)
              }
              placeholder="e.g., .pdf,.doc,.jpg"
            />
            <p className="text-xs text-gray-500 mt-1">
              Comma-separated file extensions (e.g., .pdf, .jpg, .png)
            </p>
          </div>
          <div className="mb-3">
            <label className="settings-label">Max File Size (MB)</label>
            <input
              type="number"
              className="settings-input"
              value={field.validation?.maxSize || ""}
              onChange={(e) =>
                handleValidationChange(
                  "maxSize",
                  e.target.value ? parseFloat(e.target.value) : undefined
                )
              }
              placeholder="10"
              min="0.1"
              step="0.1"
            />
          </div>
        </>
      )}
    </div>
  );

  const renderStyleSettings = () => (
    <div className="settings-group">
      <h4>Styling</h4>

      <div className="mb-3">
        <label className="settings-label">Width</label>
        <select
          className="settings-input"
          value={field.style?.width || "full"}
          onChange={(e) => handleStyleChange("width", e.target.value)}
        >
          <option value="full">Full Width</option>
          <option value="half">Half Width</option>
          <option value="third">One Third</option>
          <option value="quarter">Quarter Width</option>
        </select>
      </div>

      {["text", "email", "password", "number", "tel", "url"].includes(
        field.type
      ) && (
        <div className="mb-3">
          <label className="settings-label">Input Size</label>
          <select
            className="settings-input"
            value={field.style?.size || "normal"}
            onChange={(e) => handleStyleChange("size", e.target.value)}
          >
            <option value="small">Small</option>
            <option value="normal">Normal</option>
            <option value="large">Large</option>
          </select>
        </div>
      )}

      {field.type === "textarea" && (
        <div className="mb-3">
          <label className="settings-label">Rows</label>
          <input
            type="number"
            className="settings-input"
            value={field.style?.rows || 4}
            onChange={(e) =>
              handleStyleChange("rows", parseInt(e.target.value) || 4)
            }
            min="2"
            max="20"
          />
        </div>
      )}

      {field.type === "spacer" && (
        <div className="mb-3">
          <label className="settings-label">Height (px)</label>
          <input
            type="number"
            className="settings-input"
            value={field.style?.height || 32}
            onChange={(e) =>
              handleStyleChange("height", parseInt(e.target.value) || 32)
            }
            min="8"
            max="200"
          />
        </div>
      )}
    </div>
  );

  return (
    <div className="p-4 space-y-6">
      {renderBasicSettings()}

      {["select", "radio", "checkbox"].includes(field.type) &&
        renderOptionsSettings()}

      {![
        "heading",
        "paragraph",
        "section",
        "divider",
        "image",
        "spacer",
      ].includes(field.type) && renderValidationSettings()}

      {renderStyleSettings()}

      {/* Field Help */}
      <div className="settings-group">
        <h4>Help & Description</h4>
        <div className="mb-3">
          <label className="settings-label">Help Text</label>
          <textarea
            className="settings-input"
            rows="2"
            value={field.helpText || ""}
            onChange={(e) => handleBasicChange("helpText", e.target.value)}
            placeholder="Optional help text for users"
          />
        </div>
      </div>

      {/* Advanced Settings */}
      <div className="settings-group">
        <h4>Advanced</h4>

        <div className="mb-3">
          <label className="settings-label">Field Name/ID</label>
          <input
            type="text"
            className="settings-input"
            value={field.name || field.id}
            onChange={(e) => handleBasicChange("name", e.target.value)}
            placeholder="Unique field identifier"
          />
          <p className="text-xs text-gray-500 mt-1">
            Used for form submission data. Auto-generated if empty.
          </p>
        </div>

        {![
          "heading",
          "paragraph",
          "section",
          "divider",
          "image",
          "spacer",
        ].includes(field.type) && (
          <div className="settings-row">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="settings-checkbox"
                checked={field.disabled || false}
                onChange={(e) =>
                  handleBasicChange("disabled", e.target.checked)
                }
              />
              Disabled field
            </label>
          </div>
        )}

        {![
          "heading",
          "paragraph",
          "section",
          "divider",
          "image",
          "spacer",
        ].includes(field.type) && (
          <div className="settings-row">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="settings-checkbox"
                checked={field.readonly || false}
                onChange={(e) =>
                  handleBasicChange("readonly", e.target.checked)
                }
              />
              Read-only field
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default FieldSettings;
