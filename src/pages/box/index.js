import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Container, Row, Col } from "reactstrap";

import Swiper from '@components/Swiper';
import { fetchAPI } from "../../lib/api";
import { DEFAULT_LANG, REVALIDATE_PAGE_SECONDS } from "../../utils/constants";
import BigCards from '@components/BigCards';
import ServicesBlock from '@components/ServicesBlock';
import SwiperMagazine from '@components/SwiperMagazine';
import InstaGallery from '@components/InstaGallery';

const SWIPE_ITEMS_LIMIT = 10;

export const getStaticProps = async ({ locale }) => {
	const lang = locale || DEFAULT_LANG;

	const data = await fetchAPI(`/boxpage?_locale=${lang}`);
	const magazinePosts = await fetchAPI(`/blogs?_limit=${SWIPE_ITEMS_LIMIT}&_sort=created_at:DESC`);

	return {
		props: {
			...(await serverSideTranslations(lang, 'common')),
			data,
			magazinePosts: magazinePosts || [],
		},
		revalidate: REVALIDATE_PAGE_SECONDS,
	};
};

const BoxConcept = ({ title, description }) => {
	return (
		<section className="py-6">
			<Container>
				<Row>
					<Col className="d-flex justify-content-center mb-4">
						<h2>{title}</h2>
					</Col>
				</Row>
				<Row className="d-flex justify-content-center">
					<Col md="8" xl="8" className="d-flex justify-content-center">
						<div
							className="ck-content"
							dangerouslySetInnerHTML={{ __html: description }}
							aria-label={title}
						/>
					</Col>
				</Row>
			</Container>
		</section>
	);
};

const BoxHowTo = ({ title, steps }) => (
	<section id="how-to" className="pt-6 pb-5">
		<Container>
			<Row>
				<Col className="d-flex justify-content-center mb-4 text-muted lead">
					<h2>{title}</h2>
				</Col>
			</Row>
			<Row className="d-flex justify-content-center">
				{steps.map(({ id, step, subtitle }) => (
					<Col key={`step-${id}`} md="4" xl="4">
						{subtitle && <h5 className="d-flex justify-content-center mb-3 lead">{subtitle}</h5>}
						<p>{step}</p>
					</Col>
				))}
			</Row>
		</Container>
	</section>
);

const Box = ({ data, magazinePosts }) => {
	const { carousel, boxConceptSection, boxHowToSection, valuesSection, bigCardsSection } = data;

	const handleClickOnButton = e => {
		e.preventDefault();
		document.getElementById("big-cards")?.scrollIntoView({ behavior: 'smooth' });
	};

	return (
		<>
			<Head>
				<title>La Box Mine : Votre routine beauté optimale avec des produits naturels de qualité supérieure</title>
				<meta name="description" content="Découvrez la box Mine pour des soins naturels de qualité." />
				<meta property="og:title" content="Mine - Box Concept" />
				<meta property="og:description" content="Votre routine beauté optimale avec des produits naturels de qualité supérieure." />
				<meta property="og:url" content="https://mineparis.com/box" />
				<meta property="og:image" content="/img/slider/mine-carousel.jpg" />
				<meta name="robots" content="index, follow" />
			</Head>

			<Swiper
				data={carousel}
				slidesPerView={1}
				spaceBetween={0}
				style={{ height: "47vh", minHeight: "470px" }}
				handleClickOnButton={handleClickOnButton}
				aria-label="Carrousel de produits"
			/>

			<BoxConcept {...boxConceptSection} />

			<BigCards data={bigCardsSection} isBox />

			<BoxHowTo {...boxHowToSection} />

			{valuesSection && <ServicesBlock data={valuesSection} />}

			{magazinePosts.length ? (
				<section className="py-5" style={{ background: '#979694' }}>
					<SwiperMagazine title="Magazine" posts={magazinePosts} />
				</section>
			) : null}

			<section className="pt-3">
				<InstaGallery />
			</section>
		</>
	);
};

export default Box;
