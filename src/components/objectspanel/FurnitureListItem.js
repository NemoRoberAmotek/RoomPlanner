import PropTypes from "prop-types";
import { ItemTypes } from "../../Constants";
import { useDrag } from "react-dnd";
import useConvertUnits from "../../hooks/useConvertUnits";
import { useGlobalSettings } from "../../contexts/GlobalSettingsProvider";

const FurnitureListItem = ({ furniture }) => {
  const { units } = useGlobalSettings();
  const convertUnits = useConvertUnits(units);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.CARD,
    item: furniture,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      className="furniture-list-item"
      ref={drag}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <small className="small-bold">{furniture.name}</small>
      <small className="color-default">
        {convertUnits(furniture.width)} - {convertUnits(furniture.length)}
      </small>
    </div>
  );
};

export default FurnitureListItem;

FurnitureListItem.propTypes = {
  furniture: PropTypes.object.isRequired,
};
