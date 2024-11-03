import { useState } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { Container, Row, Col, Card, CardBody } from "reactstrap";

import ServicesBlock from '../components/ServicesBlock';
import Swiper from '../components/Swiper';
import SurveyModal from '../components/SurveyModal';
import BackgroundImage from "../components/BackgroundImage";
import { fetchAPI } from "../lib/api";
import { DEFAULT_LANG } from "../utils/constants";

const SWIPE_ITEMS_LIMIT = 10;

const SwiperProducts = dynamic(() => import('../components/SwiperProducts'));
const BigCards = dynamic(() => import('../components/BigCards'));
const BigCardsWithText = dynamic(() => import('../components/BigCardsWithText'));
const SwiperMagazine = dynamic(() => import('../components/SwiperMagazine'));

export const getStaticProps = async ({ locale }) => {
	const lang = locale || DEFAULT_LANG;
	const homeData = await fetchAPI(`/homepage?_locale=${lang}`);
	const bestSellersProducts = await fetchAPI(`/products?_limit=${SWIPE_ITEMS_LIMIT}&_sort=sold:DESC&_locale=${lang}`);
	const newProducts = await fetchAPI(`/products?_limit=${SWIPE_ITEMS_LIMIT}&isNewProduct=true&_locale=${lang}`);
	const magazinePosts = await fetchAPI(`/blogs?_limit=${SWIPE_ITEMS_LIMIT}&_sort=created_at:DESC`);
	const surveys = await fetchAPI(`/surveys?&_locale=${lang}`);

	return {
		props: {
			...(await serverSideTranslations(lang, 'common')),
			homeData,
			bestSellersProducts,
			newProducts,
			magazinePosts,
			survey: surveys?.[0] ?? null,
		},
	};
};

const Home = ({ homeData, bestSellersProducts, newProducts, magazinePosts = [], survey }) => {
	const { t } = useTranslation('common');
	const [isSurveyOpen, setIsSurveyOpen] = useState(false);

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

	return (
		<>
			<Head>
				<title>Mine</title>
				<meta property="og:title" content="Mine" />
				<meta property="og:url" content="https://mineparis.com" />
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
			{/* {boxSection && (
				<BackgroundImage src={boxSection.staticImg} alt="box" isDarkOverlay>
					<Col>
						<h2 className="text-white">{boxSection.title}</h2>
					</Col>
					<Col className="my-5 px-6">
						<p className="text-lg text-white">{boxSection.subtitle}</p>
					</Col>
					<Col className="d-flex justify-content-center">
						<Link href={boxSection.button.link}>
							<Button className="rounded-button bg-white text-primary">
								{boxSection.button.label}
							</Button>
						</Link>
					</Col>
				</BackgroundImage>
			)} */}

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

			{/* {skinSection ? (
				<section>
					<BigCardsWithText {...skinSection} imageName="skin-section" />
				</section>
			) : null} */}

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