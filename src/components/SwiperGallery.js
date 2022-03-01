import React, { useState, useRef } from "react";
import Image from "next/image";
import ReactIdSwiper from "react-id-swiper";
import { Row, Col } from "reactstrap";

import { getStrapiMedia } from '../lib/media';

const SwiperGallery = ({ images, vertical }) => {
	const [activeSlide, setActiveSlide] = useState(0);

	const gallerySwiperRef = useRef(null);
	const galleryStyle = { top: '10rem' };

	const slideTo = (index) => {
		setActiveSlide(index);
		if (
			gallerySwiperRef.current !== null &&
			gallerySwiperRef.current.swiper !== null
		) {
			gallerySwiperRef.current.swiper.slideToLoop(index);
		}
	};

	const hasMultipleImage = images?.length > 1;

	let sliderColumns = { xs: 12 },
		sliderClass = "detail-carousel",
		thumbsColumns = { xs: 12 },
		thumbsClass = "";

	if (vertical) {
		sliderColumns = { xs: 12, md: 10 };
		(sliderClass = "detail-carousel order-md-2"), (thumbsColumns = { md: 2 });
		thumbsClass = "d-none d-md-block pr-0 order-md-1";
	}

	const sliderParams = {
		autoplay: true,
		delay: 10000,
		loop: hasMultipleImage,
		navigation: hasMultipleImage ? {
			nextEl: ".swiper-button-next.swiper-button-black.swiper-nav.d-none.d-lg-block",
			prevEl: ".swiper-button-prev.swiper-button-black.swiper-nav.d-none.d-lg-block",
		} : {},
		pagination: hasMultipleImage ? {
			el: ".swiper-pagination.swiper-pagination-black",
			clickable: true,
			dynamicBullets: true,
		} : {},
		slidesPerView: 1,
		spaceBetween: 0,
		on: {
			slideChange: () =>
				setActiveSlide(gallerySwiperRef.current.swiper.realIndex),
		},
	};


	return (
		<Row style={galleryStyle}>
			<Col className={sliderClass} {...sliderColumns}>
				<ReactIdSwiper {...sliderParams} ref={gallerySwiperRef}>
					{images.map((img, index) => (
						<div key={index} className="detail-full-item bg-cover">
							<Image
								layout="fill"
								objectFit="contain"
								objectPosition="center"
								loading="eager"
								src={getStrapiMedia(img)}
								priority
							/>
						</div>
					))}
				</ReactIdSwiper>
			</Col>

			<Col className={thumbsClass} {...thumbsColumns}>
				{images.map(({ formats }, index) => (
					<button
						key={index}
						onClick={() => slideTo(index)}
						className={`detail-thumb-item mb-3 ${activeSlide === index ? "active" : ""
							}`}
					>
						<Image className="img-fluid" src={getStrapiMedia(formats.thumbnail)} />
					</button>
				))}
			</Col>
		</Row>
	);
};

export default SwiperGallery;
