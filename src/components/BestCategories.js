import React from "react";
import Image from 'next/image';
import Link from "next/link";
import { Col } from "reactstrap";
import { useTranslation } from "react-i18next";

const BestCategories = ({ categoriesSection }) => {
	const { t } = useTranslation('common');

	const categories = ['hair_category', 'skin_category', 'beard_category'];

	return (
		<div className="best-categories">
			{categories.map(category => {
				const catName = t(category);
				const currentCat = category.split('_')[0];
				const catData = categoriesSection?.[currentCat] || { womenURL: '', menURL: '' };
				const isBeardCat = currentCat === 'beard';

				return (
					<Col key={category} className="best-category dark-overlay">
						<div className="overlay-content text-center text-white">
							{isBeardCat ? (
								<Link href={catData.menURL}>
									<h3 className="cursor-pointer">{catName}</h3>
								</Link>
							) : (
								<>
									<h3>{catName}</h3>
									<div className="d-flex flex-row visible-on-hover mt-4">
										<Link href={catData.womenURL}>
											<h4 className="pr-4 cursor-pointer">{t('women')}</h4>
										</Link>
										<Link href={catData.menURL}>
											<h4 className="pl-4 cursor-pointer">{t('men')}</h4>
										</Link>
									</div>
								</>
							)}
						</div>
						<Image
							src={`/img/categories/${category}.jpg`}
							layout="fill"
							objectFit="cover"
							objectPosition="top"
							alt={catName}
						/>
					</Col>
				);
			})}
		</div>
	);
};

export default BestCategories;
