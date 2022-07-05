import ReactGA from "react-ga4";

export const gtagReportConversion = (url) => {
	if (process.env.NODE_ENV !== 'production') return;

	const gtagId = process.env.NEXT_PUBLIC_GOOGLE_ADS;
	const gtagConversionId = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID;

	ReactGA.gtag('event', 'conversion', {
		send_to: `${gtagId}/${gtagConversionId}`,
		event_callback: () => {
			if (typeof url !== 'undefined') {
				window.location = url;
			}
		}
	});
};