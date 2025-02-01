import { Container, Row, Col } from 'reactstrap';
import Link from 'next/link';
import Image from "next/image";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';

import { fetchAPI } from '../../lib/api';
import { getStrapiMedia } from '../../lib/media';
import { DEFAULT_LANG, REVALIDATE_PAGE_SECONDS } from '../../utils/constants';
import Post from '@components/Post';

export async function getStaticProps({ locale }) {
	const lang = locale || DEFAULT_LANG;
	const allPosts = await fetchAPI('/blogs?_sort=created_at:DESC');

	return {
		props: {
			...(await serverSideTranslations(lang, 'common')),
			allPosts,
		},
		revalidate: REVALIDATE_PAGE_SECONDS
	};
}

const Magazine = ({ allPosts = [] }) => {
	const [mainPost, ...posts] = allPosts;

	// SEO variables
	const pageUrl = "https://mineparis.com/magazine";
	const titleLabel = "Magazine - Mine Paris";
	const descriptionLabel = "Découvrez sur le Magazine Mine Paris des astuces beauté et des informations sur les produits cosmétiques pour sublimer votre routine de beauté.";
	const ogImage = '/img/slider/mine-carousel.jpg';

	// Meta SEO Content
	const seoMeta = {
		title: titleLabel,
		description: descriptionLabel,
		url: pageUrl,
		image: ogImage,
	};

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
				<meta property="og:type" content="website" />

				{/* Twitter Cards Meta Tags */}
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content={seoMeta.title} />
				<meta name="twitter:description" content={seoMeta.description} />
				<meta name="twitter:image" content={seoMeta.image} />

				{/* Canonical URL */}
				<link rel="canonical" href={seoMeta.url} />
			</Head>

			{/* Main Post Section */}
			{mainPost && (
				<section className="position-relative py-6 mb-30px">
					<Image
						src={getStrapiMedia(mainPost.thumbnail)}
						className="bg-image"
						alt={mainPost.slug}
						fill
						sizes="100vw"
						style={{
							objectFit: "cover"
						}} />
					<Container>
						<Row className="d-flex justify-content-center">
							<Col lg="6">
								<div className="bg-white p-5">
									<Link
										href="/magazine/[slug]"
										as={`/magazine/${mainPost.slug}`}
										className='text-decoration-none'>
										<h2 className="mb-3">{mainPost.title}</h2>
									</Link>
									<Link
										href="/magazine/[slug]"
										as={`/magazine/${mainPost.slug}`}
										className='text-decoration-none'>
										<p className="text-muted">{mainPost.summary}</p>
									</Link>
								</div>
							</Col>
						</Row>
					</Container>
				</section>
			)}

			{/* List of Articles */}
			<section>
				<Container>
					<Row>
						{posts.map(({ slug, thumbnail, title, summary, created_at }) => (
							<Col xs="6" lg="4" key={slug}>
								<Post
									slug={slug}
									thumbnail={thumbnail}
									title={title}
									summary={summary}
									createdAt={created_at}
									withoutSummary={!summary}
								/>
							</Col>
						))}
					</Row>
				</Container>
			</section>
		</>
	);
};

export default Magazine;
