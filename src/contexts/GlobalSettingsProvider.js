import PropTypes from "prop-types";
import { createContext, useContext, useState } from "react";

const GlobalSettingsContext = createContext();

const GlobalSettingsProvider = ({ children }) => {
  const [units, setUnits] = useState("metric");
  const [grid, setGrid] = useState(false);

  return (
    <GlobalSettingsContext.Provider value={{ grid, setGrid, units, setUnits }}>
      {children}
    </GlobalSettingsContext.Provider>
  );
};

export const useGlobalSettings = () => useContext(GlobalSettingsContext);

GlobalSettingsProvider.propTypes = {
  children: PropTypes.object.isRequired,
};

export default GlobalSettingsProvider;
