import PropTypes from "prop-types";
import { useState, createContext, useContext } from "react";

const ViewContext = createContext();

const ViewProvider = ({ children }) => {
  const [rotate, setRotate] = useState(0);
  const [scale, setScale] = useState(1.0);
  const [furniture, setFurniture] = useState([]);
  const [selectedFurniture, setSelectedFurniture] = useState(null);

  const rotateRoomLeft = () => {
    if (rotate > 0) {
      setRotate(rotate - 90);
    }
  };

  const rotateRoomRight = () => {
    if (rotate < 360) {
      setRotate(rotate + 90);
    }
  };

  const zoomRoomIn = () => {
    setScale(scale + 0.2);
  };

  const zoomRoomOut = () => {
    if (scale > 0) {
      setScale(scale - 0.2);
    }
  };

  return (
    <ViewContext.Provider
      value={{
        rotateRoomLeft,
        rotateRoomRight,
        zoomRoomIn,
        zoomRoomOut,
        furniture,
        setFurniture,
        rotate,
        scale,
        selectedFurniture,
        setSelectedFurniture,
      }}
    >
      {children}
    </ViewContext.Provider>
  );
};

export const useView = () => useContext(ViewContext);

ViewProvider.propTypes = {
  children: PropTypes.object.isRequired,
};

export default ViewProvider;
