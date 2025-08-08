import React from "react";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { DEFAULT_LANG, REVALIDATE_PAGE_SECONDS } from '@utils/constants';
import ContactPage from '@components/pages/ContactPage';

export default function ContactWrapper(props) {
  return <ContactPage {...props} />;
}

export async function getStaticProps({ locale }) {
  const lang = locale || DEFAULT_LANG;

  const translations = await serverSideTranslations(lang, ['common']);

  return {
    props: {
      ...translations,
			lang,
    },
		revalidate: REVALIDATE_PAGE_SECONDS,
  };
}