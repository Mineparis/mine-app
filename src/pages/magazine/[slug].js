import React from "react";
import { Container, Row, Col } from "reactstrap";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';

import Hero from "../../components/Hero";
import { dateFormat } from "../../utils/date";
import { DEFAULT_LANG, REVALIDATE_PAGE_SECONDS } from "../../utils/constants";
import { fetchAPI } from "../../lib/api";

export const getStaticPaths = async () => {
	const posts = await fetchAPI('/blogs');

	return {
		paths: posts.map(({ slug }) => ({ params: { slug } })),
		fallback: 'blocking',
	};
};

export const getStaticProps = async ({ params, locale }) => {
	const lang = locale || DEFAULT_LANG;

	const [post] = await fetchAPI(`/blogs?slug=${params.slug}`);
	const { title, content, created_at } = post;

	return {
		props: {
			...(await serverSideTranslations(lang, 'common')),
			title,
			content,
			created_at,
			slug: params.slug,
		},
		revalidate: REVALIDATE_PAGE_SECONDS
	};
};

const MagazinePost = ({ title, content, created_at, slug }) => {
	const postUrl = `https://mineparis.com/magazine/${slug}`;
	const titleLabel = `${title} - Mine Paris Magazine`;
	const descriptionLabel = `${title}. Découvrez des informations et des conseils beauté sur Mine Paris Magazine.`;
	const ogImage = '/img/slider/mine-carousel.jpg';

	const seoMeta = {
		title: titleLabel,
		description: descriptionLabel,
		url: postUrl,
		image: ogImage,
	};

	const breadcrumbs = [{ name: 'Magazine', link: '/magazine' }];

	return (
		<>
			<Head>
				<title>{seoMeta.title}</title>
				<meta name="description" content={seoMeta.description} />
				<meta name="robots" content="index, follow" />

				{/* Open Graph Meta Tags */}
				<meta property="og:title" content={seoMeta.title} />
				<meta property="og:description" content={seoMeta.description} />
				<meta property="og:image" content={seoMeta.image} />
				<meta property="og:url" content={seoMeta.url} />
				<meta property="og:type" content="article" />

				{/* Twitter Cards Meta Tags */}
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content={seoMeta.title} />
				<meta name="twitter:description" content={seoMeta.description} />
				<meta name="twitter:image" content={seoMeta.image} />

				{/* Canonical URL */}
				<link rel="canonical" href={seoMeta.url} />
			</Head>

			<Hero
				className="hero-content text-center"
				title={title}
				breadcrumbs={breadcrumbs}
				centerBreadcrumbs
			>
				<Row>
					<Col lg="10" xl="8" className="mx-auto">
						<div className="mb-5 text-muted font-weight-light d-flex align-items-center justify-content-center">
							{dateFormat(created_at)}
						</div>
					</Col>
				</Row>
			</Hero>

			<section>
				<Container>
					<Row>
						<Col xl="8" lg="10" className="mx-auto">
							<div className="text-content text-lg">
								<div dangerouslySetInnerHTML={{ __html: content }} className="ck-content" />
							</div>
						</Col>
					</Row>
				</Container>
			</section>
		</>
	);
};

export default MagazinePost;
