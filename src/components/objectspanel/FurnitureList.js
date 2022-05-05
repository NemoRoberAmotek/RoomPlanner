import PropTypes from "prop-types";
import CategoryListItem from "./CategoryListItem";

const FurnitureList = ({ categories = [] }) => {
  return (
    <div className="furniture-list">
      {categories.map((category) => (
        <div key={category.id}>
          <CategoryListItem category={category} />
        </div>
      ))}
    </div>
  );
};

export default FurnitureList;

FurnitureList.propTypes = {
  categories: PropTypes.array.isRequired,
};
