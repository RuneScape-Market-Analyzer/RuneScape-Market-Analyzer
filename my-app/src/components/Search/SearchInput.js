import React from "react";

const SearchInput = ({ query, setQuery, setSelectedItem, setIsFocused }) => {
  return (
    <input
      type="text"
      placeholder="Search Item..."
      value={query}
      onChange={(e) => {
        setQuery(e.target.value);
        setSelectedItem(null);
        setIsFocused(true);
      }}
      onFocus={() => setIsFocused(true)}
      style={{
        width: "100%",
        padding: "14px",
        borderRadius: "5px",
        background: "#1A1A2E",
        border: "2px solid #f72585",
        color: "#FFFFFF",
        outline: "none",
        boxShadow: "0px 0px 10px #f72585",
        fontSize: "17px",
      }}
    />
  );
};

export default SearchInput;
