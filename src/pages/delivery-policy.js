import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import DeliveryPolicyPage from '@components/pages/DeliveryPolicyPage';

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default function DeliveryPolicy() {
  return <DeliveryPolicyPage />;
}
