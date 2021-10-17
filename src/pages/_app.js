import { appWithTranslation } from 'next-i18next';
import { ToastContainer } from 'react-toastify';
import Layout from '../components/Layout';

import '../../public/fonts/hkgrotesk/stylesheet.css';
import '../scss/style.default.scss';
import 'react-image-lightbox/style.css';
import 'react-toastify/dist/ReactToastify.css';
import "bootstrap-icons/font/bootstrap-icons.css";

const MyApp = ({ Component, pageProps }) => {
	return (
		<Layout>
			<Component {...pageProps} />
			<ToastContainer
				position="top-right"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
			/>
		</Layout>
	);
};

export default appWithTranslation(MyApp);