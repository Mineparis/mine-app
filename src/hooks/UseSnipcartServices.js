import { useEffect } from 'react';

const useSnipcartServices = ({ setHideHeader }) => {
	useEffect(() => {
		document.addEventListener('snipcart.ready', () => {
			Snipcart.events.on('theme.routechanged', ({ from, to }) => {
				if (from === "/" && to !== "/") {
					setHideHeader(true);
				}

				if (from !== "/" && to === "/") {
					setHideHeader(false);
				}
			});
		});
	}, []);
};

export default useSnipcartServices;