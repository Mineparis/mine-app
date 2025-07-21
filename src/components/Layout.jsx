import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import CookieConsent, { Cookies, getCookieConsentValue } from "react-cookie-consent";
import { useTranslation } from 'next-i18next';

import NextNProgress from '@components/NextNProgress';
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


	const menuParentCategories = MENU.map(({ title }) => `/${title.toLowerCase()}`);
	const whitePages = [
		...MENU.map(({ title }) => `/${title}`),
		'/category', '/product', '/login', '/customer', '/legal-notice',
		'/delivery-policy', '/faq', '/contact', '/terms-of-use', '/magazine',
		'/brand', '/box', '/routine', '/search', '/cart'
	];
	const isWhitePage = whitePages.some(whitePage => asPath.startsWith(whitePage));

	return (
		<div style={{ paddingTop }} className="min-h-screen flex flex-col">
			<Head>
				<title>Mine Paris</title>
			</Head>
			<NextNProgress options={{ showSpinner: false }} />
			<Header 
				shouldDisplayWhiteLogo={isWhitePage}
				headerAbsolute={!isWhitePage}
				hideTopbar={true}
				setPaddingTop={setPaddingTop}
			/>
			<main id="main-content">{children}</main>
			<Footer />
			<CookieConsent
				containerClasses="fixed bottom-0 left-0 w-full z-50"
				style={{ 
					background: 'rgba(52, 58, 64, 0.98)', 
					display: 'flex', 
					alignItems: 'center', 
					borderRadius: '0.5rem', 
					margin: '0.5rem', 
					maxWidth: '600px', 
					left: '50%', 
					transform: 'translateX(-50%)' 
				}}
				buttonStyle={{ 
					background: '#fff', 
					color: '#343a40', 
					borderRadius: '0.375rem', 
					fontWeight: 600, 
					padding: '0.5rem 1.5rem', 
					marginLeft: '1rem' 
				}}
				buttonWrapperClasses="flex flex-row gap-2"
				declineButtonStyle={{ 
					background: 'transparent', 
					color: '#fff', 
					border: '1px solid #fff', 
					borderRadius: '0.375rem', 
					fontWeight: 600, 
					padding: '0.5rem 1.5rem' 
				}}
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
		</div>
	);
};

export default Layout;
