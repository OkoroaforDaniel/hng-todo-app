import { ArchiveIcon, CheckIcon, DashboardIcon, TasksIcon, TodayIcon } from "./Icons.jsx";

const FILTERS = [
  { id: "all", label: "All tasks", Icon: DashboardIcon },
  { id: "active", label: "Active", Icon: TodayIcon },
  { id: "completed", label: "Completed", Icon: TasksIcon },
];

/**
 * The left panel: the logo, the filters that used to be tabs, a few honest
 * hints about how to use the app, and the "clear completed" action.
 */
export default function Sidebar({ filter, counts, onFilterChange, onClearCompleted }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand__mark">
          <CheckIcon size={17} />
        </span>
        <span className="brand__name">Todo</span>
      </div>

      <nav className="sidebar__nav" aria-label="Filters">
        {FILTERS.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            className={id === filter ? "nav-item nav-item--active" : "nav-item"}
            aria-current={id === filter ? "true" : undefined}
            onClick={() => onFilterChange(id)}
          >
            <Icon size={16} />
            {label}
            <span className="nav-item__count tnum">{counts[id]}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar__group">
        <p className="sidebar__label">Shortcuts</p>
        <div className="hint-item">
          <span className="hint-item__key">Enter</span>
          Add the task
        </div>
        <div className="hint-item">
          <span className="hint-item__key">Dbl-click</span>
          Rename a task
        </div>
        <div className="hint-item">
          <span className="hint-item__key">Drag</span>
          Reorder it
        </div>
      </div>

      <div className="sidebar__group">
        <p className="sidebar__label">Good to know</p>
        <div className="hint-item">Use the three-dot button to rename, move or delete</div>
        <div className="hint-item">Everything saves as you go</div>
      </div>

      <div className="sidebar__spacer" />

      <div className="sidebar__foot">
        <button
          type="button"
          className="nav-item nav-item--danger"
          onClick={onClearCompleted}
          disabled={counts.completed === 0}
        >
          <ArchiveIcon size={16} />
          Clear completed
          <span className="nav-item__count tnum">{counts.completed}</span>
        </button>
      </div>
    </aside>
  );
}
