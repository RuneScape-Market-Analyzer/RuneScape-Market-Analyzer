import React, { useState, useEffect } from "react";
import SearchInput from "../../components/Search/SearchInput";
import SuggestionList from "../../components/Search/SuggestionList";
import ItemInfo from "../../components/Search/ItemInfo";
import { calculatePriceDifference } from "./priceDifference";

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
  const priceChange = calculatePriceDifference(priceData);

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

  const handleSelectSuggestion = async (item) => {
    setIsSelecting(true);
    setQuery(item.name);
    setSelectedItem(item);
    setSuggestions([]);
    setHoveredIndex(null);
    setIsFocused(false);
    fetchPriceHistory(item.item_id);

    try {
      const [bigImageRes, smallImageRes] = await Promise.all([
        fetch(`http://127.0.0.1:5000/items/image_big/${item.item_id}`),
        fetch(`http://127.0.0.1:5000/items/image_small/${item.item_id}`)
      ]);

      const [bigImageData, smallImageData] = await Promise.all([
        bigImageRes.json(),
        smallImageRes.json()
      ]);

      setSelectedItem((prev) => ({
        ...prev,
        bigImageUrl: bigImageData[0],
        smallImageUrl: smallImageData[0],
      }));
    } catch (error) {
      console.error("Error fetching item images:", error);
    }
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

      <SearchInput
        query={query}
        setQuery={setQuery}
        setSelectedItem={setSelectedItem}
        setIsFocused={setIsFocused}
      />

      {suggestions.length > 0 && isFocused && (
        <SuggestionList
          suggestions={suggestions}
          handleSelectSuggestion={handleSelectSuggestion}
          hoveredIndex={hoveredIndex}
          setHoveredIndex={setHoveredIndex}
        />
      )}

      {selectedItem && (
        <ItemInfo
          selectedItem={selectedItem}
          priceData={priceData}
          priceChange={priceChange}
        />
      )}

      {loading && <p style={{ color: "#FFA07A", fontSize: "17px" }}>Loading...</p>}
      {error && <p style={{ color: "red", fontSize: "17px" }}>{error}</p>}

      <style>
        {`
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(-10px); }
            100% { opacity: 1; transform: translateY(0); }
          }

          @keyframes fadeInPop {
            0% {
              opacity: 0;
              transform: scale(1) translateY(-50%);
            }
            100% {
              opacity: 1;
              transform: scale(1) translateY(-50%);
            }
          }
        `}
      </style>
    </div>
  );
};

export default Search;