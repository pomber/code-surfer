import React from "react";

export default function useWindowResize(handler, deps) {
  React.useEffect(() => {
    window.addEventListener("resize", handler);
    return () => {
      window.removeEventListener("resize", handler);
    };
  }, deps);
}
