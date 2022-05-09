import { Icon } from "@iconify/react";
import { useAction } from "../contexts/ActionProvider";
import { useEffect } from "react";

const ActionAlert = () => {
  const { action, setAction, undo } = useAction();

  useEffect(() => {
    if (action) {
      setTimeout(function () {
        setAction(null);
      }, 5000);
    }
  }, [action, setAction]);

  if (!action) return;

  return (
    <div className="action-alert">
      <Icon
        icon="akar-icons:circle-check-fill"
        className="color-success"
        height="24"
      />
      <div>
        <p className="p-bold">{action.title}</p>
        <small>{action.message}</small>
        <div>
          <small
            className="action-undo-button"
            onClick={undo}
            role="button"
            tabIndex="0"
            onKeyPress={undo}
          >
            Undo
          </small>
        </div>
      </div>
    </div>
  );
};

export default ActionAlert;
