import { useState, useEffect } from 'react';

export const useIsInViewport = (elem, offset = 0) => {
	const [isVisible, setIsVisible] = useState(false);

	const onScroll = () => {
		if (!elem.current) {
			setIsVisible(false);
			return;
		}
		const { top, bottom } = elem.current.getBoundingClientRect();
		const isInViewport = top < offset && top <= window.innerHeight ||
			bottom >= 0 && bottom <= window.innerHeight;

		setIsVisible(isInViewport);
	};

	useEffect(() => {
		document.addEventListener('scroll', onScroll, true);
		return () => document.removeEventListener('scroll', onScroll, true);
	});

	return isVisible;
};
