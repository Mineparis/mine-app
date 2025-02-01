import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { Container, Row, Col } from 'reactstrap';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Image from 'next/image';
import { fetchAPI } from '../lib/api';
import { getStrapiMedia } from '../lib/media';
import { REVALIDATE_PAGE_SECONDS } from '../utils/constants';

export const getStaticProps = async ({ locale }) => {
	const lang = locale || DEFAULT_LANG;
	const data = await fetchAPI(`/about-us?_locale=${lang}`);
	return {
		props: {
			...(await serverSideTranslations(lang, 'common')),
			data,
		},
		revalidate: REVALIDATE_PAGE_SECONDS,
	};
};

const SectionWithImage = ({ section, reverseOrder = false }) => {
	const imageUrl = section.image ? getStrapiMedia(section.image) : section.imageURL;

	return (
		<Row>
			<Col lg="6" className={`p-lg-0 about-text-column ${reverseOrder ? 'order-lg-2' : ''}`}>
				<div className="about-text">
					<h6 className="text-uppercase text-muted letter-spacing-5 mb-1">{section.subtitle}</h6>
					<h2 className="mb-4">{section.title}</h2>
					<p className="text-lg text-muted">{section.description}</p>
				</div>
			</Col>
			<Col lg="6" className="p-lg-0 about-image-column">
				<Image
					className="bg-image"
					src={imageUrl}
					alt={section.subtitle || section.title}
					fill
					objectFit="cover"
					objectPosition="top"
					priority
				/>
			</Col>
		</Row>
	);
};

const AboutUs = ({ data }) => {
	const { t } = useTranslation('common');
	const jumbotron = data?.section?.[0];
	const jumbotronImage = jumbotron?.image ? getStrapiMedia(jumbotron.image) : jumbotron?.imageURL;
	const firstSection = data?.section?.[1];
	const secondSection = data?.section?.[2];
	const thirdSection = data?.section?.[3];
	const lastSection = data?.lastSection;

	const pageTitle = 'À propos de nous | Mine Paris';
	const metaDescription = "Apprenez-en plus sur le concept de Mine et notre engagement à offrir des produits de qualité.";

	return (
		<>
			<Head>
				{/* Balises Meta pour SEO */}
				<title>{pageTitle}</title>
				<meta name="description" content={metaDescription} />
				<meta name="robots" content="index, follow" />

				{/* Open Graph Tags */}
				<meta property="og:title" content={pageTitle} />
				<meta property="og:description" content={metaDescription} />
				<meta property="og:url" content="https://www.mineparis.com/about-us" />
				<meta property="og:type" content="website" />
				<meta property="og:image" content={jumbotronImage} />

				{/* Twitter Card Tags */}
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content={pageTitle} />
				<meta name="twitter:description" content={metaDescription} />
				<meta name="twitter:image" content={jumbotronImage} />
			</Head>

			{/* Jumbotron Section */}
			<section className="mh-full-screen dark-overlay py-7 d-flex align-items-center justify-content-center">
				<Image
					className="bg-image"
					src={jumbotronImage}
					alt={jumbotron?.subtitle || 'Jumbotron'}
					fill
					objectFit="cover"
					objectPosition="center"
					priority
				/>
				<div className="overlay-content w-100">
					<Container>
						<Row>
							<Col xl="6" className="text-white">
								<h6 className="text-uppercase text-white letter-spacing-5 mb-3">{jumbotron?.subtitle}</h6>
								<h1 className="display-3 font-weight-bold text-shadow mb-5">{jumbotron?.title}</h1>
								<p className="text-lg">{jumbotron?.description}</p>
							</Col>
						</Row>
					</Container>
				</div>
			</section>

			{/* Sections 1, 2, and 3 */}
			<Container fluid>
				<SectionWithImage section={firstSection} />
				<SectionWithImage section={secondSection} reverseOrder />
				<SectionWithImage section={thirdSection} />
			</Container>

			{/* Last Section */}
			<section className="py-6">
				<Container>
					<Row className="d-flex justify-content-center text-center">
						<Col lg="6">
							<h2 className="mb-5">{lastSection?.title}</h2>
						</Col>
					</Row>
					<Row>
						<Col lg="6">
							<p className="text-lg text-muted">{lastSection?.description}</p>
						</Col>
						<Col lg="6">
							<p className="text-lg text-muted">{lastSection?.secondDescription}</p>
						</Col>
					</Row>
				</Container>
			</section>
		</>
	);
};

export default AboutUs;
