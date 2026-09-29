import { PlusIcon, SearchIcon, UserIcon } from "./Icons.jsx";

/** The greeting bar: greeting on the left, actions on the right. */
export default function Header({
  greeting,
  subtitle,
  isSearchOpen,
  search,
  onSearchChange,
  onToggleSearch,
  onAddClick,
}) {
  return (
    <header className="header">
      <div>
        <h1 className="header__greeting">{greeting}</h1>
        <p className="header__subtitle">{subtitle}</p>
      </div>

      <div className="header__actions">
        {isSearchOpen && (
          <input
            className="search-field"
            type="search"
            value={search}
            placeholder="Search tasks…"
            aria-label="Search tasks"
            autoFocus
            onChange={(event) => onSearchChange(event.target.value)}
          />
        )}

        <button type="button" className="btn-create" onClick={onAddClick}>
          <PlusIcon size={16} />
          Add task
        </button>

        <button
          type="button"
          className={isSearchOpen ? "icon-circle icon-circle--active" : "icon-circle"}
          onClick={onToggleSearch}
          aria-label={isSearchOpen ? "Close search" : "Search tasks"}
          title={isSearchOpen ? "Close search" : "Search"}
        >
          <SearchIcon size={17} />
        </button>

        <span className="avatar" title="You" aria-hidden="true">
          <UserIcon size={19} />
        </span>
      </div>
    </header>
  );
}
