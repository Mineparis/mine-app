import Head from 'next/head';
import { useRouter } from 'next/router';
import { Container, Row, Col } from 'reactstrap';
import Hero from '@components/Hero';
import Product from '@components/Product';
import ShopHeader from '@components/ShopHeader';
import ShopPagination from '@components/ShopPagination';
import { PAGE_LIMIT } from '@utils/constants';

const BrandPage = ({
	slugRequested,
	brandName,
	nbProducts,
	products,
	currentPage,
	sortOption,
}) => {
	const router = useRouter();
	const totalPages = Math.ceil(nbProducts / PAGE_LIMIT);

	const handleSortChange = (newSort) => {
		router.push({
			pathname: `/brand/${slugRequested}`,
			query: { ...router.query, sort: newSort, page: 1 },
		});
	};

	const handlePageChange = (newPage) => {
		router.push({
			pathname: `/brand/${slugRequested}`,
			query: { ...router.query, page: newPage },
		});
	};

	const title = `Mine: ${brandName} | Boutique en ligne`;
	const description = `Découvrez la collection de ${brandName} sur Mine Paris. Transformez votre routine beauté avec les meilleurs soins corporels et capillaires naturels.`;
	const canonicalUrl = `https://mineparis.com/brand/${slugRequested}`;
	const ogImage = '/img/slider/mine-carousel.jpg';

	return (
		<>
			<Head>
				<title>{title}</title>
				<meta name="description" content={description} />
				<link rel="canonical" href={canonicalUrl} />
				<meta property="og:title" content={title} />
				<meta property="og:description" content={description} />
				<meta property="og:image" content={ogImage} />
				<meta property="og:url" content={canonicalUrl} />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content={title} />
				<meta name="twitter:description" content={description} />
				<meta name="twitter:image" content={ogImage} />
			</Head>

			<Hero className="hero-content pb-5" title={brandName} />

			<Container>
				<Row>
					<Col xs="12" className="products-grid sidebar-none">
						<ShopHeader
							nbProducts={nbProducts}
							sortOptionSelected={sortOption}
							setSortOptionSelected={handleSortChange}
						/>

						<Row>
							{products.map((productData) => (
								<Col key={productData.id} xs="6" sm="4" md="4" lg="3" xl="3">
									<Product data={productData} />
								</Col>
							))}
						</Row>

						<ShopPagination
							page={currentPage}
							totalItems={nbProducts}
							totalPages={totalPages}
							handleChangePage={handlePageChange}
						/>
					</Col>
				</Row>
			</Container>
		</>
	);
};

export default BrandPage;
