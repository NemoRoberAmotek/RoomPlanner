import SidebarHeader from "./SidebarHeader";
import SidebarFooter from "./SidebarFooter";
import ActionAlert from "./ActionAlert";
import IconLink from "./IconLink";
import Properties from "./propertiespanel/Properties";

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
  return (
    <div className="sidebar">
      <SidebarHeader render={panelMenu} />
      <div className="sidebar-content">
        <Properties />
      </div>
      <SidebarFooter render={() => <ActionAlert />} />
    </div>
  );
};

export default PropertiesPanel;
