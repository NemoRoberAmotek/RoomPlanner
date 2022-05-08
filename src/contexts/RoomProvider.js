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
  name: "My First Room",
  width: 400,
  length: 200,
  color: "#FFFFFF",
  furniture: [],
};

const RoomProvider = ({ children }) => {
  const [room, setRoom] = useState(roomDummy);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [rotate, setRotate] = useState(0);
  const [scale, setScale] = useState(1.0);
  const [selectedFurniture, setSelectedFurniture] = useState(null);
  const [roomStyles, setRoomStyles] = useState(null);

  const windowSize = useWindowWidth();
  const roomBox = useRoomDomRect(scale, rotate);
  const { setAction, actionToUndo, setActionToUndo } = useAction();
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
    (item, action = true) => {
      const newFurniture = room.furniture.filter(
        (existing) => existing.placement_id !== item.placement_id
      );

      setSelectedFurniture(null);
      setRoom({ ...room, furniture: newFurniture });

      if (action) {
        setAction({
          id: uuidv4(),
          title: `${item.name} was deleted`,
          message: `${item.name} was deleted from room ${room.name}`,
          type: "delete",
          initial: item,
          new: null,
        });
      }
    },
    [room, setAction]
  );

  useEffect(() => {
    setRoom((room) => {
      if (!room) return;

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

      return {
        ...room,
        computedWidth: roomWidth,
        computedHeight: roomHeight,
      };
    });
  }, [
    translate,
    windowSize,
    rotate,
    scale,
    room.length,
    room.width,
    setRoomStyles,
    setRoom,
  ]);

  useEffect(() => {
    if (!actionToUndo) return;

    if (actionToUndo.type === "update") {
      updateRoomFurniture(actionToUndo.initial);
    }

    if (actionToUndo.type === "place") {
      removeFurniture(actionToUndo.new, false);
    }

    if (actionToUndo.type === "delete") {
      setRoom((room) => ({
        ...room,
        furniture: [...room.furniture, actionToUndo.initial],
      }));
    }

    setSelectedFurniture(actionToUndo.initial);

    setActionToUndo(null);
    setAction(null);
  }, [
    actionToUndo,
    setActionToUndo,
    updateRoomFurniture,
    removeFurniture,
    setSelectedFurniture,
    setAction,
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
          id: uuidv4(),
          title: `Something went wrong`,
          message: `${item.name} could not be moved. The position was reset.`,
          type: "update",
          initial: item,
          new: {
            ...item,
            position: {
              posX,
              posY,
            },
          },
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
          id: uuidv4(),
          title: `${item.name} moved`,
          message: `${item.name} has moved in ${room.name}`,
          type: "update",
          initial: item,
          new: movedItem,
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
        zIndex: 1,
        rotate: 0,
      };

      setRoom((room) => ({
        ...room,
        furniture: [...room.furniture, itemWithPosition],
      }));

      setAction({
        id: uuidv4(),
        title: `${item.name} added`,
        message: `${item.name} was added to ${room.name}`,
        type: "place",
        initial: null,
        new: itemWithPosition,
      });

      setSelectedFurniture(itemWithPosition);
    },
    [room, snapToRoom, setAction, roomBox]
  );

  const rotateFurniture = useCallback(
    (item) => {
      const rotation = !item.rotate;
      console.log(item);
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
      setSelectedFurniture(rotatedItem);

      setAction({
        id: uuidv4(),
        title: `${item.name} rotated`,
        message: `${item.name} has rotated in ${room.name}`,
        type: "update",
        initial: item,
        new: rotatedItem,
      });
    },
    [room, updateRoomFurniture, snapToRoom, setAction]
  );

  const duplicateFurniture = useCallback(
    (item) => {
      let posX = 0,
        posY = item.position.posY;

      if (room.width - item.position.posX - item.width >= item.width) {
        if (room.width > item.position.posX + item.width + item.width + 10) {
          posX = item.position.posX + item.width + 10;
        } else {
          posX = item.position.posX + item.width;
        }
      } else if (room.width - item.width >= item.width) {
        if (room.width > item.width + item.width + 10) {
          posX = item.position.posX - item.width - 10;
        } else {
          posX = item.position.posX - item.width;
        }
      } else {
        posX = 0;
        posY = 0;
      }

      const [snappedPosX, snappedPosY] = snapToRoom(item, posX, posY);

      const duplicatedItem = {
        ...item,
        placement_id: uuidv4(),
        position: {
          posX: snappedPosX,
          posY: snappedPosY,
        },
      };

      console.log(duplicatedItem);

      setRoom({ ...room, furniture: [...room.furniture, duplicatedItem] });
      setSelectedFurniture(duplicatedItem);

      setAction({
        id: uuidv4(),
        title: `${item.name} was duplicated.`,
        message: `${item.name} was duplicated in ${room.name}`,
        type: "place",
        initial: null,
        new: duplicatedItem,
      });
    },
    [room, snapToRoom, setAction]
  );

  const setFurnitureZIndex = useCallback(
    (item, dir) => {
      const current = item;
      const highestZIndex = room.furniture.reduce((max, item) => {
        if (item.zIndex > max && item.placement_id !== current.placement_id) {
          return item.zIndex;
        } else {
          return max;
        }
      }, 0);

      const updatedItem = {
        ...item,
        zIndex: dir === "front" ? highestZIndex + 1 : highestZIndex - 1,
      };

      updateRoomFurniture(updatedItem);
      setSelectedFurniture(null);

      setAction({
        id: uuidv4(),
        title: `${item.name} to ${dir}`,
        message: `${item.name} was brought to ${dir} in ${room.name}`,
        type: `update`,
        initial: item,
        new: updatedItem,
      });
    },
    [updateRoomFurniture, room, setAction]
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
        removeFurniture,
        roomControlKeyEvents,
        runTranslate,
        setFurnitureZIndex,
        moveFurniture,
        duplicateFurniture,
        setScale,
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
