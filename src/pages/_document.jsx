import Document, { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';

class MyDocument extends Document {
	static async getInitialProps(ctx) {
		const initialProps = await Document.getInitialProps(ctx);
		const locale = ctx.locale || 'fr';
		return { ...initialProps, locale };
	}

	render() {
		const { locale } = this.props;
		return (
			<Html lang={locale}>
				<Head>
					<link
						rel="stylesheet"
						href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap"
					/>
					<link rel="icon" href="/img/favicon.png" />
					<meta property="og:type" content="website" />
					<meta name="google-site-verification" content="HomFVDjGLE7Fgz0LBnFFcDZouzvQmYB4Om_FyvTYh3s" />
					{/* Hotjar & Mailchimp only in production */}
					{process.env.NODE_ENV === 'production' && (
						<>
							<Script
								id="hotjar"
								strategy="afterInteractive"
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
							<Script
								id="mailchimp"
								strategy="afterInteractive"
								dangerouslySetInnerHTML={{
									__html: `!function(c,h,i,m,p){m = c.createElement(h), p = c.getElementsByTagName(h)[0], m.async = 1, m.src = i, p.parentNode.insertBefore(m, p)}(document,"script","https://chimpstatic.com/mcjs-connected/js/users/e4165b25dead80b294e826446/f59f0094e1a493fdab8cde0a4.js");`,
								}}
							/>
						</>
					)}
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default MyDocument;