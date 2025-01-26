import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { toast } from 'react-toastify';
import { useRouter } from "next/router";
import Image from "next/image";
import classNames from "classnames";

import { fetchAPI } from "../lib/api";

const Footer = () => {
	const { t } = useTranslation('common');
	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isMounted, setIsMounted] = useState(false);

	const router = useRouter();

	useEffect(() => {
		// Cette logique est maintenant séparée du rendu conditionnel
		setIsMounted(true);
	}, []);

	const handleChangeLanguage = (event) => {
		const locale = event.target.value;
		router.push(router.asPath, null, { locale });
	};

	const handleChangeEmail = (event) => setEmail(event.target.value);

	const handleSubmitNewsletterEmail = async (event) => {
		event.preventDefault();
		if (!email) {
			toast.error(t('email_required'));
			return;
		}

		setIsLoading(true);
		try {
			await fetchAPI('/mailings', 'POST', { email });
			toast.success(t('email_sent_successfully'));
			setEmail(""); // Réinitialiser l'input
		} catch (err) {
			const errMsg = err.statusCode === 409 ? t(err.message) : t('error_sending_email');
			toast.error(errMsg);
		} finally {
			setIsLoading(false);
		}
	};

	// Memoized categories and language options to avoid unnecessary re-calculations
	const categories = useMemo(() => [
		{
			sectionName: 'Informations',
			links: [
				{ href: '/about-us', label: t('about_us') },
				{ href: '/contact', label: t('contact_us') },
				{ href: '/faq', label: 'FAQ' },
				{ href: '/delivery-policy', label: t('delivery_policy') },
				{ href: '/terms-of-use', label: t('terms_of_use') },
				{ href: '/legal-notice', label: t('legal_notice') },
			]
		}
	], [t]);

	const languageOptions = useMemo(() => [
		{ label: t('english'), value: 'en' },
		{ label: t('french'), value: 'fr' }
	], [t]);

	const langSelected = languageOptions.find(({ value }) => value === router.locale);

	// Ne rien afficher tant que le composant n'est pas monté côté client
	if (!isMounted) {
		return null;
	}

	return (
		<footer className="main-footer bg-primary text-gray-300">
			<div className="py-4">
				<div className="container">
					<div className="row justify-content-between">
						{/* Newsletter Form */}
						<div className="col-lg-4 mb-2">
							<h6 className="text-uppercase mb-3">{t('newsletter_label')}</h6>
							<p className="mb-3">{t('newsletter_description')}</p>
							<form id="newsletter-form" onSubmit={handleSubmitNewsletterEmail}>
								<div className="input-group mb-3">
									<input
										className="form-control bg-transparent border-secondary border-right-0 text-white"
										type="email"
										placeholder={t('newsletter_placeholder')}
										aria-label={t('newsletter_placeholder')}
										value={email}
										onChange={handleChangeEmail}
										required
									/>
									<div className="input-group-append">
										<button
											className={classNames("btn btn-outline-secondary border-left-0", {
												'disabled': isLoading
											})}
											type="submit"
											aria-label={t('submit_newsletter')}
											disabled={isLoading}
										>
											<i className="fa fa-paper-plane text-lg" />
										</button>
									</div>
								</div>
							</form>
						</div>

						{/* Footer Categories */}
						{categories.map(({ sectionName, links }) => (
							<div key={sectionName} className="col-lg-2 col-md-4 mb-2 mb-lg-0">
								<h6 className="text-uppercase">{sectionName}</h6>
								<ul className="list-unstyled footer-list">
									{links.map(({ href, label }) => (
										<li key={label}>
											<Link href={href}>
												{label}
											</Link>
										</li>
									))}
								</ul>
							</div>
						))}

						{/* Social Links */}
						<div className="col-lg-2 col-md-2 mb-2 mb-lg-0">
							<h6 className="text-uppercase">Social</h6>
							<ul className="list-unstyled footer-list">
								<li>
									<a
										className="text-hover-gray-600"
										href="https://www.instagram.com/_mineparis"
										target="_blank"
										rel="noopener noreferrer"
										title="Instagram"
									>
										Instagram
									</a>
								</li>
								<li>
									<a
										className="text-hover-gray-600"
										href="https://www.pinterest.fr/mine_paris"
										target="_blank"
										rel="noopener noreferrer"
										title="Pinterest"
									>
										Pinterest
									</a>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>

			{/* Copyright Section */}
			<div className="py-4 font-weight-light">
				<div className="container">
					<div className="row align-items-center">
						<div className="text-center text-md-left col-md-6">
							<p className="mb-md-0">
								© {new Date().getFullYear()} Mine. {t('all_rights_reserved')}.
							</p>
						</div>

						{/* Language Selector */}
						<div className="d-flex justify-content-end col-md-6 align-items-center">
							<div className="d-flex justify-content-between align-items-center col-md-4">
								<label htmlFor="language" className="mx-1 my-0">{t('language')}</label>
								<select
									id="language"
									defaultValue={langSelected?.value || 'en'}
									onChange={handleChangeLanguage}
								>
									{languageOptions.map(({ label, value }) => (
										<option key={value} value={value}>{label}</option>
									))}
								</select>
							</div>

							{/* Payment Methods */}
							<div className="col-md-6">
								<ul className="d-flex text-center m-0">
									{['visa', 'mastercard', 'paypal'].map(payment => (
										<li key={payment} className="list-inline-item">
											<Image
												width={35}
												height={35}
												className="w-2rem"
												src={`/svg/${payment}.svg`}
												alt={payment}
												style={{ maxWidth: "100%", height: "auto" }}
											/>
										</li>
									))}
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
