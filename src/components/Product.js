import React from "react";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import Image from "next/image";

import { getCommentsAverageRating } from '../utils/comments';
import Stars from "./Stars";

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
		handle,
	} = shopifyProduct;


	const link = `/products/${handle || productSlug}`;
	const { src: imageSrc, alt: imageAlt } = images[0];
	const averageRating = getCommentsAverageRating(comments);
	const title = `${brand} - ${name}`;

	return (
		<div className="group">
			{/* Product Image Container */}
			<div className="relative bg-neutral-50 aspect-square overflow-hidden mb-4 rounded-sm">
				{/* Product Image */}
				<Image
					src={imageSrc}
					alt={imageAlt || title}
					width={IMAGE_SIZE}
					height={IMAGE_SIZE}
					loading={loading}
					sizes="(max-width: 576px) 100vw, 300px"
					className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
				/>

				{/* Badges */}
				<div className="absolute top-3 left-3 flex flex-col gap-1">
					{isNewProduct && withNewFlag && (
						<span className="bg-white text-neutral-900 text-xs font-medium px-2 py-1 rounded-full shadow-sm">
							{t('new')}
						</span>
					)}
					{!availableForSale && (
						<span className="bg-red-600 text-white text-xs font-medium px-2 py-1 rounded-full shadow-sm">
							{t('sold_out')}
						</span>
					)}
				</div>

				{/* Engagement Badges */}
				{availableForSale && (isVegan || isCrueltyFree) && (
					<div className="absolute top-3 right-3 flex flex-col gap-1">
						{isVegan && (
							<span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
								Vegan
							</span>
						)}
						{isCrueltyFree && (
							<span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
								Cruelty free
							</span>
						)}
					</div>
				)}

				{/* Hover Overlay */}
				<div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
					<Link
						href={link}
						className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white text-neutral-900 px-4 py-2 rounded-full font-medium text-sm hover:bg-neutral-100"
					>
						{t('view_product', 'Voir le produit')}
					</Link>
				</div>
			</div>

			{/* Product Information */}
			<div className="space-y-2">
				{/* Brand */}
				<div className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
					{brand}
				</div>

				{/* Product Name */}
				<h3 className="text-sm font-medium text-neutral-900 line-clamp-2 leading-tight">
					<Link href={link} className="hover:text-neutral-600 transition-colors">
						{name}
					</Link>
				</h3>

				{/* Rating */}
				{averageRating ? (
					<div className="flex items-center gap-2">
						<Stars
							stars={averageRating}
							secondColor="gray-300"
							starClass="text-amber-400"
							className="flex"
						/>
						<span className="text-xs text-neutral-500">
							({comments?.length ?? 0})
						</span>
					</div>
				) : null}

				{/* Price */}
				<div className="text-sm font-medium text-neutral-900">
					{price} €
				</div>
			</div>
		</div>
	);
};

export default Product;
