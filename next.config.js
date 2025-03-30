const withPlugins = require("next-compose-plugins");
const { withSentryConfig } = require('@sentry/nextjs');
const reactSvg = require("next-react-svg");
const path = require("path");
const { i18n } = require('./next-i18next.config');

// next.js configuration
const nextConfig = {
	images: {
		remotePatterns: [{
			protocol: 'http',
			hostname: 'localhost',
		},
		{
			protocol: 'https',
			hostname: 'source.unsplash.com',
		},
		{
			protocol: 'https',
			hostname: 'res.cloudinary.com',
		},
		{
			protocol: 'https',
			hostname: 'cdn.shopify.com',
		},
		],
		formats: ['image/webp'],
		// loader: "imgix", // Uncomment this line for STATIC EXPORT
		// path: "", // Uncomment this line for STATIC EXPORT
	},
	env: {
		production_type: "server", // Change variable to "static" for STATIC EXPORT
	},
	i18n,
	// trailingSlash: true // Uncomment this line for STATIC EXPORT
	generateBuildId: () => process.env.BUILD_ID,
	// experimental: { esmExternals: false },
};

const SentryWebpackPluginOptions = {
	// Additional config options for the Sentry Webpack plugin. Keep in mind that
	// the following options are set automatically, and overriding them is not
	// recommended:
	//   release, url, org, project, authToken, configFile, stripPrefix,
	//   urlPrefix, include, ignore

	silent: true, // Suppresses all logs
	// For all available options, see:
	// https://github.com/getsentry/sentry-webpack-plugin#options.
};

const nextPlugins = [
	[
		reactSvg,
		{
			include: path.resolve(__dirname, "public/svg"),
		},
	],
	// Make sure adding Sentry options is the last code to run before exporting, to
	// ensure that your source maps include changes from all other Webpack plugins
	(nextConfig) => withSentryConfig(nextConfig, SentryWebpackPluginOptions),
];

module.exports = withPlugins(nextPlugins, nextConfig);