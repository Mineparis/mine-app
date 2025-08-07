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
					containerClasses="fixed bottom-0 left-0 w-full z-50 flex justify-center px-2"
					style={undefined}
					buttonStyle={undefined}
					buttonWrapperClasses="flex flex-col w-full mt-1"
					declineButtonStyle={undefined}
					declineButtonClasses="hidden"
					buttonClasses="w-auto min-w-[140px] bg-primary text-white font-semibold py-2 px-5 mx-auto hover:bg-primary-700 hover:text-white transition focus:outline-none focus:ring-2 focus:ring-primary-200 text-xs shadow-none mt-1"
					declineButtonText={t('cookie_consent_decline')}
					buttonText={t('cookie_consent_agree')}
					location="bottom"
					expires={180}
					enableDeclineButton
					onAccept={handleAgreeCookieConsent}
					onDecline={handleDeclineCookieConsent}
				>
					<div className="w-full max-w-md mx-auto flex flex-col items-center px-3 py-2 sm:px-6">
						<span className="block text-center text-white text-xs font-medium leading-relaxed mb-1">
							{t('cookie_consent_text')}
						</span>
						<span
							tabIndex={0}
							role="button"
							className="mb-1 text-sm text-gray-600 underline underline-offset-2 hover:text-primary transition cursor-pointer"
							onClick={handleDeclineCookieConsent}
							aria-label={t('cookie_consent_decline')}
						>
							{t('cookie_consent_decline')}
						</span>
					</div>
				</CookieConsent>
			</div>
		</>
	);
};

export default Layout;
