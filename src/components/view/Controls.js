import { useRoom } from "../../contexts/RoomProvider";
import { Icon } from "@iconify/react";

const Controls = () => {
  const {
    rotate,
    scale,
    rotateRoomLeft,
    rotateRoomRight,
    zoomRoomIn,
    zoomRoomOut,
    translateX,
    translateY,
    clearTranslate,
    clearAll,
  } = useRoom();

  return (
    <div className="controls">
      <div className="controls-group">
        <div className="controls-button-group">
          <button
            className={`button-icon primary ${rotate === 0 && "disabled"}`}
            onClick={rotateRoomLeft}
          >
            <Icon
              icon="fa6-solid:arrow-rotate-left"
              color="var(--color-primary)"
              height="16"
            />
          </button>
          <button
            className={`button-icon primary ${rotate === 360 && "disabled"}`}
            onClick={rotateRoomRight}
          >
            <Icon
              icon="fa6-solid:arrow-rotate-right"
              color="var(--color-primary)"
              height="16"
            />
          </button>
        </div>
        <div className="controls-button-group">
          <button
            className={`button-icon primary ${scale === 0.2 && "disabled"}`}
            onClick={zoomRoomOut}
          >
            <Icon
              icon="fa6-solid:magnifying-glass-minus"
              color="var(--color-primary)"
              height="16"
            />
          </button>
          <button className="button-icon primary" onClick={zoomRoomIn}>
            <Icon
              icon="fa6-solid:magnifying-glass-plus"
              color="var(--color-primary)"
              height="16"
            />
          </button>
        </div>
        <button
          className="button-icon clear-all-transforms-button danger"
          onClick={clearAll}
        >
          <Icon
            icon="fa6-solid:repeat"
            color="var(--color-danger)"
            height="16"
          />
        </button>
      </div>

      <div
        className="controls-translate-buttons"
        style={{
          transform: `rotate(${
            rotate !== 0 || rotate !== 360 ? rotate : 0
          }deg)`,
        }}
      >
        <div className="controls-translate-row">
          <button className="button-icon up" onClick={() => translateY(100)}>
            <Icon
              icon="fa6-solid:circle-arrow-up"
              color="var(--color-primary)"
              height="16"
            />
          </button>
        </div>

        <div className="controls-translate-row">
          <button className="button-icon" onClick={() => translateX(100)}>
            <Icon
              icon="fa6-solid:circle-arrow-left"
              color="var(--color-primary)"
              height="16"
            />
          </button>
          <button
            className="button-icon clear-translate-btn"
            onClick={clearTranslate}
          >
            <Icon
              icon="fa6-solid:down-left-and-up-right-to-center"
              color="var(--color-primary)"
              height="16"
            />
          </button>
          <button className="button-icon" onClick={() => translateX(-100)}>
            <Icon
              icon="fa6-solid:circle-arrow-right"
              color="var(--color-primary)"
              height="16"
            />
          </button>
        </div>

        <div className="controls-translate-row">
          <button className="button-icon" onClick={() => translateY(-100)}>
            <Icon
              icon="fa6-solid:circle-arrow-down"
              color="var(--color-primary)"
              height="16"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Controls;
