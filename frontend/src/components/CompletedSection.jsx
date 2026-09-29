import CompletedCard from "./CompletedCard.jsx";
import { ChevronDownIcon } from "./Icons.jsx";

/** The dark band at the bottom: the most recently finished tasks. */
export default function CompletedSection({ todos, total, order, onOrderChange, formatDate }) {
  return (
    <section className="section">
      <div className="section__head">
        <h2 className="section__title">
          Recently completed <span className="section__count tnum">({total})</span>
        </h2>
        <div className="section__tools">
          <div className="select-wrap">
            <select
              className="select-pill"
              value={order}
              aria-label="Sort completed tasks"
              onChange={(event) => onOrderChange(event.target.value)}
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
            <span className="select-wrap__icon">
              <ChevronDownIcon size={14} />
            </span>
          </div>
        </div>
      </div>

      <div className="done-band">
        {todos.map((todo) => (
          <CompletedCard key={todo.id} todo={todo} formatDate={formatDate} />
        ))}
      </div>
    </section>
  );
}
