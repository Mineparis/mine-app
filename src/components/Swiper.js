import Link from 'next/link';
import Image from 'next/image';
import ReactIdSwiper from "react-id-swiper";
import { Container, Row, Col, Button } from "reactstrap";

import { getStrapiMedia } from "../lib/media";

const positionMapping = {
	subtitle: {
		left: 'text-dark mb-3',
		center: 'text-uppercase text-white font-weight-light mb-4 letter-spacing-5',
	},
	row: {
		left: 'justify-content-start text-white',
		center: 'justify-content-center text-center text-white',
	},
	content: {
		left: '',
		center: 'd-flex flex-column align-items-center',
	}
};

const Swiper = (props) => {
	const className = props.className ? props.className : '';
	const navigationColor = props.navigationColor ? props.navigationColor : 'white';
	const wrapperClass = props.wrapperClass ? props.wrapperClass : '';
	const bgCover = !props.columns ? 'bg-cover' : '';
	const containerClass = 'container-fluid h-100';
	const textClass = `${props.columns ? 'text-muted' : 'lead'}  mb-5`;
	const buttonColor = props.columns ? 'outline-dark' : 'light';

	const breakpoints = [];
	if (props.sm) {
		breakpoints[565] = {
			slidesPerView: props.sm,
		};
	}
	if (props.md) {
		breakpoints[768] = {
			slidesPerView: props.md,
		};
	}
	if (props.lg) {
		breakpoints[991] = {
			slidesPerView: props.lg,
		};
	}
	if (props.xl) {
		breakpoints[1200] = {
			slidesPerView: props.xl,
		};
	}
	if (props.xxl) {
		breakpoints[1400] = {
			slidesPerView: props.xxl,
		};
	}
	if (props.xxxl) {
		breakpoints[1600] = {
			slidesPerView: props.xxxl,
		};
	}

	const params = {
		containerClass: `swiper-container ${className}`,
		slidesPerView: props.slidesPerView,
		effect: props.effect,
		allowTouchMove: props.allowTouchMove === false ? false : true,
		spaceBetween: props.spaceBetween,
		centeredSlides: props.centeredSlides,
		roundLengths: props.roundLengths,
		loop: props.loop,
		speed: props.speed ? props.speed : 400,
		parallax: props.parallax,
		breakpoints: breakpoints,
		autoplay: props.autoplay
			? {
				delay: props.delay,
			}
			: false,
		pagination:
			props.pagination !== false
				? {
					el: `.swiper-pagination.swiper-pagination-black`,
					clickable: true,
					dynamicBullets: true,
				}
				: false,
		navigation: {
			nextEl: props.navigation
				? `.swiper-button-next.swiper-button-${navigationColor}.swiper-nav.d-none.d-lg-block`
				: "",
			prevEl: props.navigation
				? `.swiper-button-prev.swiper-button-${navigationColor}.swiper-nav.d-none.d-lg-block`
				: "",
		},
		wrapperClass: `swiper-wrapper ${wrapperClass}`,
	};

	if (!props.data) return null;

	return (
		<ReactIdSwiper {...params}>
			{props.data.map(({ position, addDarkOverlay, img, staticImg, title, subtitle, text, button }, index) => {
				const darkOverlay = addDarkOverlay ? 'dark-overlay' : '';
				const rowClass = positionMapping.row[position];
				const contentClass = positionMapping.content[position];
				const subtitleClass = positionMapping.subtitle[position];
				const titleClass = 'mb-5 display-4 font-weight-bold text-uppercase';
				const buttonClass = 'rounded-button';
				const image = img ? getStrapiMedia(img) : staticImg;

				return (
					<div key={index} className={`${bgCover} ${darkOverlay}`} style={props.style}>
						<Image
							layout="fill"
							objectFit="cover"
							objectPosition="center"
							src={image}
							priority
						/>
						<Container
							fluid={props.containerFluid}
							className={`h-100 ${!props.columns ? "px-lg-6" : ""} ${containerClass}`}
						>
							<Row
								className={`overlay-content h-100 align-items-center ${rowClass}`}
								data-swiper-parallax="-500"
							>
								<Col
									className={contentClass}
									lg={{ size: props.columns ? 8 : 6 }}
								>
									{subtitle && (
										<p className={`subtitle letter-spacing-${props.columns ? 5 : 3} font-weight-light ${subtitleClass}`}>
											{subtitle}
										</p>
									)}
									<h2 className={titleClass} style={{ lineHeight: "1" }}>
										{title}
									</h2>
									{text && <p className={textClass}>{text}</p>}
									<Link href={button.link}>
										<Button className={buttonClass} color={buttonColor}>
											{button.label}
										</Button>
									</Link>
								</Col>
							</Row>
						</Container>
					</div>
				);
			})
			}
		</ReactIdSwiper>
	);
};

export default Swiper;