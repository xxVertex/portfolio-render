import { useEffect, useRef, useCallback, useState } from "react";
import {
  createGameState, resetGame, updateGame, saveScore,
  renderGame, renderStartScreen, renderDeadScreen,
} from "../game/engine";
import { CANVAS_W, CANVAS_H } from "../game/constants";
import Leaderboard from "./Leaderboard";

export default function GameCanvas() {
  const canvasRef = useRef(null);
  const stateRef = useRef(createGameState());
  const keysRef = useRef({ jump: false, slide: false });
  const rafRef = useRef(null);
  const frameRef = useRef(0);
  const lastJumpRef = useRef(false);
  const lastSlideRef = useRef(false);
  const [uiState, setUiState] = useState("start"); // start | playing | dead | leaderboard
  const [nameInput, setNameInput] = useState("");
  const [scoreSaved, setScoreSaved] = useState(false);
  const [leaderboard, setLeaderboard] = useState(
    JSON.parse(localStorage.getItem("pixelrunner-lb") || "[]")
  );

  const jump = useCallback(() => {
    keysRef.current.jump = true;
    setTimeout(() => { keysRef.current.jump = false; }, 80);
  }, []);

  const slide = useCallback(() => {
    keysRef.current.slide = true;
    setTimeout(() => { keysRef.current.slide = false; }, 50);
  }, []);

  // Game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;

    function loop() {
      frameRef.current++;
      const s = stateRef.current;

      if (!s.started) {
        renderStartScreen(ctx, s.hiScore, frameRef.current);
      } else if (s.dead) {
        renderGame(ctx, s);
        renderDeadScreen(ctx, s, frameRef.current);
        setUiState("dead");
      } else {
        const updated = updateGame(s, keysRef.current);
        stateRef.current = updated;
        renderGame(ctx, updated);
        if (updated.dead) setUiState("dead");
      }

      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // Keyboard input
  useEffect(() => {
    function onKeyDown(e) {
      if (["Space", "ArrowUp", "KeyW"].includes(e.code)) {
        e.preventDefault();
        const s = stateRef.current;
        if (!s.started || s.dead) {
          startOrRestart();
        } else {
          jump();
        }
      }
      if (["ArrowDown", "KeyS"].includes(e.code)) {
        e.preventDefault();
        slide();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [jump, slide]);

  function startOrRestart() {
    stateRef.current = resetGame(stateRef.current);
    setUiState("playing");
    setScoreSaved(false);
    setNameInput("");
  }

  function handleSaveScore() {
    const name = nameInput.trim() || "ANON";
    const lb = saveScore(stateRef.current, name);
    setLeaderboard(lb);
    stateRef.current.leaderboard = lb;
    setScoreSaved(true);
  }

  // Touch controls
  let touchStartY = 0;
  function handleTouchStart(e) {
    e.preventDefault();
    touchStartY = e.touches[0].clientY;
    const s = stateRef.current;
    if (!s.started || s.dead) { startOrRestart(); return; }
  }
  function handleTouchEnd(e) {
    e.preventDefault();
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (dy > 30) slide();
    else jump();
  }

  const score = Math.floor(stateRef.current?.score || 0);

  return (
    <div className="game-wrap">
      <div className="crt-frame">
        <div className="screen-inner">
          <canvas
            ref={canvasRef}
            width={CANVAS_W}
            height={CANVAS_H}
            className="game-canvas"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          />
        </div>
      </div>

      {/* Controls row */}
      <div className="controls-row">
        <div className="controls-hint">
          <span>SPACE / ↑ = JUMP</span>
          <span>↓ = SLIDE</span>
          <span>DOUBLE JUMP IN AIR</span>
        </div>
        <div className="touch-btns">
          <button className="touch-btn" onTouchStart={(e) => { e.preventDefault(); slide(); }} onClick={slide}>▼ SLIDE</button>
          <button className="touch-btn touch-btn--jump" onTouchStart={(e) => { e.preventDefault(); jump(); }} onClick={jump}>▲ JUMP</button>
        </div>
      </div>

      {/* Dead overlay — save score */}
      {uiState === "dead" && !scoreSaved && (
        <div className="overlay">
          <div className="overlay__panel">
            <p className="overlay__label">ENTER YOUR NAME</p>
            <input
              className="overlay__input"
              maxLength={8}
              placeholder="PLAYER1"
              value={nameInput}
              onChange={e => setNameInput(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === "Enter" && handleSaveScore()}
              autoFocus
            />
            <div className="overlay__btns">
              <button className="pixel-btn" onClick={handleSaveScore}>SAVE SCORE</button>
              <button className="pixel-btn pixel-btn--dim" onClick={startOrRestart}>SKIP</button>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard panel */}
      <Leaderboard
        leaderboard={leaderboard}
        currentScore={uiState === "dead" ? score : null}
        onPlay={startOrRestart}
      />
    </div>
  );
}
