import { useState } from "react";

import AddTodoForm from "./AddTodoForm.jsx";
import TodoCard from "./TodoCard.jsx";
import { GridIcon, ListIcon, PlusIcon } from "./Icons.jsx";

/**
 * The board of task cards, plus the drag & drop bookkeeping.
 *
 * Dragging uses the drag-and-drop browsers already have: dragstart remembers
 * which card moved, dragging over a card remembers where it would land, and
 * drop tells the app to swap them.
 */
export default function TodoBoard({
  todos,
  heading,
  searchTerm,
  emptyTitle,
  emptyHint,
  isAdding,
  onStartAdding,
  onCancelAdding,
  onAdd,
  addInputRef,
  onToggle,
  onRename,
  onDelete,
  onMove,
  view,
  onViewChange,
  formatDate,
}) {
  const [dragIndex, setDragIndex] = useState(null); // card being dragged
  const [overIndex, setOverIndex] = useState(null); // card it is hovering over

  function reset() {
    setDragIndex(null);
    setOverIndex(null);
  }

  function handleDragOver(event, index) {
    event.preventDefault(); // without this the browser refuses the drop
    if (index !== overIndex) setOverIndex(index);
  }

  function handleDrop(event, index) {
    event.preventDefault();
    if (dragIndex !== null && dragIndex !== index) onMove(dragIndex, index);
    reset();
  }

  function toggleButtonClass(value) {
    return value === view ? "view-toggle__btn view-toggle__btn--active" : "view-toggle__btn";
  }

  return (
    <section className="section">
      <div className="section__head">
        <h2 className="section__title">
          {heading} <span className="section__count tnum">({todos.length})</span>
        </h2>

        <div className="section__tools">
          {searchTerm && (
            <span className="pill">
              “{searchTerm}” · {todos.length} match{todos.length === 1 ? "" : "es"}
            </span>
          )}
          <div className="view-toggle" role="group" aria-label="Change layout">
            <button
              type="button"
              className={toggleButtonClass("grid")}
              aria-label="Grid view"
              aria-pressed={view === "grid"}
              title="Grid view"
              onClick={() => onViewChange("grid")}
            >
              <GridIcon size={15} />
            </button>
            <button
              type="button"
              className={toggleButtonClass("list")}
              aria-label="List view"
              aria-pressed={view === "list"}
              title="List view"
              onClick={() => onViewChange("list")}
            >
              <ListIcon size={15} />
            </button>
          </div>
        </div>
      </div>

      <div className="board-wrap">
        {todos.length === 0 && (
          <p className="empty">
            <span className="empty__title">{emptyTitle}</span>
            {emptyHint}
          </p>
        )}

        <ul className={view === "list" ? "board board--list" : "board"}>
          {todos.map((todo, index) => (
            <TodoCard
              key={todo.id}
              todo={todo}
              index={index}
              total={todos.length}
              isDragging={dragIndex === index}
              isDropTarget={overIndex === index && dragIndex !== index}
              onToggle={onToggle}
              onRename={onRename}
              onDelete={onDelete}
              onMove={onMove}
              onDragStart={setDragIndex}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onDragEnd={reset}
              formatDate={formatDate}
            />
          ))}

          <li className="board__tile">
            {isAdding ? (
              <AddTodoForm onAdd={onAdd} onCancel={onCancelAdding} inputRef={addInputRef} />
            ) : (
              <button type="button" className="add-tile" onClick={onStartAdding}>
                <PlusIcon size={17} />
                Add task
              </button>
            )}
          </li>
        </ul>
      </div>
    </section>
  );
}
