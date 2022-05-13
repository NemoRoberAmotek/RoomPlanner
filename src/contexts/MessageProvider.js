import { useState, createContext, useContext } from "react";
import PropTypes from "prop-types";

const MessageContext = createContext();

const MessageProvider = ({ children }) => {
  const [message, setMessage] = useState(null);

  return (
    <MessageContext.Provider value={{ message, setMessage }}>
      {children}
    </MessageContext.Provider>
  );
};

MessageProvider.propTypes = {
  children: PropTypes.object.isRequired,
};

export const useMessage = () => useContext(MessageContext);

export default MessageProvider;
