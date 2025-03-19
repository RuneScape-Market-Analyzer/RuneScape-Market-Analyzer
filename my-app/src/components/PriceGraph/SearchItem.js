import React, { useState, useEffect } from "react";
import debounce from "lodash.debounce";
import "./SearchItem.css"; // Import styles

const SearchItem = ({ onSelectItem }) => {
  // State for the search keyword
  const [keyword, setKeyword] = useState("");
  // State for search results
  const [results, setResults] = useState([]);
  // State to track loading status
  const [isLoading, setIsLoading] = useState(false);
  // State for the current page number
  const [currentPage, setCurrentPage] = useState(1);
  // Cooldown state to prevent rapid navigation
  const [isCooldown, setIsCooldown] = useState(false);
  // State for tooltip visibility (used when navigation is disabled)
  const [showTooltip, setShowTooltip] = useState(false);
  // Number of items to display per page
  const itemsPerPage = 5;
  // Cache for item images
  const [images, setImages] = useState({});

  // Fetch search results based on the keyword, with debounce to avoid excessive API calls
  useEffect(() => {
    const fetchResults = async () => {
      if (!keyword.trim()) {
        // If the keyword is empty, clear results
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const sanitizedKeyword = keyword.trim().toLowerCase(); // Sanitize keyword input
        const response = await fetch(`http://127.0.0.1:5000/items/search/${sanitizedKeyword}`);
        const data = await response.json();
        setResults(data); // Save fetched results
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
      setIsLoading(false);
    };

    const debouncedFetch = debounce(fetchResults, 300); // Debounce API calls to run after 300ms
    debouncedFetch();

    return () => {
      debouncedFetch.cancel(); // Clean up debounce on unmount or keyword change
    };
  }, [keyword]);

  // Calculate indices for pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  // Get the current page's results
  const currentResults = results.slice(startIndex, endIndex);
  // Calculate the total number of pages
  const totalPages = Math.max(1, Math.ceil(results.length / itemsPerPage));

  // Fetch images for the current page's results
  useEffect(() => {
    const fetchImages = async () => {
      const newImages = {};
      const promises = currentResults.map(async ([itemId]) => {
        if (!images[itemId]) {
          try {
            const response = await fetch(`http://127.0.0.1:5000/items/image_big/${itemId}`);
            const data = await response.json();
            newImages[itemId] = data[0]; // Store fetched image URL
          } catch (error) {
            console.error(`Error fetching image for item ${itemId}:`, error);
            newImages[itemId] = null; // Handle errors gracefully by assigning `null`
          }
        }
      });

      await Promise.all(promises);

      if (Object.keys(newImages).length > 0) {
        // Update the image cache with the new images
        setImages((prevImages) => ({ ...prevImages, ...newImages }));
      }
    };

    if (currentResults.length > 0) {
      fetchImages();
    }
  }, [currentResults, images]);

  // Start a cooldown period to prevent rapid button presses
  const startCooldown = () => {
    setIsCooldown(true);
    setTimeout(() => {
      setIsCooldown(false);
    }, 2000); // Cooldown lasts 2 seconds
  };

  // Show a tooltip when the user attempts to press a disabled button
  const handleDisabledButtonClick = () => {
    setShowTooltip(true);
    setTimeout(() => {
      setShowTooltip(false);
    }, 1500); // Tooltip disappears after 1.5 seconds
  };

  // Navigate to the next page
  const handleNextPage = () => {
    if (currentPage < totalPages && !isCooldown) {
      setCurrentPage((prev) => prev + 1);
      startCooldown();
    } else if (isCooldown) {
      handleDisabledButtonClick(); // Show tooltip if on cooldown
    }
  };

  // Navigate to the previous page
  const handlePreviousPage = () => {
    if (currentPage > 1 && !isCooldown) {
      setCurrentPage((prev) => prev - 1);
      startCooldown();
    } else if (isCooldown) {
      handleDisabledButtonClick(); // Show tooltip if on cooldown
    }
  };

  return (
    <div className="search-container">
      {/* Input field for entering search keywords */}
      <input
        type="text"
        placeholder="Search for an item..."
        value={keyword}
        onChange={(e) => {
          setKeyword(e.target.value);
          setCurrentPage(1); // Reset to the first page when searching
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
                {/* Display item image or a placeholder if the image is not available */}
                {images[itemId] ? (
                  <img
                    src={images[itemId]}
                    alt={`Icon of ${itemName}`}
                    className="item-icon"
                  />
                ) : (
                  <div className="image-placeholder"></div> /* Placeholder for missing image */
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
                    handleDisabledButtonClick(); // Show tooltip if on cooldown
                  } else {
                    handlePreviousPage(); // Go to the previous page
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
                    handleDisabledButtonClick(); // Show tooltip if on cooldown
                  } else {
                    handleNextPage(); // Go to the next page
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
        // Show a message when no results are found
        !isLoading && <p className="no-results">No items found for "{keyword}"</p>
      )}
    </div>
  );
};

export default SearchItem;
