import { useEffect, useRef, useState } from "react";

import CardMenu from "./CardMenu.jsx";
import { DotsIcon, GripIcon } from "./Icons.jsx";

/**
 * One task on the board: tick it, rename it, move it, delete it.
 *
 * The card itself is draggable (see TodoBoard) and the ⋮ menu repeats the
 * moving actions so they also work from the keyboard.
 */
export default function TodoCard({
  todo,
  index,
  total,
  isDragging,
  isDropTarget,
  onToggle,
  onRename,
  onDelete,
  onMove,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  formatDate,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(todo.title);
  const inputRef = useRef(null);

  // If the task changes behind our back, keep the draft in step.
  useEffect(() => {
    setDraft(todo.title);
  }, [todo.title]);

  // Put the cursor in the box as soon as editing starts.
  useEffect(() => {
    if (isEditing) inputRef.current?.select();
  }, [isEditing]);

  function startEditing() {
    setIsMenuOpen(false);
    setDraft(todo.title);
    setIsEditing(true);
  }

  function commitEdit() {
    setIsEditing(false);
    const trimmed = draft.trim();

    if (!trimmed || trimmed === todo.title) {
      setDraft(todo.title); // nothing changed: put the old text back
      return;
    }
    onRename(todo, trimmed);
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      commitEdit();
    }
    if (event.key === "Escape") {
      setDraft(todo.title);
      setIsEditing(false);
    }
  }

  const classes = [
    "task",
    todo.completed ? "task--done" : "",
    isDragging ? "task--dragging" : "",
    isDropTarget ? "task--drop-target" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <li
      className={classes}
      draggable={!isEditing}
      onDragStart={() => onDragStart(index)}
      onDragOver={(event) => onDragOver(event, index)}
      onDrop={(event) => onDrop(event, index)}
      onDragEnd={onDragEnd}
    >
      <div className="task__top">
        <input
          className="check"
          type="checkbox"
          checked={todo.completed}
          aria-label={`Mark "${todo.title}" as ${todo.completed ? "not done" : "done"}`}
          onChange={() => onToggle(todo)}
        />
        <button
          type="button"
          className="mini-icon-btn task__menu-btn"
          aria-label={`Options for "${todo.title}"`}
          aria-expanded={isMenuOpen}
          title="Options"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <DotsIcon size={16} />
        </button>
      </div>

      {isEditing ? (
        <input
          ref={inputRef}
          className="task__edit"
          type="text"
          value={draft}
          maxLength={300}
          aria-label="Edit task"
          onChange={(event) => setDraft(event.target.value)}
          onBlur={commitEdit}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <span
          className="task__title"
          title="Double-click to rename"
          onDoubleClick={startEditing}
        >
          {todo.title}
        </span>
      )}

      <div className="task__foot">
        <span className="task__date">{formatDate(todo.created_at)}</span>
        <span className="task__grip" title="Drag to reorder" aria-hidden="true">
          <GripIcon size={15} />
        </span>
      </div>

      {isMenuOpen && (
        <CardMenu
          canMoveUp={index > 0}
          canMoveDown={index < total - 1}
          onRename={startEditing}
          onMoveUp={() => {
            setIsMenuOpen(false);
            onMove(index, index - 1);
          }}
          onMoveDown={() => {
            setIsMenuOpen(false);
            onMove(index, index + 1);
          }}
          onDelete={() => {
            setIsMenuOpen(false);
            onDelete(todo);
          }}
          onClose={() => setIsMenuOpen(false)}
        />
      )}
    </li>
  );
}
