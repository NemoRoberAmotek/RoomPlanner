import { useRoom } from "../../contexts/RoomProvider";
import { useAuth } from "../../contexts/AuthProvider";
import { useAction } from "../../contexts/ActionProvider";
import { Icon } from "@iconify/react";

const FixedMenu = () => {
  const { room } = useRoom();
  const { updateRoom } = useAuth();
  const { undo, redo } = useAction();

  return (
    <div className="fixed-menu button-box">
      <div className="fixed-menu-left">
        <button className="button-icon primary" onClick={undo}>
          <Icon
            icon="ion:arrow-undo-sharp"
            color="var(--color-primary)"
            height="16"
          />
          <div className="tooltip">
            <small>Undo</small>
          </div>
        </button>
        <button className="button-icon primary" onClick={redo}>
          <Icon
            icon="ion:arrow-redo-sharp"
            color="var(--color-primary)"
            height="18"
          />
          <div className="tooltip">
            <small>Redo</small>
          </div>
        </button>
      </div>
      <button className="button-success" onClick={() => updateRoom(room)}>
        Save Room
      </button>
    </div>
  );
};

export default FixedMenu;
