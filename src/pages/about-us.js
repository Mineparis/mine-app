

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { REVALIDATE_PAGE_SECONDS } from '../utils/constants';
import dynamic from 'next/dynamic';

const AboutUsPage = dynamic(() => import('@components/pages/AboutUsPage'), { ssr: false });

export const getStaticProps = async ({ locale }) => {
  const lang = locale || 'fr';
  return {
	props: {
	  ...(await serverSideTranslations(lang, 'common')),
	},
	revalidate: REVALIDATE_PAGE_SECONDS,
  };
};

export default function AboutUs() {
  return <AboutUsPage />;
}
