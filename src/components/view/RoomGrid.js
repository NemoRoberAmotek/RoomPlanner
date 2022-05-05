import { useRoom } from "../../contexts/RoomProvider";
import { useEffect, useState } from "react";

const RoomGrid = () => {
  const { room } = useRoom();
  const [squareSize, setSquareSize] = useState(room.computedWidth / 10);

  const squaresX = room.computedWidth / squareSize;
  const squaresY = room.computedHeight / squareSize;
  console.log(squaresX, squaresY);
  const arrX = Array.apply(null, Array(squaresX)).map(function () {});
  const arrY = Array.apply(null, Array(squaresY)).map(function () {});

  useEffect(() => {
    setSquareSize(room.computedWidth / 10);
  }, [room]);

  console.log(room);

  return (
    <div style={{ position: "absolute", zIndex: 1, pointerEvents: "none" }}>
      {arrY.map((i) => {
        return (
          <div className="grid-row" key={i}>
            {arrX.map((x) => {
              return (
                <div
                  className="square"
                  style={{
                    width: squareSize,
                    height: squareSize,
                    border: "1px inset black",
                  }}
                  key={x}
                ></div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default RoomGrid;
