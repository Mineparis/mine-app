import Head from 'next/head';
import dynamic from 'next/dynamic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Container, Row, Col } from "reactstrap";

import Swiper from '../../components/Swiper';
import { fetchAPI } from "../../lib/api";
import { DEFAULT_LANG } from "../../utils/constants";

const BigCards = dynamic(() => import('../../components/BigCards'));
const ServicesBlock = dynamic(() => import('../../components/ServicesBlock'));

export const getStaticProps = async ({ locale }) => {
	const lang = locale || DEFAULT_LANG;

	const data = await fetchAPI(`/boxpage?_locale=${lang}`);

	return {
		props: {
			...(await serverSideTranslations(lang, 'common')),
			data,
		},
	};
};

const BoxConcept = ({ title, description }) => {
	return (
		<section className="py-6">
			<Container>
				<Row>
					<Col className="d-flex justify-content-center mb-4">
						<h3>{title}</h3>
					</Col>
				</Row>
				<Row className="d-flex justify-content-center">
					<Col md="8" xl="8" className="d-flex justify-content-center">
						<div className="ck-content" dangerouslySetInnerHTML={{ __html: description }} />
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
				<Col className="d-flex justify-content-center mb-4">
					<h3>{title}</h3>
				</Col>
			</Row>
			<Row className="d-flex justify-content-center">
				{steps.map(({ id, step }) => (
					<Col key={`step-${id}`} md="4" xl="4">
						<p className="lead">{step}</p>
					</Col>
				))}
			</Row>
		</Container>
	</section>
);

const Box = ({ data }) => {
	const { carousel, boxConceptSection, boxHowToSection, valuesSection, bigCardsSection } = data;

	const handleClickOnButton = e => {
		e.preventDefault();
		document.getElementById("big-cards")?.scrollIntoView({ behavior: 'smooth' });
	};

	return (
		<>
			<Head>
				<title>Mine - Box</title>
				<meta property="og:title" content="Mine" />
				<meta property="og:url" content="https://mineparis.com/box" />
			</Head>

			<Swiper
				data={carousel}
				slidesPerView={1}
				spaceBetween={0}
				style={{ height: "47vh", minHeight: "470px" }}
				handleClickOnButton={handleClickOnButton}
			/>

			<BoxConcept {...boxConceptSection} />

			<BigCards data={bigCardsSection} isBox />

			<BoxHowTo {...boxHowToSection} />

			{valuesSection && <ServicesBlock data={valuesSection} />}
		</>
	);
};

export default Box;