import { useRoom } from "../contexts/RoomProvider";
import { useAction } from "../contexts/ActionProvider";
import SidebarHeader from "./SidebarHeader";
import SidebarFooter from "./SidebarFooter";
import ActionAlert from "./ActionAlert";
import IconLink from "./IconLink";
import RoomProperties from "./propertiespanel/RoomProperties";
import FurnitureProperties from "./propertiespanel/FurnitureProperties";

function panelMenu() {
  return (
    <div className="panel-menu">
      <IconLink
        name="Export"
        action={() => console.log("TO DO")}
        icon="fa-solid:download"
      />
      <IconLink
        name="Account"
        action={() => console.log("TO DO")}
        classNames="color-dark reverse"
        icon="fa6-solid:user"
      />
    </div>
  );
}

const PropertiesPanel = () => {
  const { selectedFurniture } = useRoom();
  const { undo } = useAction();

  return (
    <div className="sidebar">
      <SidebarHeader render={panelMenu} />
      <div className="sidebar-content">
        <button className="button-primary" onClick={undo}>
          Undo
        </button>
        {selectedFurniture ? <FurnitureProperties /> : <RoomProperties />}
      </div>
      <SidebarFooter render={() => <ActionAlert />} />
    </div>
  );
};

export default PropertiesPanel;
