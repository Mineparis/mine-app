import React from 'react';
import Link from "next/link";
import Image from 'next/image';
import { Button, Col } from "reactstrap";
import { useTranslation } from 'next-i18next';

const BigImage = ({ label, link, index, imageName }) => {
	const src = imageName ? `/img/bigCards/${imageName}.jpg` : `/img/bigCards/subcategory${index}.jpg`;

	return (
		<Col key={label} className="big-card-text dark-overlay">
			{link ? (
				<div className="overlay-content text-center text-white cursor-pointer">
					<Link href={link} passHref>
						<h5 className="cursor-pointer">{label}</h5>
					</Link>
				</div>
			) : null}
			<Image
				src={src}
				layout="fill"
				objectFit="cover"
				objectPosition="top"
				alt={label}
			/>
		</Col>
	);
};

const BigCardsWithText = ({ title, description, cards, buttonLink, imageName }) => {
	const { t } = useTranslation('common');

	return (
		<div id="big-cards-text" className="big-cards-text">
			<div className="card-text d-flex align-items-center">
				<p className="lead font-weight-bolder text-center">{title}</p>
				<p>{description}</p>
				{buttonLink ? (
					<Link href={buttonLink} passHref>
						<Button color="primary" outline>{t('see_more')}</Button>
					</Link>
				) : null}
			</div>
			<div className="card-images">
				{imageName && !cards?.length && <BigImage imageName={imageName} />}
				{!imageName && cards?.map(({ label, link }, index) => (
					<BigImage key={label} label={label} link={link} index={index} />
				))}
			</div>
		</div>
	);
};

export default BigCardsWithText;