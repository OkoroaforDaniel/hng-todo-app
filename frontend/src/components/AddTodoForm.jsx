import { useState } from "react";

import { PlusIcon } from "./Icons.jsx";

/**
 * The open "+ Add task" tile.
 *
 * It stays open after adding, so a few tasks can be typed in a row, and it
 * closes itself again when you click away with the box still empty.
 */
export default function AddTodoForm({ onAdd, onCancel, inputRef }) {
  const [title, setTitle] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    const trimmed = title.trim();
    if (!trimmed) return; // the backend would reject an empty title anyway

    onAdd(trimmed);
    setTitle("");
  }

  function handleKeyDown(event) {
    if (event.key === "Escape") onCancel();
  }

  function handleBlur() {
    if (!title.trim()) onCancel();
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <label className="add-form__label" htmlFor="new-task">
        New task
      </label>
      <input
        id="new-task"
        ref={inputRef}
        className="add-form__input"
        type="text"
        value={title}
        maxLength={300}
        placeholder="What needs to be done?"
        autoComplete="off"
        onChange={(event) => setTitle(event.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
      />
      <div className="add-form__actions">
        <button className="btn-dark-sm" type="submit" disabled={!title.trim()}>
          <PlusIcon size={15} />
          Add task
        </button>
        <button className="btn-ghost-sm" type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
