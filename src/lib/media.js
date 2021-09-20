import { getStrapiURL } from './api';

export const getStrapiMedia = (media) => {
	if (typeof media === 'undefined' || !media) return;

	const imageURL = media.url.startsWith('/') ? getStrapiURL(media.url) : media.url;
	return imageURL;
};