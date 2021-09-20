import React from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";

const Footer = () => {
	const { t } = useTranslation('common');
	const router = useRouter();

	const handleChangeLanguage = (event) => {
		const locale = event.target.value;
		router.push(router.asPath, null, { locale });
	};

	const categories = [
		{
			sectionName: 'Shop',
			links: [
				{
					href: '/box',
					label: t('box'),
				},
				{
					href: '/about-us',
					label: t('about_us'),
				},
				{
					href: '/blog',
					label: 'Blog',
				},
				{
					href: '/customer-login',
					label: t('login'),
				},
			]
		},
		{
			sectionName: 'Informations',
			links: [
				{
					href: '/',
					label: t('shipping_returns'),
				},
				{
					href: '/faq',
					label: 'FAQ',
				},
				{
					href: '/contact',
					label: 'Contact',
				},
				{
					href: '/',
					label: t('terms_of_sales'),
				},
				{
					href: '/',
					label: t('legal_notice'),
				},
			]
		},
	];

	const languageOptions = [{
		label: t('english'),
		value: 'en',
	},
	{
		label: t('french'),
		value: 'fr',
	}];

	const langSelected = languageOptions.find(({ value }) => value === router.locale);

	return (
		<footer className="main-footer bg-primary text-gray-300">
			{/* Main block - menus, subscribe form*/}
			<div className="py-6">
				<div className="container">
					<div className="row justify-content-between">
						<div className="col-lg-4">
							<h6 className="text-uppercase mb-3">
								{t('newsletter_label')}
							</h6>
							<p className="mb-3">
								{t('newsletter_description')}
							</p>
							<form action="#" id="newsletter-form">
								<div className="input-group mb-3">
									<input
										className="form-control bg-transparent border-secondary border-right-0"
										type="email"
										placeholder={t('newsletter_placeholder')}
										aria-label={t('newsletter_placeholder')}
									/>
									<div className="input-group-append">
										<button
											className="btn btn-outline-secondary border-left-0"
											type="submit"
										>
											<i className="fa fa-paper-plane text-lg" />
										</button>
									</div>
								</div>
							</form>
						</div>
						{categories.map(({ sectionName, links }) => (
							<div key={sectionName} className="col-lg-2 col-md-2 mb-5 mb-lg-0">
								<h6 className="text-uppercase">{sectionName}</h6>
								<ul className="list-unstyled footer-list">
									{links.map(({ href, label }) => (
										<li key={label}>
											<Link href={href}>
												<a className="text-decoration-none">{label}</a>
											</Link>
										</li>
									))}
								</ul>
							</div>
						))}

						<div className="col-lg-2 mb-2 mb-lg-0">
							<h6 className="text-uppercase">Social</h6>
							<ul className="list-unstyled footer-list">
								<li>
									<a
										className="text-hover-gray-600"
										href="https://www.instagram.com/_mineparis"
										target="_blank"
										title="instagram"
									>
										Instagram
									</a>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>

			{/* Copyright section of the footer*/}
			<div className="py-4 font-weight-light">
				<div className="container">
					<div className="row align-items-center">
						<div className="col-md-6 text-center text-md-left">
							<p className="mb-md-0">
								© {new Date().getFullYear()} Mine. {t('all_rights_reserved')}.
							</p>
						</div>

						<div className="col-md-6 d-flex flex-end justify-content-end">
							{/* Language dropdown */}
							<div className="col-md-4 mx-4 d-flex justify-content-between align-items-center">
								<label htmlFor="language">{t('language')}</label>
								<select id="language" defaultValue={langSelected.value} onChange={handleChangeLanguage}>
									{languageOptions.map(({ label, value }) => <option key={value} value={value}>{label}</option>)}
								</select>
							</div>
							<div >
								<ul className="list-inline mb-0 mt-2 mt-md-0 text-center text-md-right">
									<li className="list-inline-item">
										<img className="w-2rem" src="/svg/visa.svg" alt="visa" />
									</li>
									<li className="list-inline-item">
										<img className="w-2rem" src="/svg/mastercard.svg" alt="mastercard" />
									</li>
									<li className="list-inline-item">
										<img className="w-2rem" src="/svg/paypal.svg" alt="paypal" />
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
