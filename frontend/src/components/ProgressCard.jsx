import { ArchiveIcon } from "./Icons.jsx";

// The ring is drawn with one dashed circle: the dash length is the percentage.
const RADIUS = 42;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/** "% done" ring plus the clear-completed button, like the moodboard's ring card. */
export default function ProgressCard({ total, completed, onClearCompleted }) {
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  const month = new Date().toLocaleDateString(undefined, { month: "long" });

  return (
    <section className="card">
      <div className="card__head">
        <h2 className="card__title">Progress</h2>
        <div className="card__tools">
          <span className="pill">{month}</span>
        </div>
      </div>

      <p className="delta tnum">
        {total === 0 ? "Add a task to start tracking" : `${completed} of ${total} done`}
      </p>

      <div className="ring-wrap">
        <svg
          className="ring"
          viewBox="0 0 100 100"
          role="img"
          aria-label={`${percent}% of tasks completed`}
        >
          <circle className="ring__track" cx="50" cy="50" r={RADIUS} />
          {percent > 0 && (
            <circle
              className="ring__value"
              cx="50"
              cy="50"
              r={RADIUS}
              strokeDasharray={`${(percent / 100) * CIRCUMFERENCE} ${CIRCUMFERENCE}`}
            />
          )}
        </svg>
        <span className="ring__label tnum">{percent}%</span>
      </div>

      <div className="legend">
        <div className="legend__row">
          <span className="dot dot--soft" />
          To do
          <strong className="tnum">{total - completed}</strong>
        </div>
        <div className="legend__row">
          <span className="dot dot--ink" />
          Completed
          <strong className="tnum">{completed}</strong>
        </div>
      </div>

      <button
        type="button"
        className="btn-block"
        onClick={onClearCompleted}
        disabled={completed === 0}
      >
        <ArchiveIcon size={16} />
        Clear completed
      </button>
    </section>
  );
}
