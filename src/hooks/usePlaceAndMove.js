import {
  furniturePlacePosition,
  furnitureMovePosition,
} from "../helpers/furniturePosition";
import useRoomDomRect from "./useRoomDomRect";
import { v4 as uuidv4 } from "uuid";

const usePlaceAndMove = (scale, rotate) => {
  const roomBox = useRoomDomRect(scale, rotate);

  const placeFurniture = (item, monitor) => {
    const delta = monitor.getClientOffset();

    const position = furniturePlacePosition(
      delta,
      scale,
      roomBox,
      rotate,
      item
    );

    const newItem = {
      placement_id: uuidv4(),
      ...item,
      position,
    };

    return newItem;
  };

  const moveFurniture = (item, monitor) => {
    const diff = monitor.getDifferenceFromInitialOffset();

    const position = furnitureMovePosition(diff, roomBox, rotate, item, scale);

    const updatedItem = {
      ...item,
      position,
    };

    return updatedItem;
  };

  return [placeFurniture, moveFurniture];
};

export default usePlaceAndMove;
