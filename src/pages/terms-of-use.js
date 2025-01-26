import React from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Container, Row } from "reactstrap";
import { DEFAULT_LANG } from '../utils/constants';

export const getStaticProps = async ({ locale }) => {
	const lang = locale || DEFAULT_LANG;

	return {
		props: {
			...(await serverSideTranslations(lang, 'terms-of-use')),
		},
	};
};

const TermsOfUse = () => {
	const { t } = useTranslation('terms-of-use');

	return (
		<Container>
			<section className="m-3">
				<Row>
					<h2 className="mb-5 text-muted">{t('terms_of_use')}</h2>
				</Row>
				<Row>
					<div style={{ whiteSpace: "pre-line" }}>
						{t('termsContent')}
					</div>
				</Row>
			</section>
		</Container>
	);
};

export default TermsOfUse;