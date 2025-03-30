import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Container, Row, Col, Spinner } from 'reactstrap';
import qs from 'qs';
import { useTranslation } from 'next-i18next';
import { ProductProvider } from '@shopify/hydrogen-react';

import DetailMain from '@components/DetailMain';
import DetailSimilar from '@components/DetailSimilar';
import { fetchAPI } from '../../../lib/api';
import { getShopifyProduct } from '../../../lib/shopify/requests/product';
import { DEFAULT_LANG, REVALIDATE_PAGE_SECONDS } from '../../../utils/constants';
import { getCommentsAverageRating } from '../../../utils/comments';
import Accordeon from '@components/Accordeon';
import Reviews from '@components/Reviews';
import SwiperGallery from '@components/SwiperGallery';

export const getStaticPaths = async () => {
	const products = await fetchAPI('/products?_locale=fr&_locale=en');
	return {
		paths: products.map(({ brandSlug, productSlug, locale }) => ({ params: { brandSlug, productSlug }, locale })),
		fallback: false,
	};
};

export const getStaticProps = async ({ params, locale }) => {
	const { productSlug } = params;
	const lang = locale || DEFAULT_LANG;
	const products = await fetchAPI(`/products?productSlug=${productSlug}&_locale=${lang}`);
	const product = products?.[0];
	const averageRating = getCommentsAverageRating(product.comments);

	const query = qs.stringify({
		_where: {
			'categories.slug': product.categories.map(({ slug }) => slug),
			stock_gt: 0,
			id_ne: product.id,
		},
		_sort: 'sold:DESC',
		_limit: 4,
		_locale: lang,
	});

	const similarProducts = await fetchAPI(`/products?${query}`);

	// const shopifyProduct = await getShopifyProduct(product.shopifyProductId);

	return {
		props: {
			...(await serverSideTranslations(lang, 'common')),
			product,
			// shopifyProduct,
			similarProducts,
			averageRating,
		},
		revalidate: REVALIDATE_PAGE_SECONDS
	};
};

const ProductDetail = ({ product, similarProducts, averageRating, shopifyProduct = {} }) => {
	const { t } = useTranslation();
	const router = useRouter();

	// Optimisation SEO
	const titleLabel = `${product.name} de ${product.brand} - Mine Paris`;
	const description = `Découvrez ${product.name} de ${product.brand}. Commandez dès maintenant sur Mine Paris.`;
	const canonicalUrl = `https://mineparis.com/product/${product.brandSlug}/${product.productSlug}`;
	const ogImage = product.images?.[0]?.url || '/img/slider/mine-carousel.jpg';

	if (router.isFallback) {
		return (
			<div className="d-flex justify-content-center align-items-center">
				<Spinner type="grow" color="primary" />
			</div>
		);
	}

	const tabOptions = [
		{ title: 'Description', text: product.descriptions.long },
		{ title: t('using_advice'), text: product.usingAdvice },
		{ title: t('composition'), text: product.composition },
	];

	return (
		<>
			<Head>
				{/* SEO: Titre optimisé */}
				<title>{titleLabel}</title>

				{/* SEO: Description optimisée */}
				<meta name="description" content={description} />
				<meta name="robots" content="index, follow" />

				{/* Open Graph Meta Tags */}
				<meta property="og:title" content={titleLabel} />
				<meta property="og:description" content={description} />
				<meta property="og:url" content={canonicalUrl} />
				<meta property="og:type" content="product" />
				<meta property="og:image" content={ogImage} />

				{/* Twitter Card Meta Tags */}
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content={titleLabel} />
				<meta name="twitter:description" content={description} />
				<meta name="twitter:image" content={ogImage} />

				{/* Canonical Link */}
				<link rel="canonical" href={canonicalUrl} />
			</Head>

			<ProductProvider data={shopifyProduct}>
				<>
					{/* Détails du produit */}
					<section className="product-details">
						<Container fluid>
							<Row className="justify-content-around">
								<Col
									xs={{ size: 12, order: 1 }}
									lg={{ size: 6, order: 1 }}
									className="py-3"
								>
									<SwiperGallery images={product.images} vertical={true} />
								</Col>
								<Col
									xs={{ size: 12, order: 1 }}
									lg={{ size: 6, order: 2 }}
									xl="5"
									className="py-4 pl-lg-5"
								>
									<DetailMain product={product} averageRating={averageRating} />
									<Accordeon options={tabOptions} />
								</Col>
							</Row>
						</Container>
					</section>

					{/* Produits similaires */}
					<section>
						<DetailSimilar products={similarProducts} />
					</section>

					{/* Avis clients */}
					{product.comments.length > 0 && <Reviews comments={product.comments} averageRating={averageRating} />}
				</>
			</ProductProvider>
		</>
	);
};

export default ProductDetail;
