import { useState } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import dynamic from "next/dynamic";
import useSWRImmutable from 'swr/immutable';
import { Container, Row, Col, Spinner } from 'reactstrap';

import Product from '../../../../components/Product';
import Hero from '../../../../components/Hero';
import { fetchAPI } from '../../../../lib/api';
import { DEFAULT_LANG } from '../../../../utils/constants';

const ShopHeader = dynamic(() => import('../../../../components/ShopHeader'));
const ShopPagination = dynamic(() => import('../../../../components/ShopPagination'));

const PAGE_LIMIT = 12;

export const getStaticPaths = async () => {
	const paths = await fetchAPI('/categories/menu/paths');

	return {
		paths: paths.map(({ gender, categoryType, categoryId, locale }) =>
			({ params: { gender, categoryType, categoryId }, locale })
		),
		fallback: false,
	};
};

export const getStaticProps = async ({ params, locale }) => {
	const { gender, categoryType, categoryId } = params;
	const lang = locale || DEFAULT_LANG;
	const categories = await fetchAPI(`/categories?gender=${gender}&parent=${categoryType}&categoryId=${categoryId}&_locale=${lang}`);

	if (!categories?.length) return { notFound: true };

	return {
		props: {
			...(await serverSideTranslations(lang, 'common')),
			category: categories[0] || [],
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

const Category = ({ category, locale }) => {
	const { gender, parent, name, description, categoryId } = category;
	const { t } = useTranslation('common');
	const [page, setPage] = useState(0);
	const [sortOptionSelected, setSortOptionSelected] = useState('popularity');

	const categoryNameLabel = t(name);
	const start = page * PAGE_LIMIT;
	const sortQuery = sortQueryMapping[sortOptionSelected];
	const { data: products = [] } = useSWRImmutable(
		`/products?categories.gender=${gender}&categories.parent=${parent}&categories.categoryId=${categoryId}&_limit=${PAGE_LIMIT}&_start=${start}&_sort=${sortQuery}&_locale=${locale}`,
		fetchAPI
	);

	const nbProducts = products.length;
	const totalPages = Math.ceil(nbProducts / PAGE_LIMIT);
	const genderLabel = t(gender);
	const parentLabel = t(parent);
	const titleLabel = `Mine: ${genderLabel} · ${parentLabel} · ${categoryNameLabel}`;
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
				<meta property="og:url" content={`https://mineparis.com/category/${gender}/${parent}/${name}`} />
			</Head>
			<Hero
				className="hero-content pb-5"
				title={categoryNameLabel}
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

export default Category;