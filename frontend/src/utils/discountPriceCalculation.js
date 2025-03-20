const discountPercentCalculation = (price, discountPercent) => {
    return (price - (price * discountPercent / 100)).toFixed(2); // Rounds to 2 decimal places
};
export default discountPercentCalculation;