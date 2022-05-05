import { useCallback } from "react";

const useComputation = (room, rotate) => {
  const dataToComputed = useCallback(
    (furnitureItem) => {
      if (!room.computedWidth)
        return {
          width: 0,
          height: 0,
          posX: 0,
          posY: 0,
        };

      const itemX = furnitureItem.width;
      const itemY = furnitureItem.length;
      const posX = furnitureItem.position.posX;
      const posY = furnitureItem.position.posY;

      const renderRate = room.width / room.computedWidth;

      let widthRated = Math.round(itemX / renderRate);
      let heightRated = Math.round(itemY / renderRate);
      let posXRated = Math.round(posX / renderRate);
      let posYRated = Math.round(posY / renderRate);

      let renderSizeAndPosition = {
        width: widthRated,
        height: heightRated,
        posX: posXRated,
        posY: posYRated,
      };

      return renderSizeAndPosition;
    },
    [room]
  );

  const snapToRoom = useCallback(
    (item, posX, posY) => {
      let newPosX = posX,
        newPosY = posY;

      if (5 > posX) {
        newPosX = 0;
      }

      if (5 > posY) {
        newPosY = 0;
      }

      if (posX > room.width - item.width) {
        newPosX = room.width - item.width;
      }

      if (posY > room.length - item.length) {
        newPosY = room.length - item.length;
      }

      return [newPosX, newPosY];
    },
    [room]
  );

  const snapToOthers = (item, originalX, originalY) => {
    const itemsNotThis = room.furniture.filter(
      (exist) => exist.placement_id !== item.placement_id
    );

    let newPosX = originalX,
      newPosY = originalY;

    itemsNotThis.forEach((existing) => {
      if (
        originalX + item.width < existing.position.posX + 5 &&
        originalX + item.width > existing.position.posX - 5
      ) {
        const diff = originalX + item.width - existing.position.posX;
        newPosX = originalX - diff;
      }
      if (
        originalX < existing.position.posX + existing.width + 5 &&
        originalX > existing.position.posX + existing.width - 5
      ) {
        const diff = originalX - (existing.position.posX + existing.x);
        newPosX = originalX - diff;
      }
      if (
        originalY + item.length < existing.position.posY + 5 &&
        originalY + item.length > existing.position.posY - 5
      ) {
        const diff = originalY + item.length - existing.position.posY;
        newPosY = originalY - diff;
      }
      if (
        originalY < existing.position.posY + existing.length + 5 &&
        originalY > existing.position.posY + existing.length - 5
      ) {
        const diff = originalY - (existing.position.posY + existing.length);
        newPosY = originalY - diff;
      }
    });

    return [newPosX, newPosY];
  };

  const adjustToRotation = useCallback(
    (item, originalX, originalY, ratedDiff) => {
      let posX = originalX,
        posY = originalY;

      if (rotate === 90) {
        posX = item.position.posX + ratedDiff.y;
        posY = item.position.posY - ratedDiff.x;
      }

      if (rotate === 180) {
        posX = item.position.posX - ratedDiff.x;
        posY = item.position.posY - ratedDiff.y;
      }

      if (rotate === 270) {
        posX = item.position.posX - ratedDiff.y;
        posY = item.position.posY + ratedDiff.x;
      }

      return [posX, posY];
    },
    [rotate]
  );

  return { adjustToRotation, dataToComputed, snapToRoom, snapToOthers };
};

export default useComputation;
