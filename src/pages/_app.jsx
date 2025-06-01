import React, { useState, useEffect } from 'react';
import { appWithTranslation } from 'next-i18next';
import { ToastContainer } from 'react-toastify';
import ReactGA from "react-ga4";
import { useRouter } from 'next/router';
import { ShopifyProvider, CartProvider } from '@shopify/hydrogen-react';

import Layout from '@components/Layout';
import { CartDropdownProvider } from '@contexts/CartDropdownContext';

import '../../public/fonts/hkgrotesk/stylesheet.css';
import '../scss/style.default.scss';
import 'react-toastify/dist/ReactToastify.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import 'swiper/css/bundle';

const MyApp = ({ Component, pageProps }) => {
	const { events } = useRouter();
	const [hasSetConsent, setHasSetConsent] = useState(null);

	useEffect(() => {
		if (process.env.NODE_ENV === "production") {
			ReactGA.initialize([{
				trackingId: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS,
			}, {
				trackingId: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_GA4,
			}, {
				trackingId: process.env.NEXT_PUBLIC_GOOGLE_ADS,
			}]);
		}
	}, []);

	useEffect(() => {
		const handleRouteChange = (url) => {
			window.scrollTo(0, 0);
			if (hasSetConsent !== false) ReactGA.send({ hitType: "pageview", page: url });
		};

		events.on('routeChangeComplete', handleRouteChange);

		return () => {
			events.off('routeChangeComplete', handleRouteChange);
		};
	}, [events]);


	return (
		<ShopifyProvider
			storeDomain={process.env.NEXT_PUBLIC_PUBLIC_STORE_DOMAIN}
			storefrontToken={process.env.NEXT_PUBLIC_PUBLIC_STOREFRONT_API_TOKEN}
			storefrontApiVersion="2025-01"
			countryIsoCode="FR"
			languageIsoCode="FR"
		>
			<CartProvider>
				<CartDropdownProvider>
					<Layout setHasSetConsent={setHasSetConsent} hasSetConsent={hasSetConsent}>
						<Component {...pageProps} />
						<ToastContainer
							position="top-right"
							autoClose={5000}
							hideProgressBar={false}
							newestOnTop={false}
							closeOnClick
							rtl={false}
							pauseOnFocusLoss
							draggable
							pauseOnHover
						/>
					</Layout>
				</CartDropdownProvider>
			</CartProvider>
		</ShopifyProvider>
	);
};

export default appWithTranslation(MyApp);