import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import CookieConsent, { Cookies, getCookieConsentValue } from "react-cookie-consent";
import { useTranslation } from 'next-i18next';

import ProgressBar from '@components/ProgressBar';
import { DEFAULT_LANG } from '../utils/constants';
import { MENU } from '../data/menu';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children, setHasSetConsent, hasSetConsent }) => {
	const { t } = useTranslation('common');
	const { locale, asPath } = useRouter();
	const lang = locale || DEFAULT_LANG;
	const isConsent = getCookieConsentValue();
	const [paddingTop, setPaddingTop] = useState(0);

	const handleAgreeCookieConsent = () => {
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
	}, [hasSetConsent, isConsent]);

	useEffect(() => {
		window.__localeId__ = lang;
	}, [lang]);

	const whitePages = [
		...MENU.map(({ title }) => `/${title}`),
		'/category', '/product', '/login', '/customer', '/legal-notice',
		'/delivery-policy', '/faq', '/contact', '/terms-of-use', '/magazine',
		'/brand', '/box', '/routine', '/search', '/cart'
	];
	const isWhitePage = whitePages.some(whitePage => asPath.startsWith(whitePage));

	return (
		<>
			<Head>
				<title key="title">Mine Paris</title>
				<meta key="charset" charSet="utf-8" />
				<meta key="viewport" name="viewport" content="width=device-width,initial-scale=1" />
				<meta key="theme-color" name="theme-color" content="#fff" />
				<meta key="description" name="description" content={t('seo_description', 'Boutique beauté Mine Paris : soins, routines, box et conseils experts.')} />
				<link rel="canonical" href={`https://mineparis.com${asPath}`} />
				<html lang={lang} />
			</Head>
			<div style={{ paddingTop }} className="min-h-screen flex flex-col">
				<ProgressBar />
				<Header
					shouldDisplayWhiteLogo={isWhitePage}
					headerAbsolute={!isWhitePage}
					hideTopbar={true}
					setPaddingTop={setPaddingTop}
				/>
				<main id="main-content" tabIndex={-1} role="main">
					{children}
				</main>
				<Footer />
				<CookieConsent
					containerClasses="py-5 px-2"
					buttonWrapperClasses="flex items-center"
					buttonClasses="!bg-secondary-100 text-xs font-semibold !py-3 !rounded-lg"
					declineButtonText={t('cookie_consent_decline')}
					declineButtonClasses="!bg-transparent !border-none text-xs text-gray-400"
					buttonText={t('cookie_consent_agree')}
					contentClasses="text-sm font-medium leading-relaxed"
					location="bottom"
					expires={180}
					enableDeclineButton
					onAccept={handleAgreeCookieConsent}
					onDecline={handleDeclineCookieConsent}
				>
							{t('cookie_consent_text')}
				</CookieConsent>
			</div>
		</>
	);
};

export default Layout;
