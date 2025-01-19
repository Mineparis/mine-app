import React from "react";
import { Container, Row, Col, Button } from "reactstrap";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { DEFAULT_LANG, REVALIDATE_PAGE_SECONDS } from "../../utils/constants";
import { fetchAPI } from "../../lib/api";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

export const getStaticPaths = async () => {
	const posts = await fetchAPI('/events');

	return {
		paths: posts.map(({ slug }) => ({ params: { slug } })),
		fallback: false,
	};
};

export const getStaticProps = async ({ params, locale }) => {
	const lang = locale || DEFAULT_LANG;

	const [data] = await fetchAPI(`/events?slug=${params.slug}`);

	return {
		props: {
			...(await serverSideTranslations(lang, 'common')),
			data,
		},
		revalidate: REVALIDATE_PAGE_SECONDS
	};
};

const Event = ({ data }) => {
	const [jumbotron, firstSection, secondSection, thirdSection] = data?.section;
	const jumbotronImage = jumbotron.image ? getStrapiMedia(jumbotron.image) : jumbotron.imageURL;
	const secondSectionImage = secondSection.image ? getStrapiMedia(secondSection.image) : secondSection.imageURL;
	const thirdSectionImage = thirdSection.image ? getStrapiMedia(thirdSection.image) : thirdSection.imageURL;

	return (<>
		<Head>
			<title>Mine: {data.title}</title>
		</Head>
		<section className="mh-full-screen dark-overlay py-7 d-flex align-items-center justify-content-center">
			<Image
				className="bg-image"
				src={jumbotronImage}
				alt={jumbotron.subtitle}
				priority
				fill
				sizes="100vw"
				objectFit="cover"
				objectPosition="top"
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
		<section className="py-6">
			<Container className="d-flex justify-content-center text-center">
				<Col lg="6">
					<h2 className="mb-5">
						{firstSection.title}
					</h2>
					<p className="text-lg text-muted mb-4">
						{firstSection.description}
					</p>
					<Link href={firstSection.button.link} legacyBehavior>
						<Button color="primary">{firstSection.button.label}</Button>
					</Link>
				</Col>
			</Container>
		</section>
		<section>
			<Container fluid>
				<Row>
					<Col lg="6" className="p-lg-0 about-image-column">
						<Image
							className="bg-image"
							src={secondSectionImage}
							alt={secondSection.subtitle}
							fill
							sizes="100vw"
							objectFit="cover"
							objectPosition="center"
						/>
					</Col>
					<Col lg="6" className="about-text-column bg-gray-100">
						<div className="about-text">
							<h6 className="text-uppercase text-muted letter-spacing-5 mb-1">
								{secondSection.subtitle}
							</h6>
							<h2 className="mb-4">{secondSection.title}</h2>
							<p className="text-lg text-muted mb-4">
								{secondSection.description}
							</p>
							<Link href={secondSection.button.link} legacyBehavior>
								<Button color="primary">{secondSection.button.label}</Button>
							</Link>
						</div>
					</Col>
				</Row>

				<Row>
					<Col lg="6" className="p-lg-0 about-text-column">
						<div className="about-text">
							<h6 className="text-uppercase text-muted letter-spacing-5 mb-1">
								{thirdSection.subtitle}
							</h6>
							<h2 className="mb-4">{thirdSection.title}</h2>
							<p className="text-lg text-muted mb-4">
								{thirdSection.description}
							</p>
							<Link href={thirdSection.button.link} legacyBehavior>
								<Button color="primary">{thirdSection.button.label}</Button>
							</Link>
						</div>
					</Col>
					<Col lg="6" className="p-lg-0 about-image-column order-lg-1">
						<Image
							className="bg-image"
							src={thirdSectionImage}
							alt={thirdSection.subtitle}
							fill
							sizes="100vw"
							objectFit="cover"
							objectPosition="center"
						/>
					</Col>
				</Row>
			</Container>
		</section>
	</>);
};

export default Event;