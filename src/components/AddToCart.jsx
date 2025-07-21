import { useState } from 'react';
import { useTranslation } from "next-i18next";
import toast from 'react-hot-toast';
import { AddToCartButton } from '@shopify/hydrogen-react';
import { useCartDropdown } from '@contexts/CartDropdownContext';
import { createShopifyGid } from '@utils/shopifyIds';
import { ShoppingBagIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';

const PrimaryBtn = ({ children, className = '', disabled, ...props }) => (
	<button
		{...props}
		disabled={disabled}
		className={`
			relative w-full bg-gradient-to-r from-neutral-900 to-neutral-800 
			text-white font-semibold py-4 px-8 rounded-xl
			hover:from-neutral-800 hover:to-neutral-700 
			active:from-neutral-700 active:to-neutral-600
			transition-all duration-200 
			disabled:bg-neutral-300 disabled:cursor-not-allowed
			disabled:from-neutral-300 disabled:to-neutral-300
			shadow-lg hover:shadow-xl
			transform hover:-translate-y-0.5
			flex items-center justify-center space-x-3
			group overflow-hidden
			${className}
		`}
	>
		<div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
		<div className="relative flex items-center space-x-3">
			<ShoppingBagIcon className="w-5 h-5" />
			<span>{children}</span>
		</div>
	</button>
);

const QuantitySelector = ({ quantity, onChange, min = 1, max = 99 }) => {
	const { t } = useTranslation('common');
	
	const handleDecrement = () => {
		if (quantity > min) {
			onChange(quantity - 1);
		}
	};
	
	const handleIncrement = () => {
		if (quantity < max) {
			onChange(quantity + 1);
		}
	};
	
	const handleInputChange = (e) => {
		const newQuantity = parseInt(e.target.value) || min;
		onChange(Math.max(min, Math.min(max, newQuantity)));
	};
	
	return (
		<div className="flex items-center space-x-4">
			<label className="text-sm font-semibold text-neutral-700 min-w-[80px]">
				{t('quantity', 'Quantité')}
			</label>
			<div className="flex items-center bg-neutral-50 rounded-lg border border-neutral-200 overflow-hidden">
				<button
					type="button"
					onClick={handleDecrement}
					disabled={quantity <= min}
					className="p-3 hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
					aria-label={t('decrease_quantity', 'Diminuer la quantité')}
				>
					<MinusIcon className="w-4 h-4 text-neutral-600" />
				</button>
				<input
					className="w-16 py-3 px-2 text-center bg-transparent border-none text-neutral-900 font-semibold focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
					type="number"
					value={quantity}
					min={min}
					max={max}
					onChange={handleInputChange}
					aria-label={t('quantity', 'Quantité')}
				/>
				<button
					type="button"
					onClick={handleIncrement}
					disabled={quantity >= max}
					className="p-3 hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
					aria-label={t('increase_quantity', 'Augmenter la quantité')}
				>
					<PlusIcon className="w-4 h-4 text-neutral-600" />
				</button>
			</div>
		</div>
	);
};

const AddToCart = ({ shopifyVariantId, availableForSale }) => {
	const { t } = useTranslation('common');
	const { toggleCart } = useCartDropdown();
	const [quantity, setQuantity] = useState(1);
	const [isLoading, setIsLoading] = useState(false);

	const handleChangeQuantity = (newQuantity) => {
		setQuantity(Math.max(1, newQuantity));
	};

	const handleAddToCart = () => {
		setIsLoading(true);
		setTimeout(() => {
			setIsLoading(false);
			toggleCart(true);
			toast.success(t('product_added_to_cart', 'Produit ajouté au panier'), {
				duration: 3000,
				style: {
					background: '#059669',
					color: 'white',
					fontWeight: '600',
				},
			});
		}, 600);
	};

	return (
		<div className="space-y-6">
			{!availableForSale ? (
				<div className="relative">
					<button
						className="w-full bg-neutral-200 text-neutral-500 font-semibold py-4 px-8 rounded-xl cursor-not-allowed opacity-75"
						disabled
					>
						<div className="flex items-center justify-center space-x-3">
							<ShoppingBagIcon className="w-5 h-5" />
							<span>{t('sold_out', 'Rupture de stock')}</span>
						</div>
					</button>
					<div className="absolute inset-0 bg-neutral-100/50 rounded-xl flex items-center justify-center">
						<span className="text-xs font-medium text-neutral-600 bg-white px-3 py-1 rounded-full border">
							{t('notify_when_available', 'Me prévenir du retour en stock')}
						</span>
					</div>
				</div>
			) : (
				<>
					<QuantitySelector 
						quantity={quantity}
						onChange={handleChangeQuantity}
					/>

					<AddToCartButton
						variantId={createShopifyGid(shopifyVariantId)}
						quantity={quantity}
						onClick={handleAddToCart}
						accessibleAddingToCartLabel={t('add_to_cart', 'Ajouter au panier')}
						as={PrimaryBtn}
						disabled={isLoading}
					>
						{isLoading ? (
							<div className="flex items-center space-x-3">
								<div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
								<span>{t('adding_to_cart', 'Ajout en cours...')}</span>
							</div>
						) : (
							<>
								<ShoppingBagIcon className="w-5 h-5" />
								<span>{t('add_to_cart', 'Ajouter au panier')}</span>
							</>
						)}
					</AddToCartButton>
					
					{/* Informations complémentaires */}
					<div className="text-center space-y-2">
						<p className="text-sm text-neutral-600">
							{t('secure_payment', 'Paiement sécurisé')} • {t('quality_guarantee', 'Qualité garantie')}
						</p>
						<div className="flex items-center justify-center space-x-4 text-xs text-neutral-500">
							<span className="flex items-center space-x-1">
								<div className="w-2 h-2 bg-green-500 rounded-full"></div>
								<span>{t('authentic_products', 'Produits authentiques')}</span>
							</span>
							<span className="flex items-center space-x-1">
								<div className="w-2 h-2 bg-blue-500 rounded-full"></div>
								<span>{t('premium_quality', 'Qualité premium')}</span>
							</span>
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default AddToCart;