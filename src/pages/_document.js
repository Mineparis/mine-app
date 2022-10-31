import Document, { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';

class MyDocument extends Document {
	static async getInitialProps(ctx) {
		const originalRenderPage = ctx.renderPage;

		// Run the React rendering logic synchronously
		ctx.renderPage = () =>
			originalRenderPage({
				// Useful for wrapping the whole react tree
				enhanceApp: (App) => App,
				// Useful for wrapping in a per-page basis
				enhanceComponent: (Component) => Component,
			});

		// Run the parent `getInitialProps`, it now includes the custom `renderPage`
		return Document.getInitialProps(ctx);
	}

	render() {
		return (
			<Html>
				<Head>
					<link
						rel="stylesheet"
						href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap"
					/>
					<link rel="preconnect" href="https://app.snipcart.com" />
					<link rel="preconnect" href="https://cdn.snipcart.com" />
					<link rel="stylesheet" href="https://cdn.snipcart.com/themes/v3.3.0/default/snipcart.css" />
					<link rel="icon" href="/img/favicon.png" />
					<link href="https://use.fontawesome.com/releases/v5.8.1/css/all.css" rel="stylesheet" />
					<meta property="og:type" content="website" />
					<meta name="google-site-verification" content="HomFVDjGLE7Fgz0LBnFFcDZouzvQmYB4Om_FyvTYh3s" />

					<script async defer src="https://cdn.snipcart.com/themes/v3.3.0/default/snipcart.js" />
					<script async defer src="https://cdn.ckeditor.com/ckeditor5/31.1.0/classic/ckeditor.js" />
					<Script src="https://code.jquery.com/jquery-3.4.1.min.js" strategy="lazyOnload" />

					{/* Hotjar Tracking */}
					{process.env.NODE_ENV === 'production' && (
						<>
							<script async defer
								dangerouslySetInnerHTML={{
									__html: `
							(function(h,o,t,j,a,r){
								h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
								h._hjSettings={hjid:2829073,hjsv:6};
								a=o.getElementsByTagName('head')[0];
								r=o.createElement('script');r.async=1;
								r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
								a.appendChild(r);
						})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
						`,
								}}
							/>
							{/* Mailchimp */}
							<script id="mcjs" async defer
								dangerouslySetInnerHTML={{
									__html: `!function(c,h,i,m,p){m = c.createElement(h), p = c.getElementsByTagName(h)[0], m.async = 1, m.src = i, p.parentNode.insertBefore(m, p)}(document,"script","https://chimpstatic.com/mcjs-connected/js/users/e4165b25dead80b294e826446/f59f0094e1a493fdab8cde0a4.js");`
								}}
							/>
						</>
					)}
				</Head>
				<body>
					<Main />
					<NextScript />
					<div
						hidden
						id="snipcart"
						data-api-key={process.env.NEXT_PUBLIC_SNIPCART}
						data-config-modal-style="side"
						data-currency="eur"
					/>
				</body>
			</Html>
		);
	}
}

export default MyDocument;