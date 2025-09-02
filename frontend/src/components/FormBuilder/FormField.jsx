import React from "react";
import { useDrag, useDrop } from "react-dnd";
import {
  Copy,
  Trash2,
  ChevronUp,
  ChevronDown,
  GripVertical,
  Settings,
} from "lucide-react";
import FieldRenderer from "./FieldRenderer";

const FormField = ({
  field,
  index,
  isSelected,
  isPreviewMode,
  onSelect,
  onUpdate,
  onDelete,
  onDuplicate,
  onMove,
  totalFields,
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: "FIELD",
    item: { existingId: field.id, fieldType: field.type, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: "FIELD",
    drop: (draggedItem) => {
      if (draggedItem.existingId && draggedItem.existingId !== field.id) {
        // Handle field reordering - move the dragged field to this position
        const dragIndex = draggedItem.index;
        const dropIndex = index;
        if (dragIndex !== dropIndex) {
          onMove(
            draggedItem.existingId,
            dragIndex < dropIndex ? "down" : "up",
            Math.abs(dropIndex - dragIndex)
          );
        }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const handleMove = (direction) => {
    onMove(field.id, direction);
  };

  const canMoveUp = index > 0;
  const canMoveDown = index < totalFields - 1;

  const combineRefs = (drag, drop) => (node) => {
    drag(node);
    drop(node);
  };

  return (
    <div
      ref={!isPreviewMode ? combineRefs(drag, drop) : null}
      className={`form-field ${isSelected ? "selected" : ""} ${
        isDragging ? "dragging" : ""
      } ${isOver ? "drop-target" : ""} ${isPreviewMode ? "preview-mode" : ""}`}
      onClick={!isPreviewMode ? onSelect : undefined}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: isPreviewMode ? "default" : "pointer",
      }}
    >
      {/* Field Controls */}
      {!isPreviewMode && (
        <div className="field-controls">
          {/* Move Handles */}
          <div className="move-handles">
            <button
              className={`move-handle ${!canMoveUp ? "disabled" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                if (canMoveUp) handleMove("up");
              }}
              disabled={!canMoveUp}
              title="Move up"
            >
              <ChevronUp size={12} />
            </button>
            <button
              className={`move-handle ${!canMoveDown ? "disabled" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                if (canMoveDown) handleMove("down");
              }}
              disabled={!canMoveDown}
              title="Move down"
            >
              <ChevronDown size={12} />
            </button>
          </div>

          {/* Drag Handle */}
          <div className="drag-handle" title="Drag to reorder">
            <GripVertical size={14} />
          </div>

          {/* Action Buttons */}
          <div className="field-actions">
            <button
              className="field-control-btn"
              onClick={(e) => {
                e.stopPropagation();
                onSelect();
              }}
              title="Field settings"
            >
              <Settings size={12} />
            </button>
            <button
              className="field-control-btn"
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate();
              }}
              title="Duplicate field"
            >
              <Copy size={12} />
            </button>
            <button
              className="field-control-btn delete"
              onClick={(e) => {
                e.stopPropagation();
                if (confirm("Are you sure you want to delete this field?")) {
                  onDelete();
                }
              }}
              title="Delete field"
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>
      )}

      {/* Selection Indicator */}
      {!isPreviewMode && isSelected && (
        <div className="selection-indicator">
          <div className="selection-badge">
            <Settings size={12} />
            <span className="text-xs font-medium">Selected</span>
          </div>
        </div>
      )}

      {/* Field Content */}
      <div className="field-content">
        <FieldRenderer
          field={field}
          isPreviewMode={isPreviewMode}
          onUpdate={onUpdate}
        />
      </div>

      {/* Field Type Indicator */}
      {!isPreviewMode && (
        <div className="field-type-indicator">
          <span className="text-xs text-gray-500 font-mono">{field.type}</span>
        </div>
      )}
    </div>
  );
};

export default FormField;
