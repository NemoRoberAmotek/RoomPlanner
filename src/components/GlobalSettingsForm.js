import { useGlobalSettings } from "../contexts/GlobalSettingsProvider";
import { useState } from "react";
import PropTypes from "prop-types";

const GlobalSettingsForm = ({ closeModal = (f) => f }) => {
  const { units, setUnits } = useGlobalSettings();
  const [unitsInput, setUnitsInput] = useState(units);

  const submitSettings = (e) => {
    e.preventDefault();
    setUnits(unitsInput);
    closeModal();
  };

  return (
    <form onSubmit={(e) => submitSettings(e)}>
      <div className="form-control">
        <label htmlFor="units">Units of measurement</label>
        <select
          id="units"
          type="text"
          value={unitsInput}
          onChange={(e) => setUnitsInput(e.target.value)}
        >
          <option value="imperial">Imperial</option>
          <option value="metric">Metric</option>
        </select>
      </div>
      <button type="submit" className="button-primary">
        Save settings
      </button>
    </form>
  );
};

GlobalSettingsForm.propTypes = {
  closeModal: PropTypes.func,
};

export default GlobalSettingsForm;
