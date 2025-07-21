import { useCart } from "@shopify/hydrogen-react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { XMarkIcon } from "@heroicons/react/24/outline";

const CartOverviewItem = ({ item, hideCart }) => {
	const { merchandise, quantity, cost } = item;
	const { t } = useTranslation('common');
	const { lines, linesRemove } = useCart();

	const handleRemoveFromCart = () => {
		if (lines.length === 1) hideCart();
		linesRemove([item.id]);
	};

	const productUrl = `/products/${merchandise.product.handle}`;

	return (
		<div className="py-3 px-2">
			<div className="flex items-center gap-3">
				<div className="relative w-16 h-16 flex-shrink-0 overflow-hidden bg-gray-100 rounded-lg">
					<Image
						src={merchandise.image.url}
						alt={merchandise.product.title}
						fill
						sizes="64px"
						className="object-contain"
						priority
					/>
				</div>
				<div className="flex-1 min-w-0">
					<div className="flex items-start justify-between">
						<Link
							href={productUrl}
							className="font-bold text-gray-900 hover:text-primary transition underline underline-offset-2"
							onClick={hideCart}
						>
							{merchandise.product.title}
						</Link>
						<button
							type="button"
							onClick={handleRemoveFromCart}
							className="ml-2 p-1 rounded-full hover:bg-gray-100"
							aria-label={t('remove_from_cart')}
						>
							<XMarkIcon className="w-5 h-5 text-gray-500 hover:text-primary" aria-hidden="true" />
						</button>
					</div>
					<div className="mt-1 text-xs text-gray-500">
						{t('quantity')}: <span className="font-medium text-gray-700">{quantity}</span>
					</div>
					<div className="mt-1 font-semibold text-sm text-primary">
						{cost.totalAmount.amount} €
					</div>
				</div>
			</div>
		</div>
	);
};

export default CartOverviewItem;
