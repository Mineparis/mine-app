import { useState, useEffect } from 'react';
import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { Container, Row, Col, Card, CardBody } from 'reactstrap';

import ServicesBlock from '@components/ServicesBlock';
import Swiper from '@components/Swiper';
import SurveyModal from '@components/SurveyModal';
import BackgroundImage from "@components/BackgroundImage";
import SwiperProducts from '@components/SwiperProducts';
import BigCards from '@components/BigCards';
import BigCardsWithText from '@components/BigCardsWithText';
import SwiperMagazine from '@components/SwiperMagazine';
import { fetchAPI } from "../lib/api";
import { DEFAULT_LANG, REVALIDATE_PAGE_SECONDS } from "../utils/constants";

const SWIPE_ITEMS_LIMIT = 10;

export const getStaticProps = async ({ locale }) => {
	const lang = locale || DEFAULT_LANG;

	const [homeData, bestSellersProducts, newProducts, magazinePosts, surveys] = await Promise.all([
		fetchAPI(`/homepage?_locale=${lang}`),
		fetchAPI(`/products?_limit=${SWIPE_ITEMS_LIMIT}&_sort=sold:DESC&_locale=${lang}`),
		fetchAPI(`/products?_limit=${SWIPE_ITEMS_LIMIT}&_sort=created_at:DESC&_locale=${lang}`),
		fetchAPI(`/blogs?_limit=${SWIPE_ITEMS_LIMIT}&_sort=created_at:DESC`),
		fetchAPI(`/surveys?&_locale=${lang}`),
	]);

	return {
		props: {
			...(await serverSideTranslations(lang, 'common')),
			homeData,
			bestSellersProducts,
			newProducts,
			magazinePosts,
			survey: surveys?.[0] ?? null,
		},
		revalidate: REVALIDATE_PAGE_SECONDS,
	};
};

const Home = ({ homeData, bestSellersProducts, newProducts, magazinePosts = [], survey }) => {
	const { t, i18n } = useTranslation('common');
	const [isSurveyOpen, setIsSurveyOpen] = useState(false);
	const [isClient, setIsClient] = useState(false);

	const {
		carousel,
		ourDescription,
		surveySection,
		valuesSection,
		categoriesSection,
		boxSection,
		routineSection,
		engagementText,
	} = homeData;

	const handleToggleSurveyModal = (isOpen = true) => {
		setIsSurveyOpen(isOpen);
	};

	useEffect(() => {
		setIsClient(true);

		const userLang = navigator.language || navigator.userLanguage;
		if (userLang.startsWith('fr') && i18n.language !== 'fr') {
			i18n.changeLanguage('fr');
		} else if (userLang.startsWith('en') && i18n.language !== 'en') {
			i18n.changeLanguage('en');
		}
	}, [i18n]);

	if (!isClient) return null;

	const metaDescription = 'Mine Paris - Transformez votre routine beauté avec les meilleurs soins corporels et capillaires naturels, dans une box personnalisée chaque mois.';

	return (
		<>
			<Head>
				<title>Mine Paris - Routine beauté naturelle</title>
				<meta name="description" content={metaDescription} />
				<meta property="og:title" content="Mine Paris - Routine beauté naturelle" />
				<meta property="og:description" content={metaDescription} />
				<meta property="og:url" content="https://mineparis.com" />
				<meta name="language" content="fr" />
				<meta httpEquiv="Content-Language" content="fr" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />

				{/* Hreflang pour les versions multilingues */}
				<link rel="alternate" hreflang="fr" href="https://mineparis.com" />
				<link rel="alternate" hreflang="en" href="https://mineparis.com/en" />

				{/* Données structurées (JSON-LD) */}
				<script type="application/ld+json">
					{{
						"@context": "https://schema.org",
						"@type": "Organization",
						"name": "Mine Paris",
						"url": "https://mineparis.com",
						"logo": '/img/slider/mine-carousel.jpg',
						"sameAs": ["https://www.instagram.com/_mineparis", "https://www.tiktok.com/@mineparis_"]
					}}
				</script>
			</Head>

			<Swiper
				data={carousel}
				delay={10000}
				slidesPerView={1}
				spaceBetween={0}
				speed={1500}
				autoplay
				loop
				centeredSlides
				pagination={!!carousel.length}
				style={{ height: "80vh", minHeight: "600px" }}
			/>

			{newProducts.length ? (
				<section className="py-6">
					<SwiperProducts title={t('new_arrivals')} products={newProducts} />
				</section>
			) : null}

			{surveySection && (
				<section className="position-relative py-3">
					<BackgroundImage src={surveySection.staticImg} alt="survey" />
					<Card className="product-survey-card md-3">
						<CardBody className="md-6">
							<h3><i>{surveySection.title}</i></h3>
						</CardBody>
					</Card>
				</section>
			)}

			<section className="pt-6">
				<BigCards data={categoriesSection} />
			</section>

			<section className="pt-6">
				<Container>
					<Row>
						<Col md="6" xl="6" className="mb-5">
							<p className="lead">{ourDescription}</p>
						</Col>
					</Row>
					<SwiperProducts title={t('best_sellers')} products={bestSellersProducts} />
				</Container>
			</section>

			{routineSection ? (
				<section className="bg-light">
					<BigCardsWithText {...routineSection} />
				</section>
			) : null}

			{survey ? (
				<section>
					<BigCardsWithText
						title={t('section_survey_title')}
						description={t('section_survey_description')}
						imageName="skincare"
						onClick={handleToggleSurveyModal}
					/>
				</section>
			) : null}

			{valuesSection && <ServicesBlock data={valuesSection} />}

			{engagementText && (
				<section className="py-5">
					<p className="lead text-center">{engagementText}</p>
				</section>
			)}

			{magazinePosts.length ? (
				<section className="py-5 bg-brown">
					<SwiperMagazine title="Magazine" posts={magazinePosts} />
				</section>
			) : null}

			{survey ? <SurveyModal survey={survey} isOpen={isSurveyOpen} onToggleModal={handleToggleSurveyModal} /> : null}
		</>
	);
};

export default Home;
