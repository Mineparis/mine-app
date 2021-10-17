import { useState } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import { useRouter } from 'next/router';
import useSWR from 'swr';

import Header from './Header';
import Footer from './Footer';
import { FormProvider } from './FormContext';
import NextNProgress from '../components/NextNProgress';
import { formatMenu } from '../utils/menu';
import { DEFAULT_LANG } from '../utils/constants';
import { getStrapiURL } from '../lib/api';
import useSnipcartServices from '../hooks/UseSnipcartServices';

const Layout = ({ children }) => {
	const { locale, asPath } = useRouter();

	const lang = locale || DEFAULT_LANG;
	const URL = getStrapiURL(`/categories/menu?_locale=${lang}`);
	const { data: menuByGender = [] } = useSWR(URL);

	const menu = formatMenu(menuByGender);

	const loggedUser = false;
	const hideTopbar = false;
	const hideFooter = false;
	const className = null;

	const [paddingTop, setPaddingTop] = useState(0);
	const [hideHeader, setHideHeader] = useState(false);

	useSnipcartServices({ setHideHeader });

	const whitePages = ['/category', '/product', '/login', '/customer'];
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
				<link rel="stylesheet" href="https://cdn.snipcart.com/themes/v3.2.0/default/snipcart.css" />

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
			<Script src="https://cdn.snipcart.com/themes/v3.2.0/default/snipcart.js" strategy="beforeInteractive" />
			<Script src="https://code.jquery.com/jquery-3.4.1.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous" />
			<div
				hidden
				id="snipcart"
				data-api-key="YzA5YWZjZGItYzgyMS00NWU0LTg2YmEtOTU1ZDQzYzMzYjljNjM3NjM3MTE2NzY2MTAwNzQw"
				data-config-modal-style="side"
				data-currency="eur"
			/>
		</div>
	);
};

export default Layout;
