import Head from 'next/head';
import dynamic from 'next/dynamic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { Container, Row, Col, Card, CardBody } from "reactstrap";

import Swiper from '../components/Swiper';
import Loading from '../components/Loading';
import ServicesBlock from "../components/ServicesBlock";
import BackgroundImage from "../components/BackgroundImage";
import { fetchAPI } from "../lib/api";
import { DEFAULT_LANG } from "../utils/constants";

const SWIPE_ITEMS_LIMIT = 10;

const SwiperProducts = dynamic(() => import('../components/SwiperProducts'), { loading: Loading });
const BestCategories = dynamic(() => import('../components/BestCategories'), { loading: Loading });
const SwiperMagazine = dynamic(() => import('../components/SwiperMagazine'), { loading: Loading });

export const getStaticProps = async ({ locale }) => {
	const lang = locale || DEFAULT_LANG;
	const homeData = await fetchAPI(`/homepage?_locale=${lang}`);
	const bestSellersProducts = await fetchAPI(`/products?_limit=${SWIPE_ITEMS_LIMIT}&_sort=sold:DESC&_locale=${lang}`);
	const newProducts = await fetchAPI(`/products?_limit=${SWIPE_ITEMS_LIMIT}&isNewProduct=true&_locale=${lang}`);
	const magazinePosts = await fetchAPI(`/blogs?_limit=${SWIPE_ITEMS_LIMIT}&_sort=created_at:DESC`);

	return {
		props: {
			...(await serverSideTranslations(lang, 'common')),
			homeData,
			bestSellersProducts,
			newProducts,
			magazinePosts,
		},
	};
};

const Home = ({ homeData, bestSellersProducts, newProducts, magazinePosts = [] }) => {
	const { t } = useTranslation('common');

	const { carousel, ourDescription, surveySection, valuesSection, categoriesSection } = homeData;

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
				<BestCategories categoriesSection={categoriesSection} />
			</section>

			{newProducts.length ? (
				<section className="py-6">
					<SwiperProducts title={t('new_arrivals')} products={newProducts} />
				</section>
			) : null}
			{/* 
			{boxSection && (
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

			{magazinePosts.length ? (
				<section className="py-5" style={{ background: '#979694' }}>
					<SwiperMagazine title="Magazine" posts={magazinePosts} />
				</section>
			) : null}

			{valuesSection && <ServicesBlock valuesSection={valuesSection} />}
		</>
	);
};

export default Home;