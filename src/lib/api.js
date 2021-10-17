
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
};


export const registerUser = async (email, password, snipcartId) => {
	if (typeof window === 'undefined') return;

	try {
		const { jwt } = await fetchAPI('/auth/local/register', 'POST', { email, password });

		if (!jwt) return;
		Cookie.set('token', jwt);

		const data = fetchAPI(`/customers?snipcartId=${snipcartId}`, 'POST');
		return data;
	} catch (err) {
		Sentry.captureException(err);
	}
};

export const login = (identifier, password) => {
	if (typeof window === 'undefined') return;

	return new Promise((resolve, reject) => {
		fetchAPI(`/auth/local`, 'POST', { identifier, password })
			.then((res) => {
				Cookie.set('token', res.jwt);
				resolve(res);
			})
			.catch((error) => {
				Sentry.captureException(err);
				reject(error);
			});
	});
};

export const logout = () => {
	Cookie.remove("token");
	delete window.__user;
};