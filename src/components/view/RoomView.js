import { useRoom } from "../../contexts/RoomProvider";
import FurnitureItem from "./FurnitureItem";
import CustomDragLayer from "./CustomDragLayer";
import Controls from "./Controls";
import { useEffect } from "react";
import "../../styles/room-view.css";

const RoomView = () => {
  const {
    room,
    zoomRoomIn,
    zoomRoomOut,
    drop,
    roomStyles,
    setSelectedFurniture,
  } = useRoom();

  useEffect(() => {
    const view = document.querySelector(".room-view");
    view.addEventListener("wheel", (e) => {
      if (e.deltaY > 0) {
        zoomRoomOut();
      } else {
        zoomRoomIn();
      }
    });
  }, [zoomRoomIn, zoomRoomOut]);

  const onRoomClick = (e) => {
    if (
      !e.target.classList.contains("furniture-in-view") &&
      !e.target.closest(".furniture-in-view")
    ) {
      setSelectedFurniture(null);
    }
  };

  return (
    <div className="room-view">
      <div
        className="room"
        style={roomStyles}
        ref={drop}
        onClick={onRoomClick}
        onKeyPress={onRoomClick}
        role="menu"
        tabIndex="0"
      >
        <CustomDragLayer />
        {room.furniture.map((furniture, i) => (
          <FurnitureItem key={i} furniture={furniture} />
        ))}
      </div>
      <Controls />
    </div>
  );
};

export default RoomView;
