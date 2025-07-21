import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import TermsPage from '@components/pages/TermsPage';

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default function TermsWrapper() {
  return <TermsPage />;
}
