import PropTypes from "prop-types";
import { Icon } from "@iconify/react";
import { useState, useRef, useEffect, useCallback } from "react";
import useInput from "../hooks/useInput";
import { useRoom } from "../contexts/RoomProvider";
import { useAction } from "../contexts/ActionProvider";

const RoomName = ({ name }) => {
  const [isEdit, setIsEdit] = useState(false);
  const [nameEditProps] = useInput(name);
  const { room, setRoom } = useRoom();
  const { setAction } = useAction();

  const input = useRef(null);

  const submitInput = (e) => {
    e.preventDefault();
    const editedRoom = { ...room, name: nameEditProps.value };
    setRoom(editedRoom);
    setIsEdit(false);
    setAction({
      title: "Room name was updated.",
      message: `Room name was changed to ${room.name}`,
    });
  };

  const toggleInput = useCallback(() => setIsEdit(!isEdit), [
    setIsEdit,
    isEdit,
  ]);

  useEffect(() => {
    if (isEdit) {
      const field = input.current;

      field.focus();
      field.addEventListener("focusout", toggleInput);

      return () => field.removeEventListener("focusout", toggleInput);
    }
  }, [isEdit, toggleInput]);

  return (
    <div className="room-name">
      <Icon
        icon="fa-solid:edit"
        className="toggle-room-name-edit color-primary"
        height="16"
        onClick={toggleInput}
        onKeyPress={toggleInput}
        role="button"
        tabIndex="0"
        style={{ padding: ".5rem" }}
      />
      {!isEdit && (
        <input
          type="text"
          value={name}
          className="p-bold color-primary"
          disabled
        />
      )}
      {isEdit && (
        <form onSubmit={(e) => submitInput(e)}>
          <input
            ref={input}
            id="nameInput"
            type="text"
            className="p-bold color-primary"
            {...nameEditProps}
          />
        </form>
      )}
    </div>
  );
};

export default RoomName;

RoomName.propTypes = {
  name: PropTypes.string.isRequired,
};
