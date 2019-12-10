import React from "react";

export default function useWindowSize() {
  const isClient = typeof window === "object";

  function getSize() {
    return [
      isClient ? window.innerWidth : undefined,
      isClient ? window.innerHeight : undefined
    ];
  }

  const [windowSize, setWindowSize] = React.useState(getSize);

  React.useEffect(() => {
    if (!isClient) {
      return false;
    }

    function handleResize() {
      setWindowSize(getSize());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}
