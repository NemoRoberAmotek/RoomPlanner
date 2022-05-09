import IconLink from "../IconLink";
import { useRoom } from "../../contexts/RoomProvider";

const PropertiesTopMenu = () => {
  const { exportImage } = useRoom();

  return (
    <div className="panel-menu">
      <IconLink name="Export" action={exportImage} icon="fa-solid:download" />
      <IconLink
        name="Account"
        action={() => console.log("TO DO")}
        classNames="color-dark reverse"
        icon="fa6-solid:user"
      />
    </div>
  );
};

export default PropertiesTopMenu;
