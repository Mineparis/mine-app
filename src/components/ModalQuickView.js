import React, { useState, useRef } from "react";

import {
	Button,
	ModalBody,
	Modal,
	Row,
	Col,
	Form,
	Input,
	InputGroupAddon,
	InputGroup,
} from "reactstrap";

import ReactIdSwiper from "react-id-swiper";

import SelectBox from "./SelectBox";
import Stars from "./Stars";

const ModalQuickView = ({ isOpen, toggle, product }) => {
	const [button, setButton] = useState(false);
	const swiperRef = useRef(null);
	const [inputs, setInputs] = useState({});
	const [currentIndex, updateCurrentIndex] = useState(0);

	const soldOut = product?.stock < 1;

	const params = {
		on: {
			slideChange: () => updateCurrentIndex(swiperRef.current.swiper.realIndex),
		},
	};
	const slideTo = (index) => {
		if (swiperRef.current && swiperRef.current.swiper) {
			swiperRef.current.swiper.slideTo(index + 1);
			updateCurrentIndex(index);
		}
	};
	const onChange = (e) => {
		const value = e.target.value;
		setInputs({ ...inputs, [e.target.name]: value });
	};

	const addToCart = (e) => {
		e.preventDefault();
	};

	const sizes = [
		{
			value: "value_0",
			label: "Small",
		},
		{
			value: "value_1",
			label: "Medium",
		},
		{
			value: "value_2",
			label: "Large",
		},
	];
	return (
		<Modal isOpen={isOpen} toggle={toggle} size="xl" modalClassName="quickview">
			<button
				className="close modal-close"
				type="button"
				onClick={toggle}
				aria-label="Close"
			>
				<svg className="svg-icon w-100 h-100 svg-icon-light align-middle">
					<use xlinkHref="/icons/orion-svg-sprite.svg#close-1"> </use>
				</svg>
			</button>

			<ModalBody className="quickview-body">
				{soldOut && <div className="ribbon ribbon-danger">Sold out</div>}

				<Row>
					<Col lg="6">
						<div className="detail-carousel">
							<ReactIdSwiper {...params} loop ref={swiperRef}>
								{product.img.detail.map((image, index) => (
									<img
										className="img-fluid"
										src={image.img}
										alt={image.alt}
										key={index}
									/>
								))}
							</ReactIdSwiper>
							<div className="swiper-thumbs">
								{product.img.detail.map((image, index) => (
									<button
										key={image.img}
										onClick={() => slideTo(index)}
										className={`swiper-thumb-item detail-thumb-item ${currentIndex === index ? "active" : ""
											}`}
									>
										<img
											className="img-fluid"
											src={image.img}
											alt={image.alt}
										/>
									</button>
								))}
							</div>
						</div>
					</Col>
					<Col lg="6" className="p-lg-5">
						<h2 className="mb-4 mt-4 mt-lg-1">{product.name}</h2>
						<div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-sm-between mb-4">
							<ul className="list-inline mb-2 mb-sm-0">
								<li className="list-inline-item h4 font-weight-light mb-0">
									${product.price.toFixed(2)}
								</li>
								<li className="list-inline-item text-muted font-weight-light">
									<del>$90.00</del>
								</li>
							</ul>
							<div className="d-flex align-items-center text-sm">
								<Stars
									stars={product.stars}
									className="mr-2 mb-0"
									secondColor="gray-300"
								/>
								<span className="text-muted text-uppercase">25 reviews</span>
							</div>
						</div>
						<p className="mb-4 text-muted">
							Samsa was a travelling salesman - and above it there hung a
							picture that he had recently cut out of an illustrated magazine
							and housed in a nice, gilded frame.
						</p>
						<Form onSubmit={toggle}>
							<Row>
								<Col sm="6" lg="12" className="detail-option mb-4">
									<h6 className="detail-option-heading">
										Size <span>(required)</span>
									</h6>
									<SelectBox options={sizes} />
								</Col>
								<Col sm="6" lg="12" className="detail-option mb-4">
									<h6 className="detail-option-heading">
										Type <span>(required)</span>
									</h6>

									<Button
										tag="label"
										color="outline-secondary"
										className={`detail-option-btn-label mr-1 ${button === "value_0" ? "active" : ""
											}`}
										size="sm"
										htmlFor="material_0_modal"
										onClick={() => setButton("value_0")}
									>
										Hoodie
										<Input
											className="input-invisible"
											type="radio"
											name="material"
											value="value_0"
											id="material_0_modal"
											required
										/>
									</Button>
									<Button
										tag="label"
										color="outline-secondary"
										className={`detail-option-btn-label ${button === "value_1" ? "active" : ""
											}`}
										size="sm"
										htmlFor="material_1_modal"
										onClick={() => setButton("value_1")}
									>
										College
										<Input
											className="input-invisible"
											type="radio"
											name="material"
											value="value_1"
											id="material_1_modal"
											required
										/>
									</Button>
								</Col>
							</Row>
							<InputGroup className="w-100 mb-4">
								<Input
									bsSize="lg"
									className="detail-quantity"
									name="items"
									type="number"
									value={(inputs.items > 0 && inputs.items) || 1}
									onChange={(e) => onChange(e)}
								/>
								<InputGroupAddon addonType="append" className="flex-grow-1">
									<Button color="dark" block>
										<i className="fa fa-shopping-cart mr-2" />
										Add to Cart
									</Button>
								</InputGroupAddon>
							</InputGroup>
							<Row className="mb-4">
								<Col xs="6">
									<a href="#" className="text-muted">
										<i className="far fa-heart mr-2" />
										Add to wishlist
									</a>
								</Col>
								<Col xs="6" className="text-right">
									<ul className="list-inline mb-0">
										<li className="list-inline-item mr-2">
											<a className="text-dark text-hover-primary" href="#">
												<i className="fab fa-facebook-f" />
											</a>
										</li>
										<li className="list-inline-item">
											<a className="text-dark text-hover-primary" href="#">
												<i className="fab fa-twitter" />
											</a>
										</li>
									</ul>
								</Col>
							</Row>
						</Form>
					</Col>
				</Row>
			</ModalBody>
		</Modal>
	);
};

export default ModalQuickView;
