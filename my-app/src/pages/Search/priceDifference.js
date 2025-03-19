export const calculatePriceDifference = (priceData) => {
    if (!priceData || priceData.length < 2) {
      return { difference: 0, color: "#FFFFFFCC" };
    }
  
    const latestPrice = priceData[priceData.length - 1].price;
    const previousPrice = priceData[priceData.length - 2].price;
    const difference = latestPrice - previousPrice;
  
    let color = "#FFFFFFCC";
    if (difference > 0) color = "#00FF7F";
    else if (difference < 0) color = "#FF4C4C";
  
    return { difference, color };
  };
  