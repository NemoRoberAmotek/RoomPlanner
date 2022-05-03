import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

const ActionContext = createContext();

const ActionProvider = ({ children }) => {
  const [action, setAction] = useState(null);

  return (
    <ActionContext.Provider value={{ action, setAction }}>
      {children}
    </ActionContext.Provider>
  );
};

export const useAction = () => useContext(ActionContext);

export default ActionProvider;

ActionProvider.propTypes = {
  children: PropTypes.object.isRequired,
};
