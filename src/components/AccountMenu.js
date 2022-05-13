import IconLink from "./IconLink";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthProvider";
import { useNavigate, useLocation } from "react-router-dom";
import { useRoom } from "../contexts/RoomProvider";

const AccountMenu = () => {
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const { user, logoutUser, updateRoom } = useAuth();
  const { room } = useRoom();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    window.addEventListener("click", (e) => {
      if (
        !e.target.closest(".account-menu") &&
        !e.target.classList.contains("account-menu") &&
        !e.target.classList.contains("account-menu-wrapper") &&
        !e.target.closest(".account-menu-wrapper")
      ) {
        setAccountMenuOpen(false);
      }
    });
  }, []);

  const saveRoomAndLeave = async () => {
    const res = await updateRoom(room);
    if (res.status === 200) {
      navigate("/dashboard");
    }
  };

  return (
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
          {user && location.pathname !== "/dashboard" && (
            <IconLink
              name="Rooms"
              action={saveRoomAndLeave}
              classNames="color-primary"
              icon="material-symbols:meeting-room-rounded"
            />
          )}
          <IconLink
            name="Logout"
            action={logoutUser}
            classNames="color-default"
            icon="mdi:logout"
          />
        </div>
      )}
    </div>
  );
};

export default AccountMenu;
