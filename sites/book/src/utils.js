import React from "react";

export function StoryWithSlider({ max, children }) {
  const [progress, setProgress] = React.useState(0);

  return (
    <div>
      <Slider
        value={progress}
        setValue={value => setProgress(value)}
        max={max}
      />
      <div
        style={{
          height: 180,
          width: 320,
          border: "1px solid black",
          margin: "5px 0"
        }}
      >
        {children(progress)}
      </div>
    </div>
  );
}

function Slider({ value, setValue, max }) {
  return (
    <div>
      <input
        type="range"
        value={value}
        onChange={e => setValue(+e.target.value)}
        max={max}
        step={0.01}
      />
      <span>{Math.round(value * 100) / 100}</span>
    </div>
  );
}
