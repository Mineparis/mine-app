import { Row, Col, Form, Button, Input } from 'reactstrap';
import { useTranslation } from 'next-i18next';

import Stars from './Stars';
import { getCurrentPrice } from '../utils/price';
import { getStrapiMedia } from '../lib/media';
import { useRouter } from 'next/router';

const DetailMain = ({ product, averageRating }) => {
	const { t } = useTranslation('common');
	const { asPath } = useRouter();

	const {
		id,
		name,
		originalPrice,
		salePricePercent,
		comments,
		descriptions,
		thumbnail,
		stock,
		shippingInfo
	} = product;
	const { weight = 0, width = 0, len = 0, height = 0 } = shippingInfo || {};
	const currentPrice = getCurrentPrice(originalPrice, salePricePercent);
	const imageURL = getStrapiMedia(thumbnail?.formats.small);

	return (
		<>
			<h1 className="h4 font-weight-normal mb-4 font-italic">{name}</h1>
			<div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-sm-between mb-4">
				<ul className="list-inline mb-2 mb-sm-0">
					<li className="list-inline-item h4 font-weight-light mb-0">
						{currentPrice.toFixed(2)} €
					</li>

					{salePricePercent > 0 && (
						<li className="list-inline-item text-muted font-weight-light">
							<del>{originalPrice.toFixed(2)} €</del>
						</li>
					)}
				</ul>
				<div className="d-flex align-items-center">
					<Stars
						stars={averageRating}
						secondColor="gray-300"
						starClass="mr-1"
						className="mr-2"
					/>

					<span className="text-muted text-uppercase text-sm mt-1">
						{comments.length} {t('reviews')}
					</span>
				</div>
			</div>
			<p className="mb-4 text-muted">{descriptions.short}</p>

			<Form>
				<Row className="list-inline mb-5 align-items-center">
					<Col lg="3" className="detail-option">
						<Input
							className="form-control detail-quantity data-item-quantity"
							name="items"
							type="number"
							defaultValue={1}
							min={1}
							max={stock}
							onChange={number => number <= 0 ? 1 : number}
						/>
						<div hidden className="data-item-max-quantity">{stock}</div>
					</Col>
					<Col className="detail-option">
						<Button
							color="dark"
							className="w-10 mb-1 snipcart-add-item"
							type="submit"
							data-item-id={id}
							data-item-price={currentPrice}
							data-item-url={asPath}
							data-item-description={descriptions.short}
							data-item-image={imageURL}
							data-item-name={name}
							data-item-categories=""
							data-item-weight={weight} // poid en gramme (pas de decimale)
							data-item-length={len} // longueur en cm (pas de decimale)
							data-item-width={width} // largeur en cm (pas de decimale)
							data-item-height={height}
						>
							{t('add_to_cart')}
						</Button>
					</Col>
				</Row>
			</Form>
		</>
	);
};

export default DetailMain;