module.exports = {
	i18n: {
		defaultLocale: 'fr',
		locales: ['fr', 'en'],
	},
	...(typeof window === undefined
		? { localePath: path.resolve('./public/locales') }
		: {})
};