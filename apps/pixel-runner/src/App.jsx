import GameCanvas from "./components/GameCanvas";
import "./App.css";

export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header__cartridge">CART</div>
        <h1 className="app-header__title">PIXEL RUNNER</h1>
        <div className="app-header__badge">v1.0</div>
      </header>
      <GameCanvas />
      <footer className="app-footer">
        COLLECT COINS · DODGE OBSTACLES · GRAB POWER-UPS
      </footer>
    </div>
  );
}
