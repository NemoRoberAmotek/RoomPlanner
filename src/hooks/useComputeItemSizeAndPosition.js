import { useCallback } from "react";

const useComputeItemSizeAndPosition = (room) => {
  const computedPositionToData = useCallback(
    (mousePosInRoom) => {
      const roomWidth = room.width;
      const roomComputedWidth = room.computedWidth;
      const rate = roomComputedWidth / roomWidth;
      console.log(mousePosInRoom);

      return {
        x: mousePosInRoom.x / rate,
        y: mousePosInRoom.y / rate,
      };
    },
    [room]
  );

  const dataToComputed = useCallback(
    (furnitureItem) => {
      if (!room.computedWidth)
        return {
          width: 0,
          height: 0,
          posX: 0,
          posY: 0,
        };

      const itemX = furnitureItem.x;
      const itemY = furnitureItem.y;
      const posX = furnitureItem.position.posX;
      const posY = furnitureItem.position.posY;

      const renderRate = room.width / room.computedWidth;

      const renderSizeAndPosition = {
        width: itemX / renderRate,
        height: itemY / renderRate,
        posX: posX / renderRate,
        posY: posY / renderRate,
      };

      return renderSizeAndPosition;
    },
    [room]
  );

  return { computedPositionToData, dataToComputed };
};

export default useComputeItemSizeAndPosition;
