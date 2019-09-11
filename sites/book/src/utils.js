import React from "react";
import useSpring from "./use-spring";

const height = 225;
const width = 400;

export function StoryWithSlider({ max, children }) {
  const [{ progress, force }, setProgress] = React.useState({
    progress: 0,
    force: true
  });
  const p = useSpring({
    target: progress,
    current: force ? progress : undefined
    // tension: 80,
    // friction: 50
  });
  return (
    <div>
      <div style={{ width, display: "flex", alignItems: "center" }}>
        <button
          onClick={() =>
            setProgress(({ progress }) => ({
              progress: Math.max(Math.ceil(progress) - 1, 0),
              force: false
            }))
          }
        >
          Prev
        </button>
        <input
          style={{ flex: 1 }}
          type="range"
          value={p}
          onChange={e =>
            setProgress({ progress: +e.target.value, force: true })
          }
          max={max}
          step={0.01}
        />
        <span style={{ width: 40, textAlign: "center" }}>
          {Math.round(p * 100) / 100}
        </span>
        <button
          onClick={() =>
            setProgress(({ progress }) => ({
              progress: Math.min(Math.floor(progress) + 1, max),
              force: false
            }))
          }
        >
          Next
        </button>
      </div>
      <div
        style={{
          height,
          width,
          border: "1px solid black",
          margin: "5px 0"
        }}
      >
        {children(p)}
      </div>
    </div>
  );
}
