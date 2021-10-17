import { useState } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import useSWR from 'swr';
import { Container, Row, Col, Spinner } from 'reactstrap';

import ShopHeader from '../../../components/ShopHeader';
import ShopPagination from '../../../components/ShopPagination';
import Product from '../../../components/Product';
import Hero from '../../../components/Hero';

import { fetchAPI, getStrapiURL } from '../../../lib/api';
import { DEFAULT_LANG } from '../../../utils/constants';

const PAGE_LIMIT = 12;

export const getStaticPaths = async () => {
	const paths = await fetchAPI('/categories/menu/paths');
	return {
		paths: paths.map(({ gender, categorySlug, locale }) => ({ params: { gender, categorySlug }, locale })),
		fallback: false,
	};
};

export const getStaticProps = async ({ params, locale }) => {
	const slug = params.categorySlug;
	const lang = locale || DEFAULT_LANG;
	const categories = await fetchAPI(`/categories?slug=${slug}&_locale=${lang}`);
	const nbProducts = await fetchAPI(`/products/count?categories.slug=${slug}&_locale=${lang}`) || 0;
	return {
		props: {
			...(await serverSideTranslations(lang, 'common')),
			category: categories[0] || [],
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

const Category = ({ category, nbProducts, locale }) => {
	const { gender, parent, slug, name, description } = category;
	const { t } = useTranslation('common');
	const [page, setPage] = useState(0);
	const [sortOptionSelected, setSortOptionSelected] = useState('popularity');

	const categoryName = t(name);
	const start = page * PAGE_LIMIT;
	const totalPages = Math.ceil(nbProducts / PAGE_LIMIT);
	const sortQuery = sortQueryMapping[sortOptionSelected];
	const URL = getStrapiURL(`/products?categories.slug=${slug}&_limit=${PAGE_LIMIT}&_start=${start}&_sort=${sortQuery}&_locale=${locale}`);

	const { data: products = [] } = useSWR(URL);

	const genderLabel = t(gender);
	const parentLabel = t(parent);
	const titleLabel = `Mine: ${genderLabel} · ${parentLabel} · ${categoryName}`;
	const breadcrumbs = [
		{
			name: genderLabel,
		},
		{
			name: parentLabel,
			active: true,
		},
	];

	return (
		<>
			<Head>
				<title>{titleLabel}</title>
				<meta name="description" content={titleLabel} />
				<meta property="og:title" content="Mine" />
				<meta property="og:description" content={titleLabel} />
				<meta property="og:url" content={`https://mineparis.com/category/${parent}/${slug}`} />
			</Head>
			<Hero
				className="hero-content pb-5"
				title={categoryName}
				breadcrumbs={breadcrumbs}
				content={description}
			/>
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
								<Spinner color="dark" size="lg" />
							</div>
						) : (
							<>
								<Row>
									{products.map((productData) => (
										<Col key={productData._id} xs="6" sm="4" md="4" lg="3" xl="3">
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

export default Category;