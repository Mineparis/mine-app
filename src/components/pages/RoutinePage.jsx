import { useRouter } from 'next/router';
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { Container, Row, Col, Spinner } from 'reactstrap';

import Product from '@components/Product';
import Hero from '@components/Hero';
import Swiper from '@components/Swiper';
import ShopHeader from '@components/ShopHeader';
import ShopPagination from '@components/ShopPagination';
import { PAGE_LIMIT } from '@utils/constants';


const RoutinePage = ({
	routine,
	products,
	nbProducts,
	page,
	sortOptionSelected,
	typeSelected,
}) => {
	const { t } = useTranslation('common');
	const router = useRouter();

	const { slug, parent, description, carousel } = routine;

	const handleChangePage = (newPage) => {
		router.push({
			pathname: router.pathname,
			query: {
				...router.query,
				page: newPage,
				sort: sortOptionSelected,
				type: typeSelected,
			},
		});
	};

	const handleSortChange = (newSort) => {
		router.push({
			pathname: router.pathname,
			query: {
				...router.query,
				page: 1,
				sort: newSort,
				types: typeSelected,
			},
		});
	};

	const totalPages = Math.ceil(nbProducts / PAGE_LIMIT);

	const routineNameLabel = t(slug);
	const parentLabel = t(parent);
	const titleLabel = `Mine Paris: Routine ${parentLabel} ${routineNameLabel}`;
	const descriptionContent =
		description ||
		`Explorez notre sélection de produits pour une routine beauté ${parentLabel.toLowerCase()} ${routineNameLabel.toLowerCase()}.`;
	const canonicalUrl = `https://mineparis.com/routine/${parent}/${slug}`;
	const ogImage = carousel?.[0]?.image || '/img/slider/mine-carousel.jpg';

	return (
		<>
			<Head>
				<title>{titleLabel}</title>
				<meta name="description" content={descriptionContent} />
				<meta name="robots" content="index, follow" />
				<meta property="og:title" content={titleLabel} />
				<meta property="og:description" content={descriptionContent} />
				<meta property="og:url" content={canonicalUrl} />
				<meta property="og:type" content="website" />
				<meta property="og:image" content={ogImage} />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content={titleLabel} />
				<meta name="twitter:description" content={descriptionContent} />
				<meta name="twitter:image" content={ogImage} />
				<link rel="canonical" href={canonicalUrl} />
			</Head>

			<Swiper style={{ height: "70vh" }} data={carousel} />

			<Hero
				className="hero-content mt-4 mb-2"
				colSize={12}
				content={description}
				title={`${t(parent)} ${t(slug)}`}
				breadcrumbs={[{ label: t(parent), href: `/routine/${parent}` }, { label: t(slug) }]}
				centerBreadcrumbs={true}
			/>

			<Container>
				<Row>
					<Col xs="12" className="products-grid sidebar-none">
						<ShopHeader
							nbProducts={nbProducts}
							sortOptionSelected={sortOptionSelected}
							setSortOptionSelected={handleSortChange}
						/>

						{!products.length ? (
							<div className="d-flex justify-content-center align-items-center py-7 my-6">
								<Spinner color="dark" role="status" />
							</div>
						) : (
							<>
								<Row>
									{products.map((product) => (
										<Col key={product.id} xs="6" sm="4" md="4" lg="3" xl="3">
											<Product data={product} />
										</Col>
									))}
								</Row>

								<ShopPagination
									page={page}
									totalItems={nbProducts}
									totalPages={totalPages}
									handleChangePage={handleChangePage}
								/>
							</>
						)}
					</Col>
				</Row>
			</Container>
		</>
	);
};

export default RoutinePage;
