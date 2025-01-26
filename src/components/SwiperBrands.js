import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

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
		(<Swiper modules={[Navigation, Pagination]} {...params}>
			{props.brands.map((brand, index) => (
				<SwiperSlide key={index} className="h-auto d-flex align-items-center justify-content-center">
					<Image
						src={brand.img}
						alt={brand.title}
						className="img-fluid w-6rem"
						fill
						sizes="100vw"
					/>
				</SwiperSlide>
			))}
		</Swiper>)
	);
};

export default SwiperBrands;
