import React, { useRef, useEffect } from "react";

export default function Deck() {
  const ref = useRef();
  useInterval(() => {
    ref.current.contentWindow.dispatchEvent(
      new KeyboardEvent("keydown", { keyCode: 39 })
    );
  });
  return (
    <iframe
      src="demo/"
      width="100%"
      height="100%"
      style={{ border: 0 }}
      ref={ref}
    />
  );
}

function useInterval(callback, delay = 3000) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }

    let id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay]);
}
