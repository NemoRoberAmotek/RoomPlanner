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

function getItemStyles(initialOffset, currentOffset, roomBox, rotate, item) {
  if (!initialOffset || !currentOffset) {
    return {
      display: "none",
    };
  }
  let { x, y } = currentOffset;
  let transform;

  console.log(roomBox.y);

  if (rotate === 90) {
    transform = `translate(${y - roomBox.y}px, ${
      roomBox.width - item.y + (x - roomBox.x) * -1
    }px)`;
  } else if (rotate === 180) {
    transform = `translate(${
      roomBox.width - item.x + (x - roomBox.x) * -1
    }px, ${roomBox.height - item.y + (y - roomBox.y) * -1}px)`;
  } else if (rotate === 270) {
    transform = `translate(${
      roomBox.height - item.x + (y - roomBox.y) * -1
    }px, ${x - roomBox.x}px)`;
  } else {
    transform = `translate(${x - roomBox.x}px, ${y - roomBox.y}px)`;
  }

  return {
    transform,
    WebkitTransform: transform,
  };
}

const CustomDragLayer = () => {
  const roomBox = useRoomDomRect();
  const { rotate } = useRoom();

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
    // return null;
  }

  return (
    <div className="custom-drag-layer" style={layerStyles}>
      <div
        style={getItemStyles(
          initialOffset,
          currentOffset,
          roomBox,
          rotate,
          item
        )}
      >
        {renderItem()}
      </div>
    </div>
  );
};

export default CustomDragLayer;
