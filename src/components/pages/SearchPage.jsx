import { useRouter } from 'next/router';
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { Container, Row, Col } from 'reactstrap';

import Product from '@components/Product';
import Hero from '@components/Hero';
import ShopHeader from '@components/ShopHeader';
import ShopPagination from '@components/ShopPagination';

const SearchPage = ({ keyword, page, sortOption, products, totalPages, nbProducts }) => {
	const { t } = useTranslation('common');
	const router = useRouter();

	const titleLabel = `Mine: Résultats de recherche pour "${keyword}"`;
	const descriptionLabel = `Résultats de recherche pour "${keyword}" sur Mine Paris. Découvrez nos produits cosmétiques naturels.`;
	const canonicalUrl = `https://mineparis.com/search?keyword=${encodeURIComponent(keyword)}&page=${page}&sort=${sortOption}`;

	const handleSortChange = (newSort) => {
		router.push({
			pathname: '/search',
			query: { keyword, page: 1, sort: newSort },
		});
	};

	const handlePageChange = (newPage) => {
		router.push({
			pathname: '/search',
			query: { keyword, page: newPage, sort: sortOption },
		});
	};

	return (
		<>
			<Head>
				<title>{titleLabel}</title>
				<meta name="description" content={descriptionLabel} />
				<meta name="robots" content="index, follow" />
				<meta property="og:title" content={titleLabel} />
				<meta property="og:description" content={descriptionLabel} />
				<meta property="og:url" content={canonicalUrl} />
				<meta name="twitter:title" content={titleLabel} />
				<meta name="twitter:description" content={descriptionLabel} />
				<link rel="canonical" href={canonicalUrl} />
			</Head>

			<Hero
				className="hero-content mt-3"
				title={`${t('result_for')} "${keyword}"`}
				subtitle={`${nbProducts} ${t('products_found')}`}
			/>

			<Container>
				<Row>
					<Col xs="12" className="products-grid sidebar-none">
						<ShopHeader
							nbProducts={nbProducts}
							sortOptionSelected={sortOption}
							setSortOptionSelected={handleSortChange}
						/>

						{products.length === 0 ? (
							<div className="text-center py-5">
								<p>{t('no_results_found')}</p>
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

								{totalPages > 1 && (
									<ShopPagination
										page={page}
										totalItems={nbProducts}
										totalPages={totalPages}
										handleChangePage={handlePageChange}
									/>
								)}
							</>
						)}
					</Col>
				</Row>
			</Container>
		</>
	);
};

export default SearchPage;
