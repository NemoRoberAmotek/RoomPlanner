import { useGlobalSettings } from "../contexts/GlobalSettingsProvider";
import { useAction } from "../contexts/ActionProvider";
import { useState } from "react";
import PropTypes from "prop-types";

const GlobalSettingsForm = ({ closeModal = (f) => f }) => {
  const { grid, setGrid, units, setUnits } = useGlobalSettings();
  const [gridInput, setGridInput] = useState(grid);
  const [unitsInput, setUnitsInput] = useState(units);

  const { setAction } = useAction();

  const submitSettings = (e) => {
    e.preventDefault();
    setGrid(gridInput);
    setUnits(unitsInput);
    closeModal();

    setAction({
      title: "Global settings changed.",
      message: "Global settings were successfully saved.",
    });
  };

  return (
    <form onSubmit={(e) => submitSettings(e)}>
      <div className="form-control-checkbox">
        <input
          id="grid"
          type="checkbox"
          checked={gridInput ? true : false}
          onChange={() => setGridInput(!gridInput)}
        />
        <label htmlFor="grid">Enable grid?</label>
      </div>
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
      <input type="submit" className="button-primary" value="Save settings" />
    </form>
  );
};

GlobalSettingsForm.propTypes = {
  closeModal: PropTypes.func,
};

export default GlobalSettingsForm;
