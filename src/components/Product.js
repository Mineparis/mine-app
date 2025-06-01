import React from "react";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import Image from "next/image";

import { getCommentsAverageRating } from '../utils/comments';
import Stars from "./Stars";

const GOLDEN_RATIO = 1.618;
const IMAGE_SIZE = 300;

const Product = ({ data, loading = 'lazy', withNewFlag = false }) => {
	const { t } = useTranslation('common');

	const {
		productSlug,
		brandSlug,
		isNewProduct,
		isVegan,
		isCrueltyFree,
		comments,
		shopifyProduct,
	} = data;

	if (!shopifyProduct) return null;

	const {
		name,
		brand,
		price,
		availableForSale,
		images,
	} = shopifyProduct;

	const link = `/product/${brandSlug}/${productSlug}`;
	const { src: imageSrc, alt: imageAlt } = images[0];
	const averageRating = getCommentsAverageRating(comments);
	const title = `${brand} - ${name}`;

	return (
		<div className="product">
			<div className="product-image">
				{isNewProduct && withNewFlag && <div className="badge bg-light">{t('new')}</div>}
				{!availableForSale && <span className="badge bg-danger text-white">{t('sold_out')}</span>}
				{availableForSale && (
					<div className="badges-engagement">
						{isVegan && <span className="badge badge-light">Vegan</span>}
						{isCrueltyFree && <span className="badge badge-light">Cruelty free</span>}
					</div>
				)}

				<Image
					className="img-fluid"
					src={imageSrc}
					alt={imageAlt || title}
					width={IMAGE_SIZE}
					height={IMAGE_SIZE * GOLDEN_RATIO}
					loading={loading}
					sizes="(max-width: 576px) 100vw, 530px"
				/>

				<div className="product-hover-overlay">
					<Link href={link} className="product-hover-overlay-link">

					</Link>
					<div className="product-hover-overlay-buttons d-flex">
						<Link href={link} className="btn btn-dark btn-buy">
							<i className="fa-search fa" />
						</Link>
					</div>
				</div>
			</div>
			<div className="py-2">
				<p className="mb-1">
					<Link href={link} className="text-decoration-none">
						{title}
					</Link>
				</p>
				<span className="font-weight-bold mr-1">{price} €</span>
			</div>
			{averageRating ? (
				<div className="d-flex mb-4">
					<Stars
						stars={averageRating}
						secondColor="gray-300"
						starClass="mr-1"
						className="mr-2"
					/>
					<p>({comments?.length ?? 0})</p>
				</div>
			) : null}
		</div>
	);
};

export default Product;
