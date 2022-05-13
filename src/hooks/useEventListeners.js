import { useRoom } from "../contexts/RoomProvider";
import { useAction } from "../contexts/ActionProvider";
import { useCallback } from "react";

const useEventListeners = () => {
  const {
    roomControlKeyEvents,
    setSelectedFurniture,
    zoomRoomIn,
    zoomRoomOut,
  } = useRoom();
  const { undo, redo } = useAction();

  const onWindowKeyPress = useCallback(
    (e) => {
      if (e.target.nodeName !== "INPUT") {
        if (e.key === "\x1A" && e.ctrlKey) {
          undo();
        } else if (e.key === "\x19" && e.ctrlKey) {
          redo();
        }
      }
    },
    [undo, redo]
  );

  const onWindowKeyDown = useCallback(
    (e) => {
      roomControlKeyEvents(e);
      if (e.code === "Escape") {
        setSelectedFurniture(null);
      }
    },
    [setSelectedFurniture, roomControlKeyEvents]
  );

  const setWindowKeyEvents = useCallback(() => {
    window.addEventListener("keydown", onWindowKeyDown);

    window.addEventListener("keypress", onWindowKeyPress);

    return () => {
      window.removeEventListener("keydown", onWindowKeyDown);
      window.removeEventListener("keypress", onWindowKeyPress);
    };
  }, [onWindowKeyDown, onWindowKeyPress]);

  const setRoomViewEvents = useCallback(() => {
    const view = document.querySelector(".room-view");
    if (view) {
      view.addEventListener("wheel", (e) => {
        if (e.deltaY > 0) {
          zoomRoomOut();
        } else {
          zoomRoomIn();
        }
      });
    }

    const room = view.querySelector(".room");
    if (room) {
      room.addEventListener("click", (e) => {
        if (
          !e.target.classList.contains("furniture-in-view") &&
          !e.target.closest(".furniture-in-view") &&
          !e.target.closest(".ruler")
        ) {
          setSelectedFurniture(null);
        }
      });
    }
  }, [zoomRoomIn, zoomRoomOut, setSelectedFurniture]);

  return [setWindowKeyEvents, setRoomViewEvents];
};

export default useEventListeners;
