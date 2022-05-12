import { useDragLayer } from "react-dnd";
import FurnitureItemPreview from "./FurnitureItemPreview";
import { ItemTypes } from "../../Constants";
import useRoomDomRect from "../../hooks/useRoomDomRect";
import { useRoom } from "../../contexts/RoomProvider";

const layerStyles = {
  position: "absolute",
  pointerEvents: "none",
  zIndex: 10,
  left: 0,
  top: 0,
  width: "100%",
  height: "100%",
};

function getItemStyles(
  initialOffset,
  currentOffset,
  roomBox,
  rotate,
  item,
  room,
  computedRoom,
  scale
) {
  if (!initialOffset || !currentOffset) {
    return {
      display: "none",
    };
  }
  let transform;

  const diffX = currentOffset.x - initialOffset.x;
  const diffY = currentOffset.y - initialOffset.y;

  const rate = room.width / computedRoom.computedWidth;

  if (rotate === 90) {
    if (item.position) {
      let posX = Math.round(item.position.posX / rate) + diffY / scale;
      let posY = Math.round(item.position.posY / rate) - diffX / scale;

      transform = `translate(${posX}px, ${posY}px)`;
    }
  } else if (rotate === 180) {
    if (item.position) {
      let posX = Math.round(item.position.posX / rate) - diffX / scale;
      let posY = Math.round(item.position.posY / rate) - diffY / scale;

      transform = `translate(${posX}px, ${posY}px)`;
    }
  } else if (rotate === 270) {
    if (item.position) {
      let posX = Math.round(item.position.posX / rate) - diffY / scale;
      let posY = Math.round(item.position.posY / rate) + diffX / scale;

      transform = `translate(${posX}px, ${posY}px)`;
    }
  } else {
    if (item.position) {
      let posX = Math.round(item.position.posX / rate) + diffX / scale;
      let posY = Math.round(item.position.posY / rate) + diffY / scale;

      transform = `translate(${posX}px, ${posY}px)`;
    }
  }

  return {
    transform,
    WebkitTransform: transform,
  };
}

const CustomDragLayer = () => {
  const roomBox = useRoomDomRect();
  const { room, rotate, scale, computedRoom } = useRoom();

  const {
    itemType,
    isDragging,
    item,
    initialOffset,
    currentOffset,
  } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }));

  function renderItem() {
    switch (itemType) {
      case ItemTypes.FURNITURE:
        return <FurnitureItemPreview furniture={item} />;
      default:
        return null;
    }
  }

  if (!isDragging) {
    return null;
  }

  return (
    <div className="custom-drag-layer" style={layerStyles}>
      <div
        style={getItemStyles(
          initialOffset,
          currentOffset,
          roomBox,
          rotate,
          item,
          room,
          computedRoom,
          scale
        )}
      >
        {renderItem()}
      </div>
    </div>
  );
};

export default CustomDragLayer;
