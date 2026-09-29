import { CheckIcon } from "./Icons.jsx";

/** One finished task, as a dark card. */
export default function CompletedCard({ todo, formatDate }) {
  return (
    <article className="dark-card">
      <div className="dark-card__top">
        <h3 className="dark-card__title">{todo.title}</h3>
        <span className="dark-card__badge" aria-hidden="true">
          <CheckIcon size={15} />
        </span>
      </div>

      <div className="dark-card__status">
        <span className="dot dot--live" />
        Completed
      </div>

      <div className="dark-card__desc">Added {formatDate(todo.created_at)}</div>
    </article>
  );
}
