import React from "react";
import Link from "next/link";
import { Dropdown, DropdownToggle, DropdownMenu, Button } from "reactstrap";
import { useCart, CartCheckoutButton } from "@shopify/hydrogen-react";
import CartOverviewItem from "./CartOverviewItem";
import { useTranslation } from "next-i18next";
import { BsCart } from "react-icons/bs";

import { useCartDropdown } from '@contexts/CartDropdownContext';

const BtnDarkOutline = (props) => <Button {...props} outline />;

export default function CartDropdown({ textColorClassName }) {
	const { t } = useTranslation('common');
	const { isCartOpen, toggleCart } = useCartDropdown();
	const { lines, totalQuantity, cost } = useCart();

	const handleToggleCart = () => toggleCart(!isCartOpen);

	return (
		<Dropdown
			inNavbar
			key="cart_dropdown"
			isOpen={isCartOpen}
			toggle={handleToggleCart}
		>
			<DropdownToggle className="p-0" nav>
				<div className={`navbar-icon-link ${textColorClassName}`} onClick={() => toggleCart(!isCartOpen)}>
					<BsCart />
					<div className="navbar-icon-link-badge">
						{totalQuantity ?? 0}
					</div>
				</div>
			</DropdownToggle>

			<DropdownMenu className="p-4">
				{!lines?.length
					? (
						<div className="d-flex justify-content-center">
							<p className="text-muted">{t('empty_cart')}</p>
						</div>
					)
					: (
						<>
							<div className="navbar-cart-product-wrapper">
								{lines.map((line, index) => (
									<CartOverviewItem
										item={line}
										key={index}
										hideCart={handleToggleCart}
									/>
								))}
							</div>

							<div className="navbar-cart-total">
								<span className="text-uppercase text-muted">Total</span>
								<strong className="text-uppercase">{`${cost.totalAmount.amount ?? 0} €`}</strong>
							</div>

							<div className="d-flex justify-content-between">
								<Link href="/cart" className="btn btn-link text-dark mr-3" onClick={handleToggleCart}>
									<p>{t('view_cart')} <i className="fa-arrow-right fa" /></p>
								</Link>
								<CartCheckoutButton
									className="btn btn-outline-dark"
									as={BtnDarkOutline}
								>
									{t('finalized_order')}
								</CartCheckoutButton>
							</div>
						</>
					)}
			</DropdownMenu>
		</Dropdown>
	);
}
