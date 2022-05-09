import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import PropTypes from "prop-types";

const ActionContext = createContext();

const ActionProvider = ({ children }) => {
  const [action, setAction] = useState(null);
  const [, setActionList] = useState([]);
  const [actionToUndo, setActionToUndo] = useState(null);
  const [, setActionsUndone] = useState([]);
  const [actionToRedo, setActionToRedo] = useState(null);
  const [message, setMessage] = useState(null);

  const undo = useCallback(() => {
    setActionList((actionList) => {
      const lastAction = actionList[actionList.length - 1];
      if (!lastAction) {
        setMessage({
          title: "There's nothing to undo.",
          content: "There are no actions that can be undone at this moment",
        });
        return actionList;
      }
      setActionToUndo(lastAction);
      setActionsUndone((actionsUndone) => [...actionsUndone, lastAction]);
      return actionList.filter((action) => action.id !== lastAction.id);
    });
  }, [setActionList, setMessage]);

  const redo = useCallback(() => {
    setActionsUndone((actionsUndone) => {
      const lastAction = actionsUndone[actionsUndone.length - 1];
      if (!lastAction) {
        setMessage({
          title: "There's nothing to redo.",
          content: "There are no actions that can be redone at this moment",
        });
        return actionsUndone;
      }
      setActionToRedo(lastAction);
      setActionList((actionList) => [...actionList, lastAction]);
      return actionsUndone.filter((action) => action.id !== lastAction.id);
    });
  }, []);

  function isEqual(obj1, obj2) {
    if (!obj1 || !obj2) return false;
    const props1 = Object.getOwnPropertyNames(obj1);
    const props2 = Object.getOwnPropertyNames(obj2);

    if (props1.length !== props2.length) return false;

    let equal = true;

    props1.forEach((prop) => {
      if (Object.getOwnPropertyNames(obj1[prop])) {
        const innerProps1 = Object.getOwnPropertyNames(obj1[prop]);
        innerProps1.forEach((innerProp) => {
          if (obj1[prop][innerProp] !== obj2[prop][innerProp]) {
            equal = false;
          }
        });
      } else {
        if (obj1[prop] !== obj2[prop]) {
          equal = false;
        }
      }
    });

    return equal;
  }

  useEffect(() => {
    if (!action) return;
    setActionList((actionList) => {
      const lastAction = actionList[actionList.length - 1];

      if (lastAction && isEqual(lastAction.initial, action.initial)) {
        return actionList.map((existing) => {
          if (existing.id === lastAction.id) {
            return action;
          } else {
            return existing;
          }
        });
      }
      return [...actionList, action];
    });
  }, [action]);

  return (
    <ActionContext.Provider
      value={{
        action,
        setAction,
        undo,
        redo,
        actionToUndo,
        actionToRedo,
        setActionToRedo,
        setActionToUndo,
        message,
        setMessage,
      }}
    >
      {children}
    </ActionContext.Provider>
  );
};

export const useAction = () => useContext(ActionContext);

export default ActionProvider;

ActionProvider.propTypes = {
  children: PropTypes.object.isRequired,
};
