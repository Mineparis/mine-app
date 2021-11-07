import React, { useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { toast } from 'react-toastify';
import { useRouter } from "next/router";
import Image from "next/image";

import { fetchAPI } from "../lib/api";

const Footer = () => {
	const { t } = useTranslation('common');
	const [email, setEmail] = useState(null);

	const router = useRouter();

	const handleChangeLanguage = (event) => {
		const locale = event.target.value;
		router.push(router.asPath, null, { locale });
	};

	const handleChangeEmail = (event) => setEmail(event.target.value);

	const handleSubmitNewsletterEmail = async (event) => {
		event.preventDefault();
		try {
			await fetchAPI('/mailings', 'POST', { email });
			const msg = t('email_sent_successfully');
			toast.success(msg);

		} catch (err) {
			const errMsg = err.statusCode === 409 ? t(err.message) : t();
			toast.error(errMsg);
		}
	};

	const categories = [
		{
			sectionName: 'Informations',
			links: [
				{
					href: '/about-us',
					label: t('about_us'),
				},
				{
					href: '/',
					label: t('shipping_returns'),
				},
				{
					href: '/',
					label: t('terms_of_sales'),
				},
				{
					href: '/legal-notice',
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
			<div className="py-4">
				<div className="container">
					<div className="row justify-content-between">
						<div className="col-lg-4 mb-2">
							<h6 className="text-uppercase mb-3">
								{t('newsletter_label')}
							</h6>
							<p className="mb-3">
								{t('newsletter_description')}
							</p>
							<form id="newsletter-form" onSubmit={handleSubmitNewsletterEmail}>
								<div className="input-group mb-3">
									<input
										className="form-control bg-transparent border-secondary border-right-0 text-white"
										type="email"
										placeholder={t('newsletter_placeholder')}
										aria-label={t('newsletter_placeholder')}
										onChange={handleChangeEmail}
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
							<div key={sectionName} className="col-lg-2 col-md-2 mb-2 mb-lg-0">
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
						<div className="text-center text-md-left col-md-6">
							<p className="mb-md-0">
								© {new Date().getFullYear()} Mine. {t('all_rights_reserved')}.
							</p>
						</div>

						<div className="d-flex flex-end justify-content-end col-md-6 align-items-center">
							{/* Language dropdown */}
							<div className="d-flex justify-content-between align-items-center col-md-4">
								<label htmlFor="language" className="mx-1">{t('language')}</label>
								<select id="language" defaultValue={langSelected.value} onChange={handleChangeLanguage}>
									{languageOptions.map(({ label, value }) => <option key={value} value={value}>{label}</option>)}
								</select>
							</div>
							<div className="col-md-6">
								<ul className="d-flex text-center m-0">
									<li className="list-inline-item">
										<Image width={35} height={35} className="w-2rem" src="/svg/visa.svg" alt="visa" />
									</li>
									<li className="list-inline-item">
										<Image width={35} height={35} className="w-2rem" src="/svg/mastercard.svg" alt="mastercard" />
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
