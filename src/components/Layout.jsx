import { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import CookieConsent, { Cookies, getCookieConsentValue } from "react-cookie-consent";
import { useTranslation } from 'next-i18next';
import useSWRImmutable from 'swr/immutable';

import NextNProgress from '@components/NextNProgress';
import { formatMenu } from '../utils/menu';
import { DEFAULT_LANG } from '../utils/constants';
import { fetchAPI } from '../lib/api';

import Header from './Header';
import Footer from './Footer';

const Layout = ({ children, setHasSetConsent, hasSetConsent }) => {
	const { t } = useTranslation('common');
	const { locale, asPath } = useRouter();

	const lang = locale || DEFAULT_LANG;
	const { data: menuByGender } = useSWRImmutable(`/categories/menu?_locale=${lang}`, fetchAPI);

	const isConsent = getCookieConsentValue();

	const menu = useMemo(() => formatMenu(menuByGender), [menuByGender]);

	const loggedUser = false;
	const hideTopbar = true;
	const hideFooter = false;
	const className = null;
	const hideHeader = false;
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
	}, [isConsent]);

	useEffect(() => {
		window.__localeId__ = lang;
	}, []);

	const whitePages = [
		'/category',
		'/product',
		'/login',
		'/customer',
		'/legal-notice',
		'/delivery-policy',
		'/faq',
		'/contact',
		'/terms-of-use',
		'/magazine',
		'/brand',
		'/box',
		'/routine',
		'/search',
		'/cart'
	];
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
		shouldDisplayWhiteLogo: isWhitePage,
		loggedUser,
		headerAbsolute: !isWhitePage,
		hideTopbar,
		setPaddingTop: (event) => setPaddingTop(event),
		locale: lang,
	};

	return (
		<div style={{ paddingTop }} className={className}>
			<Head>
				<title>{title}</title>
			</Head>
			<NextNProgress options={{ showSpinner: false }} />

			{!hideHeader && <Header {...headerProps} />}

			<main>{children}</main>

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
		</div >
	);
};

export default Layout;
