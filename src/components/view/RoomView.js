import { useRoom } from "../../contexts/RoomProvider";
import FurnitureItem from "./FurnitureItem";
import CustomDragLayer from "./CustomDragLayer";
import Controls from "./Controls";
import Rulers from "./Rulers";
import SnapLines from "./SnapLines";
import "../../styles/room-view.css";
import { useEffect } from "react";
import domtoimage from "dom-to-image";
import { saveAs } from "file-saver";
import useEventListeners from "../../hooks/useEventListeners";

const RoomView = () => {
  const {
    room,
    drop,
    computedRoom,
    setTryToExport,
    scale,
    rotate,
    translate,
  } = useRoom();

  const [, setRoomViewEvents] = useEventListeners();

  useEffect(() => {
    setTryToExport((tryToExport) => {
      if (!tryToExport) return false;

      if (
        scale === 1 &&
        rotate === 0 &&
        translate.x === 0 &&
        translate.y === 0
      ) {
        const roomNode = document.querySelector(".room-image-wrapper");

        setTimeout(function () {
          domtoimage.toPng(roomNode).then(function (blob) {
            saveAs(blob, "my-room.png");
          });
        }, 1000);

        return false;
      }
    });
  }, [setTryToExport, scale, rotate, translate]);

  useEffect(() => {
    setRoomViewEvents();
  }, [setRoomViewEvents]);

  return (
    <div className="room-view">
      <div
        className="room-image-wrapper"
        style={{ padding: "4rem", backgroundColor: "#f5f5f5" }}
      >
        <div
          className="room"
          style={computedRoom.styles}
          ref={drop}
          role="menu"
          tabIndex="0"
        >
          <Rulers />
          <SnapLines />
          <CustomDragLayer />
          {room.furniture.map((furniture, i) => (
            <FurnitureItem key={i} furniture={furniture} />
          ))}
        </div>
      </div>

      <Controls />
    </div>
  );
};

export default RoomView;
