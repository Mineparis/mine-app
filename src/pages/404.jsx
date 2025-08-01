import React from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from "next/link";
import Head from 'next/head';

import BackgroundImage from "../components/BackgroundImage";
import { DEFAULT_LANG } from "../utils/constants";

export const getStaticProps = async ({ locale }) => {
	const lang = locale || DEFAULT_LANG;
	return {
		props: {
			...(await serverSideTranslations(lang, ['common'])),
		},
	};
};

const PageNotFound = () => {
	const { t } = useTranslation('common');

	return (
		<>
			<Head>
				<title>404 - Page non trouvée | Mine Paris</title>
				<meta name="description" content="La page que vous cherchez n'existe pas." />
			</Head>

			<BackgroundImage 
				src="/img/404.jpg" 
				alt="404" 
				overlayOpacity="dark"
				size="py-20"
			>
				<div className="text-center">
					{/* 404 Number */}
					<div className="mb-8">
						<h1 className="text-[6rem] lg:text-[10rem] font-bold text-white/20 leading-none select-none mb-6">
							404
						</h1>
						<h2 className="text-2xl lg:text-4xl font-bold text-white leading-tight mb-4">
							{t('404_page_title')}
						</h2>
						<p className="text-base lg:text-lg text-white/90 max-w-md mx-auto leading-relaxed mb-8">
							{t('404_page_description')}
						</p>
					</div>

					{/* Actions */}
					<div>
						<Link
							href="/"
							className="inline-flex items-center justify-center bg-white text-neutral-900 font-semibold py-3 px-8 rounded-full hover:bg-neutral-100 hover:shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/30"
						>
							{t('go_back_home')}
						</Link>
					</div>
				</div>
			</BackgroundImage>
		</>
	);
};

export default PageNotFound;
