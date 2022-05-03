import { useState, useEffect } from "react";

const useRenderAllowed = () => {
  const [screenWidth, setScreenWidth] = useState();
  const [renderAllowed, setRenderAllowed] = useState(false);

  useEffect(() => {
    setScreenWidth(window.innerWidth);
    window.addEventListener("resize", () => setScreenWidth(window.innerWidth));
    return () => "resize", () => setScreenWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    if (screenWidth < 1240) {
      setRenderAllowed(false);
    } else {
      setRenderAllowed(true);
    }
  }, [screenWidth]);

  return renderAllowed;
};

export default useRenderAllowed;
