import { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import { useRouter } from 'next/router';
import CookieConsent, { Cookies, getCookieConsentValue } from "react-cookie-consent";
import ReactGA from "react-ga4";
import { useTranslation } from 'react-i18next';
import useSWRImmutable from 'swr/immutable';

import Header from './Header';
import Footer from './Footer';
import { FormProvider } from './FormContext';
import NextNProgress from '../components/NextNProgress';
import { formatMenu } from '../utils/menu';
import { DEFAULT_LANG } from '../utils/constants';
import { fetchAPI } from '../lib/api';
import useSnipcartServices from '../hooks/UseSnipcartServices';


const Layout = ({ children }) => {
	const { t } = useTranslation('common');
	const { locale, asPath } = useRouter();
	const [hasSetConsent, setHasSetConsent] = useState(false);

	const lang = locale || DEFAULT_LANG;
	const { data: menuByGender } = useSWRImmutable(`/categories/menu?_locale=${lang}`, fetchAPI);

	const isConsent = getCookieConsentValue();

	const menu = useMemo(() => formatMenu(menuByGender), [menuByGender]);

	const loggedUser = false;
	const hideTopbar = false;
	const hideFooter = false;
	const className = null;

	const [paddingTop, setPaddingTop] = useState(0);
	const [hideHeader, setHideHeader] = useState(false);

	const handleAgreeCookieConsent = () => {
		const gaId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS;

		if (process.env.NODE_ENV === "production" && gaId) {
			ReactGA.initialize(gaId);
		}
		setHasSetConsent(true);
	};

	const handleDeclineCookieConsent = () => {
		Cookies.remove("_ga");
		Cookies.remove("_gat");
		Cookies.remove("_gid");
	};

	useEffect(() => {
		if (!hasSetConsent && isConsent === "true") {
			handleAgreeCookieConsent();
		}
	}, [isConsent]);

	useEffect(() => {
		window.__localeId__ = lang;
	}, []);

	useSnipcartServices({ setHideHeader, lang });

	const whitePages = ['/category', '/product', '/login', '/customer', '/legal-notice', '/faq', '/contact', '/terms-of-use', '/magazine'];
	const isWhitePage = whitePages.some(whitePage => asPath.startsWith(whitePage));

	const title = 'Mine';
	const headerProps = {
		nav: {
			classes: "bg-hover-white bg-fixed-white navbar-hover-light navbar-fixed-light",
			color: "transparent",
			dark: !isWhitePage,
			fixed: false,
			light: false,
			sticky: true,
		},
		menu,
		loggedUser,
		headerAbsolute: !isWhitePage,
		hideTopbar,
		setPaddingTop: (event) => setPaddingTop(event),
	};

	return (
		<div
			style={{ paddingTop }}
			className={className}
		>
			<Head>
				<link
					rel="stylesheet"
					href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap"
				/>
				<link rel="preconnect" href="https://app.snipcart.com" />
				<link rel="preconnect" href="https://cdn.snipcart.com" />
				<link rel="stylesheet" href="https://cdn.snipcart.com/themes/v3.3.0/default/snipcart.css" />

				<link rel="icon" href="/img/favicon.png" />
				<link
					href="https://use.fontawesome.com/releases/v5.8.1/css/all.css"
					rel="stylesheet"
				/>
				<title>{title}</title>
				<meta property="og:type" content="website" />
			</Head>

			<NextNProgress color="#191919" options={{ showSpinner: false }} />

			{!hideHeader && <Header {...headerProps} />}

			<FormProvider>
				<main>{children}</main>
			</FormProvider>

			{!hideFooter && <Footer />}
			<CookieConsent
				style={{ background: '#343a40', display: 'flex', alignItems: 'center' }}
				buttonStyle={{ background: '#fff', color: '#343a40' }}
				buttonWrapperClasses="d-flex flex-row"
				declineButtonStyle={{ background: 'transparent' }}
				declineButtonText={t('cookie_consent_decline')}
				buttonText={t('cookie_consent_agree')}
				location="bottom"
				expires={365}
				enableDeclineButton
				onAccept={handleAgreeCookieConsent}
				onDecline={handleDeclineCookieConsent}
			>
				{t('cookie_consent_text')}
			</CookieConsent>

			<Script src="https://cdn.snipcart.com/themes/v3.3.0/default/snipcart.js" strategy="beforeInteractive" />
			<Script src="https://code.jquery.com/jquery-3.4.1.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous" />
			<Script src="https://cdn.ckeditor.com/ckeditor5/31.1.0/classic/ckeditor.js" />

			<div
				hidden
				id="snipcart"
				data-api-key={process.env.NEXT_PUBLIC_SNIPCART}
				data-config-modal-style="side"
				data-currency="eur"
			/>
		</div >
	);
};

export default Layout;
