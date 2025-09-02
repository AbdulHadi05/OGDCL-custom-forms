import React from "react";
import { useDrop } from "react-dnd";
import { PlusIcon } from "lucide-react";
import FormField from "./FormField";

const FormCanvas = ({
  formFields,
  selectedField,
  setSelectedField,
  addField,
  updateField,
  deleteField,
  moveField,
  duplicateField,
  formTitle,
  formDescription,
  isPreviewMode = false,
}) => {
  const [{ isOver }, drop] = useDrop({
    accept: "FIELD",
    drop: (item, monitor) => {
      if (!monitor.didDrop()) {
        // Check if it's a new field from sidebar or moving existing field
        if (item.existingId) {
          // This is moving an existing field - handle in FormField component
          return;
        } else {
          // This is a new field from sidebar
          addField(item.fieldType);
        }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  // Group fields by sections for preview mode only
  const groupFieldsBySection = (fields) => {
    if (!isPreviewMode) return null;

    const groups = [];
    let currentSection = null;
    let currentFields = [];

    fields.forEach((field) => {
      if (field.type === "section") {
        // Save previous section/group
        if (currentFields.length > 0) {
          groups.push({
            section: currentSection,
            fields: currentFields,
          });
        }
        // Start new section
        currentSection = field;
        currentFields = [];
      } else {
        // Check if field belongs to current section or is independent
        if (field.belongsToSection !== false && currentSection) {
          currentFields.push(field);
        } else {
          // Independent field - add previous section if exists, then add this field as independent
          if (currentSection && currentFields.length === 0) {
            // Section with no fields yet
            currentFields.push(field);
          } else {
            // Save current section if has fields
            if (currentFields.length > 0 && currentSection) {
              groups.push({
                section: currentSection,
                fields: currentFields,
              });
            }
            // Add independent field
            groups.push({
              section: null,
              fields: [field],
            });
            currentSection = null;
            currentFields = [];
          }
        }
      }
    });

    // Add the last section/group
    if (currentSection || currentFields.length > 0) {
      groups.push({
        section: currentSection,
        fields: currentFields,
      });
    }

    return groups;
  };

  const fieldGroups = groupFieldsBySection(formFields);

  const EmptyCanvas = () => (
    <div className="flex flex-col items-center justify-center h-96 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
      <PlusIcon className="h-12 w-12 mb-4" />
      <p className="text-lg font-medium">Start Building Your Form</p>
      <p className="text-sm">Drag and drop fields from the sidebar</p>
    </div>
  );

  const handleCanvasClick = () => {
    if (!isPreviewMode && selectedField) {
      setSelectedField(null);
    }
  };

  if (!formFields || formFields.length === 0) {
    return (
      <div className="form-canvas">
        <div
          ref={drop}
          onClick={handleCanvasClick}
          className={`canvas-content ${isOver ? "bg-blue-50" : ""}`}
        >
          <EmptyCanvas />
        </div>
      </div>
    );
  }

  // Preview mode with sections
  if (isPreviewMode && fieldGroups) {
    return (
      <div className="form-canvas">
        <div className="canvas-content space-y-8">
          {/* Form Title and Description */}
          {formTitle && (
            <div className="mb-8 border-b-2 border-gray-200 pb-4">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {formTitle}
              </h1>
              {formDescription && (
                <p className="text-gray-600 text-lg">{formDescription}</p>
              )}
            </div>
          )}

          {/* Grouped Fields by Section */}
          {fieldGroups.map((group, groupIndex) => (
            <div key={groupIndex}>
              {group.section && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-blue-200 pb-2">
                    {group.section.label}
                  </h3>
                </div>
              )}
              <div className="space-y-4">
                {group.fields.map((field) => (
                  <div key={field.id} className="bg-white">
                    <FormField
                      field={field}
                      index={0}
                      isSelected={false}
                      isPreviewMode={true}
                      onSelect={() => {}}
                      onUpdate={(updates) => updateField(field.id, updates)}
                      onDelete={() => {}}
                      onDuplicate={() => {}}
                      onMove={() => {}}
                      totalFields={group.fields.length}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Builder mode - normal field list with all controls
  return (
    <div className="form-canvas">
      <div
        ref={drop}
        onClick={handleCanvasClick}
        className={`canvas-content space-y-4 ${isOver ? "bg-blue-50" : ""}`}
      >
        {/* Form Title and Description */}
        {formTitle && (
          <div className="mb-8 border-b-2 border-gray-200 pb-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {formTitle}
            </h1>
            {formDescription && (
              <p className="text-gray-600 text-lg">{formDescription}</p>
            )}
          </div>
        )}

        {/* Fields with full builder controls */}
        {formFields.map((field, index) => (
          <FormField
            key={field.id}
            field={field}
            index={index}
            isSelected={selectedField === field.id}
            isPreviewMode={false}
            onSelect={() => setSelectedField(field.id)}
            onUpdate={(updates) => updateField(field.id, updates)}
            onDelete={() => deleteField(field.id)}
            onDuplicate={() => duplicateField(field.id)}
            onMove={(fieldId, direction) => moveField(fieldId, direction)}
            totalFields={formFields.length}
          />
        ))}
      </div>
    </div>
  );
};

export default FormCanvas;
