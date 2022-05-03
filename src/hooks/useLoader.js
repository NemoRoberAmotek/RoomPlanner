import BounceLoader from "react-spinners/BounceLoader";
import { css } from "@emotion/react";

const useLoader = () => {
  const center = css`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  `;

  return <BounceLoader css={center} />;
};

export default useLoader;
