import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Container, Row, Col, Spinner } from 'reactstrap';
import { useTranslation } from 'next-i18next';

import DetailMain from '@components/DetailMain';
import Product from '@components/Product';
import { fetchAPI } from '../../../lib/api';
import { DEFAULT_LANG, REVALIDATE_PAGE_SECONDS } from '../../../utils/constants';
import SwiperGallery from '@components/SwiperGallery';
import Swiper from '@components/Swiper';
import Accordeon from '@components/Accordeon';

export const getStaticPaths = async () => {
	const boxes = await fetchAPI('/boxes?_locale=fr&_locale=en');
	return {
		paths: boxes?.map(({ gender, slug, locale }) => ({ params: { gender, slug }, locale })) ?? [],
		fallback: false,
	};
};

export const getStaticProps = async ({ params, locale }) => {
	const { gender, slug } = params;
	const lang = locale || DEFAULT_LANG;
	const boxes = await fetchAPI(`/boxes?slug=${slug}&gender=${gender}&_locale=${lang}`);
	const box = boxes?.[0];

	// Calcul de la note moyenne
	const accRatings = box.comments.reduce((acc, { rating }) => acc + rating, 0);
	const averageRating = Math.floor(accRatings / box.comments.length);

	return {
		props: {
			...(await serverSideTranslations(lang, 'common')),
			box,
			averageRating,
		},
		revalidate: REVALIDATE_PAGE_SECONDS,
	};
};

const MonthlyBox = ({ box, averageRating }) => {
	const { t } = useTranslation('common');
	const router = useRouter();
	const { slug, carousel, images, products, descriptions } = box;
	const [month, year] = slug?.split('-') ?? [];
	const titleLabel = `Box Mine ${month} ${year}`;

	const tabOptions = [
		{ title: t('description'), text: descriptions.long },
	];

	if (router.isFallback) {
		return (
			<div className="d-flex justify-content-center align-items-center">
				<Spinner type="grow" color="primary" />
			</div>
		);
	}

	const ogImage = 'img/slider/mine-carousel.jpg';

	return (
		<>
			<Head>
				<title>{titleLabel} | Mine Paris - Box Beauté</title>
				<meta name="description" content="Votre routine beauté optimale avec des produits naturels de qualité supérieure." />
				<meta property="og:title" content={titleLabel} />
				<meta property="og:description" content="Votre routine beauté optimale avec des produits naturels de qualité supérieure" />
				<meta property="og:url" content={`https://mineparis.com/box/${slug}`} />
				<meta property="og:type" content="website" />
				<meta property="og:image" content={ogImage} />
				<meta property="og:site_name" content="Mine Paris" />
			</Head>

			{/* Carousel */}
			<Swiper
				data={carousel}
				slidesPerView={1}
				spaceBetween={0}
				style={{ height: "47vh", minHeight: "470px" }}
			/>

			{/* Box Details */}
			<section id="detail" className="py-6">
				<Container fluid>
					<Row className="justify-content-around">
						<Col xs={{ size: 12, order: 1 }} lg={{ size: 6, order: 1 }} className="py-3">
							<SwiperGallery images={images} vertical />
						</Col>
						<Col xs={{ size: 12, order: 1 }} lg={{ size: 6, order: 2 }} xl="5" className="py-4 pl-lg-5">
							<DetailMain product={box} averageRating={averageRating} />
							<Accordeon options={tabOptions} />
						</Col>
					</Row>
				</Container>
			</section>

			{/* Products of the Box */}
			<section id="monthly_selection" className="py-2">
				<Container fluid>
					<Row className="d-flex justify-content-between mx-1 mb-2">
						<h3>{t('monthly_selection')}</h3>
					</Row>
					<Row className="justify-content-around">
						{products.map(product => (
							<Col key={product.id} xs="6" sm="3">
								<Product data={product} />
							</Col>
						))}
					</Row>
				</Container>
			</section>
		</>
	);
};

export default MonthlyBox;
