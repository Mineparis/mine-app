export const getCurrentPrice = (price, salePercent) => {
	if (!salePercent) return price;
	return price * (1 - salePercent);
}