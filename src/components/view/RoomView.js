import { useRoom } from "../../contexts/RoomProvider";
import { useView } from "../../contexts/ViewProvider";
import useRoomDomRect from "../../hooks/useRoomDomRect";
import { useAction } from "../../contexts/ActionProvider";
import FurnitureItem from "./FurnitureItem";
import Controls from "./Controls";
import { useEffect } from "react";
import "../../styles/room-view.css";
import { useDrop } from "react-dnd";
import { ItemTypes } from "../../Constants";
import { v4 as uuidv4 } from "uuid";
import furniturePosition from "../../helpers/furniturePosition";

const RoomView = () => {
  const {
    scale,
    rotate,
    zoomRoomIn,
    zoomRoomOut,
    furniture,
    setFurniture,
  } = useView();
  const { room } = useRoom();
  const { setAction } = useAction();

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

  const roomBox = useRoomDomRect();

  const [, drop] = useDrop(
    () => ({
      accept: [ItemTypes.CARD, ItemTypes.FURNITURE],
      drop(item, monitor) {
        const type = monitor.getItemType();

        let itemWithPosition;

        if (type === "furniture") {
          const diff = monitor.getDifferenceFromInitialOffset();

          const updatedItem = {
            ...item,
            position: {
              posX: Math.round(item.position.posX + diff.x),
              posY: Math.round(item.position.posY + diff.y),
            },
          };

          itemWithPosition = updatedItem;
        } else {
          const delta = monitor.getClientOffset();

          const position = furniturePosition(
            delta,
            scale,
            roomBox,
            rotate,
            item
          );

          itemWithPosition = {
            placement_id: uuidv4(),
            ...item,
            position,
          };
        }

        let actionMessage = {
          title: "Furniture added",
          message: `${itemWithPosition.name} was added to ${room.name}`,
        };

        const found = furniture.find(
          (furniture_item) =>
            furniture_item.placement_id === itemWithPosition.placement_id
        );

        if (found) {
          const updatedFurniture = furniture.map((furniture_item) => {
            if (furniture_item.placement_id === itemWithPosition.placement_id) {
              return itemWithPosition;
            } else {
              return furniture_item;
            }
          });

          setFurniture(updatedFurniture);
          actionMessage = {
            title: "Furniture moved",
            message: `${itemWithPosition.name} was moved.`,
          };
        } else {
          setFurniture([...furniture, itemWithPosition]);
        }

        setAction(actionMessage);
      },
    }),
    [furniture, roomBox, rotate]
  );

  const roomStyles = {
    width: room.width,
    height: room.length,
    backgroundColor: room.color,
    transform: `translate(-50%, -50%) rotate(${rotate}deg) scale(${scale})`,
  };

  return (
    <div className="room-view">
      <div className="room" style={roomStyles} ref={drop}>
        {furniture.map((furniture, i) => (
          <FurnitureItem key={i} furniture={furniture} />
        ))}
      </div>
      <Controls />
    </div>
  );
};

export default RoomView;
