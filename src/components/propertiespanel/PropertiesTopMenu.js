import IconLink from "../IconLink";
import { useRoom } from "../../contexts/RoomProvider";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthProvider";

const PropertiesTopMenu = () => {
  const { exportImage } = useRoom();
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const { user, logoutUser } = useAuth();

  return (
    <div className="panel-menu">
      <IconLink name="Export" action={exportImage} icon="fa-solid:download" />
      <div className="account-menu-wrapper">
        <IconLink
          name={user ? user.name : "Guest"}
          action={() => setAccountMenuOpen(!accountMenuOpen)}
          classNames="color-dark reverse"
          icon="fa6-solid:user"
          style={{ minWidth: "65px" }}
        />
        {accountMenuOpen && (
          <div className="account-menu">
            <IconLink
              name="Rooms"
              action={(f) => f}
              classNames="color-primary"
              icon="material-symbols:meeting-room-rounded"
            />
            <IconLink
              name="Logout"
              action={logoutUser}
              classNames="color-default"
              icon="mdi:logout"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertiesTopMenu;
