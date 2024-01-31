import React from "react";

export default function useWindowSize() {
  const isssr = typeof window === 'undefined' ? true : false;

  const [windowSize, setWindowSize] = React.useState({
    width: !isssr ? window.innerWidth : undefined,
    height: !isssr ? window.innerHeight : undefined,
  });

  if (isssr) return windowSize;

  function changeWindowSize() {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
  }

  React.useEffect(() => {
    window.addEventListener("resize", changeWindowSize);

    return () => {
      window.removeEventListener("resize", changeWindowSize);
    };
  }, []);

  return windowSize;
}