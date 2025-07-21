import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import LegalNoticePage from '@components/pages/LegalNoticePage';

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default function LegalNoticeWrapper() {
  return <LegalNoticePage />;
}
