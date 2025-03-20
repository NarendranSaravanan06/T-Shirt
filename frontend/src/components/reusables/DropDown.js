import React from "react";
import "../../styles/Dropdown.css";

const Dropdown = ({ options, value, onChange, defaultLabel }) => {
  return (
    <select className="dropdown" value={value} onChange={onChange}>
      <option value="">{defaultLabel}</option>
      {options.map((option, index) => (
        <option key={index} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Dropdown;
