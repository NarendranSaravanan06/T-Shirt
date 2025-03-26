const discountPercentCalculation = (price, discountPercent) => {
    return (price - (price * discountPercent / 100)).toFixed(2); 
};
export default discountPercentCalculation;