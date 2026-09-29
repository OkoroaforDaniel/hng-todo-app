import { StatsIcon } from "./Icons.jsx";

/** The big numbers card: what is left, what is done, and the totals. */
export default function OverviewCard({ total, active, completed }) {
  return (
    <section className="card">
      <div className="card__head">
        <StatsIcon size={16} />
        <h2 className="card__title">Overall information</h2>
        <div className="card__tools">
          <span className="pill tnum">{total} on the list</span>
        </div>
      </div>

      <div className="bigstat">
        <div>
          <div className="bigstat__value tnum">{active}</div>
          <div className="bigstat__label">
            {active === 1 ? "task left to do" : "tasks left to do"}
          </div>
        </div>
        <div className="divider-v" />
        <div>
          <div className="bigstat__value tnum">{completed}</div>
          <div className="bigstat__label">tasks completed</div>
        </div>
      </div>

      <div className="mini-stats">
        <div className="mini-stat">
          <div className="mini-stat__value tnum">{total}</div>
          <div className="mini-stat__label">Total</div>
        </div>
        <div className="mini-stat">
          <div className="mini-stat__value tnum">{active}</div>
          <div className="mini-stat__label">In progress</div>
        </div>
        <div className="mini-stat">
          <div className="mini-stat__value tnum">{completed}</div>
          <div className="mini-stat__label">Completed</div>
        </div>
      </div>
    </section>
  );
}
