import React from 'react';
import { useTranslation } from 'react-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Container, Row } from "reactstrap";
import { DEFAULT_LANG } from '../utils/constants';

export const getStaticProps = async ({ locale }) => {
	const lang = locale || DEFAULT_LANG;

	return {
		props: {
			...(await serverSideTranslations(lang, 'legal-notice')),
		},
	};
};

const LegalNotice = () => {
	const { t } = useTranslation('legal-notice');

	return (
		<Container>
			<section className="m-3">
				<Row>
					<h2 className="mb-5 text-muted">{t('legal_notice')}</h2>
				</Row>
				<Row>
					<h5>{t('hosting_publishing_title')}</h5>
					<p>{t('hosting_publishing_content_1', { siren: 'XXX', siret: 'XXX' })}</p>
					<p>{t('hosting_publishing_content_2', { hostName: "XXX" })}</p>
					<p>{t('hosting_publishing_content_3', { phone: "06.12.84.04.67" })}</p>
				</Row>
				<Row>
					<h5>{t('external_sources_title')}</h5>
					<p>{t('external_sources_content_1')}</p>
					<p>{t('external_sources_content_2')}</p>
				</Row>
				<Row>
					<h5>{t('intellectual_property_title')}</h5>
					<p>{t('intellectual_property_content_1')}</p>
					<p>{t('intellectual_property_content_2')}</p>
				</Row>
				<Row>
					<h5>{t('modification_title')}</h5>
					<p>{t('modification_content')}</p>
				</Row>
				<Row>
					<p>{t('last_update')}</p>
				</Row>
			</section>
		</Container>
	);
};

export default LegalNotice;