import FurnitureList from "./objectspanel/FurnitureList";
import SidebarHeader from "./SidebarHeader";
import SidebarFooter from "./SidebarFooter";
import RoomName from "./RoomName";
import IconLink from "./IconLink";
import Modal from "./Modal";
import GlobalSettingsForm from "./GlobalSettingsForm";
import { useRoom } from "../contexts/RoomProvider";
import { useState, useEffect } from "react";

const ObjectsPanel = () => {
  const { room } = useRoom();
  const [globalSettingsModalOpen, setGlobalSettingsModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/furniture")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  return (
    <>
      <div className="sidebar">
        <SidebarHeader render={() => <RoomName name={room.name} />} />
        <div className="sidebar-content">
          <h4>Furniture</h4>
          <FurnitureList categories={categories} />
        </div>
        <SidebarFooter
          render={() => (
            <IconLink
              classNames="color-default"
              name="Settings"
              action={() => setGlobalSettingsModalOpen(true)}
              icon="ic:baseline-settings"
            />
          )}
        />
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
    </>
  );
};

export default ObjectsPanel;
