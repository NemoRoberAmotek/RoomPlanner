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
import useRoomTransform from "../hooks/useRoomTransform";
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
      width: 100,
      length: 200,
      color: "#4F95FF",
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
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [rotate, setRotate] = useState(0);
  const [scale, setScale] = useState(1.0);
  const [selectedFurniture, setSelectedFurniture] = useState(null);
  const [roomStyles, setRoomStyles] = useState({
    backgroundColor: room.color,
  });

  const windowSize = useWindowWidth();
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
    clearTranslate,
    clearAll,
    roomControlKeyEvents,
    runTranslate,
  ] = useRoomTransform(
    scale,
    rotate,
    setScale,
    setRotate,
    translate,
    setTranslate
  );

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

  const removeFurniture = useCallback(
    (item) => {
      const newFurniture = room.furniture.filter(
        (existing) => existing.placement_id !== item.placement_id
      );

      setSelectedFurniture(null);
      setRoom({ ...room, furniture: newFurniture });
    },
    [room]
  );

  const updateAfterSelectedChange = useCallback(() => {
    if (!selectedFurniture) return;
    const [snappedPosX, snappedPosY] = snapToRoom(
      selectedFurniture,
      selectedFurniture.position.posX,
      selectedFurniture.position.posY
    );

    const updatedItem = {
      ...selectedFurniture,
      position: {
        posX: snappedPosX,
        posY: snappedPosY,
      },
    };

    updateRoomFurniture(updatedItem);
    setSelectedFurniture(updatedItem);
  }, [selectedFurniture, snapToRoom, updateRoomFurniture]);

  useEffect(() => {
    let ratio, roomWidth, roomHeight;
    if (room.width > room.length) {
      ratio = room.length / room.width;
      roomWidth = Math.round(windowSize.width * 0.5);
      roomHeight = Math.round(windowSize.width * 0.5 * ratio);
    } else {
      ratio = room.width / room.length;
      roomWidth = Math.round(windowSize.height * 0.75 * ratio);
      roomHeight = Math.round(windowSize.height * 0.75);
    }

    setRoomStyles((roomStyles) => ({
      ...roomStyles,
      width: `${roomWidth}px`,
      height: `${roomHeight}px`,
      transform: `rotateZ(${rotate}deg) scale(${scale}) translate(${translate.x}px, ${translate.y}px)`,
      backgroundColor: room.color,
    }));

    setRoom((room) => ({
      ...room,
      computedWidth: roomWidth,
      computedHeight: roomHeight,
    }));
  }, [
    translate,
    windowSize,
    rotate,
    scale,
    setRoomStyles,
    room.length,
    room.width,
    room.color,
    setRoom,
  ]);

  const moveFurniture = useCallback(
    (item, monitor) => {
      const diff = monitor.getDifferenceFromInitialOffset();

      const rate = room.computedWidth / room.width;

      const ratedDiff = {
        x: Math.round(diff.x / rate / scale),
        y: Math.round(diff.y / rate / scale),
      };

      let posX = item.position.posX + ratedDiff.x;
      let posY = item.position.posY + ratedDiff.y;

      let error = false;

      if (isNaN(posX) || isNaN(posY)) {
        posX = 0;
        posY = 0;
        error = true;
        setAction({
          title: `Something went wrong`,
          message: `${item.name} could not be moved. The position was reset.`,
        });
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
      setSelectedFurniture(movedItem);
      if (!error) {
        setAction({
          title: `${item.name} moved`,
          message: `${item.name} has moved in ${room.name}`,
        });
      }
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

      x = pos.x - roomX - item.width;
      y = pos.y - roomY - item.length;

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

      const newX = item.length,
        newY = item.width;

      const [snappedX, snappedY] = snapToRoom(
        { ...item, width: newX, length: newY },
        item.position.posX,
        item.position.posY
      );

      const rotatedItem = {
        ...item,
        width: newX,
        length: newY,
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
        clearTranslate,
        clearAll,
        rotate,
        scale,
        selectedFurniture,
        setSelectedFurniture,
        drop,
        roomStyles,
        rotateFurniture,
        updateRoomFurniture,
        updateAfterSelectedChange,
        removeFurniture,
        roomControlKeyEvents,
        runTranslate,
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
