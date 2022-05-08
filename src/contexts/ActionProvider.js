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
  const [actionList, setActionList] = useState([]);
  const [actionToUndo, setActionToUndo] = useState(null);

  const undo = useCallback(() => {
    const lastAction = actionList[actionList.length - 1];
    if (!lastAction) return;

    setActionToUndo(lastAction);
    setActionList((actionList) =>
      actionList.filter((action) => action.id !== lastAction.id)
    );
    /* TO DO: set message when actionlist is empty "Nothing to undo!"*/
  }, [actionList]);

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
        return actionList;
      }
      return [...actionList, action];
    });
  }, [action]);

  return (
    <ActionContext.Provider
      value={{ action, setAction, undo, actionToUndo, setActionToUndo }}
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
