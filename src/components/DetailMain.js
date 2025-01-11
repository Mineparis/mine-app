import { Row, Col, Form, Button, Input } from 'reactstrap';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

import { getCurrentPrice } from '../utils/price';
import { getStrapiMedia } from '../lib/media';
import Stars from "./Stars";

const DetailMain = ({ product, averageRating }) => {
	const { t } = useTranslation('common');
	const { asPath } = useRouter();

	const {
		id,
		name,
		brand,
		originalPrice,
		salePricePercent,
		descriptions,
		thumbnail,
		stock,
		shippingInfo,
	} = product;

	const { weight = 0, width = 0, len = 0, height = 0 } = shippingInfo || {};
	const currentPrice = getCurrentPrice(originalPrice, salePricePercent);
	const imageURL = getStrapiMedia(thumbnail?.formats.small);
	const soldOut = stock < 1;
	const isBox = asPath.split('/').includes('box');
	const nbComments = product?.comments?.length ?? 0;

	return (
		<>
			<h1 className="h5 mb-4 text-uppercase font-weight-light">{brand}</h1>
			<h1 className="h3 mb-4 font-weight-normal">{name}</h1>
			{averageRating ? (
				<div className="d-flex mb-4">
					<Stars
						stars={averageRating}
						secondColor="gray-300"
						starClass="mr-1"
						className="mr-2"
					/>
					<p>({nbComments})</p>
				</div>
			) : null}
			<div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-sm-between mb-4">
				<ul className="list-inline mb-2 mb-sm-0">
					<li className="list-inline-item h4 font-weight-light mb-0">
						{currentPrice} €
					</li>

					{salePricePercent > 0 && (
						<li className="list-inline-item text-muted font-weight-light">
							<del>{originalPrice.toFixed(2)} €</del>
						</li>
					)}
				</ul>
			</div>
			{!isBox && <p className="mb-4 text-muted">{descriptions.short}</p>}

			<Form>
				<Row className="d-flex list-inline mb-5 align-items-center col-12">
					{soldOut ? (
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
									data-item-description={descriptions.short}
									data-item-image={imageURL}
									data-item-name={name}
									data-item-weight={weight} // poid en gramme (pas de decimale)
									data-item-length={len} // longueur en cm (pas de decimale)
									data-item-width={width} // largeur en cm (pas de decimale)
									data-item-height={height}
								>
									{t('add_to_cart')}
								</Button>
							</Col>
						</>
					)}
				</Row>
			</Form>
		</>
	);
};

export default DetailMain;