import React, { useState, useEffect } from "react";
import debounce from "lodash.debounce";
import "./SearchItem.css";

const SearchItem = ({ onSelectItem }) => {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCooldown, setIsCooldown] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const itemsPerPage = 5;
  const [images, setImages] = useState({});


  useEffect(() => {
    const fetchResults = async () => {
      if (!keyword.trim()) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const sanitizedKeyword = keyword.trim().toLowerCase();
        const response = await fetch(`http://127.0.0.1:5000/items/search/${sanitizedKeyword}`);
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
      setIsLoading(false);
    };

    const debouncedFetch = debounce(fetchResults, 300);
    debouncedFetch();

    return () => {
      debouncedFetch.cancel();
    };
  }, [keyword]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentResults = results.slice(startIndex, endIndex);
  const totalPages = Math.max(1, Math.ceil(results.length / itemsPerPage));

  useEffect(() => {
    const fetchImages = async () => {
      const newImages = {};
      const promises = currentResults.map(async ([itemId]) => {
        if (!images[itemId]) {
          try {
            const response = await fetch(`http://127.0.0.1:5000/items/image_big/${itemId}`);
            const data = await response.json();
            newImages[itemId] = data[0];
          } catch (error) {
            console.error(`Error fetching image for item ${itemId}:`, error);
            newImages[itemId] = null;
          }
        }
      });

      await Promise.all(promises);

      if (Object.keys(newImages).length > 0) {
        setImages((prevImages) => ({ ...prevImages, ...newImages }));
      }
    };

    if (currentResults.length > 0) {
      fetchImages();
    }
  }, [currentResults, images]);

  // Cooldown period to prevent rapid button presses
  const startCooldown = () => {
    setIsCooldown(true);
    setTimeout(() => {
      setIsCooldown(false);
    }, 2000); // Cooldown set to 2 seconds
  };

  const handleDisabledButtonClick = () => {
    setShowTooltip(true);
    setTimeout(() => {
      setShowTooltip(false);
    }, 1500);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages && !isCooldown) {
      setCurrentPage((prev) => prev + 1);
      startCooldown();
    } else if (isCooldown) {
      handleDisabledButtonClick();
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1 && !isCooldown) {
      setCurrentPage((prev) => prev - 1);
      startCooldown();
    } else if (isCooldown) {
      handleDisabledButtonClick();
    }
  };

  return (
    <div className="search-container">
      {/* Input for search */}
      <input
        type="text"
        placeholder="Search for an item..."
        value={keyword}
        onChange={(e) => {
          setKeyword(e.target.value);
          setCurrentPage(1);
        }}
        className="search-input"
      />

      {/* Show loading indicator while fetching data */}
      {isLoading && <p className="loading">Loading...</p>}

      {/* Display search results if available */}
      {currentResults.length > 0 ? (
        <div className="results-container">
          <ul className="search-results">
            {currentResults.map(([itemId, itemName, itemDescription]) => (
              <li
                key={`${itemId}-${itemName}`}
                role="button"
                aria-label={`Select item ${itemName}`}
                onClick={() => onSelectItem(itemId)}
                className="search-result-item"
              >
                {/* Display item image or a placeholder */}
                {images[itemId] ? (
                  <img
                    src={images[itemId]}
                    alt={`Icon of ${itemName}`}
                    className="item-icon"
                  />
                ) : (
                  <div className="image-placeholder"></div>
                )}
                <div className="item-details">
                  <strong>{itemName}</strong>
                  <p>{itemDescription}</p>
                </div>
              </li>
            ))}
          </ul>

          {/* Pagination controls */}
          <div className="pagination">
            <div className="pagination-button-wrapper">
              <button
                className="pagination-button"
                onClick={() => {
                  if (isCooldown) {
                    handleDisabledButtonClick();
                  } else {
                    handlePreviousPage();
                  }
                }}
              >
                Previous
              </button>
              {/* Tooltip for disabled previous button */}
              {showTooltip && isCooldown && (
                <div className="tooltip">Please wait 2 seconds before proceeding</div>
              )}
            </div>

            {/* Pagination information */}
            <span className="pagination-info">
              Page {currentPage} of {totalPages}
            </span>

            <div className="pagination-button-wrapper">
              <button
                className="pagination-button"
                onClick={() => {
                  if (isCooldown) {
                    handleDisabledButtonClick();
                  } else {
                    handleNextPage();
                  }
                }}
              >
                Next
              </button>
              {/* Tooltip for disabled next button */}
              {showTooltip && isCooldown && (
                <div className="tooltip">Please wait 2 seconds before proceeding</div>
              )}
            </div>
          </div>
        </div>
      ) : (
        !isLoading && <p className="no-results">No items found for "{keyword}"</p>
      )}
    </div>
  );
};

export default SearchItem;
