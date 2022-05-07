import { useRoom } from "../../contexts/RoomProvider";
import { Icon } from "@iconify/react";
import { useEffect } from "react";

const Controls = () => {
  const {
    rotate,
    scale,
    rotateRoomLeft,
    rotateRoomRight,
    zoomRoomIn,
    zoomRoomOut,
    runTranslate,
    clearTranslate,
    clearAll,
    roomControlKeyEvents,
  } = useRoom();

  useEffect(() => {
    window.addEventListener("keydown", roomControlKeyEvents);
  }, [roomControlKeyEvents]);

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
            <div className="tooltip">
              <small>A</small>
            </div>
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
            <div className="tooltip">
              <small>R</small>
            </div>
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
            <div className="tooltip">
              <small>-</small>
            </div>
          </button>
          <button className="button-icon primary" onClick={zoomRoomIn}>
            <Icon
              icon="fa6-solid:magnifying-glass-plus"
              color="var(--color-primary)"
              height="16"
            />
            <div className="tooltip">
              <small>+</small>
            </div>
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

      <div className="controls-translate-buttons">
        <div className="controls-translate-row">
          <button
            className="button-icon up"
            onClick={() => runTranslate(100, "up")}
          >
            <Icon
              icon="fa6-solid:circle-arrow-up"
              color="var(--color-primary)"
              height="16"
            />
            <div className="tooltip">
              <small>Arrow Up</small>
            </div>
          </button>
        </div>

        <div className="controls-translate-row">
          <button
            className="button-icon"
            onClick={() => runTranslate(100, "left")}
          >
            <Icon
              icon="fa6-solid:circle-arrow-left"
              color="var(--color-primary)"
              height="16"
            />
            <div className="tooltip">
              <small>Arrow Left</small>
            </div>
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
            <div className="tooltip">
              <small>C</small>
            </div>
          </button>
          <button
            className="button-icon"
            onClick={() => runTranslate(100, "right")}
          >
            <Icon
              icon="fa6-solid:circle-arrow-right"
              color="var(--color-primary)"
              height="16"
            />
            <div className="tooltip">
              <small>Arrow Right</small>
            </div>
          </button>
        </div>

        <div className="controls-translate-row">
          <button
            className="button-icon"
            onClick={() => runTranslate(100, "down")}
          >
            <Icon
              icon="fa6-solid:circle-arrow-down"
              color="var(--color-primary)"
              height="16"
            />
            <div className="tooltip">
              <small>Arrow Down</small>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Controls;
