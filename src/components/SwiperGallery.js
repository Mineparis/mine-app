import React, { useState, useRef } from "react";
import Image from "next/image";
import Lightbox from "react-image-lightbox";
import Magnifier from "react-magnifier";
import { Row, Col, Button } from "reactstrap";

import ReactIdSwiper from "react-id-swiper";

const SwiperGallery = ({ data, vertical }) => {
	const [lightBoxOpen, setLightBoxOpen] = useState(false);
	const [activeImage, setActiveImage] = useState(0);
	const [activeSlide, setActiveSlide] = useState(0);

	const gallerySwiperRef = useRef(null);

	const slideTo = (index) => {
		setActiveSlide(index);
		if (
			gallerySwiperRef.current !== null &&
			gallerySwiperRef.current.swiper !== null
		) {
			gallerySwiperRef.current.swiper.slideToLoop(index);
		}
	};

	const onClick = (index) => {
		setActiveImage(index);
		setLightBoxOpen(!lightBoxOpen);
	};

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
		slidesPerView: 1,
		spaceBetween: 0,
		loop: true,
		on: {
			slideChange: () =>
				setActiveSlide(gallerySwiperRef.current.swiper.realIndex),
		},
	};

	const customStyles = {
		overlay: {
			zIndex: "1000",
		},
		bodyOpen: {
			position: "fixed",
		},
	};

	return (
		<>
			<Row>
				<Col className={sliderClass} {...sliderColumns}>
					<div className="ribbon ribbon-info">Fresh</div>
					<div className="ribbon ribbon-primary">Sale</div>
					<ReactIdSwiper {...sliderParams} ref={gallerySwiperRef}>
						{data.map((item, index) => (
							<div key={index}>
								<Magnifier
									mgShowOverflow={false}
									mgWidth={2000}
									mgHeight={2000}
									className="img-fluid"
									src={item.img}
									alt={item.alt}
									zoomFactor={0.11}
									style={{ cursor: "default" }}
								/>

								<Button color="expand" onClick={() => onClick(index)}>
									<svg className="svg-icon">
										<use xlinkHref="/icons/orion-svg-sprite.svg#expand-1"></use>
									</svg>
								</Button>
							</div>
						))}
					</ReactIdSwiper>
				</Col>

				<Col className={thumbsClass} {...thumbsColumns}>
					{data.map((item, index) => (
						<button
							key={index}
							onClick={() => slideTo(index)}
							className={`detail-thumb-item mb-3 ${activeSlide === index ? "active" : ""
								}`}
						>
							<Image layout="fill" className="img-fluid" src={item.img} alt={item.alt} />
						</button>
					))}
				</Col>

				{lightBoxOpen && (
					<Lightbox
						mainSrc={data[activeImage].img}
						nextSrc={data[(activeImage + 1) % data.length].img}
						prevSrc={data[(activeImage + data.length - 1) % data.length].img}
						onCloseRequest={() => setLightBoxOpen(false)}
						imageCaption={data[activeImage].caption}
						onMovePrevRequest={() =>
							setActiveImage((activeImage + data.length - 1) % data.length)
						}
						onMoveNextRequest={() =>
							setActiveImage((activeImage + 1) % data.length)
						}
						enableZoom={false}
						reactModalStyle={customStyles}
					/>
				)}
			</Row>
		</>
	);
};

export default SwiperGallery;
