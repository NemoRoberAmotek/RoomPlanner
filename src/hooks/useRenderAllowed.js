import { useState, useEffect } from "react";
import useWindowWidth from "./useWindowWidth";

const useRenderAllowed = () => {
  const [renderAllowed, setRenderAllowed] = useState(false);

  const { width } = useWindowWidth();

  useEffect(() => {
    if (width < 1240) {
      setRenderAllowed(false);
    } else {
      setRenderAllowed(true);
    }
  }, [width]);

  return renderAllowed;
};

export default useRenderAllowed;
