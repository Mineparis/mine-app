import { appWithTranslation } from 'next-i18next';
import Layout from '../components/Layout';

import '../../public/fonts/hkgrotesk/stylesheet.css';
import '../scss/style.default.scss';
import 'react-image-lightbox/style.css';

const MyApp = ({ Component, pageProps }) => {
	return (
		<Layout>
			<Component {...pageProps} />
		</Layout>
	);
};

export default appWithTranslation(MyApp);