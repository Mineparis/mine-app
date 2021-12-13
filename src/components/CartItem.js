import { Row, Col } from "reactstrap";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const CartItem = ({ item, review }) => {
	const [quantity, setQuantity] = useState(item.items);

	return (
		<div className="cart-item">
			<Row className=" d-flex align-items-center text-left text-md-center">
				<Col xs="12" md="5">
					<a className="cart-remove close mt-3 d-md-none" href="#">
						<i className="fa fa-times"> </i>
					</a>
					<div className="d-flex align-items-center">
						<Link href={item.link}>
							<a>
								<Image className="cart-item-img" src={item.img} alt="..." layout="fill" />
							</a>
						</Link>
						<div className="cart-title text-left">
							<Link href={item.link}>
								<a className="text-uppercase text-dark">
									<strong>{item.name}</strong>
								</a>
							</Link>
							{item.attributes &&
								item.attributes.map((attribute, index) => (
									<div className="text-muted text-sm" key={index}>
										{attribute.name}: {attribute.value}
									</div>
								))}
						</div>
					</div>
				</Col>
				<Col xs="12" md="7" className="mt-4 mt-md-0">
					<Row className="align-items-center">
						<Col md="3">
							<Row>
								<Col xs="6" className="d-md-none text-muted">
									Price per item
								</Col>
								<Col xs="6" md="12" className="text-right text-md-center">
									${item.price.toFixed(2)}
								</Col>
							</Row>
						</Col>
						<Col md="4">
							<Row className="align-items-center">
								<Col xs="7" sm="9" className="d-md-none text-muted">
									Quantity
								</Col>
								<Col xs="5" sm="3" md="12">
									{review ? (
										quantity
									) : (
										<div className="d-flex align-items-center">
											<div
												className="btn btn-items btn-items-decrease"
												onClick={() =>
													quantity > 1 && setQuantity(quantity - 1)
												}
											>
												-
											</div>
											<input
												className="form-control text-center border-0 border-md input-items"
												type="text"
												value={quantity}
												onChange={(e) =>
													e.target.value >= 1 &&
													setQuantity(parseInt(e.target.value))
												}
											/>
											<div
												className="btn btn-items btn-items-increase"
												onClick={() => setQuantity(quantity + 1)}
											>
												+
											</div>
										</div>
									)}
								</Col>
							</Row>
						</Col>
						<Col md="3">
							<Row>
								<Col xs="6" className="d-md-none text-muted">
									Total price
								</Col>
								<Col xs="6" md="12" className="text-right text-md-center">
									${item.total.toFixed(2)}
								</Col>
							</Row>
						</Col>
						{!review && (
							<Col xs="2" className="d-none d-md-block text-center">
								<a className="cart-remove" href="#">
									<i className="delete fa fa-times" />
								</a>
							</Col>
						)}
					</Row>
				</Col>
			</Row>
		</div>
	);
};

export default CartItem;
