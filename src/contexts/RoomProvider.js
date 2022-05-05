import {
  useState,
  createContext,
  useContext,
  useEffect,
  useCallback,
} from "react";
import PropTypes from "prop-types";
import useWindowWidth from "../hooks/useWindowWidth";
import { useDrop } from "react-dnd";
import { ItemTypes } from "../Constants";
import useRoomDomRect from "../hooks/useRoomDomRect";
import useRotateAndZoom from "../hooks/useRotateAndZoom";
import useComputation from "../hooks/useComputation";
import { useAction } from "./ActionProvider";
import { v4 as uuidv4 } from "uuid";

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
      y: 200,
      position: {
        posX: 300,
        posY: 0,
      },
      rotate: false,
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
  const { adjustToRotation, snapToRoom, snapToOthers } = useComputation(
    room,
    rotate
  );

  const [
    rotateRoomLeft,
    rotateRoomRight,
    zoomRoomIn,
    zoomRoomOut,
  ] = useRotateAndZoom(scale, rotate, setScale, setRotate);

  useEffect(() => {
    const ratio = room.length / room.width;
    const roomWidth = Math.round(windowWidth * 0.5);
    const roomHeight = Math.round(windowWidth * 0.5 * ratio);

    setRoomStyles((roomStyles) => ({
      ...roomStyles,
      width: `${roomWidth}px`,
      height: `${roomHeight}px`,
      transform: `rotateZ(${rotate}deg) scale(${scale})`,
    }));

    setRoom((room) => ({
      ...room,
      computedWidth: roomWidth,
      computedHeight: roomHeight,
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

  const updateRoomFurniture = useCallback(
    (item) => {
      const newFurniture = room.furniture.map((existing) => {
        if (existing.placement_id === item.placement_id) {
          return item;
        } else {
          return existing;
        }
      });

      setRoom((room) => ({ ...room, furniture: newFurniture }));
    },
    [setRoom, room]
  );

  const moveFurniture = useCallback(
    (item, monitor) => {
      const diff = monitor.getDifferenceFromInitialOffset();

      const rate = room.computedWidth / room.width;

      const ratedDiff = {
        x: Math.round(diff.x / rate / scale),
        y: Math.round(diff.y / rate / scale),
      };

      const posX = item.position.posX + ratedDiff.x;
      const posY = item.position.posY + ratedDiff.y;

      if (item.rotate === 90) {
        console.log("rotate");
      }

      const [rotatedX, rotatedY] = adjustToRotation(
        item,
        posX,
        posY,
        ratedDiff
      );

      const [snappedPosX, snappedPosY] = snapToRoom(item, rotatedX, rotatedY);

      const [snappedToOthersX, snappedToOthersY] = snapToOthers(
        item,
        snappedPosX,
        snappedPosY
      );

      const movedItem = {
        ...item,
        position: {
          posX: snappedToOthersX,
          posY: snappedToOthersY,
        },
      };

      updateRoomFurniture(movedItem);

      setAction({
        title: `${item.name} moved`,
        message: `${item.name} has moved in ${room.name}`,
      });
    },
    [
      room,
      updateRoomFurniture,
      adjustToRotation,
      snapToOthers,
      snapToRoom,
      setAction,
      scale,
    ]
  );

  const placeFurniture = useCallback(
    (item, monitor) => {
      const pos = monitor.getClientOffset();
      const roomX = roomBox.x;
      const roomY = roomBox.y;
      let x, y;

      const rate = room.computedWidth / room.width;

      x = pos.x - roomX - item.x;
      y = pos.y - roomY - item.y;

      const ratedPos = {
        x: Math.round(x / rate),
        y: Math.round(y / rate),
      };

      const [snappedPosX, snappedPosY] = snapToRoom(
        item,
        ratedPos.x,
        ratedPos.y
      );

      const itemWithPosition = {
        placement_id: uuidv4(),
        ...item,
        position: {
          posX: snappedPosX,
          posY: snappedPosY,
        },
        rotate: 0,
      };

      setRoom((room) => ({
        ...room,
        furniture: [...room.furniture, itemWithPosition],
      }));

      setAction({
        title: `${item.name} added`,
        message: `${item.name} was added to ${room.name}`,
      });

      setSelectedFurniture(itemWithPosition);
    },
    [room, snapToRoom, setAction, roomBox]
  );

  const rotateFurniture = useCallback(
    (item) => {
      const rotation = !item.rotate;

      const newX = item.y,
        newY = item.x;

      const [snappedX, snappedY] = snapToRoom(
        { ...item, x: newX, y: newY },
        item.position.posX,
        item.position.posY
      );

      const rotatedItem = {
        ...item,
        x: newX,
        y: newY,
        position: {
          posX: snappedX,
          posY: snappedY,
        },
        rotate: rotation,
      };

      updateRoomFurniture(rotatedItem);

      setAction({
        title: `${item.name} rotated`,
        message: `${item.name} has rotated in ${room.name}`,
      });
    },
    [room, updateRoomFurniture, snapToRoom, setAction]
  );

  const [, drop] = useDrop(
    () => ({
      accept: [ItemTypes.CARD, ItemTypes.FURNITURE],
      drop(item, monitor) {
        if (monitor.getItemType() === "card") {
          placeFurniture(item, monitor);
        } else {
          moveFurniture(item, monitor);
        }
      },
      hover: (item, monitor) => {
        if (monitor.getItemType() === "card") {
          setScale(1);
          setRotate(0);
        }
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
        rotateFurniture,
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
