import { useState } from 'react';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import useSWRImmutable from 'swr/immutable';
import { Container, Row, Col, Spinner } from 'reactstrap';

import Product from '@components/Product';
import Hero from '@components/Hero';
import Swiper from '@components/Swiper';
import { fetchAPI } from '../../../lib/api';
import { DEFAULT_LANG } from '../../../utils/constants';
import useFilter from '@hooks/UseFilter';
import ShopHeader from '@components/ShopHeader';
import ShopPagination from '@components/ShopPagination';

const PAGE_LIMIT = 12;

export const getServerSideProps = async ({ params, locale, res }) => {
	const { slug, categoryType } = params;

	res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate');

	const lang = locale || DEFAULT_LANG;
	const routines = await fetchAPI(`/routines?slug=${slug}&_locale=${lang}`);
	const menuData = await fetchAPI(`/categories/menu/paths`);

	const menuDataCategoryNames = menuData.map(({ categoryName }) => categoryName);

	const menuDataFiltered = menuData.filter(({ categoryName }, index) => {
		return !menuDataCategoryNames.includes(categoryName, index + 1);
	});

	const subCategories = menuDataFiltered.reduce((acc, data) =>
		(data.categoryType === categoryType &&
			data.locale === lang)
			? [...acc, { categoryId: data.categoryId, name: data.categoryName }]
			: acc
		, []);

	if (!routines?.length) return { notFound: true };

	return {
		props: {
			...(await serverSideTranslations(lang, 'common')),
			routine: routines[0] || [],
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

const Routine = ({ routine, subCategories, locale }) => {
	const { parent, slug, description, id, carousel } = routine;
	const { t } = useTranslation('common');
	const router = useRouter();

	const [page, setPage] = useState(1);
	const [sortOptionSelected, setSortOptionSelected] = useState('popularity');

	const start = page === 1 ? 0 : (page - 1) * PAGE_LIMIT;
	const sortQuery = sortQueryMapping[sortOptionSelected];
	const URL = `/products?&routines.id=${id}&_limit=${PAGE_LIMIT}&_start=${start}&_sort=${sortQuery}&_locale=${locale}`;
	const countURL = `/products?&routines.id=${id}&_sort=${sortQuery}&_locale=${locale}`;

	const {
		handleChangeType,
		handleResetType,
		URLWithQueryParams,
		typesSelected,
	} = useFilter(URL);

	const { data: products = [] } = useSWRImmutable(URLWithQueryParams, fetchAPI);
	const { data: productData } = useSWRImmutable(countURL, fetchAPI);
	const totalProducts = productData?.length ?? 0;

	const totalPages = Math.ceil(totalProducts / PAGE_LIMIT);
	const routineNameLabel = t(slug);
	const parentLabel = t(parent);

	// Optimisation du titre SEO
	const titleLabel = `Mine Paris: Routine ${parentLabel} ${routineNameLabel}`;
	const descriptionContent = description || `Explorez notre sélection de produits pour une routine beauté ${parentLabel.toLowerCase()} ${routineNameLabel.toLowerCase()}.`;
	const canonicalUrl = `https://mineparis.com/routine/${parent}/${slug}`;
	const ogImage = carousel?.[0]?.image || '/img/slider/mine-carousel.jpg';

	const noTypesSelected = !typesSelected.length ? '-selected' : '';

	return (
		<>
			<Head>
				<title>{titleLabel}</title>

				{/* Description SEO optimisée */}
				<meta name="description" content={descriptionContent} />
				<meta name="robots" content="index, follow" />

				{/* Balises Open Graph optimisées */}
				<meta property="og:title" content={titleLabel} />
				<meta property="og:description" content={descriptionContent} />
				<meta property="og:url" content={canonicalUrl} />
				<meta property="og:type" content="website" />
				<meta property="og:image" content={ogImage} />

				{/* Balises Twitter Card optimisées */}
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content={titleLabel} />
				<meta name="twitter:description" content={descriptionContent} />
				<meta name="twitter:image" content={ogImage} />

				{/* URL Canonique */}
				<link rel="canonical" href={canonicalUrl} />
			</Head>

			{/* Section Carousel */}
			<Swiper style={{ height: "70vh" }} data={carousel} />

			{/* Section Hero avec la description */}
			<Hero className="hero-content mt-4 mb-2" colSize={12} content={description} />

			{/* Section produits */}
			<Container>
				<Row>
					<Col xs="12" className="products-grid sidebar-none">
						<ShopHeader
							nbProducts={totalProducts}
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

						{/* Affichage des produits */}
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

								{/* Pagination */}
								<ShopPagination
									page={page}
									totalItems={totalProducts}
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

export default Routine;
