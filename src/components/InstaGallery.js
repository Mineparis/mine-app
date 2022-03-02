import React from 'react';
import Image from 'next/image';
import { Container, Row } from 'reactstrap';
import { useTranslation } from 'next-i18next';

const images = [
	{
		src: '/img/instagram/face-with-quote.jpg',
		alt: 'Beauty has no skin tone',
		postId: 'CTP_KhSI_M0',
	},
	{
		src: '/img/instagram/oil.jpg',
		alt: 'Oil',
		postId: 'CaKd7FJIZ4G',
	},
	{
		src: '/img/instagram/group.jpg',
		alt: 'Mine group',
		postId: 'CUqESWLItrI',
	},
	{
		src: '/img/instagram/quote.jpg',
		alt: 'Best time for new begginnings is now',
		postId: 'CW9BzefI47-'
	}
];

const InstaGallery = () => {
	const { t } = useTranslation('common');

	return (
		<>
			<Container>
				<Row className="d-flex justify-content-center">
					<h4>{t('follow_us_on_instagram')}</h4>
				</Row>
			</Container>
			<Row className='insta-gallery'>
				{images.map(({ src, alt, postId }) => (
					<a key={alt} className="insta-img" target="_blank" href={`https://www.instagram.com/p/${postId}`}>
						<Image
							src={src}
							layout="responsive"
							width={300}
							height={300}
							alt={alt}
						/>
					</a>
				))}
			</Row>
		</>
	);
};

export default InstaGallery;