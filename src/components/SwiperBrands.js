import React from "react";
import ReactIdSwiper from "react-id-swiper";
import Image from "next/image";

import "swiper/css/swiper.css";

const SwiperBrands = (props) => {
	const params = {
		containerClass: `swiper-container brands-slider pb-5`,
		slidesPerView: 2,
		spaceBetween: 15,
		loop: true,
		roundLengths: true,
		pagination: {
			el: `.swiper-pagination.swiper-pagination-black`,
			clickable: true,
			dynamicBullets: true,
		},
		breakpoints: {
			1200: { slidesPerView: 6, spaceBetween: 60 },
			991: { slidesPerView: 4, spaceBetween: 40 },
			768: { slidesPerView: 3, spaceBetween: 30 },
		},
	};

	return (
		<ReactIdSwiper {...params}>
			{props.brands.map((brand, index) => (
				<div
					key={index}
					className="h-auto d-flex align-items-center justify-content-center"
				>
					<Image layout="fill" src={brand.img} alt={brand.title} className="img-fluid w-6rem" />
				</div>
			))}
		</ReactIdSwiper>
	);
};

export default SwiperBrands;
