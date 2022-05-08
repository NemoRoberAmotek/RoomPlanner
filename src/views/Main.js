import "../styles/main.css";
import ObjectsPanel from "../components/ObjectsPanel";
import PropertiesPanel from "../components/PropertiesPanel";
import AddRoomForm from "../components/AddRoomForm.js";
import RoomView from "../components/view/RoomView";
import { useRoom } from "../contexts/RoomProvider";
import { useAction } from "../contexts/ActionProvider";
import { useEffect } from "react";

const Main = () => {
  const { undo } = useAction();
  const { room } = useRoom();

  useEffect(() => {
    window.addEventListener("keypress", (e) => {
      console.log(e);
      console.log(undo);
    });
  }, [undo]);

  // useEffect(() => {
  //   window.addEventListener("keydown", (e) => {
  //     console.log(e);
  //     if (e.target.nodeName !== "INPUT") {
  //       if (e.key === "z" && e.ctrlKey) {
  //         console.log("Undoing");
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
