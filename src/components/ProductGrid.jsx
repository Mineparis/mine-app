import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import toast from 'react-hot-toast';
import { useCart } from '@shopify/hydrogen-react';
import { useCartDropdown } from '@contexts/CartDropdownContext';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { createShopifyGid } from "@utils/shopifyIds";
import Image from 'next/image';

const StyledAddToCartButton = ({ disabled, ...props }) => {
	const { t } = useTranslation('common');
	return (
		<button
			{...props}
			className="w-full px-3 py-2.5 bg-neutral-900 text-white font-medium text-xs uppercase tracking-wider hover:bg-neutral-800 transition-all duration-300 opacity-0 group-hover:opacity-100 group-focus:opacity-100 focus:opacity-100 disabled:bg-neutral-300 disabled:cursor-not-allowed disabled:opacity-60 transform translate-y-2 group-hover:translate-y-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-900"
			style={{ borderRadius: 0 }}
			tabIndex={0}
			aria-label={disabled ? t('product_unavailable') : t('add_to_cart')}
			disabled={disabled}
		/>
	);
};

const ProductGrid = ({ products = [] }) => {
	const { t } = useTranslation('common');
	const { toggleCart } = useCartDropdown();
	const { linesAdd } = useCart();

	if (products.length === 0) {
		return (
			<div className="col-span-full flex flex-col items-center justify-center py-16 px-4" role="status" aria-live="polite">
				<div className="w-16 h-16 mx-auto mb-6 bg-neutral-50 rounded-full flex items-center justify-center">
					<MagnifyingGlassIcon className="w-7 h-7 text-neutral-300" aria-hidden="true" />
				</div>
				<h3 className="text-xl font-light text-neutral-700 mb-3 text-center">
					{t('no_products_found')}
				</h3>
				<p className="text-sm text-neutral-500 text-center max-w-md leading-relaxed">
					{t('no_products_found_description')}
				</p>
			</div>
		);
	}

	return (
		<>
			{products.map(({ name, brand, id, handle, variantId, availableForSale, images, price }) => {
				const productUrl = `/products/${handle}`;

				const isAvailable = availableForSale || false;
				
				const formattedVariantId = variantId ? createShopifyGid(variantId) : null;
				const formattedPrice = parseFloat(price).toFixed(2);

				const handleAddToCart = async (e) => {
					e.preventDefault();
					e.stopPropagation();
					
					if (!formattedVariantId || !isAvailable) {
						toast.error(t('product_unavailable'));
						return;
					}
					
					try {
						await linesAdd([{
							merchandiseId: formattedVariantId,
							quantity: 1,
						}]);
						toast.success(t('product_added_to_cart'));
						toggleCart(true);
					} catch (error) {
						const errorMsg = t('error_adding_to_cart')
						console.error(errorMsg, error);
						toast.error(errorMsg);
					}
				};

				return (
					<article
						key={`${id}-${handle}`}
						className="group cursor-pointer transition-all duration-300 hover:scale-[1.02] focus-within:scale-[1.02]"
						role="gridcell"
					>
						<Link
							href={productUrl}
							className="block rounded-sm"
							style={{ textDecoration: 'none' }}
							aria-label={t('view_product_details', { productName: name, brand: brand })}
						>
							{/* Image Container */}
							<div className="relative w-full overflow-hidden mb-3" style={{ aspectRatio: '4/5' }}>
								{images?.[0]?.src ? (
									<Image
										src={images[0].src}
										alt={images[0].altText || t('product_image', { productName: name })}
										fill
										sizes="(max-width: 768px) 100vw, 25vw"
										className="object-contain w-full h-full group-hover:scale-110 transition-transform duration-700 ease-out"
										onError={(e) => {
											e.target.style.display = 'none';
											e.target.nextSibling.style.display = 'flex';
										}}
										priority={!!id && id === products[0]?.id}
										draggable={false}
									/>
								) : null}
								<div 
									className="w-full h-full flex items-center justify-center text-neutral-200 text-3xl font-light bg-gray-50"
									style={{ display: images?.[0]?.src ? 'none' : 'flex' }}
									aria-label="No image available"
								>
									{t('no_image_available', 'Image non disponible')}
								</div>
								<div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity duration-300" aria-hidden="true" />
								<div className="absolute bottom-3 left-3 right-3">
									{formattedVariantId && isAvailable ? (
										<StyledAddToCartButton 
											onClick={handleAddToCart}
											aria-label={t('add_product_to_cart', { productName: name })}
										>
											{t('add_to_cart')}
										</StyledAddToCartButton>
									) : (
										<StyledAddToCartButton 
											disabled
											aria-label={t('product_sold_out', { productName: name })}
										>
											{t('sold_out')}
										</StyledAddToCartButton>
									)}
								</div>
							</div>
							
							{/* Product Info */}
							<div className="pt-3 border-t-2 border-neutral-20">
								{brand && (
									<div className="text-xs font-medium tracking-widest text-neutral-400 mb-1 uppercase">
										{brand}
									</div>
								)}
								<h3 className="text-xs font-medium mb-2 text-neutral-900 line-clamp-2 leading-relaxed">
									{name}
								</h3>
								<div className="flex items-center justify-between">
									<span className="text-xs text-neutral-900" aria-label={t('price_label', { price: formattedPrice })}>
										{formattedPrice} €
									</span>
								</div>
							</div>
						</Link>
					</article>
				);
			})}
		</>
	);
};

export default ProductGrid;
