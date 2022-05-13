import PropTypes from "prop-types";

const Modal = ({ render = (f) => f, onClose = (f) => f }) => {
  return (
    <div className="modal-outer">
      <div className="modal-inner">
        <div className="modal-top-bar">
          <button className="button-default" onClick={onClose}>
            Close
          </button>
        </div>

        {render()}
      </div>
    </div>
  );
};

Modal.propTypes = {
  render: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Modal;
