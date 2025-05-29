import Head from 'next/head';
import { Container, Row, Col } from 'reactstrap';
import { useTranslation } from 'next-i18next';
import { ProductProvider } from '@shopify/hydrogen-react';

import ProductDetail from '@components/ProductDetail';
import DetailSimilar from '@components/DetailSimilar';
import Accordeon from '@components/Accordeon';
import Reviews from '@components/Reviews';
import SwiperGallery from '@components/SwiperGallery';

const ProductPage = ({ product, shopifyProduct, averageRating, similarProducts }) => {
	const { t } = useTranslation();

	const {
		name,
		brand,
		descriptionHtml,
		instructions,
		composition,
		images,
	} = shopifyProduct;

	const seoTitle = `${name} de ${brand} - Mine Paris`;
	const seoDescription = `Découvrez ${name} de ${brand}. Commandez dès maintenant sur Mine Paris.`;
	const canonicalUrl = `https://mineparis.com/product/${product.brandSlug}/${product.productSlug}`;
	const ogImage = product.images?.[0]?.url || '/img/slider/mine-carousel.jpg';

	const tabOptions = [
		{ title: 'Description', text: descriptionHtml },
		{ title: t('using_advice'), text: instructions, isRichText: true },
		{ title: t('composition'), text: composition, isRichText: true },
	];

	return (
		<>
			<Head>
				<title>{seoTitle}</title>
				<meta name="description" content={seoDescription} />
				<link rel="canonical" href={canonicalUrl} />
				<meta property="og:title" content={seoTitle} />
				<meta property="og:description" content={seoDescription} />
				<meta property="og:url" content={canonicalUrl} />
				<meta property="og:type" content="product" />
				<meta property="og:image" content={ogImage} />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content={seoTitle} />
				<meta name="twitter:description" content={seoDescription} />
				<meta name="twitter:image" content={ogImage} />
			</Head>

			<ProductProvider data={shopifyProduct}>
				<section className="product-details">
					<Container fluid>
						<Row className="justify-content-around">
							<Col xs={12} lg={6} className="py-3">
								<SwiperGallery images={images} vertical />
							</Col>
							<Col xs={12} lg={6} xl={5} className="py-4 pl-lg-5">
								<ProductDetail
									shopifyProduct={shopifyProduct}
									averageRating={averageRating}
									comments={product.comments}
								/>
								<Accordeon options={tabOptions} />
							</Col>
						</Row>
					</Container>
				</section>

				{similarProducts?.length > 0 && (
					<section>
						<DetailSimilar products={similarProducts} />
					</section>
				)}

				{product.comments?.length > 0 && (
					<Reviews comments={product.comments} averageRating={averageRating} />
				)}
			</ProductProvider>
		</>
	);
};

export default ProductPage;
