import { useRoom } from "../../contexts/RoomProvider";

const SnapLines = () => {
  const { snappingX, snappingY } = useRoom();

  return (
    <>
      {snappingY && <div className="snap-line snap-line-y"></div>}
      {snappingX && <div className="snap-line snap-line-x"></div>}
    </>
  );
};

export default SnapLines;
