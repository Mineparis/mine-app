module.exports = {
	i18n: {
		defaultLocale: 'fr',
		locales: ['fr', 'en'],
		localeDetection: true,
	},
	...(typeof window === undefined
		? { localePath: path.resolve('./public/locales') }
		: {})
};