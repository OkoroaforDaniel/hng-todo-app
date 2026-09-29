import { useEffect, useMemo, useRef, useState } from "react";

import * as api from "./api.js";
import CompletedSection from "./components/CompletedSection.jsx";
import FocusCard from "./components/FocusCard.jsx";
import Header from "./components/Header.jsx";
import { CrossIcon } from "./components/Icons.jsx";
import OverviewCard from "./components/OverviewCard.jsx";
import ProgressCard from "./components/ProgressCard.jsx";
import Sidebar from "./components/Sidebar.jsx";
import TodoBoard from "./components/TodoBoard.jsx";
import "./App.css";

const HEADINGS = {
  all: "All tasks",
  active: "Active tasks",
  completed: "Completed tasks",
};

const dateFormatter = new Intl.DateTimeFormat(undefined, { day: "numeric", month: "short" });

/** Turns a timestamp into "Today", "Yesterday" or "27 Aug" for the card pill. */
function formatDate(value) {
  if (!value) return "No date";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "No date";

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return dateFormatter.format(date);
}

function greetingFor(date) {
  const hour = date.getHours();
  if (hour < 12) return "Good morning!";
  if (hour < 18) return "Good afternoon!";
  return "Good evening!";
}

export default function App() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all"); // all | active | completed
  const [view, setView] = useState("grid"); // grid | list
  const [search, setSearch] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [completedOrder, setCompletedOrder] = useState("newest");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const addInputRef = useRef(null);

  /** Ask the backend for the current list. */
  async function loadTodos() {
    try {
      setTodos(await api.getTodos());
    } catch (problem) {
      setError(problem.message);
    }
  }

  // Runs once, the first time the page is shown.
  useEffect(() => {
    loadTodos().finally(() => setIsLoading(false));
  }, []);

  // A brand new (empty) list opens the "+ Add task" tile straight away.
  useEffect(() => {
    if (!isLoading && todos.length === 0) setIsAdding(true);
  }, [isLoading, todos.length]);

  useEffect(() => {
    if (isAdding) addInputRef.current?.focus();
  }, [isAdding]);

  /**
   * Every change goes to the API through here. If a save fails we show the
   * reason and reload from the database, so the screen can never drift out of
   * sync with what is actually stored.
   */
  async function save(work) {
    try {
      setError("");
      await work();
    } catch (problem) {
      setError(problem.message);
      await loadTodos();
    }
  }

  /** Swap one todo in the list for a newer version of it. */
  function replace(todo) {
    setTodos((current) => current.map((item) => (item.id === todo.id ? todo : item)));
  }

  function handleAdd(title) {
    save(async () => {
      const created = await api.createTodo(title);
      // The backend decides the final position, so use what it sends back.
      setTodos((current) => [...current, created]);
    });
  }

  function handleToggle(todo) {
    const completed = !todo.completed;
    replace({ ...todo, completed }); // show it immediately...
    save(async () => replace(await api.updateTodo(todo.id, { completed })));
  }

  function handleRename(todo, title) {
    replace({ ...todo, title });
    save(async () => replace(await api.updateTodo(todo.id, { title })));
  }

  function handleDelete(todo) {
    setTodos((current) => current.filter((item) => item.id !== todo.id));
    save(() => api.deleteTodo(todo.id));
  }

  /** Move the task at index `from` so that it sits at index `to`. */
  function handleMove(from, to) {
    if (to < 0 || to >= todos.length) return; // already at the top or bottom

    const reordered = [...todos];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(to, 0, moved);
    handleReorder(reordered.map((item) => item.id));
  }

  function handleReorder(ids) {
    const byId = new Map(todos.map((item) => [item.id, item]));
    setTodos(ids.map((id) => byId.get(id))); // show the new order immediately...
    save(async () => setTodos(await api.reorderTodos(ids)));
  }

  function handleClearCompleted() {
    const done = todos.filter((todo) => todo.completed);
    if (done.length === 0) return;

    setTodos(todos.filter((todo) => !todo.completed));
    save(async () => {
      await Promise.all(done.map((todo) => api.deleteTodo(todo.id)));
      setTodos(await api.getTodos());
    });
  }

  function startAdding() {
    setIsAdding(true);
    // If the tile is already open the effect above will not run again.
    addInputRef.current?.focus();
  }

  const counts = useMemo(() => {
    const completed = todos.filter((todo) => todo.completed).length;
    return { all: todos.length, active: todos.length - completed, completed };
  }, [todos]);

  /** The tasks the board shows: the chosen filter, narrowed by the search box. */
  const visibleTodos = useMemo(() => {
    const needle = search.trim().toLowerCase();

    return todos.filter((todo) => {
      if (filter === "active" && todo.completed) return false;
      if (filter === "completed" && !todo.completed) return false;
      if (needle && !todo.title.toLowerCase().includes(needle)) return false;
      return true;
    });
  }, [todos, filter, search]);

  const focusTodos = useMemo(
    () => todos.filter((todo) => !todo.completed).slice(0, 3),
    [todos],
  );

  const completedTodos = useMemo(
    () =>
      todos
        .filter((todo) => todo.completed)
        .sort((a, b) => {
          const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
          const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
          return completedOrder === "newest" ? bTime - aTime : aTime - bTime;
        }),
    [todos, completedOrder],
  );

  const recentCompleted = useMemo(() => completedTodos.slice(0, 3), [completedTodos]);

  const trimmedSearch = search.trim();

  const emptyTitle = trimmedSearch
    ? `No tasks match “${trimmedSearch}”`
    : filter === "completed"
      ? "Nothing completed yet"
      : filter === "active"
        ? "Nothing left to do"
        : "Your board is empty";

  const emptyHint = trimmedSearch
    ? "Try another word, or close the search box."
    : filter === "completed"
      ? "Tick a task and it will show up here."
      : "Use the dashed tile below to add your first task.";

  const subtitle = isLoading
    ? "Loading your tasks…"
    : counts.active === 0
      ? "Everything is done — nice work."
      : `${counts.active} ${counts.active === 1 ? "task" : "tasks"} left to get through.`;

  const greeting = greetingFor(new Date());

  return (
    <div className="page">
      <div className="shell">
        <Sidebar
          filter={filter}
          counts={counts}
          onFilterChange={setFilter}
          onClearCompleted={handleClearCompleted}
        />

        <main className="main">
          <Header
            greeting={greeting}
            subtitle={subtitle}
            isSearchOpen={isSearchOpen}
            search={search}
            onSearchChange={setSearch}
            onToggleSearch={() => {
              setIsSearchOpen((open) => !open);
              setSearch("");
            }}
            onAddClick={startAdding}
          />

          {error && (
            <p className="alert" role="alert">
              <span>{error}</span>
              <button
                type="button"
                className="mini-icon-btn alert__close"
                onClick={() => setError("")}
                aria-label="Dismiss message"
              >
                <CrossIcon size={15} />
              </button>
            </p>
          )}

          <div className="stats-row">
            <OverviewCard total={counts.all} active={counts.active} completed={counts.completed} />
            <ProgressCard
              total={counts.all}
              completed={counts.completed}
              onClearCompleted={handleClearCompleted}
            />
            <FocusCard todos={focusTodos} onToggle={handleToggle} />
          </div>

          {isLoading ? (
            <p className="empty">Loading your tasks…</p>
          ) : (
            <TodoBoard
              todos={visibleTodos}
              heading={HEADINGS[filter]}
              searchTerm={trimmedSearch}
              emptyTitle={emptyTitle}
              emptyHint={emptyHint}
              isAdding={isAdding}
              onStartAdding={startAdding}
              onCancelAdding={() => setIsAdding(false)}
              onAdd={handleAdd}
              addInputRef={addInputRef}
              onToggle={handleToggle}
              onRename={handleRename}
              onDelete={handleDelete}
              onMove={handleMove}
              view={view}
              onViewChange={setView}
              formatDate={formatDate}
            />
          )}

          {!isLoading && counts.completed > 0 && filter !== "completed" && (
            <CompletedSection
              todos={recentCompleted}
              total={counts.completed}
              order={completedOrder}
              onOrderChange={setCompletedOrder}
              formatDate={formatDate}
            />
          )}
        </main>
      </div>
    </div>
  );

}

