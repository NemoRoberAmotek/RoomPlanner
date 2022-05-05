import { useRoom } from "../../contexts/RoomProvider";
import FurnitureItem from "./FurnitureItem";
import CustomDragLayer from "./CustomDragLayer";
import Controls from "./Controls";
import { useEffect } from "react";
import useConvertUnits from "../../hooks/useConvertUnits";
import { useGlobalSettings } from "../../contexts/GlobalSettingsProvider";
import "../../styles/room-view.css";

const RoomView = () => {
  const { room, zoomRoomIn, zoomRoomOut, drop, roomStyles } = useRoom();
  const { units } = useGlobalSettings();
  const convertUnits = useConvertUnits(units);

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

  return (
    <div className="room-view">
      <div className="room" style={roomStyles} ref={drop}>
        <CustomDragLayer />
        {`Room: ${convertUnits(room.width)} - ${convertUnits(room.length)}`}
        {room.furniture.map((furniture, i) => (
          <FurnitureItem key={i} furniture={furniture} />
        ))}
      </div>
      <Controls />
    </div>
  );
};

export default RoomView;
