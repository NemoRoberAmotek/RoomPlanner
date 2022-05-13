import "../styles/main.css";
import ObjectsPanel from "../components/ObjectsPanel";
import PropertiesPanel from "../components/PropertiesPanel";
import RoomView from "../components/view/RoomView";
import { useRoom } from "../contexts/RoomProvider";
import { useEffect } from "react";
import useEventListeners from "../hooks/useEventListeners";

const Main = () => {
  const { room } = useRoom();
  const [setWindowKeyEvents] = useEventListeners();

  useEffect(() => {
    setWindowKeyEvents();
  }, [setWindowKeyEvents]);

  if (!room) return <p>Loading...</p>;

  return (
    <div className="app-layout">
      <ObjectsPanel />
      <RoomView />
      <PropertiesPanel />
    </div>
  );
};

export default Main;
