import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import useConvertUnits from "../../hooks/useConvertUnits";
import { capitalizeString } from "../../helpers/strings";
import { useGlobalSettings } from "../../contexts/GlobalSettingsProvider";

const RoomCard = ({ room }) => {
  const { units } = useGlobalSettings();
  const { convertUnitsToString } = useConvertUnits(units);

  const getDateString = (date) => {
    const dateTime = new Date(date);

    return dateTime.toLocaleDateString("de-DE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="dashboard-room-card">
      <h4>{room.name}</h4>
      <div className="dashboard-room-card__info">
        <div className="dashboard-room-card__info-row">
          <div className="dashboard-room-card__info--item">
            <small className="info-label">Width</small>
            <span className="info">{convertUnitsToString(room.width)}</span>
          </div>
          <div className="dashboard-room-card__info--item">
            <small className="info-label">Length</small>
            <span className="info">{convertUnitsToString(room.length)}</span>
          </div>
        </div>
        <div className="dashboard-room-card__info-row">
          <div className="dashboard-room-card__info--item">
            <small className="info-label">Floor color</small>
            <div className="info color-item">
              <div
                className="info color"
                style={{ backgroundColor: room.color }}
              ></div>
              <small>{room.color}</small>
            </div>
          </div>
          <div className="dashboard-room-card__info--item">
            <small className="info-label">Texture</small>
            <span className="info">{capitalizeString(room.texture)}</span>
          </div>
        </div>
        <div className="dashboard-room-card__info-row">
          <div className="dashboard-room-card__info--item">
            <small className="info-label">Created</small>
            <span className="info">{getDateString(room.createdAt)}</span>
          </div>
          <div className="dashboard-room-card__info--item">
            <small className="info-label">Last save</small>
            <span className="info">{getDateString(room.lastSave)}</span>
          </div>
        </div>
      </div>
      <div className="button-box">
        <Link to={`/room/${room._id}`} className="button-primary">
          Open
        </Link>
        <button className="button-danger">Delete</button>
      </div>
    </div>
  );
};

RoomCard.propTypes = {
  room: PropTypes.object.isRequired,
};

export default RoomCard;
