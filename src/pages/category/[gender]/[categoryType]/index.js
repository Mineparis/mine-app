import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import useSWRImmutable from 'swr/immutable';
import { Container, Row, Col, Spinner } from 'reactstrap';

import Product from '@components/Product';
import Hero from '@components/Hero';
import { fetchAPI } from '../../../../lib/api';
import { DEFAULT_LANG } from '../../../../utils/constants';
import useFilter from '@hooks/UseFilter';
import usePagination from '@hooks/UsePagination';

import ShopHeader from '@components/ShopHeader';
import ShopPagination from '@components/ShopPagination';

const PAGE_LIMIT = 12;

export const getServerSideProps = async ({ locale, params, res }) => {
	const { gender, categoryType } = params;

	res.setHeader('Cache-Control', `s-maxage=600, stale-while-revalidate`);

	const lang = locale || DEFAULT_LANG;
	const categories = await fetchAPI(`/categories?gender=${gender}&parent=${categoryType}&_locale=${lang}`);
	const menuData = await fetchAPI(`/categories/menu/paths`);

	const subCategories = menuData.filter(data =>
		data.gender === gender && data.categoryType === categoryType && data.locale === lang
	).map(data => ({ categoryId: data.categoryId, name: data.categoryName }));

	if (!categories?.length) return { notFound: true };

	return {
		props: {
			...(await serverSideTranslations(lang, 'common')),
			category: categories[0] || [],
			subCategories,
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

const Category = ({ category, subCategories, locale }) => {
	const { gender, parent, description } = category;

	const { t } = useTranslation('common');
	const [page, setPage] = usePagination();
	const [sortOptionSelected, setSortOptionSelected] = useState('popularity');

	const start = (page - 1) * PAGE_LIMIT; // Calcul du début pour la pagination
	const sortQuery = sortQueryMapping[sortOptionSelected];

	const URL = `/products?categories.gender=${gender}&categories.parent=${parent}&_limit=${PAGE_LIMIT}&_start=${start}&_sort=${sortQuery}&_locale=${locale}`;
	const countURL = `/products?categories.gender=${gender}&categories.parent=${parent}&_locale=${locale}`;

	const {
		handleChangeType,
		handleResetType,
		URLWithQueryParams,
		typesSelected,
	} = useFilter(URL);

	const { data: products = [] } = useSWRImmutable(URLWithQueryParams, fetchAPI);
	const { data: productData } = useSWRImmutable(countURL, fetchAPI);
	const nbProducts = productData?.length ?? 0; // Total des produits sans limite

	const totalPages = Math.ceil(nbProducts / PAGE_LIMIT); // Total des pages en fonction du nombre total de produits
	const genderLabel = t(gender);
	const parentLabel = t(parent);
	const titleLabel = `Mine: ${genderLabel} · ${parentLabel}`;
	const breadcrumbs = [
		{
			name: genderLabel,
			active: true
		},
	];

	const noTypesSelected = !typesSelected.length ? '-selected' : '';

	// Ne pas afficher la pagination si le nombre de produits est inférieur à PAGE_LIMIT + 1
	if (nbProducts <= PAGE_LIMIT) {
		return (
			<>
				<Head>
					<title>{titleLabel}</title>
					<meta name="description" content={titleLabel} />
					<meta property="og:title" content="Mine" />
					<meta property="og:description" content={titleLabel} />
					<meta property="og:url" content={`https://mineparis.com/category/${gender}/${parent}`} />
				</Head>
				<Hero
					className="hero-content pb-5"
					title={parentLabel}
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

							<Col>
								<Row className="mb-4">
									<button
										type="button"
										className={`btn subcategory-nav-item${noTypesSelected}`}
										onClick={handleResetType}
									>
										{t('all')}
									</button>
									{subCategories.map(({ name, categoryId }) => {
										const selected = typesSelected.includes(categoryId) ? '-selected' : '';

										return (
											<button
												key={categoryId}
												type="button"
												className={`btn subcategory-nav-item${selected}`}
												onClick={handleChangeType(categoryId)}
											>
												{name}
											</button>
										);
									})}
								</Row>
							</Col>

							{!products.length ? (
								<div className="d-flex justify-content-center align-items-center py-7 my-6">
									<Spinner color="dark" role="status" />
								</div>
							) : (
								<Row>
									{products.map((productData) => (
										<Col key={productData.id} xs="6" sm="4" md="4" lg="3" xl="3">
											<Product data={productData} />
										</Col>
									))}
								</Row>
							)}
						</Col>
					</Row>
				</Container>
			</>
		);
	}

	return (
		<>
			<Head>
				<title>{titleLabel}</title>
				<meta name="description" content={titleLabel} />
				<meta property="og:title" content="Mine" />
				<meta property="og:description" content={titleLabel} />
				<meta property="og:url" content={`https://mineparis.com/category/${gender}/${parent}`} />
			</Head>
			<Hero
				className="hero-content pb-5"
				title={parentLabel}
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

						<Col>
							<Row className="mb-4">
								<button
									type="button"
									className={`btn subcategory-nav-item${noTypesSelected}`}
									onClick={handleResetType}
								>
									{t('all')}
								</button>
								{subCategories.map(({ name, categoryId }) => {
									const selected = typesSelected.includes(categoryId) ? '-selected' : '';

									return (
										<button
											key={categoryId}
											type="button"
											className={`btn subcategory-nav-item${selected}`}
											onClick={handleChangeType(categoryId)}
										>
											{name}
										</button>
									);
								})}
							</Row>
						</Col>

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
									page={page}
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
