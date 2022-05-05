import { useState, createContext, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import useWindowWidth from "../hooks/useWindowWidth";
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
  computedWidth: 400,
  computedHeight: 200,
  color: "#FFFFFF",
  furniture: [
    {
      id: 0,
      placement_id: "EEIF-EEEE-EEEE-EEE",
      name: "Table For 2",
      x: 100,
      y: 100,
      position: {
        posX: 300,
        posY: 100,
      },
    },
  ],
};

const RoomProvider = ({ children }) => {
  const [room, setRoom] = useState(roomDummy);
  const [rotate, setRotate] = useState(0);
  const [scale, setScale] = useState(1.0);
  const [selectedFurniture, setSelectedFurniture] = useState(null);

  const windowWidth = useWindowWidth();
  const [roomStyles, setRoomStyles] = useState({
    backgroundColor: room.color,
  });

  const roomBox = useRoomDomRect(scale, rotate);
  const { setAction } = useAction();

  const [placeFurniture] = usePlaceAndMove(roomBox, room);

  useEffect(() => {
    const ratio = room.length / room.width;

    setRoomStyles((roomStyles) => ({
      ...roomStyles,
      width: `${Math.round(windowWidth * 0.5)}px`,
      height: `${Math.round(windowWidth * 0.5 * ratio)}px`,
      transform: `rotateZ(${rotate}deg) scale(${scale})`,
    }));

    setRoom((room) => ({
      ...room,
      computedWidth: Math.round(windowWidth * 0.5),
      computedHeight: Math.round(windowWidth * 0.5 * ratio),
    }));
  }, [
    windowWidth,
    rotate,
    scale,
    setRoomStyles,
    room.length,
    room.width,
    setRoom,
  ]);

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
        const move = monitor.getItemType() === "furniture";

        const furnitureItem = placeFurniture(item, monitor, move);

        if (monitor.getItemType() === "card") {
          setRoom((room) => ({
            ...room,
            furniture: [...room.furniture, furnitureItem],
          }));
        } else {
          const newFurniture = room.furniture.map((furniture_item) => {
            if (furniture_item.placement_id === furnitureItem.placement_id) {
              return furnitureItem;
            } else {
              return furniture_item;
            }
          });

          setRoom((room) => ({
            ...room,
            furniture: newFurniture,
          }));
        }

        setAction({});
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
        roomStyles,
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
