export const getCurrentPrice = (price, salePercent) => {
	const newPrice = salePercent ? price * (1 - salePercent) : price;
	return newPrice.toFixed(2);
};