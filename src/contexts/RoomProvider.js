import { useState, createContext, useContext } from "react";
import PropTypes from "prop-types";

const RoomContext = createContext();

const roomDummy = {
  name: "My Living Room",
  width: 400,
  length: 200,
  color: "#FFFFFF",
};

const RoomProvider = ({ children }) => {
  const [room, setRoom] = useState(roomDummy);

  return (
    <RoomContext.Provider value={{ room, setRoom }}>
      {children}
    </RoomContext.Provider>
  );
};

export default RoomProvider;

export const useRoom = () => useContext(RoomContext);

RoomProvider.propTypes = {
  children: PropTypes.object.isRequired,
};
