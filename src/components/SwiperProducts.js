import React, { useState } from "react";
import { Container, Row, Col, Button } from "reactstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import Product from "./Product";

const SwiperProducts = ({ products, title, withNewFlag = false, ...props }) => {
	const [swiperInstance, setSwiperInstance] = useState();

	const sliderParams = {
		centeredSlides: false,
		freeMode: true,
		slidesPerView: 2,
		spaceBetween: 20,
		loop: false,
		breakpoints: {
			1200: { slidesPerView: 5, spaceBetween: 50 },
			1024: { slidesPerView: 4, spaceBetween: 40 },
			768: { slidesPerView: 3, spaceBetween: 30 },
			320: { slidesPerView: 2, spaceBetween: 20 },
		},
		pagination:
			props.pagination !== false && products.length > 5
				? {
					el: `.swiper-pagination.swiper-pagination-black.swiper-button-black`,
					clickable: true,
					dynamicBullets: true,
				}
				: false,
		onSwiper: setSwiperInstance,
	};

	if (!products.length) return null;

	const slidePrev = () => swiperInstance.slidePrev();
	const slideNext = () => swiperInstance.slideNext();

	return (
		<Container>
			<Row className="d-flex justify-content-between mx-1 mb-2">
				<Col xs="12" md="10">
					<h3>{title}</h3>
				</Col>
				{products.length > 5 && (
					<Col className="d-flex justify-content-end p-0">
						<Button className="mr-1 rounded-circle bg-primary" onClick={slidePrev}><i className="fas fa-arrow-left" /></Button>
						<Button className="ml-1 rounded-circle bg-primary" onClick={slideNext}><i className="fas fa-arrow-right" /></Button>
					</Col>
				)}
			</Row>
			<Row>
				<Swiper modules={[Navigation, Pagination]} {...sliderParams} style={{ paddingLeft: "30px" }}>
					{products.map((product, index) => (
						<SwiperSlide key={index}>
							<Product data={product} />
						</SwiperSlide>
					))}
				</Swiper>
			</Row>
		</Container>
	);
};

export default SwiperProducts;
