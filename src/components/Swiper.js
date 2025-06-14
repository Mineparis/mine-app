import Link from 'next/link';
import Image from 'next/image';
import { Container, Row, Col, Button } from "reactstrap";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import { getStrapiMedia } from "../lib/media";

const positionMapping = {
	subtitle: {
		left: 'text-white mb-3',
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

const getBreakpoints = ({ sm = 1, md = 1, lg = 1, xl = 1, xxl = 1, xxxl = 1 }) => {
	const breakpoints = {};
	if (sm) breakpoints[565] = { slidesPerView: sm };
	if (md) breakpoints[768] = { slidesPerView: md };
	if (lg) breakpoints[991] = { slidesPerView: lg };
	if (xl) breakpoints[1200] = { slidesPerView: xl };
	if (xxl) breakpoints[1400] = { slidesPerView: xxl };
	if (xxxl) breakpoints[1600] = { slidesPerView: xxxl };
	return breakpoints;
};

const SwiperJumbotron = ({
	sm,
	md,
	lg,
	xl,
	xxl,
	xxxl,
	...props
}) => {
	const navigationColor = props.navigationColor || 'white';
	const wrapperClass = props.wrapperClass || '';
	const bgCover = !props.columns ? 'bg-cover' : '';
	const containClass = 'container-fluid h-100';
	const textClass = `${props.columns ? 'text-muted' : 'lead'} mb-5`;
	const buttonColor = props.columns ? 'outline-dark' : 'light';

	const navigation = props.data.length > 1 ? {
		nextEl: `.swiper-button-next.swiper-button-${navigationColor}.swiper-nav.d-none.d-lg-block`,
		prevEl: `.swiper-button-prev.swiper-button-${navigationColor}.swiper-nav.d-none.d-lg-block`,
	} : false;

	const breakpoints = getBreakpoints({ sm, md, lg, xl, xxl, xxxl });

	const params = {
		slidesPerView: props.slidesPerView,
		effect: props.effect,
		allowTouchMove: props.allowTouchMove || true,
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
			props.pagination
				? {
					el: '.swiper-pagination.swiper-pagination-black',
					clickable: true,
					dynamicBullets: true,
				}
				: false,
		navigation,
		wrapperClass: `swiper-wrapper ${wrapperClass}`,
	};

	if (!props.data) return null;

	return (
		<Swiper modules={[Navigation, Pagination, Autoplay]} {...params}>
			{props.data.map(({ position, addDarkOverlay, img, staticImg, title, subtitle, text, button }, index) => {
				const darkOverlay = addDarkOverlay ? 'dark-overlay' : '';
				const rowClass = positionMapping.row[position];
				const contentClass = positionMapping.content[position];
				const subtitleClass = positionMapping.subtitle[position];
				const titleClass = 'mb-5 display-5 font-weight-bold text-uppercase';
				const buttonClass = 'rounded-button';
				const image = img ? getStrapiMedia(img) : staticImg;

				return (
					<SwiperSlide key={index} className={`${bgCover} ${darkOverlay}`} style={props.style}>
						<Image
							src={image}
							alt={title}
							fill
							style={{ objectFit: 'cover', objectPosition: 'center' }}
							priority
						/>
						<Container
							fluid={props.containerFluid}
							className={`h-100 ${!props.columns ? "px-lg-12" : ""} ${containClass}`}
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
									{props.handleClickOnButton && button?.link === 'anchor' && (
										<Button
											className={buttonClass}
											color={buttonColor}
											onClick={props.handleClickOnButton}
										>
											{button.label}
										</Button>
									)}
									{button?.link && button?.link !== 'anchor' && (
										<Link href={button.link} legacyBehavior>
											<Button className={buttonClass} color={buttonColor}>
												{button.label}
											</Button>
										</Link>
									)}
								</Col>
							</Row>
						</Container>
					</SwiperSlide>
				);
			})}

			{/* Pagination */}
			<div className="swiper-pagination swiper-pagination-black" />
		</Swiper>
	);
};

export default SwiperJumbotron;
