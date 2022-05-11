import IconLink from "../IconLink";
import { useRoom } from "../../contexts/RoomProvider";
import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";

const PropertiesTopMenu = () => {
  const { exportImage } = useRoom();
  const { isLoading, isAuthenticated, user, logout } = useAuth0();
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="panel-menu">
      <IconLink name="Export" action={exportImage} icon="fa-solid:download" />
      <div className="account-menu-wrapper">
        <IconLink
          name={isAuthenticated ? user.name : "Guest"}
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
              action={() => logout({ returnTo: window.location.origin })}
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
