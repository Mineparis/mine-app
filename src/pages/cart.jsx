import React, { useState } from "react";
import { CartCheckoutButton, useCart } from "@shopify/hydrogen-react";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from "next-i18next";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { 
	MinusIcon, 
	PlusIcon, 
	TrashIcon, 
	ShoppingBagIcon,
	ChevronRightIcon 
} from "@heroicons/react/24/outline";

export const getStaticProps = async ({ locale }) => {
	const lang = locale || 'fr';
	return {
		props: {
			...(await serverSideTranslations(lang, 'common')),
		},
	};
};

const ShoppingCart = () => {
	const { t } = useTranslation('common');
	const { lines, cost, linesUpdate, linesRemove } = useCart();
	const [loadingLineId, setLoadingLineId] = useState(null);
	const [announcement, setAnnouncement] = useState('');
	
	const handleQuantityChange = async (lineId, newQuantity) => {
		if (newQuantity < 1) return;
		setLoadingLineId(lineId);
		try {
			await linesUpdate([{ id: lineId, quantity: newQuantity }]);
			setAnnouncement(t('quantity_updated'));
		} catch (err) {
			toast.error(t('error_default_message'));
			setAnnouncement(t('error_default_message'));
		} finally {
			setLoadingLineId(null);
		}
	};

	const handleRemove = async (lineId) => {
		setLoadingLineId(lineId);
		try {
			await linesRemove([lineId]);
			toast.success(t('item_removed'));
			setAnnouncement(t('item_removed'));
		} catch (err) {
			toast.error(t('error_default_message'));
			setAnnouncement(t('error_default_message'));
		} finally {
			setLoadingLineId(null);
		}
	};

	const CustomCheckoutButton = ({ children, ...props }) => (
		<button
			{...props}
			className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-semibold py-3 px-5 transition-colors duration-200 disabled:bg-neutral-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2 outline-none"
		>
			{children}
		</button>
	);

	return (
		<div className="min-h-screen bg-neutral-50">
			{/* Skip to main content */}
			<a
				href="#main-content"
				className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:bg-primary-700 focus:text-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium outline-none"
			>
				{t('skip_to_main_content')}
			</a>
			
			{/* Live region for announcements */}
			<div
				role="status"
				aria-live="polite"
				aria-atomic="true"
				className="sr-only"
			>
				{announcement}
			</div>
			
			<main id="main-content" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<header className="text-center mb-8">
					<h1 className="text-xl font-light text-neutral-900 tracking-wide">
						{t('cart')}
					</h1>
					<div className="w-12 h-px bg-neutral-300 mx-auto mt-3" role="presentation"></div>
				</header>

				{lines.length === 0 ? (
					<div className="text-center py-12">
						<div className="w-20 h-20 mx-auto mb-4 bg-neutral-100 rounded-full flex items-center justify-center" role="presentation">
							<ShoppingBagIcon className="w-6 h-6 text-neutral-400" />
						</div>
						<h2 className="text-lg font-light text-neutral-600 mb-2">{t('empty_cart')}</h2>
						<p className="text-neutral-500 mb-6">{t('empty_cart_description')}</p>
						<Link 
							href="/"
							className="inline-flex items-center px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-sm transition-colors duration-200 outline-none rounded"
						>
							{t('continue_shopping')}
						</Link>
					</div>
				) : (
					<div className="lg:grid lg:grid-cols-12 lg:gap-8">
						{/* Cart Items */}
						<section className="lg:col-span-8" aria-labelledby="cart-items-heading">
							<h2 id="cart-items-heading" className="sr-only">{t('cart_items')}</h2>
							<div className="space-y-3">
								<AnimatePresence>
									{lines.map((line) => {
										const product = line.merchandise?.product;
										const merchandise = line.merchandise;
										const productUrl = `/products/${product.handle}`;
										const isLoading = loadingLineId === line.id;
										
										return (
											<motion.div
												key={line.id}
												exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.3 } }}
												initial={{ opacity: 0, y: 20 }}
												animate={{ opacity: 1, y: 0 }}
												className="bg-white shadow-sm overflow-hidden group transition-shadow duration-200"
											>
												<div className="p-4">
													<div className="flex items-start space-x-3">
														{/* Product Image */}
														<Link href={productUrl} className="flex-shrink-0 block outline-none rounded">
															<div className="w-16 h-16 relative bg-neutral-50 overflow-hidden group-hover:scale-105 transition-transform duration-300">
																<Image
																	src={line.merchandise.image?.url || '/img/placeholder.jpg'}
																	alt={line.merchandise.product.title}
																	fill
																	className="object-cover"
																/>
															</div>
														</Link>

														{/* Product Info */}
														<div className="flex-1 min-w-0">
															<Link href={productUrl} className="block group outline-none rounded">
																<h3 className="text-base font-medium text-neutral-900 group-hover:text-neutral-700 transition-colors line-clamp-2">
																	{line.merchandise.product.title}
																</h3>
															</Link>

															{/* Quantity Controls */}
															<div className="flex items-center space-x-2 mt-3">
																<div className="flex items-center border border-neutral-300 rounded" role="group" aria-label={t('quantity_controls')}>
																	<button
																		onClick={() => handleQuantityChange(line.id, line.quantity - 1)}
																		disabled={isLoading || line.quantity <= 1}
																		className="p-1.5 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors outline-none"
																		aria-label={t('decrease_quantity')}
																	>
																		<MinusIcon className="w-3 h-3" />
																	</button>
																	<span 
																		className="px-3 py-1.5 text-sm font-medium bg-neutral-50 border-x border-neutral-300 min-w-[50px] text-center"
																		role="status"
																		aria-label={t('quantity_value', { quantity: line.quantity })}
																	>
																		{line.quantity}
																	</span>
																	<button
																		onClick={() => handleQuantityChange(line.id, line.quantity + 1)}
																		disabled={isLoading}
																		className="p-1.5 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors outline-none"
																		aria-label={t('increase_quantity')}
																	>
																		<PlusIcon className="w-3 h-3" />
																	</button>
																</div>

																<button
																	onClick={() => handleRemove(line.id)}
																	disabled={isLoading}
																	className="p-1.5 text-neutral-400 hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors outline-none rounded"
																	aria-label={t('remove_item_from_cart', { item: line.merchandise.product.title })}
																>
																	{isLoading ? (
																		<div className="w-3 h-3 border-2 border-neutral-300 border-t-neutral-600 rounded-full animate-spin" role="status" aria-label={t('loading')} />
																	) : (
																		<TrashIcon className="w-3 h-3" />
																	)}
																</button>
															</div>
														</div>

														{/* Price */}
														<div className="text-right">
															<div className="text-base font-medium text-neutral-900" aria-label={t('line_total', { total: (line.quantity * parseFloat(line.merchandise.price.amount)).toFixed(2) })}>
																{(line.quantity * parseFloat(line.merchandise.price.amount)).toFixed(2)} €
															</div>
															<div className="text-xs text-neutral-500">
																{parseFloat(line.merchandise.price.amount).toFixed(2)} € {t('unit_price')}
															</div>
														</div>
													</div>
												</div>
											</motion.div>
										);
									})}
								</AnimatePresence>
							</div>
						</section>

						{/* Order Summary */}
						<aside className="lg:col-span-4 mt-8 lg:mt-0" aria-labelledby="order-summary-heading">
							<div className="bg-white shadow-sm sticky top-0 rounded-lg overflow-hidden">
								<div className="p-5">
									<h2 id="order-summary-heading" className="text-base font-medium text-neutral-900 mb-5">
										{t('order_summary')}
									</h2>

									<div className="space-y-3">
										<div className="flex justify-between text-sm">
											<span className="text-neutral-600">
												{t('subtotal')} ({lines.length} {lines.length > 1 ? t('articles') : t('article')})
											</span>
											<span className="font-medium" aria-label={t('subtotal_amount', { amount: parseFloat(cost?.subtotalAmount?.amount ?? 0).toFixed(2) })}>
												{parseFloat(cost?.subtotalAmount?.amount ?? 0).toFixed(2)} €
											</span>
										</div>

										<div className="border-t border-neutral-200 pt-3">
											<div className="flex justify-between">
												<span className="text-base font-medium text-neutral-900">{t('total')}</span>
												<span className="text-lg font-medium text-neutral-900" aria-label={t('total_amount', { amount: parseFloat(cost?.totalAmount?.amount ?? 0).toFixed(2) })}>
													{parseFloat(cost?.totalAmount?.amount ?? 0).toFixed(2)} €
												</span>
											</div>
										</div>
									</div>

									<div className="mt-6">
										<CartCheckoutButton as={CustomCheckoutButton}>
											<span>{t('finalized_order')}</span>
											<ChevronRightIcon className="w-4 h-4" />
										</CartCheckoutButton>
									</div>

									<div className="mt-3">
										<Link 
											href="/"
											className="block w-full text-center py-2.5 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors outline-none rounded"
										>
											← {t('continue_shopping')}
										</Link>
									</div>
								</div>
							</div>
						</aside>
					</div>
				)}
			</main>
		</div>
	);
};

export default ShoppingCart;
