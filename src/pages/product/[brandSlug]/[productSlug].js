import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import dynamic from "next/dynamic";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Container, Row, Col, Spinner } from 'reactstrap';
import qs from 'qs';
import { useTranslation } from 'next-i18next';

import { fetchAPI } from '../../../lib/api';
import { DEFAULT_LANG } from '../../../utils/constants';

const DetailMain = dynamic(() => import('../../../components/DetailMain'));
const DetailSimilar = dynamic(() => import('../../../components/DetailSimilar'));
const Accordeon = dynamic(() => import('../../../components/Accordeon'));
const Reviews = dynamic(() => import('../../../components/Reviews'));
const SwiperGallery = dynamic(() => import('../../../components/SwiperGallery'));

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
	const accRatings = product.comments.reduce((acc, { rating }) => acc + rating, 0);
	const averageRating = Math.floor(accRatings / product.comments.length);

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

	return {
		props: {
			...(await serverSideTranslations(lang, 'common')),
			product,
			similarProducts,
			averageRating,
		},
	};
};

const ProductDetail = ({ product, similarProducts, averageRating }) => {
	const { t } = useTranslation('common');
	const router = useRouter();

	const titleLabel = `Mine: ${product.brand} · ${product.name}`;

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
				<title>{titleLabel}</title>
				<meta name="description" content={titleLabel} />
				<meta property="og:title" content="Mine" />
				<meta property="og:description" content={titleLabel} />
				<meta property="og:url" content={`https://mineparis.com/product/${product.brandSlug}/${product.productSlug}`} />
			</Head>
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

			<section>
				<DetailSimilar products={similarProducts} />
			</section>

			{product.comments > 0 && <Reviews comments={product.comments} averageRating={averageRating} />}
		</>
	);
};

export default ProductDetail;
