import "../styles/main.css";
import ObjectsPanel from "../components/ObjectsPanel";
import PropertiesPanel from "../components/PropertiesPanel";
import AddRoomForm from "../components/AddRoomForm.js";
import RoomView from "../components/view/RoomView";
import { useRoom } from "../contexts/RoomProvider";
// import { useAction } from "../contexts/ActionProvider";
import { useEffect } from "react";
import useEventListeners from "../hooks/useEventListeners";

const Main = () => {
  // const { undo } = useAction();
  const { room } = useRoom();
  const [setWindowKeyEvents, setRoomViewEvents] = useEventListeners();

  useEffect(() => {
    setWindowKeyEvents();
    setRoomViewEvents();
  }, [setWindowKeyEvents, setRoomViewEvents]);

  //TO BE REPLACED
  // useEffect(() => {
  //   window.addEventListener("keypress", (e) => {
  //     if (e.target.nodeName !== "INPUT") {
  //       if (e.key === "\x1A" && e.ctrlKey) {
  //         undo();
  //       }
  //     }
  //   });
  // }, [undo]);

  if (!room) return <AddRoomForm />;

  return (
    <div className="app-layout">
      <ObjectsPanel />
      <RoomView />
      <PropertiesPanel />
    </div>
  );
};

export default Main;
