import { useCart } from "@shopify/hydrogen-react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "next-i18next";

const CartOverviewItem = ({ item, hideCart }) => {
	const { merchandise, quantity, cost } = item;
	const { t } = useTranslation('common');
	const { lines, linesRemove } = useCart();

	const handleRemoveFromCart = () => {
		if (lines.length === 1) hideCart();
		linesRemove([item.id]);
	};

	return (
		<div className="navbar-cart-product">
			<div className="d-flex align-items-center">
				<div className="position-relative p-5">
					<Image
						className="img-fluid navbar-cart-product-image"
						src={merchandise.image.url}
						alt={merchandise.product.title}
						fill
						sizes="100vw"
						style={{ objectFit: "contain" }}
					/>
				</div>

				<div>
					<div className="close text-sm mr-2" onClick={handleRemoveFromCart}>
						<i className="fa fa-times" />
					</div>
					<div className="pl-3">
						<Link
							href={'/'}
							className="navbar-cart-product-link"
						// onClick={hideCart}
						>
							{merchandise.product.title}
						</Link>
						<small className="d-block text-muted">{t('quantity')}: {quantity}</small>
						<strong className="d-block text-sm">
							{cost.totalAmount.amount} €
						</strong>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CartOverviewItem;
