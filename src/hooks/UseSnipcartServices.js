import { lang } from 'moment';
import { useEffect } from 'react';

const useSnipcartServices = ({ setHideHeader, lang }) => {
	useEffect(() => {
		const unsubscribe = Snipcart.events.on('theme.routechanged', ({ from, to }) => {
			const language = lang === 'fr' ? 'fr-FR' : lang;
			Snipcart.api.session.setLanguage(language);

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