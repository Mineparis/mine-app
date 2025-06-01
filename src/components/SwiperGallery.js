import React, { useState } from "react";
import { Row, Col } from "reactstrap";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import { getStrapiMedia } from '../lib/media';

const getStrapiImg = (images) => {
	return images.map((img) => (
		<SwiperSlide key={img.hash} className="detail-full-item bg-cover">
			<Image
				src={getStrapiMedia(img)}
				priority
				fill
				sizes="100vw"
				objectFit="contain"
				objectPosition="center"
				alt={img.alternativeText || ''}
			/>
		</SwiperSlide>
	));
};

const getShopifyImg = (images) => {
	return images.map(({ src, alt }) => (
		<SwiperSlide key={alt} className="detail-full-item bg-cover">
			<Image
				src={src}
				priority
				fill
				sizes="100vw"
				objectFit="contain"
				objectPosition="center"
				alt={alt}
			/>
		</SwiperSlide>
	));
};

const SwiperGallery = ({ images, vertical }) => {
	const [activeSlide, setActiveSlide] = useState(0);
	const [swiperInstance, setSwiperInstance] = useState();

	const galleryStyle = { top: '10rem' };

	const hasMultipleImage = images?.length > 1;
	const isShopifyImg = images.some(({ src }) => !!src);
	const GalleryImages = isShopifyImg ? getShopifyImg(images) : getStrapiImg(images);

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
		} : false,
		pagination: hasMultipleImage ? {
			el: ".swiper-pagination.swiper-pagination-black",
			clickable: true,
			dynamicBullets: true,
		} : false,
		slidesPerView: 1,
		spaceBetween: 0,
		onSwiper: setSwiperInstance,
	};

	const handleSlideChange = () => () => setActiveSlide(swiperInstance.realIndex);

	const handleClickImg = (index) => {
		setActiveSlide(index);
		swiperInstance.slideToLoop(index);
	};

	return (
		<Row style={galleryStyle}>
			<Col className={sliderClass} {...sliderColumns}>
				<Swiper modules={[Navigation, Pagination, Autoplay]} {...sliderParams} onSlideChange={handleSlideChange}>
					{GalleryImages}
				</Swiper>
			</Col>
			{hasMultipleImage && isShopifyImg && (
				<Col className={thumbsClass} {...thumbsColumns}>
					{images.map(({ src, alt }, index) => (
						<button
							key={`thumbnail-${index}`}
							onClick={() => handleClickImg(index)}
							className={`detail-thumb-item mb-3 ${activeSlide === index ? "active" : ""}`}
						>
							<Image
								layout="responsive"
								width={400}
								height={400}
								objectFit="contain"
								objectPosition="center"
								src={src}
								alt={alt || ''}
							/>
						</button>
					))}
				</Col>
			)}
		</Row>
	);
};

export default SwiperGallery;
