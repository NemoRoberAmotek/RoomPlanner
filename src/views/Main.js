import "../styles/main.css";
import ObjectsPanel from "../components/ObjectsPanel";
import PropertiesPanel from "../components/PropertiesPanel";
import AddRoomForm from "../components/AddRoomForm.js";
import RoomView from "../components/view/RoomView";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useRoom } from "../contexts/RoomProvider";

const Main = () => {
  const { room } = useRoom();

  if (!room) return <AddRoomForm />;

  return (
    <div className="app-layout">
      <DndProvider backend={HTML5Backend}>
        <ObjectsPanel />
        <RoomView />
        <PropertiesPanel />
      </DndProvider>
    </div>
  );
};

export default Main;
