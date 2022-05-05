import useComputeItemSizeAndPosition from "./useComputeItemSizeAndPosition";
import { v4 as uuidv4 } from "uuid";

const usePlaceAndMove = (roomBox, room) => {
  const { computedPositionToData } = useComputeItemSizeAndPosition(room);

  const placeFurniture = (item, monitor, move = false) => {
    let clientOffset = monitor.getClientOffset();
    if (move) clientOffset = monitor.getDifferenceFromInitialOffset();

    let { x, y } = clientOffset;

    console.log(move);

    if (!move) {
      x = Math.round(x - roomBox.x);
      y = Math.round(y - roomBox.y);
    }

    const mousePosInRoom = {
      x,
      y,
    };

    const dataPos = computedPositionToData(mousePosInRoom);

    let adjustX = 0,
      adjustY = 0;

    if (!move) {
      adjustX = item.x / 2;
      adjustY = item.y / 2;
    }

    const result = {
      placement_id: uuidv4(),
      ...item,
      position: {
        posX: dataPos.x - adjustX,
        posY: dataPos.y - adjustY,
      },
    };

    return result;
  };
  return [placeFurniture];
};

export default usePlaceAndMove;
