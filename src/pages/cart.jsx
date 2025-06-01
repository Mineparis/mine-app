import React, { useState } from "react";
import { Container, Row, Col, Button, Spinner } from "reactstrap";
import { CartCheckoutButton, useCart } from "@shopify/hydrogen-react";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

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

	const handleQuantityChange = async (lineId, newQuantity) => {
		if (newQuantity < 1) return;
		setLoadingLineId(lineId);
		try {
			await linesUpdate([{ id: lineId, quantity: newQuantity }]);
		} catch (err) {
			toast.error(t('error_default_message'));
		} finally {
			setLoadingLineId(null);
		}
	};

	const handleRemove = async (lineId) => {
		setLoadingLineId(lineId);
		try {
			await linesRemove([lineId]);
			toast.success(t('item_removed'));
		} catch (err) {
			toast.error(t('error_default_message'));
		} finally {
			setLoadingLineId(null);
		}
	};

	return (
		<Container className="my-5 min-vh-100">
			<Row>
				<Col lg="8">
					<h5 className="text-uppercase text-center mb-4">{t('cart')}</h5>

					{lines.length === 0 ? (
						<p className="text-center">{t('empty_cart')}</p>
					) : (
						<AnimatePresence>
							{lines.map((line) => (
								<motion.div
									key={line.id}
									exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.3 } }}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									className="bg-white shadow-sm rounded p-3 mb-4"
								>
									<Row className="align-items-center">
										<Col xs="4" md="3">
											<div className="w-100" style={{ height: "120px", position: "relative" }}>
												<Image
													src={line.merchandise.image.url}
													alt={line.merchandise.product.title}
													fill
													style={{ objectFit: "contain" }}
												/>
											</div>
										</Col>

										<Col xs="8" md="5">
											<h6 className="mb-2">{line.merchandise.product.title}</h6>
											<div className="d-flex align-items-center">
												<Button
													size="sm"
													color="light"
													onClick={() => handleQuantityChange(line.id, line.quantity - 1)}
													disabled={loadingLineId === line.id}
												>
													−
												</Button>
												<span className="mx-2">{line.quantity}</span>
												<Button
													size="sm"
													color="light"
													onClick={() => handleQuantityChange(line.id, line.quantity + 1)}
													disabled={loadingLineId === line.id}
												>
													+
												</Button>
												<Button
													size="sm"
													color="light"
													className="ms-3"
													onClick={() => handleRemove(line.id)}
													disabled={loadingLineId === line.id}
												>
													{loadingLineId === line.id ? <Spinner size="sm" /> : '🗑️'}
												</Button>
											</div>
										</Col>

										<Col xs="12" md="4" className="text-md-end mt-3 mt-md-0">
											<div>
												{(line.quantity * parseFloat(line.merchandise.price.amount)).toFixed(2)} €
											</div>
										</Col>
									</Row>
								</motion.div>
							))}
						</AnimatePresence>
					)}
				</Col>

				<Col lg="4">
					<div className="bg-light p-4 rounded shadow-sm h-100 d-flex flex-column justify-content-between">
						<div>
							<h6 className="text-uppercase mb-3">{t('order_summary')}</h6>
							<strong className="d-block mb-3">
								{parseFloat(cost?.totalAmount?.amount ?? 0).toFixed(2)} €
							</strong>
						</div>

						{lines.length > 0 && (
							<CartCheckoutButton className="btn btn-dark w-100" as={Button}>
								{t('finalized_order')} <i className="fa fa-chevron-right ms-2" />
							</CartCheckoutButton>
						)}
					</div>
				</Col>
			</Row>
		</Container>
	);
};

export default ShoppingCart;
