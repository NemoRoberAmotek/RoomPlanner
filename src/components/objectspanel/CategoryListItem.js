import PropTypes from "prop-types";
import FurnitureListItem from "./FurnitureListItem";
import { Icon } from "@iconify/react";
import { useState } from "react";

const CategoryListItem = ({ category }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <div
        className="category-heading"
        onClick={() => setIsOpen(!isOpen)}
        onKeyPress={() => setIsOpen(!isOpen)}
        role="menuitem"
        tabIndex="0"
      >
        <div className="category-title">
          <Icon
            icon={`${category.icon}`}
            className="color-primary"
            height="24"
          />
          <p className="p-bold">{category.name}</p>
        </div>
        <Icon
          icon="fa-solid:caret-down"
          className="color-default"
          height="16"
        />
      </div>
      {isOpen && (
        <div className="category-list-furniture">
          {category.furniture.map((furniture) => (
            <FurnitureListItem key={furniture.id} furniture={furniture} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryListItem;

CategoryListItem.propTypes = {
  category: PropTypes.object.isRequired,
};
