const furniturePosition = (delta, scale, roomBox, rotate, item) => {
  let posX, posY;

  posX = (delta.x - roomBox.x) / scale - item.x / 2;
  posY = (delta.y - roomBox.y) / scale - item.y / 2;

  if (rotate === 90) {
    posX = (delta.y - roomBox.y) / scale - item.x / 2;
    posY = (roomBox.x + roomBox.width - delta.x) / scale - item.y / 2;
  }

  if (rotate === 180) {
    posX = (roomBox.x + roomBox.width - delta.x) / scale - item.x / 2;
    posY = (roomBox.y + roomBox.height - delta.y) / scale - item.y / 2;
  }

  if (rotate === 270) {
    posX = (roomBox.y + roomBox.height - delta.y) / scale - item.x / 2;
    posY = (delta.x - roomBox.x) / scale - item.y / 2;
  }

  const position = {
    posX,
    posY,
  };

  return position;
};

export default furniturePosition;
