import { useRoom } from "../../contexts/RoomProvider";
import { useAction } from "../../contexts/ActionProvider";
import {
  capitalizeString,
  tryToInteger,
  tryToFloat,
} from "../../helpers/strings.js";
import { useState, useEffect, useCallback } from "react";
import useConvertUnits from "../../hooks/useConvertUnits";
import { useGlobalSettings } from "../../contexts/GlobalSettingsProvider";

const RoomProperties = () => {
  const [width, setWidth] = useState(0);
  const [length, setLength] = useState(0);

  const { units } = useGlobalSettings();
  const { convertUnits, getUnitName } = useConvertUnits(units);

  const { room, setRoom } = useRoom();
  const { setAction } = useAction();

  useEffect(() => {
    setLength(room.length);
    setWidth(room.width);
  }, [room]);

  const onInputChange = useCallback(
    (e) => {
      let value = tryToInteger(e.target.value);

      if (units === "imperial") {
        value = tryToFloat(e.target.value);
      }

      if (typeof value === "number") {
        value = convertUnits(value, units, "metric");
      }

      const key = e.target.getAttribute("id");

      setRoom({ ...room, [key]: value });

      setAction({
        title: `Room ${capitalizeString(key)} updated.`,
        message: `${capitalizeString(key)} was changed to ${value}`,
      });
    },
    [convertUnits, room, setAction, setRoom, units]
  );

  return (
    <div>
      <h4>{room.name}</h4>
      <div className="form-control">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          value={room.name}
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
            onChange={(e) =>
              setWidth(convertUnits(e.target.value, units, "metric"))
            }
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
            onChange={(e) =>
              setLength(convertUnits(e.target.value, units, "metric"))
            }
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
      </div>
      <div className="form-control">
        <label htmlFor="color">Color</label>
        <input
          type="color"
          id="color"
          value={room.color}
          onChange={onInputChange}
        />
      </div>
    </div>
  );
};

export default RoomProperties;
