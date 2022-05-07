import { useRoom } from "../../contexts/RoomProvider";
import { useAction } from "../../contexts/ActionProvider";
import {
  capitalizeString,
  tryToInteger,
  tryToFloat,
} from "../../helpers/strings.js";
import { useGlobalSettings } from "../../contexts/GlobalSettingsProvider";
import useComputation from "../../hooks/useComputation";
import { useState, useEffect, useCallback } from "react";
import { Icon } from "@iconify/react";
import useConvertUnits from "../../hooks/useConvertUnits";

const FurnitureProperties = () => {
  const [formWarning, setFormWarning] = useState();

  const { units } = useGlobalSettings();
  const { convertUnits, getUnitName } = useConvertUnits(units);

  const {
    selectedFurniture,
    room,
    setSelectedFurniture,
    updateRoomFurniture,
    removeFurniture,
  } = useRoom();
  const { setAction } = useAction();
  const { snapToRoom } = useComputation(room);

  const [width, setWidth] = useState(0);

  const [length, setLength] = useState(0);

  useEffect(() => {
    setLength(selectedFurniture.length);
    setWidth(selectedFurniture.width);
  }, [selectedFurniture]);

  const onInputChange = useCallback(
    (e) => {
      let value = tryToInteger(e.target.value);
      const key = e.target.getAttribute("id");

      if (units === "imperial") {
        value = tryToFloat(e.target.value);
      }

      if (typeof value === "number") {
        value = convertUnits(value, units, "metric");
      }

      let updatedItem = {
        ...selectedFurniture,
        [key]: value,
      };

      if (key === "posX" || key === "posY") {
        updatedItem = {
          ...selectedFurniture,
          position: {
            ...selectedFurniture.position,
            [key]: value,
          },
        };
      }

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

      setAction({
        title: `${selectedFurniture.name} ${capitalizeString(key)} updated.`,
        message: `${capitalizeString(key)} was changed to ${value}`,
      });
    },
    [
      units,
      convertUnits,
      selectedFurniture,
      setAction,
      setSelectedFurniture,
      snapToRoom,
      updateRoomFurniture,
    ]
  );

  return (
    <div>
      <h4>{selectedFurniture.name}</h4>
      <div className="form-control">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          value={selectedFurniture.name}
          onChange={onInputChange}
        />
      </div>
      <div className="form-col">
        <div className="form-control">
          <label htmlFor="width">Width ({getUnitName()})</label>
          <input
            type="number"
            id="width"
            value={convertUnits(width, "metric", units)}
            onChange={(e) => {
              const newWidth = convertUnits(e.target.value, units, "metric");
              setWidth(newWidth);
              if (newWidth > room.width) {
                setFormWarning({
                  message: "Furniture width is higher than room width!",
                });
              } else {
                setFormWarning(null);
              }
            }}
            onBlur={onInputChange}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                onInputChange(e);
              }
            }}
            min={0}
            step={units === "imperial" ? "0.01" : "1"}
          />
        </div>
        <div className="form-control">
          <label htmlFor="length">Length ({getUnitName()})</label>
          <input
            type="number"
            id="length"
            value={convertUnits(length, "metric", units)}
            onChange={(e) => {
              const newLength = convertUnits(e.target.value, units, "metric");
              setLength(newLength);
              if (newLength > room.length) {
                setFormWarning({
                  message: "Furniture length is higher than room length!",
                });
              } else {
                setFormWarning(null);
              }
            }}
            onBlur={onInputChange}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                onInputChange(e);
              }
            }}
            min={0}
            step={units === "imperial" ? 0.01 : 1}
          />
        </div>
      </div>
      {formWarning && (
        <div className="input-warning">
          <Icon icon="ic:baseline-warning" color="#f47f36" height="24" />
          <small>{formWarning.message}</small>
        </div>
      )}

      <div className="form-col">
        <div className="form-control">
          <label htmlFor="posX">Position X ({getUnitName()})</label>
          {room.width - selectedFurniture.width <= 0 ? (
            <small>Only one position possible</small>
          ) : (
            <div className="range-input-wrap">
              <input
                type="range"
                id="posX"
                min={0}
                max={convertUnits(
                  room.width - selectedFurniture.width,
                  "metric",
                  units
                )}
                value={convertUnits(
                  selectedFurniture.position.posX,
                  "metric",
                  units
                )}
                onChange={onInputChange}
                step={units === "imperial" ? 0.01 : 1}
              />
              <small>
                {convertUnits(selectedFurniture.position.posX, "metric", units)}
              </small>
            </div>
          )}
        </div>
        <div className="form-control">
          <label htmlFor="posY">Position Y ({getUnitName()})</label>
          {room.length - selectedFurniture.length <= 0 ? (
            <small>Only one position possible</small>
          ) : (
            <div className="range-input-wrap">
              <input
                type="range"
                id="posY"
                min={0}
                max={convertUnits(
                  room.length - selectedFurniture.length,
                  "metric",
                  units
                )}
                value={convertUnits(
                  selectedFurniture.position.posY,
                  "metric",
                  units
                )}
                onChange={onInputChange}
                step={units === "imperial" ? 0.01 : 1}
              />
              <small>
                {convertUnits(selectedFurniture.position.posY, "metric", units)}
              </small>
            </div>
          )}
        </div>
      </div>
      <div className="form-control">
        <label htmlFor="color">Color</label>
        <input
          type="color"
          id="color"
          value={selectedFurniture.color}
          onChange={onInputChange}
        />
      </div>
      <button
        className="button-danger"
        onClick={() => removeFurniture(selectedFurniture)}
      >
        Remove
      </button>
    </div>
  );
};

export default FurnitureProperties;
