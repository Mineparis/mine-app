import React from "react";

const Stars = ({ stars, color, secondColor, className, starClass }) => {
	const starsArray = Array.from({ length: 5 }, (_, index) => {
		const starFilledClassName = index < stars
			? color ? `text-${color}` : 'text-primary'
			: `text-${secondColor || 'muted'}`;

		return (
			<i
				key={index}
				className={`fa fa-star ${starFilledClassName} ${starClass || ''}`}
			/>
		);
	});

	return <div className={className}>{starsArray}</div>;
};

export default Stars;
