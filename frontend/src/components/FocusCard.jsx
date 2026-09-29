import { SparkIcon, TargetIcon } from "./Icons.jsx";

/** "Up next": the first few unfinished tasks, tickable right from the card. */
export default function FocusCard({ todos, onToggle }) {
  return (
    <section className="card card--focus">
      <div className="card__head">
        <TargetIcon size={16} />
        <h2 className="card__title">Up next</h2>
        <div className="card__tools">
          <span className="pill tnum">{todos.length} of 3</span>
        </div>
      </div>

      {todos.length === 0 ? (
        <p className="empty empty--card">
          <span className="empty__title">Nothing waiting</span>
          Every task is done. Add something new whenever you like.
        </p>
      ) : (
        <div className="checklist">
          {todos.map((todo) => (
            <div className="checklist__item" key={todo.id}>
              <input
                className="check"
                type="checkbox"
                checked={todo.completed}
                aria-label={`Mark "${todo.title}" as done`}
                onChange={() => onToggle(todo)}
              />
              <span className="checklist__title">{todo.title}</span>
            </div>
          ))}
        </div>
      )}

      {todos.length > 0 && (
        <div className="legend__row">
          <SparkIcon size={14} />
          Finish one and the list moves on by itself
        </div>
      )}
    </section>
  );
}
