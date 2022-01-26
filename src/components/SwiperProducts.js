import React, { useRef } from "react";
import { Container, Row, Col, Button } from "reactstrap";

import ReactIdSwiper from "react-id-swiper";
import "swiper/css/swiper.css";

import Product from "./Product";

const SwiperProducts = ({ products, title, withNewFlag = false, ...props }) => {
	const swiperRef = useRef(null);

	const goPrev = () => {
		if (swiperRef.current && swiperRef.current.swiper) {
			swiperRef.current.swiper.slidePrev();
		}
	};

	const goNext = () => {
		if (swiperRef.current && swiperRef.current.swiper) {
			swiperRef.current.swiper.slideNext();
		}
	};

	const sliderParams = {
		centeredSlides: false,
		freeMode: true,
		slidesPerView: 2,
		spaceBetween: 20,
		loop: false,
		loopFillGroupWithBlank: true,
		breakpoints: {
			1200: { slidesPerView: 5, spaceBetween: 50 },
			1024: { slidesPerView: 4, spaceBetween: 40 },
			768: { slidesPerView: 3, spaceBetween: 30 },
			320: { slidesPerView: 2, spaceBetween: 20 },
		},
		pagination:
			props.pagination !== false
				? {
					el: `.swiper-pagination.swiper-pagination-black.swiper-button-black`,
					clickable: true,
					dynamicBullets: true,
				}
				: false,
	};

	if (!products.length) return null;

	return (
		<Container>
			<Row className="d-flex justify-content-between mx-1 mb-2">
				<Col xs="12" md="10">
					<h3>{title}</h3>
				</Col>
				{products.length > 5 && (
					<Col className="d-flex justify-content-end p-0">
						<Button className="mr-1 rounded-circle bg-primary" onClick={goPrev}><i className="fas fa-arrow-left" /></Button>
						<Button className="ml-1 rounded-circle bg-primary" onClick={goNext}><i className="fas fa-arrow-right" /></Button>
					</Col>
				)}
			</Row>
			<Row>
				<ReactIdSwiper {...sliderParams} ref={swiperRef} style={{ paddingLeft: "30px" }}>
					{products.map((product, index) => <Product key={index} data={product} />)}
				</ReactIdSwiper>
			</Row>
		</Container>
	);
};

export default SwiperProducts;
