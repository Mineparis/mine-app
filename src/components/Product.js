import React from "react";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { Button } from 'reactstrap';

import { getStrapiMedia } from '../lib/media';
import { getCurrentPrice } from '../utils/price';
import Image from "./CustomImage";
import Stars from "./Stars";

const GOLDEN_RATIO = 1.618;
const IMAGE_SIZE = 300;

const Product = ({ data, loading, withNewFlag = false }) => {
	const { t } = useTranslation('common');

	const {
		id,
		name,
		brand,
		originalPrice,
		productSlug,
		brandSlug,
		salePricePercent,
		descriptions,
		thumbnail,
		stock,
		isNewProduct,
		shippingInfo,
		isVegan,
		isCrueltyFree,
		averageRating,
		currencies,
	} = data;
	const { weight = 0, width = 0, len = 0, height = 0 } = shippingInfo || {};

	const link = `/product/${brandSlug}/${productSlug}`;
	const soldOut = stock < 1;
	const imageURL = getStrapiMedia(thumbnail?.formats.small);
	const currentPrice = getCurrentPrice(originalPrice, salePricePercent);

	return (
		<>
			<div className="product">
				<div className="product-image">
					{isNewProduct && withNewFlag && <div className="ribbon ribbon-info">{t('new')}</div>}
					{soldOut && <div className="ribbon ribbon-danger">{t('sold_out')}</div>}
					{!soldOut && (
						<div className="badges-engagement">
							{isVegan && <span class="badge badge-light">Vegan</span>}
							{isCrueltyFree && <span class="badge badge-light">Cruelty free</span>}
						</div>
					)}

					<Image
						className="img-fluid"
						src={imageURL}
						alt={thumbnail?.alternativeText}
						width={IMAGE_SIZE}
						height={IMAGE_SIZE * GOLDEN_RATIO}
						loading={loading}
						sizes="(max-width: 576px) 100vw, 530px"
					/>

					<div className="product-hover-overlay">
						<Link href={link}>
							<a className="product-hover-overlay-link" />
						</Link>
						<div className="product-hover-overlay-buttons d-flex">
							<Link href={link}>
								<a className="btn btn-dark btn-buy">
									<i className="fa-search fa" />
								</a>
							</Link>
							{!soldOut && (
								<Button
									className="btn btn-dark btn-buy snipcart-add-item"
									data-item-id={id}
									data-item-price={currentPrice}
									data-item-url={link}
									data-item-description={descriptions.short}
									data-item-image={imageURL}
									data-item-name={name}
									data-item-categories=""
									data-item-weight={weight} // poid en gramme (pas de decimale)
									data-item-length={len} // longueur en cm (pas de decimale)
									data-item-width={width} // largeur en cm (pas de decimale)
									data-item-height={height}
								>
									<i className="bi bi-cart" />
								</Button>
							)}
						</div>
					</div>
				</div>
				<div className="py-2">
					<p className="mb-1">
						<Link href={link}>
							<a className="text-decoration-none">{`${brand} - ${name}`}</a>
						</Link>
					</p>
					<>
						<span className="font-weight-bold mr-1">{currentPrice.toFixed(2)} €</span>
						{salePricePercent > 0 && <span className="text-muted font-weight-light"><del>{originalPrice.toFixed(2)} €</del></span>}
					</>
				</div>
				<div className="mb-4">
					<Stars
						stars={averageRating}
						secondColor="gray-300"
						starClass="mr-1"
						className="mr-2"
					/>
				</div>
			</div>
		</>
	);
};

export default Product;
