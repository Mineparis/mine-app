import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { ProductProvider } from '@shopify/hydrogen-react';

import ProductDetail from '@components/ProductDetail';
import SimilarProducts from '@components/ProductPage/SimilarProducts';
import ProductHero from '@components/ProductPage/ProductHero';
import ProductTabs from '@components/ProductPage/ProductTabs';

const ProductPage = ({ product, averageRating, similarProducts }) => {
	const { t } = useTranslation();
	const {
		name,
		brand,
		descriptionHtml,
		instructions,
		composition,
		categories,
	} = product;

	const productCategory = categories?.[0];
	const seoTitle = `${name} ${brand} - ${t(productCategory)} | Mine Paris`;
	const seoDescription = t('seo_product_description', {
		productName: name,
		brand: brand,
		category: t(productCategory)
	});
	const canonicalUrl = `https://mineparis.com/product/${product.productSlug}`;
	const ogImage = product.images?.[0]?.url || '/img/slider/mine-carousel.webp';

	const structuredData = {
		"@context": "https://schema.org",
		"@type": "Product",
		"name": name,
		"brand": {
			"@type": "Brand",
			"name": brand
		},
		"description": descriptionHtml || t('default_product_description'),
		"image": product.images?.map(img => img.url) || [],
		"url": canonicalUrl,
		"offers": {
			"@type": "Offer",
			"availability": product.availableForSale ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
			"price": product.price?.amount || "0",
			"priceCurrency": product.price?.currencyCode || "EUR",
			"url": canonicalUrl
		},
		"aggregateRating": averageRating ? {
			"@type": "AggregateRating",
			"ratingValue": averageRating,
			"reviewCount": product.comments?.length || 0
		} : undefined
	};

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
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
				/>
			</Head>

			<ProductProvider data={product}>
				{/* Skip to main content link for screen readers */}
				<a
					href="#main-content"
					className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-black focus:text-white focus:rounded"
				>
					{t('skip_to_main_content')}
				</a>

				{/* Hero Section with Product Main Info */}
				<ProductHero product={product} />

				{/* Product Details and Tabs Section */}
				<main id="main-content">
					<section className="bg-white py-4" aria-labelledby="product-details-heading">
						{/* Hidden heading for screen readers */}
						<h2 id="product-details-heading" className="sr-only">
							{t('product_details_and_information')}
						</h2>
						<div className="max-w-5xl mx-auto px-4">
							<div className="flex flex-col items-center">
								<div className="w-full">
									<ProductTabs
										descriptionHtml={descriptionHtml}
										instructions={instructions}
										composition={composition}
									/>
									{/* Product Reviews */}
									<ProductDetail
										averageRating={averageRating}
										comments={product.comments}
									/>
								</div>
							</div>
						</div>
					</section>
				</main>

				{similarProducts?.length > 0 && (
					<SimilarProducts
						products={similarProducts}
					/>
				)}
			</ProductProvider>
		</>
	);
};

export default ProductPage;
