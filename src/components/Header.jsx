import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Router from "next/router";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import useScrollPosition from "@react-hook/window-scroll";
import useSize from "@react-hook/size";
import { IoIosSearch, IoIosArrowDown } from "react-icons/io";
import { FaUserCircle, FaBars } from "react-icons/fa";

import UseWindowSize from "@hooks/UseWindowSize";
import { MENU } from "@utils/menu";
import Searchbar from "./Searchbar";
import CartDropdown from "./CartDropdown";

const PROMO_CODE = '';
const MOBILE_BREAKPOINT = 500;

const Header = ({ shouldDisplayWhiteLogo, locale, ...props }) => {
	const { t } = useTranslation('common');

	const [collapsed, setCollapsed] = useState(false);
	const [dropdownOpen, setDropdownOpen] = useState({});
	const [searchToggle, setSearchToggle] = useState(false);
	const [additionalNavClasses, setAdditionalNavClasses] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	const [searchTimeout, setSearchTimeout] = useState(null);
	const [isSearchLoading, setIsSearchLoading] = useState(false);
	const [mobileDropdownOpen, setMobileDropdownOpen] = useState({});

	const size = UseWindowSize();
	const scrollY = useScrollPosition();
	const navbarRef = useRef(null);
	const topbarRef = useRef(null);
	const [, topbarHeight] = useSize(topbarRef);
	const [, navbarHeight] = useSize(navbarRef);
	const isSmallScreen = size.width < MOBILE_BREAKPOINT;
	const textColor = shouldDisplayWhiteLogo || additionalNavClasses ? 'text-primary-700' : 'text-white';

	// Dropdown logic
	const toggleDropdown = (name) => {
		setDropdownOpen({ ...dropdownOpen, [name]: !dropdownOpen[name] });
	};

	const onLinkClick = (url) => {
		if (url) Router.push(url);
		if (isSmallScreen) setCollapsed(!collapsed);
	};

	// Sticky logic
	const makeNavbarSticky = () => {
		if (!props.nav.sticky) {
			if (additionalNavClasses) {
				setAdditionalNavClasses("");
				props.setPaddingTop(0);
			}
			return;
		}
		if (scrollY > topbarHeight) {
			setAdditionalNavClasses("fixed top-0 left-0 w-full z-50 shadow-lg bg-white");
			if (navbarHeight > 0 && !props.headerAbsolute) {
				props.setPaddingTop(navbarHeight);
			}
		} else {
			setAdditionalNavClasses("");
			props.setPaddingTop(0);
		}
	};

	useEffect(() => {
		makeNavbarSticky();
	}, [scrollY, topbarHeight]);

	// Search logic
	const handleSearch = useCallback((term) => {
		if (searchTimeout) clearTimeout(searchTimeout);
		if (!term.trim()) {
			setSearchResults([]);
			setIsSearchLoading(false);
			return;
		}
		setIsSearchLoading(true);
		const timeout = setTimeout(async () => {
			try {
				const response = await fetch(
					`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/products/search?keyword=${encodeURIComponent(term)}&_locale=${locale}`
				);
				const { data } = await response.json();
				setSearchResults(data);
			} catch (error) {
				setSearchResults([]);
			} finally {
				setIsSearchLoading(false);
			}
		}, 500);
		setSearchTimeout(timeout);
	}, [searchTimeout, locale]);

	useEffect(() => {
		return () => {
			if (searchTimeout) clearTimeout(searchTimeout);
		};
	}, [searchTimeout]);

	// highlight not only active dropdown item, but also its parent, i.e. dropdown toggle
	const highlightDropdownParent = () => {
		MENU.forEach((item) => {
			item?.dropdown?.forEach((dropdownLink) => {
				dropdownLink.link && dropdownLink.link === Router.route && setParentName(item.title);
				dropdownLink?.links?.forEach((link) => link.link === Router.route && setParentName(item.title));
			});
			item?.megamenu?.forEach((megamenuColumn) =>
				megamenuColumn.forEach((megamenuBlock) =>
					megamenuBlock.links.forEach((dropdownLink) => {
						if (dropdownLink.link === Router.route) {
							dropdownLink.parent
								? setParentName(dropdownLink.parent)
								: setParentName(item.title);
						}
					})
				)
			);
			item.link === Router.route && setParentName(item.title);
		});
	};

	useEffect(highlightDropdownParent, []);

	// Cart + logo + icônes à droite
	const CartOverviewWithLogo = () => {
		const logoStyle = shouldDisplayWhiteLogo || additionalNavClasses ? { filter: undefined } : { filter: 'brightness(0) invert(1)' };

		return (
			<>
				<Link href="/" passHref>
					<Image
						src="/svg/logo.svg"
						alt="Logo"
						style={logoStyle}
						className="h-6 w-auto transition-all duration-300"
						width={100}
						height={100}
					/>
				</Link>
				<div className="w-1/6 md:w-1/2 flex justify-end">
					<div className="w-full md:w-1/2 flex justify-evenly">
						<button
							className={`text-xl ${textColor}`}
							onClick={() => setSearchToggle(!searchToggle)}
							aria-label="Recherche"
						>
							<IoIosSearch />
						</button>
						{!isSmallScreen && (
							<Link
								className={`text-xl ${textColor}`}
								href={`https://${process.env.NEXT_PUBLIC_PUBLIC_STORE_DOMAIN}/account`}
							>
								<FaUserCircle />
							</Link>
						)}
						<CartDropdown textColorClassName={textColor} />
					</div>
				</div>
			</>
		);
	};

	const renderMenuItem = (item) => {
		const shouldShowItem = !props.loggedUser || (props.loggedUser && !item.hideToLoggedUser);
		if (!shouldShowItem) return null;
		const isDropdown = item.sousCategories || item.preoccupations;
		const baseLinkClass = `${textColor} px-3 py-2 font-semibold uppercase tracking-wider transition-colors duration-200 focus:outline-none`;
		if (isDropdown) {
			return (
				<div key={item.title} className="relative group">
					<button
						className={`${baseLinkClass} flex items-center gap-1 hover:text-primary-700`}
						onClick={() => toggleDropdown(item.title)}
						onMouseEnter={() => setDropdownOpen(prev => ({ ...prev, [item.title]: true }))}
						onMouseLeave={() => setDropdownOpen(prev => ({ ...prev, [item.title]: false }))}
						aria-haspopup="true"
						aria-expanded={dropdownOpen[item.title] || false}
						type="button"
					>
						{t(item.title.toUpperCase())}
						<IoIosArrowDown />
					</button>
					{/* Dropdown menu */}
					<div
						className={`absolute left-0 mt-2 w-max min-w-[320px] bg-white shadow-xl border border-gray-100 z-30 transition-all duration-200 origin-top scale-95 group-hover:scale-100 group-hover:opacity-100 ${dropdownOpen[item.title] ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
						onMouseEnter={() => setDropdownOpen(prev => ({ ...prev, [item.title]: true }))}
						onMouseLeave={() => setDropdownOpen(prev => ({ ...prev, [item.title]: false }))}
					>
						<div className="flex flex-col md:flex-row gap-5 p-5">
							{item.sousCategories && (
								<div>
									<div className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-500">{t('Sous-catégories')}</div>
									<ul className="flex flex-col gap-1">
										{item.sousCategories.map((cat) => (
											<li key={cat.title}>
												<Link
													className="block px-3 py-2 rounded text-base text-primary-700 hover:bg-black hover:text-white transition-colors duration-150"
													href={cat.url}
													onClick={onLinkClick}
												>
													{t(cat.title)}
												</Link>
											</li>
										))}
									</ul>
								</div>
							)}
							{item.preoccupations && (
								<div>
									<div className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-500">{t('Préoccupations')}</div>
									<ul className="flex flex-col gap-1">
										{item.preoccupations.map((cat) => (
											<li key={cat.title}>
												<Link
													className="block px-3 py-2 rounded text-base text-primary-700 hover:bg-black hover:text-white transition-colors duration-150"
													href={cat.url}
													onClick={onLinkClick}
												>
													{t(cat.title)}
												</Link>
											</li>
										))}
									</ul>
								</div>
							)}
						</div>
					</div>
				</div>
			);
		}
	};

	// Render menu item (dropdown or simple) - version mobile
	const renderMobileMenuItem = (item) => {
		const shouldShowItem = !props.loggedUser || (props.loggedUser && !item.hideToLoggedUser);
		if (!shouldShowItem) return null;
		const hasDropdown = item.sousCategories || item.preoccupations;

		return (
			<div key={item.title}>
				<button
					className={`w-full flex items-center justify-between py-3 text-base font-semibold tracking-wider focus:outline-none transition-colors duration-200 text-gray-900`}
					onClick={() => hasDropdown ? setMobileDropdownOpen(prev => ({ ...prev, [item.title]: !prev[item.title] })) : onLinkClick(item.url)}
					aria-expanded={!!mobileDropdownOpen[item.title]}
					type="button"
				>
					<span>{t(item.title.toUpperCase())}</span>
					{hasDropdown && (
						<svg className={`w-5 h-5 ml-2 transform transition-transform ${mobileDropdownOpen[item.title] ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
						</svg>
					)}
				</button>
				{hasDropdown && mobileDropdownOpen[item.title] && (
					<div className="pl-4 pb-2">
						{item.sousCategories && (
							<div>
								<div className="mb-2 text-xs uppercase tracking-widest text-gray-500">{t('Sous-catégories')}</div>
								<ul className="space-y-1">
									{item.sousCategories.map((cat) => (
										<li key={cat.title}>
											<Link
												className="block text-sm font-normal hover:text-primary-600 transition-colors duration-200"
												href={cat.url}
												onClick={() => onLinkClick(item.title)}
											>
												{t(cat.title)}
											</Link>
										</li>
									))}
								</ul>
							</div>
						)}
						{item.preoccupations && (
							<div className="mt-2">
								<div className="mb-2 text-xs uppercase tracking-widest text-gray-500">{t('Préoccupations')}</div>
								<ul className="space-y-1">
									{item.preoccupations.map((cat) => (
										<li key={cat.title}>
											<Link
												className="block text-sm font-normal hover:text-primary-600 transition-colors duration-200"
												href={cat.url}
												onClick={() => onLinkClick(item.title)}
											>
												{t(cat.title)}
											</Link>
										</li>
									))}
								</ul>
							</div>
						)}
					</div>
				)}
			</div>
		);
	};

	return (
		<header className={`container md:!max-w-none md:px-0 w-full ${props.headerClasses || ""} ${props.headerAbsolute ? "absolute top-0 left-0 w-full z-50" : ""}`}>
			{/* Topbar promo */}
			{!props.hideTopbar && (
				<div ref={topbarRef} className="w-full bg-primary-700 text-white text-center py-2 text-sm font-medium tracking-wide">
					{t('topbar_label')}
					{PROMO_CODE && <b className="ml-2">{PROMO_CODE}</b>}
				</div>
			)}
			{/* Navbar principale */}
			<nav
				ref={navbarRef}
				className={`px-2 lg:px-4 transition-all duration-300 ${additionalNavClasses}`}
			>
				<div className="flex items-center justify-between h-20">
					{/* Burger menu mobile */}
					<button
						className={`md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary-400 ${textColor}`}
						onClick={() => setCollapsed(!collapsed)}
						aria-label="Ouvrir le menu"
					>
						<FaBars className="text-2xl" />
					</button>
					{/* Menu principal desktop */}
					<div className="md:w-1/2 hidden md:flex items-center h-full">
						{MENU.map(renderMenuItem)}
					</div>
					{/* Logo + icônes */}
					{CartOverviewWithLogo()}
				</div>
				{/* Menu mobile (accordion) */}
				{collapsed && (
					<div className="md:hidden bg-white border-t border-gray-100 shadow-lg absolute left-0 w-full z-40 animate-fade-in" style={{ maxHeight: '80vh', top: '5rem', overflowY: 'auto' }}>
						<div className="flex flex-col gap-2 py-4 px-6">
							{MENU.map(renderMobileMenuItem)}
						</div>
					</div>
				)}
			</nav>
			{/* Barre de recherche */}
			<Searchbar
				searchToggle={searchToggle}
				setSearchToggle={setSearchToggle}
				searchResults={searchResults}
				onSearch={handleSearch}
				isLoading={isSearchLoading}
			/>
		</header>
	);
};

export default Header;