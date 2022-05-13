import IconLink from "../IconLink";
import AccountMenu from "../AccountMenu";
import { useRoom } from "../../contexts/RoomProvider";

const PropertiesTopMenu = () => {
  const { exportImage } = useRoom();

  return (
    <div className="panel-menu">
      <IconLink name="Export" action={exportImage} icon="fa-solid:download" />
      <AccountMenu />
    </div>
  );
};

export default PropertiesTopMenu;
