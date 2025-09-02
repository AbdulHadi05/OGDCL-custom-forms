import React from "react";
import { useDrag } from "react-dnd";
import {
  Type,
  Mail,
  Lock,
  Hash,
  Phone,
  Link,
  FileText,
  ChevronDown,
  Circle,
  Square,
  Upload,
  Calendar,
  Clock,
  Sliders,
  PenTool,
  Image,
  Minus,
  AlignLeft,
  Divide,
  Layers,
} from "lucide-react";
import FieldSettings from "./FieldSettings";

const fieldTypes = {
  "Basic Fields": [
    { type: "text", label: "Text Input", icon: Type },
    { type: "email", label: "Email", icon: Mail },
    { type: "password", label: "Password", icon: Lock },
    { type: "number", label: "Number", icon: Hash },
    { type: "tel", label: "Phone", icon: Phone },
    { type: "url", label: "URL", icon: Link },
    { type: "textarea", label: "Textarea", icon: FileText },
  ],
  "Choice Fields": [
    { type: "select", label: "Dropdown", icon: ChevronDown },
    { type: "radio", label: "Radio Buttons", icon: Circle },
    { type: "checkbox", label: "Checkboxes", icon: Square },
  ],
  "Advanced Fields": [
    { type: "file", label: "File Upload", icon: Upload },
    { type: "date", label: "Date", icon: Calendar },
    { type: "time", label: "Time", icon: Clock },
    { type: "datetime", label: "Date & Time", icon: Calendar },
    { type: "range", label: "Range Slider", icon: Sliders },
    { type: "signature", label: "Signature", icon: PenTool },
  ],
  "Layout Elements": [
    { type: "section", label: "Section", icon: Layers },
    { type: "heading", label: "Heading", icon: Type },
    { type: "paragraph", label: "Paragraph", icon: AlignLeft },
    { type: "divider", label: "Divider", icon: Minus },
    { type: "image", label: "Image", icon: Image },
    { type: "spacer", label: "Spacer", icon: Divide },
  ],
};

const DraggableFieldItem = ({ fieldType, label, Icon, addField }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "FIELD",
    item: { fieldType },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`field-item ${isDragging ? "opacity-50" : ""}`}
      onClick={() => addField(fieldType)}
    >
      <div className="field-item-icon">
        <Icon size={16} />
      </div>
      <div className="field-item-label">{label}</div>
    </div>
  );
};

const Sidebar = ({ addField, selectedField, formFields, updateField }) => {
  const selectedFieldData = formFields.find(
    (field) => field.id === selectedField
  );

  return (
    <div className="sidebar">
      {/* Field Types */}
      <div className="field-category">
        <h3>Form Fields</h3>
        {Object.entries(fieldTypes).map(([category, fields]) => (
          <div key={category} className="mb-6">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-4">
              {category}
            </h4>
            <div className="space-y-1">
              {fields.map(({ type, label, icon }) => (
                <DraggableFieldItem
                  key={type}
                  fieldType={type}
                  label={label}
                  Icon={icon}
                  addField={addField}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Field Settings */}
      {selectedFieldData && (
        <div className="field-category border-t border-gray-200">
          <h3>Field Settings</h3>
          <div className="field-settings">
            <FieldSettings
              field={selectedFieldData}
              updateField={updateField}
            />
          </div>
        </div>
      )}

      {/* Help Text */}
      {!selectedFieldData && (
        <div className="field-category border-t border-gray-200">
          <h3>Getting Started</h3>
          <div className="p-4 text-sm text-gray-600 space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-xs font-bold">1</span>
              </div>
              <p>Click or drag fields from above to add them to your form</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-xs font-bold">2</span>
              </div>
              <p>Select a field to customize its settings here</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-xs font-bold">3</span>
              </div>
              <p>Use the toolbar to preview and publish your form</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
