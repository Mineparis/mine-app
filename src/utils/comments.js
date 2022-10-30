export const getCommentsAverageRating = (comments) => {
	if (!comments.length) return 0;
	const accRatings = comments.reduce((acc, { rating }) => acc + rating, 0);
	return Math.floor(accRatings / comments.length);
};