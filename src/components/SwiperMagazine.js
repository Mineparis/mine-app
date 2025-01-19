import React, { useState } from "react";
import { Container, Row, Col, Button } from "reactstrap";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import Post from "./Post";

const SwiperMagazine = ({ posts, title, ...props }) => {
	const { t } = useTranslation('common');
	const [swiperInstance, setSwiperInstance] = useState();

	const sliderParams = {
		centeredSlides: false,
		freeMode: true,
		slidesPerView: 2,
		spaceBetween: 20,
		loop: false,
		loopFillGroupWithBlank: true,
		breakpoints: {
			1024: { slidesPerView: 4 },
		},
		pagination:
			props.pagination !== false && posts.length > 5
				? {
					el: `.swiper-pagination.swiper-pagination-white.swiper-button-white`,
					clickable: true,
					dynamicBullets: true,
				}
				: false,
		onSwiper: setSwiperInstance,
	};

	if (!posts.length) return null;

	const slidePrev = () => swiperInstance.slidePrev();
	const slideNext = () => swiperInstance.slideNext();

	return (
		(
			<Container>
				<Row className="d-flex justify-content-between mx-1 mb-2">
					<Col xs="12" md="10">
						<h3 className="text-white">{title}</h3>
					</Col>
					{posts.length > 4 && (
						<Col className="d-flex justify-content-end p-0">
							<Button className="mr-1 rounded-circle bg-primary" onClick={slidePrev}><i className="fas fa-arrow-left" /></Button>
							<Button className="ml-1 rounded-circle bg-primary" onClick={slideNext}><i className="fas fa-arrow-right" /></Button>
						</Col>
					)}
				</Row>
				<Row>
					<Swiper modules={[Navigation, Pagination]} {...sliderParams}>
						{posts.map(({ slug, thumbnail, title }) => (
							<SwiperSlide key={slug} spaceBetween={50}>
								<Post slug={slug} thumbnail={thumbnail} title={title} withoutSummary withoutDate />
							</SwiperSlide>
						))}
					</Swiper>
				</Row>
				<Row>
					<Col className="d-flex justify-content-center my-4">
						<Link href="/magazine" legacyBehavior>
							<Button className="text-white border-white" outline>{t('see_more')}</Button>
						</Link>
					</Col>
				</Row>
			</Container>
		)
	);
};

export default SwiperMagazine;
