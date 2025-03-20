import React from "react";
import Dropdown from "./DropDown";
import Input from "./Input";
import Button from "./Button";
import "../../styles/Filters.css";

const Filters = ({ searchQuery, handleSearch, categories, selectedCategory, setSelectedCategory, selectedGender, setSelectedGender, handleFilter }) => {
  return (
    <div className="filters">
      {/* Search Input */}
      <Input type="text" placeholder="Search products..." value={searchQuery} onChange={handleSearch} />

      {/* Category Dropdown */}
      <Dropdown
        options={categories.map(cat => ({ value: cat.categoryName, label: cat.categoryName }))}
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        defaultLabel="All Categories"
      />

      {/* Gender Dropdown */}
      <Dropdown
        options={[
          { value: "male", label: "Male" },
          { value: "female", label: "Female" },
          { value: "unisex", label: "Unisex" },
        ]}
        value={selectedGender}
        onChange={(e) => setSelectedGender(e.target.value)}
        defaultLabel="All Genders"
      />

      {/* Apply Filters Button */}
      <Button label="Apply Filters" onClick={handleFilter} color="primary" size="medium"/>
    </div>
  );
};

export default Filters;
