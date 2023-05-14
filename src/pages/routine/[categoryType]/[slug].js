import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import dynamic from "next/dynamic";
import useSWRImmutable from 'swr/immutable';
import { Container, Row, Col, Spinner } from 'reactstrap';

import Product from '../../../components/Product';
import Hero from '../../../components/Hero';
import Swiper from '../../../components/Swiper';
import { fetchAPI } from '../../../lib/api';
import { DEFAULT_LANG } from '../../../utils/constants';
import useFilter from '../../../hooks/UseFilter';

const ShopHeader = dynamic(() => import('../../../components/ShopHeader'));
const ShopPagination = dynamic(() => import('../../../components/ShopPagination'));

const PAGE_LIMIT = 12;
const i18nConfig = {
	i18n: {
		defaultLocale: 'fr',
		locales: ['fr', 'en'],
		ns: ["common"],
		defaultNS: "common",
	}
};

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
			...(await serverSideTranslations(lang, 'common', i18nConfig)),
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

	const [page, setPage] = useState(0);
	const [sortOptionSelected, setSortOptionSelected] = useState('popularity');

	const start = page * PAGE_LIMIT;
	const sortQuery = sortQueryMapping[sortOptionSelected];
	const URL = `/products?&routines.id=${id}&_limit=${PAGE_LIMIT}&_start=${start}&_sort=${sortQuery}&_locale=${locale}`;

	const {
		handleChangeType,
		handleResetType,
		URLWithQueryParams,
		typesSelected,
	} = useFilter(URL);

	const { data: products = [] } = useSWRImmutable(URLWithQueryParams, fetchAPI);

	const nbProducts = products.length;
	const totalPages = Math.ceil(nbProducts / PAGE_LIMIT);
	const routineNameLabel = t(slug);
	const parentLabel = t(parent);
	const titleLabel = `Mine: ${parentLabel} · ${routineNameLabel}`;

	useEffect(() => {
		const typesQueryParams = router.query?.types;

		if (typesQueryParams) {
			const typesSearched = typesQueryParams.split(',');
			const isSame = typesSearched.every(typeSearched => typesSelected.includes(typeSearched));
			if (!isSame) {
				setTypesSelected(typesSearched);
				mutate(URLWithQueryParams);
			}
		}
	}, [router.query.types]);

	const noTypesSelected = !typesSelected.length ? '-selected' : '';

	return (
		<>
			<Head>
				<title>{titleLabel}</title>
				<meta name="description" content={titleLabel} />
				<meta property="og:title" content="Mine" />
				<meta property="og:description" content={titleLabel} />
				<meta property="og:url" content={`https://mineparis.com/routine/${parent}/${slug}`} />
			</Head>

			<Swiper style={{ height: "70vh" }} data={carousel} />
			<Hero className="hero-content mt-4 mb-2" colSize={12} content={description} />

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

export default Routine;