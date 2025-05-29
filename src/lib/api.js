
import fetch from "node-fetch";
import * as Sentry from "@sentry/nextjs";

export const getStrapiURL = (path = '') => {
	const APIURL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';
	return `${APIURL}${path}`;
};

export const fetchAPI = async (path, method = 'GET', body) => {
	if (!path) return null;

	const requestURL = getStrapiURL(path);

	try {
		const response = await fetch(requestURL, {
			method,
			headers: {
				'Content-Type': 'application/json',
			},
			...(body ? { body: JSON.stringify(body) } : {})
		});

		const data = await response.json();

		if (!response.ok) throw data;
		return data;
	} catch (err) {
		Sentry.captureException(err);
		throw err;
	}
};