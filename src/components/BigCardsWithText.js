import React from 'react';
import Link from "next/link";
import Image from 'next/image';
import { Button, Col } from "reactstrap";
import { useTranslation } from 'next-i18next';

const BigImage = ({ label, link, index, imageName }) => {
	const src = imageName ? `/img/bigCards/${imageName}.jpg` : `/img/bigCards/subcategory${index}.jpg`;

	const Content = (
		<Col key={label} className="big-card-text dark-overlay cursor-pointer">
			<div className="overlay-content text-center text-white">
				<h5>{label}</h5>
			</div>
			<Image
				src={src}
				layout="fill"
				objectFit="cover"
				objectPosition="top"
				alt={label}
			/>
		</Col>
	);

	const WithLink = (
		<Link href={link} passHref>
			{Content}
		</Link>
	);

	return link ? WithLink : Content;
};

const BigCardsWithText = ({ title, description, cards, buttonLink, imageName, onClick }) => {
	const { t } = useTranslation('common');

	const isSingleCard = !cards || cards.length < 2;

	return (
		<div id="big-cards-text" className="big-cards-text">
			<div className="card-text d-flex align-items-center" data-single-card={isSingleCard}>
				<p className="lead font-weight-bolder text-center">{title}</p>
				<p>{description}</p>
				{!onClick && buttonLink ? (
					<Link href={buttonLink} passHref>
						<Button color="primary" outline>{t('see_more')}</Button>
					</Link>
				) : null}
				{onClick && !buttonLink ? (
					<Button color="primary" onClick={onClick} outline>{t('do_survey')}</Button>
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