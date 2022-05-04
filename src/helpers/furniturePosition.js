export const furniturePlacePosition = (delta, scale, roomBox, rotate, item) => {
  let posX, posY;

  posX = delta.x - roomBox.x - item.x / 2;
  posY = delta.y - roomBox.y - item.y / 2;

  if (rotate === 90) {
    posX = delta.y - roomBox.y - item.x / 2;
    posY = roomBox.x + roomBox.width - delta.x - item.y / 2;
  }

  if (rotate === 180) {
    posX = roomBox.x + roomBox.width - delta.x - item.x / 2;
    posY = roomBox.y + roomBox.height - delta.y - item.y / 2;
  }

  if (rotate === 270) {
    posX = roomBox.y + roomBox.height - delta.y - item.x / 2;
    posY = delta.x - roomBox.x - item.y / 2;
  }

  const position = {
    posX,
    posY,
  };

  return position;
};

export const furnitureMovePosition = (diff, roomBox, rotate, item, scale) => {
  let posX, posY;
  console.log(scale);
  posX = Math.round(item.position.posX + diff.x);
  posY = Math.round(item.position.posY + diff.y);

  if (rotate === 90) {
    posX = Math.round(item.position.posX + diff.y);
    posY = Math.round(item.position.posY - diff.x);
  }

  if (rotate === 180) {
    posX = Math.round(item.position.posX - diff.x);
    posY = Math.round(item.position.posY - diff.y);
  }

  if (rotate === 270) {
    posX = Math.round(item.position.posX - diff.y);
    posY = Math.round(item.position.posY + diff.x);
  }

  const position = {
    posX,
    posY,
  };

  return position;
};
