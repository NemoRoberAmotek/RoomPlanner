import { useRoom } from "../../contexts/RoomProvider";
import { useAction } from "../../contexts/ActionProvider";
import { capitalizeString } from "../../helpers/strings.js";
import useComputation from "../../hooks/useComputation";

const Properties = () => {
  const {
    room,
    setRoom,
    selectedFurniture,
    setSelectedFurniture,
    updateRoomFurniture,
    removeFuniture,
  } = useRoom();
  const { setAction } = useAction();
  const { snapToRoom } = useComputation(room);

  const onInputChange = (e) => {
    let object = "Room";
    if (selectedFurniture) {
      object = "Furniture";
    }
    const value = e.target.value;
    const key = e.target.getAttribute("id");

    if (!selectedFurniture) {
      setRoom({ ...room, [key]: value });
    } else {
      const updatedItem = {
        ...selectedFurniture,
        [key]: value,
      };
      const [snappedPosX, snappedPosY] = snapToRoom(
        updatedItem,
        updatedItem.position.posX,
        updatedItem.position.posY
      );

      const snappedItem = {
        ...updatedItem,
        position: {
          posX: snappedPosX,
          posY: snappedPosY,
        },
      };
      setSelectedFurniture(snappedItem);
      updateRoomFurniture(snappedItem);
    }

    setAction({
      title: `${object} ${capitalizeString(key)} updated.`,
      message: `${capitalizeString(key)} was changed to ${value}`,
    });
  };

  return (
    <div>
      <h4>{selectedFurniture ? selectedFurniture.name : room.name}</h4>
      <div className="form-control">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          value={selectedFurniture ? selectedFurniture.name : room.name}
          onChange={onInputChange}
        />
      </div>
      <div className="form-col">
        <div className="form-control">
          <label htmlFor="width">Width (cm)</label>
          <input
            type="number"
            id="width"
            value={selectedFurniture ? selectedFurniture.width : room.width}
            onChange={onInputChange}
            min={10}
          />
        </div>
        <div className="form-control">
          <label htmlFor="length">Length (cm)</label>
          <input
            type="number"
            id="length"
            value={selectedFurniture ? selectedFurniture.length : room.length}
            onChange={onInputChange}
            min={10}
          />
        </div>
      </div>
      {selectedFurniture && (
        <button
          className="button-default"
          onClick={() => removeFuniture(selectedFurniture)}
        >
          Remove
        </button>
      )}
    </div>
  );
};

export default Properties;
