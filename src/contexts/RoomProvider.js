import { useState, createContext, useContext } from "react";
import PropTypes from "prop-types";
import { useDrop } from "react-dnd";
import { ItemTypes } from "../Constants";
import useRoomDomRect from "../hooks/useRoomDomRect";
import useRotateAndZoom from "../hooks/useRotateAndZoom";
import usePlaceAndMove from "../hooks/usePlaceAndMove";
import { useAction } from "./ActionProvider";

const RoomContext = createContext();

const roomDummy = {
  name: "My Living Room",
  width: 400,
  length: 200,
  color: "#FFFFFF",
  furniture: [],
};

const RoomProvider = ({ children }) => {
  const [room, setRoom] = useState(roomDummy);
  const [rotate, setRotate] = useState(0);
  const [scale, setScale] = useState(1.0);
  const [selectedFurniture, setSelectedFurniture] = useState(null);

  const roomBox = useRoomDomRect(scale, rotate);
  const { setAction } = useAction();
  const [placeFurniture, moveFurniture] = usePlaceAndMove(scale, rotate);

  const [
    rotateRoomLeft,
    rotateRoomRight,
    zoomRoomIn,
    zoomRoomOut,
  ] = useRotateAndZoom(scale, rotate, setScale, setRotate);

  const [, drop] = useDrop(
    () => ({
      accept: [ItemTypes.CARD, ItemTypes.FURNITURE],
      drop(item, monitor) {
        const type = monitor.getItemType();

        let itemWithPosition;

        let actionMessage;

        if (type === "furniture") {
          itemWithPosition = moveFurniture(item, monitor);

          actionMessage = {
            title: "Furniture moved",
            message: `${itemWithPosition.name} was moved.`,
          };

          const updatedFurniture = room.furniture.map((furniture_item) => {
            if (furniture_item.placement_id === itemWithPosition.placement_id) {
              return itemWithPosition;
            } else {
              return furniture_item;
            }
          });

          setRoom({ ...room, furniture: updatedFurniture });
        } else {
          itemWithPosition = placeFurniture(item, monitor);

          setRoom({
            ...room,
            furniture: [...room.furniture, itemWithPosition],
          });

          actionMessage = {
            title: "Furniture added",
            message: `${itemWithPosition.name} was added to ${room.name}`,
          };
        }

        setAction(actionMessage);
      },
    }),
    [room, roomBox, rotate]
  );

  return (
    <RoomContext.Provider
      value={{
        room,
        setRoom,
        rotateRoomLeft,
        rotateRoomRight,
        zoomRoomIn,
        zoomRoomOut,
        rotate,
        scale,
        selectedFurniture,
        setSelectedFurniture,
        drop,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export default RoomProvider;

export const useRoom = () => useContext(RoomContext);

RoomProvider.propTypes = {
  children: PropTypes.object.isRequired,
};
