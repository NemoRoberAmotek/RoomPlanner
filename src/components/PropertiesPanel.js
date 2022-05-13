import { useRoom } from "../contexts/RoomProvider";
import SidebarHeader from "./SidebarHeader";
import SidebarFooter from "./SidebarFooter";
import ActionAlert from "./ActionAlert";
import RoomProperties from "./propertiespanel/RoomProperties";
import FurnitureProperties from "./propertiespanel/FurnitureProperties";
import PropertiesTopMenu from "./propertiespanel/PropertiesTopMenu";
import FixedMenu from "./propertiespanel/FixedMenu";

const PropertiesPanel = () => {
  const { selectedFurniture } = useRoom();

  return (
    <div className="sidebar">
      <SidebarHeader render={() => <PropertiesTopMenu />} />
      <div className="sidebar-content">
        <FixedMenu />
        {selectedFurniture ? <FurnitureProperties /> : <RoomProperties />}
      </div>
      <SidebarFooter render={() => <ActionAlert />} />
    </div>
  );
};

export default PropertiesPanel;
