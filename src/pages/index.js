import Link from "next/link";
import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { Container, Row, Col, Button, Card, CardBody } from "reactstrap";


import Swiper from "../components/Swiper";
import SwiperProducts from "../components/SwiperProducts";
import ServicesBlock from "../components/ServicesBlock";
import BestCategories from "../components/BestCategories";

import BackgroundImage from "../components/BackgroundImage";
import { fetchAPI } from "../lib/api";
import { DEFAULT_LANG } from "../utils/constants";

const SWIPE_ITEMS_LIMIT = 10;

export const getStaticProps = async ({ locale }) => {
	const lang = locale || DEFAULT_LANG;
	const homeData = await fetchAPI(`/homepage?_locale=${lang}`);
	const bestSellersProducts = await fetchAPI(`/products?_limit=${SWIPE_ITEMS_LIMIT}&_sort=sold:DESC&_locale=${lang}`);
	const newProducts = await fetchAPI(`/products?_limit=${SWIPE_ITEMS_LIMIT}&isNewProduct=true&_locale=${lang}`);
	return {
		props: {
			...(await serverSideTranslations(lang, 'common')),
			homeData,
			bestSellersProducts,
			newProducts,
		},
	};
};

const Home = ({ homeData, bestSellersProducts, newProducts }) => {
	const { t } = useTranslation('common');

	const { carousel, ourDescription, surveySection, boxSection, valuesSection } = homeData;

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
				parallax
				navigation
				style={{ height: "80vh", minHeight: "600px" }}
			/>

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
				<BestCategories t={t} />
			</section>

			<section className="py-6">
				<SwiperProducts title={t('new_arrivals')} products={newProducts} />
			</section>

			{boxSection && (
				<BackgroundImage src={boxSection.staticImg} alt="box" isDarkOverlay>
					<Col className="mb-6">
						<h2 className="text-white">{boxSection.title}</h2>
					</Col>
					<Col className="d-flex justify-content-center">
						<Link href={boxSection.button.link}>
							<Button className="rounded-button bg-white text-primary">{boxSection.button.label}</Button>
						</Link>
					</Col>
				</BackgroundImage>
			)}

			{valuesSection && <ServicesBlock valuesSection={valuesSection} />}
		</>
	);
};

export default Home;