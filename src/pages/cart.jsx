import React from "react";
import { Container, Row, Col, Button } from "reactstrap";
import { CartCheckoutButton, useCart } from "@shopify/hydrogen-react";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from "next-i18next";
import Image from "next/image";

export const getStaticProps = async ({ locale }) => {
	const lang = locale || DEFAULT_LANG;

	return {
		props: {
			...(await serverSideTranslations(lang, 'common')),
		},
	};
};

const ShoppingCart = () => {
	const { t } = useTranslation('common');
	const { lines } = useCart();
	console.log({ lines });
	return (
		<Container>
			<Row className="mb-5">
				<Col lg="8">
					<div className="cart">
						<div className="cart-header text-center">
							<Row>
								<Col md="5">Item</Col>
								<div className="d-none d-md-block col">
									<Row>
										<Col md="3">{t('price')}</Col>
										<Col md="4">{t('quantity')}</Col>
										<Col md="3">Total</Col>
										<Col md="2"></Col>
									</Row>
								</div>
							</Row>
						</div>

						<div className="cart-body">
							{lines.map(line => (
								<div className="cart-item">
									<div className="d-flex align-items-center text-start text-md-center row">
										<Col md="5">
											<div className="d-flex align-items-center">
												<div className="position-relative p-5">
													<Image
														src={line.merchandise.image.url}
														alt=""
														fill
														sizes="100vw"
														style={{ objectFit: "contain" }}
													/>
												</div>
												<div className="cart-title text-start">
													<p>{line.merchandise.product.title}</p>
												</div>
											</div>
										</Col>
										<Col md="5">
											<div className="align-items-center row">
												<Col md="4">
													<div className="text-end text-md-center">
														{line.merchandise.price.amount} €
													</div>
												</Col>
											</div>
										</Col>
									</div>
								</div>
							))}
						</div>
					</div>
				</Col>

				<Col lg="4">
					<div className="d-flex flex-column mb-5">
						<div className="block-header">
							<h6 className="text-uppercase mb-0">Total</h6>
						</div>
						<div className="block-body bg-light pt-1">
							<strong className="order-summary-total">$400.00</strong>
						</div>
						<CartCheckoutButton className="btn btn-dark" as={Button}>
							{t('finalized_order')} <i className="fa fa-chevron-right" />
						</CartCheckoutButton>
					</div>
				</Col>
			</Row>
		</Container>
	);
};

export default ShoppingCart;