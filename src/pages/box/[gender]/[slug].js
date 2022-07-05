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
const SwiperGallery = dynamic(() => import('../../../components/SwiperGallery'));
const Swiper = dynamic(() => import('../../../components/Swiper'));
const Product = dynamic(() => import('../../../components/Product'));
const Accordeon = dynamic(() => import('../../../components/Accordeon'));

export const getStaticPaths = async () => {
	const boxes = await fetchAPI('/boxes');
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

	const lastBoxes = {};

	const accRatings = box.comments.reduce((acc, { rating }) => acc + rating, 0);
	const averageRating = Math.floor(accRatings / box.comments.length);

	// const query = qs.stringify({
	// 	_where: {
	// 		id_ne: box.id,
	// 	},
	// 	_sort: 'sold:DESC',
	// 	_limit: 4,
	// 	_locale: lang,
	// });

	// const lastBoxes = await fetchAPI(`/boxes?${query}`);

	return {
		props: {
			...(await serverSideTranslations(lang, 'common')),
			box,
			lastBoxes,
			averageRating,
		},
	};
};

const MontlyBox = ({ box, lastBoxes, averageRating }) => {
	const { t } = useTranslation('common');
	const router = useRouter();

	const { slug, carousel, images, products, description } = box;
	const [month, year] = slug?.split('-') ?? [];
	const titleLabel = `Mine Box ${month} ${year}`;

	const tabOptions = [
		{ title: 'Description', text: description },
	];

	if (router.isFallback) {
		return (
			<div className="d-flex justify-content-center align-items-center">
				<Spinner type="grow" color="primary" />
			</div>
		);
	}

	return (
		<>
			<Head>
				<title>{titleLabel}</title>
				<meta name="description" content={titleLabel} />
				<meta property="og:title" content="Mine" />
				<meta property="og:description" content={titleLabel} />
				<meta property="og:url" content={`https://mineparis.com/box/${slug}`} />
			</Head>

			<Swiper
				data={carousel}
				slidesPerView={1}
				spaceBetween={0}
				style={{ height: "47vh", minHeight: "470px" }}
			/>

			<section id="detail" className="py-6">
				<Container fluid>
					<Row className="justify-content-around">
						<Col
							xs={{ size: 12, order: 1 }}
							lg={{ size: 6, order: 1 }}
							className="py-3"
						>
							<SwiperGallery images={images} vertical />
						</Col>
						<Col
							xs={{ size: 12, order: 1 }}
							lg={{ size: 6, order: 2 }}
							xl="5"
							className="py-4 pl-lg-5"
						>
							<DetailMain product={box} averageRating={averageRating} />
							<Accordeon options={tabOptions} />
						</Col>
					</Row>
				</Container>
			</section>

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

			{/* <section>
				<PrevBoxes boxes={boxes} />
			</section> */}
		</>
	);
};

export default MontlyBox;
