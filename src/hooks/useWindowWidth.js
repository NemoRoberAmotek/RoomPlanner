import { useState, useEffect } from "react";

const useWindowWidth = () => {
  const [windowSize, setWindowSize] = useState({});

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });

    window.addEventListener("resize", () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    });

    return () =>
      window.removeEventListener("resize", () => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      });
  }, []);

  return windowSize;
};

export default useWindowWidth;
