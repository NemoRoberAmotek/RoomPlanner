import "../styles/main.css";
import ObjectsPanel from "../components/ObjectsPanel";
import PropertiesPanel from "../components/PropertiesPanel";
import AddRoomForm from "../components/AddRoomForm.js";
import RoomView from "../components/view/RoomView";
import { useRoom } from "../contexts/RoomProvider";

const Main = () => {
  const { room } = useRoom();

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
