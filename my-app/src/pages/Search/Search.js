import React, { useState, useEffect } from "react";
import PriceChart from "./PriceChart";

const Search = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [priceData, setPriceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!query.trim() || isSelecting) {
      setSuggestions([]);
      setIsSelecting(false);
      return;
    }

    const fetchSuggestions = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`http://127.0.0.1:5000/items/search/${query}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        console.log("API Response:", data);

        if (!Array.isArray(data)) throw new Error("Invalid data format");

        const formattedData = data.map((item) => ({
          item_id: item[0],
          name: item[1],
          description: item[2],
        }));

        setSuggestions(formattedData.slice(0, 10));
      } catch (err) {
        console.error("Error fetching search results:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => fetchSuggestions(), 300);
    return () => clearTimeout(debounceTimer);
  }, [query, isSelecting]);


  const fetchPriceHistory = async (itemID) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/items/prices/${itemID}?time=1W`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      if (!Array.isArray(data)) throw new Error("Invalid price data format");

      const validData = data.map((entry) => ({
        date: entry[1],
        price: entry[2],
      }));

      setPriceData(validData);
    } catch (error) {
      console.error("Error fetching price history:", error);
      setPriceData(null);
    }
  };

  const handleSelectSuggestion = (item) => {
    setIsSelecting(true);
    setQuery(item.name);
    setSelectedItem(item);
    setSuggestions([]);
    setHoveredIndex(null);
    setIsFocused(false);
    fetchPriceHistory(item.item_id);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".search-container")) {
        setSuggestions([]);
        setIsFocused(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="search-container" style={{ width: "650px", margin: "auto", textAlign: "center", fontFamily: "'Orbitron', sans-serif" }}>
      
      <h2 style={{ fontSize: "25px", color: "#FFFFFF" }}>
        RuneScape Item Search
      </h2>
  
      {/* Search Input */}
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
          border: "1px solid #f72585",
          color: "#FFFFFF",
          outline: "none",
          boxShadow: "0px 0px 10px #f72585",
          fontSize: "17px",
        }}
      />
  
      {/* Search Dropdown List */}
      {suggestions.length > 0 && isFocused && (
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
      )}
  
      {/* Item Info */}
      {selectedItem && (
        <div
          style={{
            marginTop: "20px",
            padding: "18px",
            border: "2px solid #f72585",
            borderRadius: "10px",
            background: "#1A1A2E",
            color: "white",
            boxShadow: "0px 0px 15px #f72585",
            animation: "fadeIn 0.5s ease-in-out",
            width: "100%",
            maxWidth: "640px",
          }}
        >
          <h3 style={{ color: "#FFFFFF", fontSize: "23px" }}>{selectedItem.name}</h3>
          <p style={{ fontSize: "17px" }}><strong style={{ color: "#FFA07A" }}>ID:</strong> {selectedItem.item_id}</p>
          <p style={{ fontSize: "17px" }}><strong style={{ color: "#FFA07A" }}>Description:</strong> {selectedItem.description}</p>
          <p style={{ fontSize: "19px" }}>
            <strong style={{ color: "gold" }}>💰 Current Price:</strong> {priceData?.slice(-1)[0]?.price || "N/A"} GP
          </p>
  
          <PriceChart priceData={priceData} />
        </div>
      )}
  
      {loading && <p style={{ color: "#FFA07A", fontSize: "17px" }}>Loading...</p>}
      {error && <p style={{ color: "red", fontSize: "17px" }}>{error}</p>}
  
      {/* List Animations */}
      <style>
        {`
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(-10px); }
            100% { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
};  

export default Search;
