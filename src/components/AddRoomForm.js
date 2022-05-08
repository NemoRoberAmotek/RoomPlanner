import { useRoom } from "../contexts/RoomProvider";
import useInput from "../hooks/useInput";
import { tryToInteger } from "../helpers/strings";

const AddRoomForm = () => {
  const { setRoom, clearAll } = useRoom();
  const [nameProps, resetName] = useInput("");
  const [widthProps, resetWidth] = useInput(0);
  const [heightProps, resetHeight] = useInput(0);
  const [colorProps, resetColor] = useInput("#ffffff");

  const onSubmit = (e) => {
    e.preventDefault();
    const room = {
      name: nameProps.value,
      width: tryToInteger(widthProps.value),
      length: tryToInteger(heightProps.value),
      color: colorProps.value,
      furniture: [],
    };

    setRoom(room);
    clearAll();
    resetName();
    resetWidth();
    resetHeight();
    resetColor();
  };

  return (
    <div>
      <h2>Add your first room.</h2>
      <form onSubmit={(e) => onSubmit(e)}>
        <div className="form-control">
          <label htmlFor="roomname">Room name</label>
          <input
            type="text"
            id="roomname"
            placeholder="Your room's name"
            {...nameProps}
          />
        </div>
        <div className="form-control">
          <label htmlFor="roomwidth">Room floor width</label>
          <input
            type="number"
            id="roomwidth"
            placeholder="Your room's width"
            {...widthProps}
          />
        </div>
        <div className="form-control">
          <label htmlFor="roomlength">Room floor length</label>
          <input
            type="number"
            id="roomlength"
            placeholder="Your room's length"
            {...heightProps}
          />
        </div>
        <div className="form-control">
          <label htmlFor="roomcolor">Room floor color</label>
          <input
            type="color"
            id="roomcolor"
            placeholder="Your room floor's color"
            {...colorProps}
          />
        </div>
        <button type="submit" className="button-primary">
          Add room
        </button>
      </form>
    </div>
  );
};

export default AddRoomForm;
