import { useEffect } from 'react';

const useSnipcartServices = ({ setHideHeader }) => {
	useEffect(() => {
		const unsubscribe = Snipcart.events.on('theme.routechanged', ({ from, to }) => {
			if (from === "/" && to !== "/") {
				setHideHeader(true);
			}

			if (from !== "/" && to === "/") {
				setHideHeader(false);
			}
		});

		return () => unsubscribe();
	}, []);
};

export default useSnipcartServices;