import { useEffect } from "react";

import { ArrowDownIcon, ArrowUpIcon, PencilIcon, TrashIcon } from "./Icons.jsx";

/**
 * The small popover behind the ⋮ button.
 *
 * It closes itself when you click anywhere else on the page or press Escape.
 */
export default function CardMenu({
  canMoveUp,
  canMoveDown,
  onRename,
  onMoveUp,
  onMoveDown,
  onDelete,
  onClose,
}) {
  useEffect(() => {
    function handleMouseDown(event) {
      if (!event.target.closest(".menu")) onClose();
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="menu" aria-label="Task options">
      <button className="menu__item" type="button" onClick={onRename}>
        <PencilIcon size={15} />
        Rename
      </button>
      <button
        className="menu__item"
        type="button"
        onClick={onMoveUp}
        disabled={!canMoveUp}
      >
        <ArrowUpIcon size={15} />
        Move up
      </button>
      <button
        className="menu__item"
        type="button"
        onClick={onMoveDown}
        disabled={!canMoveDown}
      >
        <ArrowDownIcon size={15} />
        Move down
      </button>
      <div className="menu__sep" />
      <button className="menu__item menu__item--danger" type="button" onClick={onDelete}>
        <TrashIcon size={15} />
        Delete
      </button>
    </div>
  );
}
