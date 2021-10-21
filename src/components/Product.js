import React, { useState } from "react";
import Link from "next/link";
import { useTranslation } from "next-i18next";

import Image from "./CustomImage";
import { getStrapiMedia } from '../lib/media';
import { getCurrentPrice } from '../utils/price';

const GOLDEN_RATIO = 1.618;
const IMAGE_SIZE = 300;

const Product = ({ data, loading, withNewFlag = false }) => {
	const { t } = useTranslation('common');

	const { name, brand, originalPrice, salePricePercent, productSlug, brandSlug, thumbnail, stock, isNewProduct } = data;

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
						<div className="product-hover-overlay-buttons">
							<Link href={link}>
								<a className="btn btn-dark btn-buy">
									<i className="fa-search fa" />
								</a>
							</Link>
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
			</div>
		</>
	);
};

export default Product;
