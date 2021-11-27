import React from "react";
import Image from 'next/image';
import Link from "next/link";
import { Col } from "reactstrap";
import { useTranslation } from "react-i18next";

const BestCategories = ({ categoriesSection }) => {
	const { t } = useTranslation('common');

	const categories = [
		{ id: 'hair_category', mappingURL: 'hairURL' },
		{ id: 'skin_category', mappingURL: 'skinURL' },
		{ id: 'beard_category', mappingURL: 'beardURL' }
	];

	return (
		<div className="best-categories">
			{categories.map(({ id: categoryId, mappingURL }) => {
				const catName = t(categoryId);
				const catURL = categoriesSection?.[mappingURL] || '';

				return (
					<Col key={categoryId} className="best-category dark-overlay">
						<Link href={catURL}>
							<>
								<div className="overlay-content text-center text-white">
									<h3>{catName}</h3>
								</div>
								<Image
									src={`/img/categories/${categoryId}.jpg`}
									layout="fill"
									objectFit="cover"
									objectPosition="top"
									alt={catName}
									priority
								/>
							</>
						</Link>
					</Col>
				);
			})}
		</div>
	);
};

export default BestCategories;
