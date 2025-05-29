import { useState } from 'react';
import { Row, Col, Button, Input } from 'reactstrap';
import { useTranslation } from "next-i18next";
import { AddToCartButton } from '@shopify/hydrogen-react';
import { useCartDropdown } from '@contexts/CartDropdownContext';

const PrimaryBtn = (props) => (
	<Button {...props} color="primary" />
);

const AddToCart = ({ shopifyVariantId, availableForSale }) => {
	const { t } = useTranslation('common');
	const { toggleCart } = useCartDropdown();
	const [quantity, setQuantity] = useState(1);

	const handleChangeQuantity = (number) => setQuantity(number);

	const handleAddToCart = () => toggleCart(true);

	return (
		<Row className="d-flex list-inline mb-5 align-items-center col-12">
			{!availableForSale ? (
				<Button className="w-10 mb-1" disabled>
					{t('sold_out')}
				</Button>
			) : (
				<>
					<Col className="detail-option col-3">
						<Input
							className="form-control detail-quantity data-item-quantity"
							name="items"
							type="number"
							defaultValue={1}
							min={1}
							onChange={handleChangeQuantity}
						/>
					</Col>
					<Col className="detail-option">
						<AddToCartButton
							variantId={`gid://shopify/ProductVariant/${shopifyVariantId}`}
							quantity={quantity}
							onClick={handleAddToCart}
							accessibleAddingToCartLabel={t('add_to_cart')}
							as={PrimaryBtn}
						>
							{t('add_to_cart')}
						</AddToCartButton>
					</Col>
				</>
			)}
		</Row>
	);
};

export default AddToCart;