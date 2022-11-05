import React, { useRef } from "react";
import Link from "next/link";
import { Container, Row, Col, Button } from "reactstrap";
import { useTranslation } from "next-i18next";
import ReactIdSwiper from "react-id-swiper";

import Post from "./Post";

import "swiper/css/swiper.css";

const SwiperMagazine = ({ posts, title, ...props }) => {
	const { t } = useTranslation('common');

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
	};

	if (!posts.length) return null;

	return (
		<Container>
			<Row className="d-flex justify-content-between mx-1 mb-2">
				<Col xs="12" md="10">
					<h3 className="text-white">{title}</h3>
				</Col>
				{posts.length > 4 && (
					<Col className="d-flex justify-content-end p-0">
						<Button className="mr-1 rounded-circle bg-primary" onClick={goPrev}><i className="fas fa-arrow-left" /></Button>
						<Button className="ml-1 rounded-circle bg-primary" onClick={goNext}><i className="fas fa-arrow-right" /></Button>
					</Col>
				)}
			</Row>
			<Row>
				<ReactIdSwiper {...sliderParams} ref={swiperRef}>
					{posts.map(({ slug, thumbnail, title }) => (
						<div key={slug} style={{ width: "250px" }}>
							<Post slug={slug} thumbnail={thumbnail} title={title} withoutSummary withoutDate />
						</div>
					))}
				</ReactIdSwiper>
			</Row>
			<Row>
				<Col className="d-flex justify-content-center my-4">
					<Link href="/magazine">
						<Button className="text-white border-white" outline>{t('see_more')}</Button>
					</Link>
				</Col>
			</Row>
		</Container>
	);
};

export default SwiperMagazine;
