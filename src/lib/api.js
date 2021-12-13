
import Cookie from "js-cookie";
import fetch from "node-fetch";
import * as Sentry from "@sentry/nextjs";

export const getStrapiURL = (path = '') => {
	const APIURL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';
	return `${APIURL}${path}`;
};

export const fetchAPI = async (path, method = 'GET', body) => {
	const requestURL = getStrapiURL(path);
	const token = Cookie.get('token');

	try {
		const response = await fetch(requestURL, {
			method,
			headers: {
				'Content-Type': 'application/json',
				...(token && token !== 'undefined' ? { Authorization: `Bearer ${token}` } : {}),
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