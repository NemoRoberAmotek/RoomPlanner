import { useState, useEffect } from "react";
import useWindowWidth from "./useWindowWidth";

const useRenderAllowed = () => {
  const [renderAllowed, setRenderAllowed] = useState(false);

  const windowWidth = useWindowWidth();

  useEffect(() => {
    if (windowWidth < 1240) {
      setRenderAllowed(false);
    } else {
      setRenderAllowed(true);
    }
  }, [windowWidth]);

  return renderAllowed;
};

export default useRenderAllowed;
