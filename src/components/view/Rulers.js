import { useRoom } from "../../contexts/RoomProvider";
import { useGlobalSettings } from "../../contexts/GlobalSettingsProvider";
import useConverUnits from "../../hooks/useConvertUnits";
import useComputation from "../../hooks/useComputation";

const Rulers = () => {
  const {
    room,
    computedRoom,
    rotate,
    selectedFurniture,
    setSelectedFurniture,
  } = useRoom();
  const { units } = useGlobalSettings();

  const { dataToComputed } = useComputation(computedRoom, room, rotate);

  const { convertUnitsToString } = useConverUnits(units);

  const onRulerItemClick = (item) => {
    if (selectedFurniture) {
      if (item.placement_id === selectedFurniture.placement_id) return;
    }
    const foundItem = room.furniture.find(
      (furniture) => furniture.placement_id === item.placement_id
    );
    console.log(foundItem);
    setSelectedFurniture(foundItem);
  };

  return (
    <>
      <div
        className="ruler ruler-x"
        style={{ width: `${computedRoom.computedWidth}px` }}
      >
        <div className="ruler-numbers">
          <small>{convertUnitsToString(0)}</small>
          <small>{convertUnitsToString(room.width)}</small>
        </div>
        <div className="ruler-line">
          {room.furniture.map((item) => (
            <div
              key={item.placement_id}
              className={`ruler-line-item ${
                selectedFurniture &&
                item.placement_id === selectedFurniture.placement_id &&
                "selected"
              }`}
              onClick={() => onRulerItemClick(item)}
              onKeyPress={(e) => {
                if (e.keyCode === "Enter") {
                  onRulerItemClick(item);
                }
              }}
              tabIndex="0"
              role="button"
            >
              <div
                style={{
                  left: dataToComputed(item).posX,
                  backgroundColor: item.color,
                }}
                className="ruler-line-item__dot"
              ></div>
              <div
                className="ruler-line-item__between"
                style={{
                  left: dataToComputed(item).posX,
                  width: dataToComputed(item).width,
                  backgroundColor: item.color,
                }}
              >
                <small style={{ color: item.color }}>
                  {convertUnitsToString(item.width)}
                </small>
              </div>
              <div
                style={{
                  left: dataToComputed(item).posX + dataToComputed(item).width,
                  backgroundColor: item.color,
                }}
                className="ruler-line-item__dot"
              ></div>
            </div>
          ))}
        </div>
      </div>
      <div
        className="ruler ruler-y"
        style={{ height: `${computedRoom.computedHeight}px` }}
      >
        <div className="ruler-numbers">
          <small>{convertUnitsToString(0)}</small>
          <small>{convertUnitsToString(room.length)}</small>
        </div>
        <div className="ruler-line">
          {room.furniture.map((item) => (
            <div
              key={item.placement_id}
              className={`ruler-line-item ${
                selectedFurniture &&
                item.placement_id === selectedFurniture.placement_id &&
                "selected"
              }`}
              onClick={() => onRulerItemClick(item)}
              onKeyPress={(e) => {
                if (e.keyCode === "Enter") {
                  onRulerItemClick(item);
                }
              }}
              tabIndex="0"
              role="button"
            >
              <div
                style={{
                  top: dataToComputed(item).posY,
                  backgroundColor: item.color,
                }}
                className="ruler-line-item__dot"
              ></div>
              <div
                className="ruler-line-item__between"
                style={{
                  top: dataToComputed(item).posY,
                  height: dataToComputed(item).height,
                  backgroundColor: item.color,
                }}
              >
                <small style={{ color: item.color }}>
                  {convertUnitsToString(item.length)}
                </small>
              </div>
              <div
                style={{
                  top: dataToComputed(item).posY + dataToComputed(item).height,
                  backgroundColor: item.color,
                }}
                className="ruler-line-item__dot"
              ></div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Rulers;
