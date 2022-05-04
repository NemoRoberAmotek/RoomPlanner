import { useRoom } from "../../contexts/RoomProvider";

const Controls = () => {
  const {
    rotateRoomLeft,
    rotateRoomRight,
    zoomRoomIn,
    zoomRoomOut,
  } = useRoom();

  return (
    <div className="controls">
      <button className="button-default" onClick={rotateRoomLeft}>
        Rotate Left
      </button>
      <button className="button-default" onClick={rotateRoomRight}>
        Rotate Right
      </button>
      <button className="button-default" onClick={zoomRoomIn}>
        Zoom In
      </button>
      <button className="button-default" onClick={zoomRoomOut}>
        Zoom Out
      </button>
    </div>
  );
};

export default Controls;
