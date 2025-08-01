import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import FaqPage from '@components/pages/FaqPage';

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default function FaqWrapper() {
  return <FaqPage />;
}
