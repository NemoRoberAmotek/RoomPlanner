import useComputeItemSizeAndPosition from "./useComputeItemSizeAndPosition";
import { v4 as uuidv4 } from "uuid";

const usePlaceAndMove = (roomBox, room) => {
  const { computedPositionToData } = useComputeItemSizeAndPosition(room);

  const placeFurniture = (item, monitor) => {
    // console.log("getSourceClientOffset");
    // console.log(monitor.getSourceClientOffset());
    // console.log("getClientOffset");
    // console.log(monitor.getClientOffset());
    // console.log(roomBox.x);

    const mousePosInRoom = {
      x: Math.round(monitor.getClientOffset().x - roomBox.x),
      y: Math.round(monitor.getClientOffset().y - roomBox.y),
    };

    const dataPos = computedPositionToData(mousePosInRoom);

    console.log(dataPos);

    const result = {
      placement_id: uuidv4(),
      ...item,
      position: {
        posX: dataPos.x - item.x / 2,
        posY: dataPos.y - item.y / 2,
      },
    };

    return result;
  };
  return [placeFurniture];
};

export default usePlaceAndMove;
