import React from "react";

const SuggestionList = ({ suggestions, handleSelectSuggestion, hoveredIndex, setHoveredIndex }) => {
  return (
    <div style={{ marginTop: "15px", textAlign: "left", width: "100%" }}>
      {suggestions.map((item, index) => (
        <div
          key={item.item_id}
          onClick={() => handleSelectSuggestion(item)}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          style={{
            padding: "14px",
            margin: "6px 0",
            width: "100%",
            background: hoveredIndex === index ? "#f72585" : "#1A1A2E",
            color: hoveredIndex === index ? "#000" : "white",
            fontSize: "19px",
            borderBottom: "1px solid #f72585",
            cursor: "pointer",
            opacity: 0,
            animation: `fadeIn 0.3s ease-in-out ${index * 0.1}s forwards`,
            transition: "background 0.3s, transform 0.2s",
            transform: hoveredIndex === index ? "scale(1.02)" : "scale(1)",
          }}
        >
          <strong>{item.name}</strong>
        </div>
      ))}
    </div>
  );
};

export default SuggestionList;
