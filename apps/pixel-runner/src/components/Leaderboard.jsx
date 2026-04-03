import { useState } from "react";

export default function Leaderboard({ leaderboard, currentScore, onPlay }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="leaderboard-wrap">
      <button className="pixel-btn pixel-btn--sm" onClick={() => setOpen(o => !o)}>
        {open ? "▲ HIDE" : "▼ LEADERBOARD"}
      </button>

      {open && (
        <div className="leaderboard">
          <div className="leaderboard__title">🏆 HIGH SCORES</div>
          {leaderboard.length === 0 && (
            <div className="leaderboard__empty">NO SCORES YET — PLAY TO RANK!</div>
          )}
          {leaderboard.map((entry, i) => (
            <div
              key={i}
              className={`lb-row ${currentScore === entry.score ? "lb-row--current" : ""}`}
            >
              <span className="lb-row__rank">
                {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
              </span>
              <span className="lb-row__name">{entry.name}</span>
              <span className="lb-row__score">{entry.score.toString().padStart(6, "0")}</span>
            </div>
          ))}
          <button className="pixel-btn" style={{ marginTop: 12, width: "100%" }} onClick={onPlay}>
            ▶ PLAY AGAIN
          </button>
        </div>
      )}
    </div>
  );
}
