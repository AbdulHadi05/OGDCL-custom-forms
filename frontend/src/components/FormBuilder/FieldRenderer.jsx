import React, { useState, useRef, useEffect } from "react";
import { Upload, X, Download, Trash2 } from "lucide-react";

const FieldRenderer = ({ field, isPreviewMode = false, onUpdate }) => {
  const [localValue, setLocalValue] = useState(field.value || "");
  const [files, setFiles] = useState([]);
  const signatureRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setLocalValue(field.value || "");
  }, [field.value]);

  const handleChange = (value) => {
    setLocalValue(value);
    if (onUpdate) {
      onUpdate({ value });
    }
  };

  const handleFileChange = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);

    if (onUpdate && selectedFiles.length > 0) {
      try {
        const fileDataPromises = selectedFiles.map((file) => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              resolve({
                name: file.name,
                type: file.type,
                size: file.size,
                lastModified: file.lastModified,
                data: reader.result,
              });
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        });

        const filesData = await Promise.all(fileDataPromises);
        onUpdate({ value: filesData });
      } catch (error) {
        console.error("Error processing files:", error);
        onUpdate({ value: selectedFiles.map((f) => f.name).join(", ") });
      }
    }
  };

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    if (onUpdate) {
      onUpdate({ value: newFiles });
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const renderLabel = () => {
    if (!field.label && !["divider", "spacer"].includes(field.type))
      return null;

    return (
      <label className="form-label">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
    );
  };

  const renderHelpText = () => {
    if (!field.helpText) return null;

    return <p className="text-sm text-gray-500 mt-1">{field.helpText}</p>;
  };

  const getFieldWidth = () => {
    const widthMap = {
      full: "w-full",
      half: "w-1/2",
      third: "w-1/3",
      quarter: "w-1/4",
    };
    return widthMap[field.style?.width] || "w-full";
  };

  const getInputSize = () => {
    const sizeMap = {
      small: "px-2 py-1 text-sm",
      normal: "px-3 py-2",
      large: "px-4 py-3 text-lg",
    };
    return sizeMap[field.style?.size] || "px-3 py-2";
  };

  const commonProps = {
    required: field.required,
    disabled: field.disabled || !isPreviewMode,
    readOnly: field.readonly,
    className: `form-input ${getInputSize()} ${
      field.disabled ? "opacity-50" : ""
    }`,
  };

  const containerClass = `field-container ${getFieldWidth()} ${
    field.style?.width === "half" ||
    field.style?.width === "third" ||
    field.style?.width === "quarter"
      ? "inline-block mr-4"
      : "block"
  }`;

  switch (field.type) {
    case "text":
    case "email":
    case "password":
    case "number":
    case "tel":
    case "url":
      return (
        <div className={containerClass}>
          {renderLabel()}
          <input
            type={field.type}
            placeholder={field.placeholder}
            value={localValue}
            onChange={(e) => handleChange(e.target.value)}
            min={field.type === "number" ? field.validation?.min : undefined}
            max={field.type === "number" ? field.validation?.max : undefined}
            minLength={field.validation?.minLength}
            maxLength={field.validation?.maxLength}
            {...commonProps}
          />
          {renderHelpText()}
        </div>
      );

    case "textarea":
      return (
        <div className={containerClass}>
          {renderLabel()}
          <textarea
            placeholder={field.placeholder}
            value={localValue}
            onChange={(e) => handleChange(e.target.value)}
            rows={field.style?.rows || 4}
            minLength={field.validation?.minLength}
            maxLength={field.validation?.maxLength}
            className={`form-textarea ${getInputSize()} resize-vertical`}
            required={field.required}
            disabled={field.disabled || !isPreviewMode}
            readOnly={field.readonly}
          />
          {renderHelpText()}
        </div>
      );

    case "select":
      return (
        <div className={containerClass}>
          {renderLabel()}
          <select
            value={localValue}
            onChange={(e) => handleChange(e.target.value)}
            {...commonProps}
            className="form-select"
          >
            <option value="">
              {field.placeholder || "Select an option..."}
            </option>
            {field.options?.map((option, index) => {
              const optionValue =
                typeof option === "string" ? option : option.value;
              const optionLabel =
                typeof option === "string" ? option : option.label;
              return (
                <option key={index} value={optionValue}>
                  {optionLabel}
                </option>
              );
            })}
          </select>
          {renderHelpText()}
        </div>
      );

    case "radio":
      return (
        <div className={containerClass}>
          {renderLabel()}
          <div className="radio-group">
            {field.options?.map((option, index) => {
              const optionValue =
                typeof option === "string" ? option : option.value;
              const optionLabel =
                typeof option === "string" ? option : option.label;
              return (
                <div key={index} className="radio-item">
                  <input
                    type="radio"
                    id={`${field.id}-${index}`}
                    name={field.name || field.id}
                    value={optionValue}
                    checked={localValue === optionValue}
                    onChange={(e) => handleChange(e.target.value)}
                    disabled={field.disabled || !isPreviewMode}
                    className="form-radio"
                  />
                  <label htmlFor={`${field.id}-${index}`} className="ml-2">
                    {optionLabel}
                  </label>
                </div>
              );
            })}
          </div>
          {renderHelpText()}
        </div>
      );

    case "checkbox":
      const checkboxValues = Array.isArray(localValue) ? localValue : [];
      return (
        <div className={containerClass}>
          {renderLabel()}
          <div className="checkbox-group">
            {field.options?.map((option, index) => {
              const optionValue =
                typeof option === "string" ? option : option.value;
              const optionLabel =
                typeof option === "string" ? option : option.label;
              return (
                <div key={index} className="checkbox-item">
                  <input
                    type="checkbox"
                    id={`${field.id}-${index}`}
                    value={optionValue}
                    checked={checkboxValues.includes(optionValue)}
                    onChange={(e) => {
                      const newValues = e.target.checked
                        ? [...checkboxValues, optionValue]
                        : checkboxValues.filter((v) => v !== optionValue);
                      handleChange(newValues);
                    }}
                    disabled={field.disabled || !isPreviewMode}
                    className="form-checkbox"
                  />
                  <label htmlFor={`${field.id}-${index}`} className="ml-2">
                    {optionLabel}
                  </label>
                </div>
              );
            })}
          </div>
          {renderHelpText()}
        </div>
      );

    case "section":
      if (isPreviewMode) {
        // In preview mode, just show the section header without container styling
        return (
          <div className="section-header mb-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b-2 border-blue-500 pb-2">
              {field.label || "Section Title"}
            </h3>
          </div>
        );
      } else {
        // In builder mode, show as a visual separator/header
        return (
          <div className="section-container border-2 border-dashed border-blue-300 bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-blue-800">
                {field.label || "Section Title"}
              </h3>
              <span className="text-xs text-blue-600 bg-blue-200 px-2 py-1 rounded">
                Section Header
              </span>
            </div>
            <p className="text-sm text-blue-600 italic">
              Fields placed after this section will be grouped under: "
              {field.label || "Section Title"}"
            </p>
          </div>
        );
      }

    case "file":
      return (
        <div className={containerClass}>
          {renderLabel()}
          <div className="file-upload-area">
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              disabled={field.disabled || !isPreviewMode}
              accept={field.validation?.acceptedTypes}
              multiple={field.multiple}
              className="file-upload-input"
            />

            <div
              className="file-upload-zone"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-gray-600 font-medium">
                Click to upload or drag and drop
              </p>
              {field.validation?.acceptedTypes && (
                <p className="text-sm text-gray-500 mt-1">
                  Accepted: {field.validation.acceptedTypes}
                </p>
              )}
              {field.validation?.maxSize && (
                <p className="text-sm text-gray-500">
                  Max size: {field.validation.maxSize} MB
                </p>
              )}
            </div>

            {files.length > 0 && (
              <div className="file-list">
                {files.map((file, index) => (
                  <div key={index} className="file-item">
                    <div className="flex-1">
                      <p className="file-item-name">{file.name}</p>
                      <p className="file-item-size">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                    {isPreviewMode && (
                      <button
                        onClick={() => removeFile(index)}
                        className="file-remove"
                        title="Remove file"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          {renderHelpText()}
        </div>
      );

    case "date":
    case "time":
    case "datetime":
      const inputType =
        field.type === "datetime" ? "datetime-local" : field.type;
      return (
        <div className={containerClass}>
          {renderLabel()}
          <input
            type={inputType}
            value={localValue}
            onChange={(e) => handleChange(e.target.value)}
            {...commonProps}
          />
          {renderHelpText()}
        </div>
      );

    case "range":
      return (
        <div className={containerClass}>
          {renderLabel()}
          <div className="range-container">
            <input
              type="range"
              value={localValue || field.validation?.min || 0}
              onChange={(e) => handleChange(e.target.value)}
              min={field.validation?.min || 0}
              max={field.validation?.max || 100}
              step={field.validation?.step || 1}
              disabled={field.disabled || !isPreviewMode}
              className="form-range w-full"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>{field.validation?.min || 0}</span>
              <span className="font-medium">
                {localValue || field.validation?.min || 0}
              </span>
              <span>{field.validation?.max || 100}</span>
            </div>
          </div>
          {renderHelpText()}
        </div>
      );

    case "signature":
      return (
        <div className={containerClass}>
          {renderLabel()}
          <div className="signature-canvas-container">
            <div className="signature-placeholder">
              <p className="text-gray-500 text-center py-8">
                Signature field - Implementation requires react-signature-canvas
              </p>
            </div>
          </div>
          {renderHelpText()}
        </div>
      );

    case "heading":
      const HeadingTag = field.headingLevel || "h2";
      const headingSizes = {
        h1: "text-3xl font-bold",
        h2: "text-2xl font-semibold",
        h3: "text-xl font-semibold",
      };

      return (
        <div className={containerClass}>
          <HeadingTag
            className={`heading-element ${headingSizes[HeadingTag]} text-gray-900 my-4`}
          >
            {field.label || "Heading Text"}
          </HeadingTag>
        </div>
      );

    case "paragraph":
      return (
        <div className={containerClass}>
          <div className="paragraph-element text-gray-700 my-4 leading-relaxed">
            {field.content?.split("\n").map((line, index) => (
              <React.Fragment key={index}>
                {line}
                {index < field.content.split("\n").length - 1 && <br />}
              </React.Fragment>
            )) || "Paragraph content goes here..."}
          </div>
        </div>
      );

    case "divider":
      return (
        <div className={containerClass}>
          <hr className="divider-element border-t border-gray-300 my-6" />
        </div>
      );

    case "image":
      return (
        <div className={containerClass}>
          {renderLabel()}
          <div className="image-element">
            {field.src ? (
              <img
                src={field.src}
                alt={field.alt || field.label || "Form image"}
                className="max-w-full h-auto rounded border border-gray-200"
              />
            ) : (
              <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <div className="text-gray-400 mb-2">
                  <svg
                    className="w-12 h-12 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <p className="text-gray-500">Image placeholder</p>
                <p className="text-sm text-gray-400 mt-1">
                  Configure image source in field settings
                </p>
              </div>
            )}
          </div>
          {renderHelpText()}
        </div>
      );

    case "spacer":
      const height = field.style?.height || 32;
      return (
        <div className="spacer-element" style={{ height: `${height}px` }} />
      );

    default:
      return (
        <div className={containerClass}>
          <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
            <p className="text-yellow-800">
              Unknown field type:{" "}
              <code className="font-mono">{field.type}</code>
            </p>
          </div>
        </div>
      );
  }
};

export default FieldRenderer;
