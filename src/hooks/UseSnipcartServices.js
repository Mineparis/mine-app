import { useEffect } from 'react';

const useSnipcartServices = ({ setHideHeader, lang }) => {
	const Snip = typeof window !== 'undefined' && window?.Snipcart;
	useEffect(() => {
		if (!Snip) return;
		const unsubscribe = Snip.events.on('theme.routechanged', ({ from, to }) => {
			const language = lang === 'fr' ? 'fr-FR' : lang;
			Snip.api.session.setLanguage(language);

			if (from === "/" && to !== "/") {
				setHideHeader(true);
			}

			if (from !== "/" && to === "/") {
				setHideHeader(false);
			}
		});

		return () => unsubscribe();
	}, [Snip]);
};

export default useSnipcartServices;