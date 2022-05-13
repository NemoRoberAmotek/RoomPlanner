import RoomCard from "../components/dashboard/RoomCard";
import GlobalSettingsForm from "../components/GlobalSettingsForm";
import AddRoomForm from "../components/AddRoomForm";
import IconLink from "../components/IconLink";
import Modal from "../components/Modal";
import { useAuth } from "../contexts/AuthProvider";
import { useState } from "react";
import "../styles/dashboard.css";

const Dashboard = () => {
  const { userRooms } = useAuth();
  const [globalSettingsModalOpen, setGlobalSettingsModalOpen] = useState(false);
  const [addRoomModalOpen, setAddRoomModalOpen] = useState(false);

  return (
    <>
      <div className="dashboard-container">
        <div className="dashboard-top">
          <IconLink
            classNames="color-default"
            name="Settings"
            action={() => setGlobalSettingsModalOpen(true)}
            icon="ic:baseline-settings"
          />
        </div>
        <div>
          <div className="dashboard-heading">
            <h1>My rooms</h1>
            <button
              className="button-secondary"
              onClick={() => setAddRoomModalOpen(true)}
            >
              New room
            </button>
          </div>
          {userRooms.length === 0 && (
            <div className="dashboard-rooms-empty">
              <h2 className="color-primary">
                You have not created any rooms yet.
              </h2>
              <p>Start by creating a room by clicking the button below.</p>
              <button
                className="button-primary"
                onClick={() => setAddRoomModalOpen(true)}
              >
                Create A Room
              </button>
            </div>
          )}
          <div className="dashboard-rooms-grid">
            {userRooms.map((room, i) => (
              <div key={i}>
                <RoomCard room={room} />
              </div>
            ))}
          </div>
        </div>
      </div>
      {globalSettingsModalOpen && (
        <Modal
          render={() => (
            <GlobalSettingsForm
              closeModal={() => setGlobalSettingsModalOpen(false)}
            />
          )}
          onClose={() => setGlobalSettingsModalOpen(false)}
        />
      )}
      {addRoomModalOpen && (
        <Modal
          render={() => (
            <AddRoomForm callback={() => setAddRoomModalOpen(false)} />
          )}
          onClose={() => setAddRoomModalOpen(false)}
        />
      )}
    </>
  );
};

export default Dashboard;
