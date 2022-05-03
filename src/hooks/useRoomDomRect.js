import { useState, useEffect } from "react";
import { useView } from "../contexts/ViewProvider";

const useRoomDomRect = () => {
  const [roomBox, setRoomBox] = useState({});
  const { scale, rotate } = useView();

  useEffect(() => {
    const room = document.querySelector(".room");
    const domRect = room.getBoundingClientRect();
    setRoomBox({
      x: domRect.x,
      y: domRect.y,
      width: domRect.width,
      height: domRect.height,
    });
  }, []);

  useEffect(() => {
    const room = document.querySelector(".room");

    if (!room) return;
    console.log("Running");
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
