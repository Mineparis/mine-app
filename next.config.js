const withPlugins = require("next-compose-plugins");
const reactSvg = require("next-react-svg");
const path = require("path");
const { i18n } = require('./next-i18next.config');

// next.js configuration
const nextConfig = {
	images: {
		domains: ['localhost', 'source.unsplash.com', 'res.cloudinary.com']
		// loader: "imgix", // Uncomment this line for STATIC EXPORT
		// path: "", // Uncomment this line for STATIC EXPORT
	},
	env: {
		production_type: "server", // Change variable to "static" for STATIC EXPORT
	},
	i18n,
	// trailingSlash: true // Uncomment this line for STATIC EXPORT
	target: "serverless"
};

module.exports = withPlugins(
	[
		[
			reactSvg,
			{
				include: path.resolve(__dirname, "public/svg"),
			},
		],
	],
	nextConfig,
);
