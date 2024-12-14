import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import { Container, Row, Col } from "reactstrap";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import Image from "../components/CustomImage";
import { fetchAPI } from "../lib/api";
import { getStrapiMedia } from "../lib/media";
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


const AboutUs = ({ data }) => {
	const { t } = useTranslation('common');
	const jumbotron = data?.section?.[0];
	const jumbotronImage = jumbotron.image ? getStrapiMedia(jumbotron.image) : jumbotron.imageURL;
	const firstSection = data?.section?.[1];
	const firstSectionImage = firstSection.image ? getStrapiMedia(firstSection.image) : firstSection.imageURL;
	const secondSection = data?.section?.[2];
	const secondSectionImage = secondSection.image ? getStrapiMedia(secondSection.image) : secondSection.imageURL;
	const thirdSection = data?.section?.[3];
	const thirdSectionImage = thirdSection.image ? getStrapiMedia(thirdSection.image) : thirdSection.imageURL;
	const lastSection = data?.lastSection;

	return (
		<>
			<Head>
				<title>Mine: {t('about_us')}</title>
			</Head>
			<section className="mh-full-screen dark-overlay py-7 d-flex align-items-center justify-content-center">
				<Image
					className="bg-image"
					src={jumbotronImage}
					alt={jumbotron.subtitle}
					layout="fill"
					objectFit="cover"
					objectPosition="center"
					priority
				/>
				<div className="overlay-content w-100">
					<Container>
						<Row>
							<Col xl="6" className="text-white">
								<h6 className="text-uppercase text-white letter-spacing-5 mb-3">
									{jumbotron.subtitle}
								</h6>
								<h1 className="display-3 font-weight-bold text-shadow mb-5">
									{jumbotron.title}
								</h1>
								<p className="text-lg">
									{jumbotron.description}
								</p>
							</Col>
						</Row>
					</Container>
				</div>
			</section>
			<section>
				<Container fluid>
					<Row>
						<Col lg="6" className="about-text-column bg-gray-100">
							<div className="about-text">
								<h6 className="text-uppercase text-muted letter-spacing-5 mb-1">
									{firstSection.subtitle}
								</h6>
								<h2 className="mb-4">{firstSection.title}</h2>
								<p className="text-lg text-muted">
									{firstSection.description}
								</p>
							</div>
						</Col>
						<Col lg="6" className="p-lg-0 about-image-column">
							<Image
								className="bg-image"
								src={firstSectionImage}
								alt={firstSection.subtitle}
								layout="fill"
								objectFit="cover"
								objectPosition="top"
							/>
						</Col>
					</Row>
					<Row>
						<Col lg="6" className="p-lg-0 about-text-column order-lg-2">
							<div className="about-text">
								<h6 className="text-uppercase text-muted letter-spacing-5 mb-1">
									{secondSection.subtitle}
								</h6>
								<h2 className="mb-4">{secondSection.title}</h2>
								<p className="text-lg text-muted">
									{secondSection.description}
								</p>
							</div>
						</Col>
						<Col lg="6" className="p-lg-0 about-image-column order-lg-1">
							<Image
								className="bg-image"
								src={secondSectionImage}
								alt={secondSection.subtitle}
								layout="fill"
								objectFit="cover"
								objectPosition="top"
							/>
						</Col>
					</Row>
					<Row>
						<Col lg="6" className="about-text-column bg-gray-100">
							<div className="p-5">
								<blockquote className="mb-5">
									<p className="text-xl text-serif mb-4">
										{thirdSection.title}
									</p>
								</blockquote>
								<p className="text-lg text-muted">
									{thirdSection.description}
								</p>
							</div>
						</Col>
						<Col lg="6" className="p-lg-0 about-image-column">
							<Image
								className="bg-image"
								src={thirdSectionImage}
								alt="Mine"
								layout="fill"
								objectFit="cover"
								objectPosition="top"
							/>
						</Col>
					</Row>
				</Container>
			</section>
			<section className="py-6">
				<Container>
					<Row className="d-flex justify-content-center text-center">
						<Col lg="6">
							<h2 className="mb-5">
								{lastSection.title}
							</h2>
						</Col>
					</Row>
					<Row>
						<Col lg="6">
							<p className="text-lg text-muted">
								{lastSection.description}
							</p>
						</Col>
						<Col lg="6">
							<p className="text-lg text-muted">
								{lastSection.secondDescription}
							</p>
						</Col>
					</Row>
				</Container>
			</section>
		</>
	);
};

export default AboutUs;