import { useState } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import dynamic from "next/dynamic";
import useSWRImmutable from 'swr/immutable';
import { Container, Row, Col, Spinner } from 'reactstrap';

import Hero from '../../components/Hero';
import { fetchAPI } from '../../lib/api';
import { DEFAULT_LANG } from '../../utils/constants';

const ShopHeader = dynamic(() => import('../../components/ShopHeader'));
const ShopPagination = dynamic(() => import('../../components/ShopPagination'));
const Product = dynamic(() => import('../../components/Product'));

const PAGE_LIMIT = 12;

export const getStaticPaths = async () => {
	const paths = await fetchAPI('/products/brands/paths');
	return {
		paths: paths.map(({ brandSlug, locale }) => ({ params: { brandSlug }, locale })),
		fallback: false,
	};
};

export const getStaticProps = async ({ params, locale }) => {
	const slugRequested = params.brandSlug;
	const lang = locale || DEFAULT_LANG;
	const nbProducts = await fetchAPI(`/products/count?brandSlug=${slugRequested}&_locale=${lang}`) || 0;

	return {
		props: {
			...(await serverSideTranslations(lang, 'common')),
			slugRequested,
			nbProducts,
			locale: lang,
		},
	};
};

const sortQueryMapping = {
	popularity: 'sold:desc',
	newest: 'published_at:desc',
	ascending_price: 'originalPrice:asc,salePricePercent:asc',
	descending_price: 'originalPrice:desc,salePricePercent:desc',
};

const Brand = ({ slugRequested, nbProducts, locale }) => {
	const [page, setPage] = useState(0);
	const [sortOptionSelected, setSortOptionSelected] = useState('popularity');

	const start = page * PAGE_LIMIT;
	const totalPages = Math.ceil(nbProducts / PAGE_LIMIT);
	const sortQuery = sortQueryMapping[sortOptionSelected];
	const { data: products = [] } = useSWRImmutable(
		`/products?brandSlug=${slugRequested}&_limit=${PAGE_LIMIT}&_start=${start}&_sort=${sortQuery}&_locale=${locale}`,
		fetchAPI
	);

	const { brandSlug, brand: brandName } = products?.[0] ?? {};
	const titleLabel = `Mine: ${brandName}`;

	return (
		<>
			<Head>
				<title>{titleLabel}</title>
				<meta name="description" content={titleLabel} />
				<meta property="og:title" content="Mine" />
				<meta property="og:description" content={titleLabel} />
				<meta property="og:url" content={`https://mineparis.com/brand/${brandSlug}`} />
			</Head>
			<Hero className="hero-content pb-5" title={brandName} />
			<Container>
				<Row>
					<Col xs="12" className="products-grid sidebar-none">
						<ShopHeader
							nbProducts={nbProducts}
							sortOptionSelected={sortOptionSelected}
							setSortOptionSelected={setSortOptionSelected}
						/>

						{!products.length ? (
							<div className="d-flex justify-content-center align-items-center py-7 my-6">
								<Spinner color="dark" role="status" />
							</div>
						) : (
							<>
								<Row>
									{products.map((productData) => (
										<Col key={productData.id} xs="6" sm="4" md="4" lg="3" xl="3">
											<Product data={productData} />
										</Col>
									))}
								</Row>

								<ShopPagination
									page={page + 1}
									totalItems={nbProducts}
									totalPages={totalPages}
									handleChangePage={setPage}
								/>
							</>
						)}
					</Col>
				</Row>
			</Container>
		</>
	);
};

export default Brand;