'use client';

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { useCart, CartCheckoutButton } from "@shopify/hydrogen-react";
import CartOverviewItem from "./CartOverviewItem";
import { useTranslation } from "next-i18next";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import { useCartDropdown } from "@contexts/CartDropdownContext";

const CartDropdown = ({ textColorClassName }) => {
	const { t } = useTranslation('common');
	const { isCartOpen, toggleCart } = useCartDropdown();
	const { lines, totalQuantity, cost } = useCart();
	const dropdownRef = useRef(null);

	const formattedTotalPrice = parseFloat(cost?.totalAmount?.amount ?? 0).toFixed(2);

	const handleToggleCart = () => toggleCart(!isCartOpen);

	// Close dropdown on outside click
	useEffect(() => {
		if (!isCartOpen) return;
		const handleClick = (e) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(e.target) &&
				!(e.target.closest('a,button'))
			) {
				toggleCart(false);
			}
		};
		document.addEventListener("mousedown", handleClick);
		return () => document.removeEventListener("mousedown", handleClick);
	}, [isCartOpen, toggleCart]);

	return (
		<div className="relative" ref={dropdownRef}>
			<button
				type="button"
				aria-haspopup="menu"
				aria-expanded={isCartOpen}
				aria-label={t('open_cart')}
				className={`relative flex items-center justify-center transition ${textColorClassName}`}
				onClick={handleToggleCart}
			>
				<span className="relative">
					<ShoppingBagIcon className="w-6 h-6" />
					<span className="absolute -top-4 -right-3 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white shadow">
						{totalQuantity ?? 0}
					</span>
				</span>
			</button>

			{isCartOpen && (
				<div
					role="menu"
					aria-label={t('cart')}
					tabIndex={-1}
					className="absolute right-0 mt-3 w-80 max-w-xs bg-white shadow-2xl border border-gray-200 z-50 animate-fade-in"
				>
					<div className="p-4">
						{!lines?.length ? (
							<div className="flex justify-center items-center py-8">
								<p className="text-sm text-gray-400">{t('empty_cart')}</p>
							</div>
						) : (
							<>
								<div className="max-h-64 overflow-y-auto divide-y divide-gray-100 mb-4">
									{lines.map((line, index) => (
										<CartOverviewItem
											item={line}
											key={index}
											hideCart={handleToggleCart}
										/>
									))}
								</div>

								<div className="flex items-center justify-between py-2 border-t border-gray-100 mb-4">
									<span className="uppercase text-sm text-gray-500">{t('total')}</span>
									<strong className="text-sm text-primary">{`${formattedTotalPrice ?? 0} €`}</strong>
								</div>

								<div className="flex gap-2">
									<Link
										href="/cart"
										className="flex-1 inline-flex items-center justify-center rounded-lg border border-gray-300 bg-gray-50 text-gray-800 hover:bg-gray-100 transition p-2 text-sm"
										onClick={handleToggleCart}
									>
										{t('view_cart')}
										<span className="ml-2" aria-hidden="true">→</span>
									</Link>
									<CartCheckoutButton
										className="flex-1 inline-flex items-center justify-center rounded-lg border border-primary bg-primary text-white hover:bg-primary-700 transition p-2 text-sm"
										as="button"
									>
										{t('finalized_order')}
									</CartCheckoutButton>
								</div>
							</>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default CartDropdown;