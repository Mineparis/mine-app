import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { Container, Row, Col } from 'reactstrap';

import Hero from '@components/Hero';
import Product from '@components/Product';
import ShopHeader from '@components/ShopHeader';
import ShopPagination from '@components/ShopPagination';
import { PAGE_LIMIT } from '@utils/constants';

const CategoryPage = ({
	category,
	subCategories,
	products,
	nbProducts,
	page,
	sortOptionSelected,
	typesSelected,
}) => {
	const { t } = useTranslation('common');
	const { gender, parent, description } = category;
	const router = useRouter();
	const [selectedFilters, setSelectedFilters] = useState(typesSelected);

	useEffect(() => {
		const { types } = router.query;
		if (types) setSelectedFilters(types.split(','));
	}, [router.query.types]);

	const totalPages = Math.ceil(nbProducts / PAGE_LIMIT);

	const updateQuery = (newQuery) => {
		router.push({ pathname: router.pathname, query: { ...router.query, ...newQuery } });
	};

	const handleChangeType = (categoryId) => {
		const newFilters = selectedFilters.includes(categoryId)
			? selectedFilters.filter((id) => id !== categoryId)
			: [...selectedFilters, categoryId];
		setSelectedFilters(newFilters);
		updateQuery({ types: newFilters.join(','), page: 1 });
	};

	const handleResetType = () => {
		setSelectedFilters([]);
		updateQuery({ types: '', page: 1 });
	};

	const handleSortChange = (newSort) => updateQuery({ sort: newSort, page: 1 });
	const handleChangePage = (newPage) => updateQuery({ page: newPage });

	const genderLabel = t(gender);
	const parentLabel = t(parent);
	const titleLabel = `${parentLabel} pour ${genderLabel} - Mine Paris | Beauté et Cosmétiques`;
	const canonicalUrl = `https://mineparis.com${router.asPath}`;
	const ogImage = '/img/slider/mine-carousel.jpg';

	return (
		<>
			<Head>
				<title>{titleLabel}</title>
				<meta name="description" content={description || titleLabel} />
				<link rel="canonical" href={canonicalUrl} />
				<meta property="og:image" content={ogImage} />
			</Head>

			<Hero
				className="hero-content pb-5"
				title={parentLabel}
				breadcrumbs={[{ name: genderLabel, active: true }]}
				content={description}
			/>

			<Container>
				<Row>
					<Col xs="12" className="products-grid sidebar-none">
						<ShopHeader
							nbProducts={nbProducts}
							sortOptionSelected={sortOptionSelected}
							setSortOptionSelected={handleSortChange}
						/>
						{subCategories && (
							<Col>
								<Row className="mb-4">
									<button
										type="button"
										className={`btn subcategory-nav-item${!selectedFilters.length ? '-selected' : ''}`}
										onClick={handleResetType}
									>
										{t('all')}
									</button>
									{subCategories.map(({ name, categoryId }) => {
										const selected = selectedFilters.includes(categoryId) ? '-selected' : '';
										return (
											<button
												key={categoryId}
												type="button"
												className={`btn subcategory-nav-item${selected}`}
												onClick={() => handleChangeType(categoryId)}
											>
												{name}
											</button>
										);
									})}
								</Row>
							</Col>
						)}

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
							handleChangePage={handleChangePage}
						/>
					</Col>
				</Row>
			</Container>
		</>
	);
};

export default CategoryPage;
