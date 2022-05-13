import { useState, useEffect } from "react";

const useRoomDomRect = (room, scale, rotate) => {
  const [roomBox, setRoomBox] = useState({});

  useEffect(() => {
    const room = document.querySelector(".room");

    if (!room) return;

    const domRect = room.getBoundingClientRect();
    setRoomBox({
      x: domRect.x,
      y: domRect.y,
      width: domRect.width,
      height: domRect.height,
    });
  }, [room]);

  useEffect(() => {
    const room = document.querySelector(".room");

    if (!room) return;
    let domRect;

    room.addEventListener("transitionend", () => {
      domRect = room.getBoundingClientRect();
      setRoomBox({
        x: domRect.x,
        y: domRect.y,
        width: domRect.width,
        height: domRect.height,
      });
    });
  }, [scale, rotate]);

  return roomBox;
};

export default useRoomDomRect;
