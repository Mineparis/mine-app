import React from "react";
import Image from 'next/image';
import Link from "next/link";
import { Col } from "reactstrap";
import { useTranslation } from "react-i18next";

const BigCards = ({ isBox, data }) => {
	const { t } = useTranslation('common');

	const boxesLabel = ['women_box', 'men_box'];
	const categoriesLabel = ['hair_category', 'skin_category', 'beard_category'];
	const cardsLabel = isBox ? boxesLabel : categoriesLabel;

	return (
		<div id="big-cards" className="big-cards">
			{cardsLabel.map(cardLabel => {
				const cardName = t(cardLabel);
				const currentCardType = cardLabel.split('_')[0];
				const defaultCardData = { womenURL: '', menURL: '' };
				const cardData = isBox ? `box/${currentCardType}/${data?.[`${currentCardType}URL`]}` || '' : data?.[currentCardType] || defaultCardData;
				const isBeardCat = currentCardType === 'beard';

				if (isBox) {
					return (
						<Col key={cardLabel} className="big-card dark-overlay">
							<div className="overlay-content text-center text-white">
								<h3>{cardName}</h3>
								<div className="d-flex flex-row visible-on-hover justify-content-center mt-4">
									<Link href={cardData}>
										<h4 className="cursor-pointer">{t('discover')}</h4>
									</Link>
								</div>
							</div>
							<Image
								src={`/img/bigCards/${cardLabel}.jpg`}
								layout="fill"
								objectFit="cover"
								objectPosition="top"
								alt={cardName}
							/>
						</Col>
					);
				}

				return (
					<Col key={cardLabel} className="big-card dark-overlay">
						<div className="overlay-content text-center text-white">
							{isBeardCat ? (
								<Link href={cardData.menURL}>
									<h3 className="cursor-pointer">{cardName}</h3>
								</Link>
							) : (
								<>
									<h3>{cardName}</h3>
									<div className="d-flex flex-row visible-on-hover mt-4">
										<Link href={cardData.womenURL}>
											<h4 className="pr-4 cursor-pointer">{t('women')}</h4>
										</Link>
										<Link href={cardData.menURL}>
											<h4 className="pl-4 cursor-pointer">{t('men')}</h4>
										</Link>
									</div>
								</>
							)}
						</div>
						<Image
							src={`/img/bigCards/${cardLabel}.jpg`}
							layout="fill"
							objectFit="cover"
							objectPosition="top"
							alt={cardName}
						/>
					</Col>
				);
			})}
		</div>
	);
};

export default BigCards;
