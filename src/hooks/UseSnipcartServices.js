import { useEffect } from 'react';
import { registerUser } from '../lib/api';

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

			Snipcart.events.on('customer.registered', ({ id, email, password }) => {
				console.log({ email, password, id });

				registerUser(email, password, id);
			});
		});
	}, []);
};

export default useSnipcartServices;