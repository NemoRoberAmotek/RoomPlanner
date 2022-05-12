import "../styles/main.css";
import ObjectsPanel from "../components/ObjectsPanel";
import PropertiesPanel from "../components/PropertiesPanel";
import AddRoomForm from "../components/AddRoomForm.js";
import RoomView from "../components/view/RoomView";
import { useRoom } from "../contexts/RoomProvider";
import { useAuth } from "../contexts/AuthProvider";
import { useEffect } from "react";
import useEventListeners from "../hooks/useEventListeners";

const Main = () => {
  const { room } = useRoom();
  const { guest } = useAuth();
  const [setWindowKeyEvents] = useEventListeners();

  useEffect(() => {
    setWindowKeyEvents();
  }, [setWindowKeyEvents]);

  if (!room && !guest) return <AddRoomForm />;

  if (!room && guest) return <p>Loading...</p>;

  return (
    <div className="app-layout">
      <ObjectsPanel />
      <RoomView />
      <PropertiesPanel />
    </div>
  );
};

export default Main;
