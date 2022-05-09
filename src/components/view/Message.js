import { useAction } from "../../contexts/ActionProvider";
import { useEffect } from "react";

const Message = () => {
  const { message, setMessage } = useAction();

  useEffect(() => {
    if (!message) return;
    setTimeout(function () {
      setMessage(null);
    }, 5000);
  }, [message, setMessage]);

  if (!message) return null;
  return (
    <div className="message">
      <p className="p-bold">{message.title}</p>
      <small>{message.content}</small>
    </div>
  );
};

export default Message;
