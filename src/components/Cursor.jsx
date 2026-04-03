import { useEffect, useRef } from "react";

export default function Cursor() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    let mx = 0, my = 0;
    let rx = 0, ry = 0;
    let raf;

    function onMove(e) { mx = e.clientX; my = e.clientY; }
    document.addEventListener("mousemove", onMove);

    function loop() {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      if (dotRef.current) {
        dotRef.current.style.left = mx + "px";
        dotRef.current.style.top  = my + "px";
      }
      if (ringRef.current) {
        ringRef.current.style.left = rx + "px";
        ringRef.current.style.top  = ry + "px";
      }
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
    return () => { document.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, []);

  return (
    <>
      <div ref={dotRef}  className="cursor" style={{position:"fixed",pointerEvents:"none",zIndex:9999}}><div className="cursor__dot" /></div>
      <div ref={ringRef} className="cursor" style={{position:"fixed",pointerEvents:"none",zIndex:9998}}><div className="cursor__ring" /></div>
    </>
  );
}
