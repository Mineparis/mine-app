import React from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Row, Button } from "reactstrap";
import Link from "next/link";

import BackgroundImage from "../components/BackgroundImage";
import { DEFAULT_LANG } from "../utils/constants";

export const getStaticProps = async ({ locale }) => {
	const lang = locale || DEFAULT_LANG;
	return {
		props: {
			...(await serverSideTranslations(lang, 'common')),
		},
	};
};

const PageNotFound = () => {
	const { t } = useTranslation('common');

	return (
		<BackgroundImage src="/img/404.jpg" alt="404" isFullScreen isDarkOverlay>
			<Row className="text-white d-flex flex-column justify-content-center text-center">
				<h1 className="display-3 font-weight-bold mb-5">{t('404_page_title')}</h1>
				<p className="font-weight-light mb-5">
					{t('404_page_description')}
				</p>
				<p className="d-flex justify-content-center">
					<Link href="/">
						<Button color="outline-light">
							<i className="fa fa-home mr-2" />
							{t('go_back_home')}
						</Button>
					</Link>
				</p>
			</Row>

		</BackgroundImage>
	);
};

export default PageNotFound;
