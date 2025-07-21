import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import useScrollPosition from "@react-hook/window-scroll";
import useSize from "@react-hook/size";
import { MagnifyingGlassIcon, UserIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

import { MENU } from "@data/menu";
import { useIsMobile } from "@hooks/useIsMobile";
import { useSearchbar } from "@hooks/useSearchbar";

import Searchbar from "./Searchbar";
import CartDropdown from "./CartDropdown";
import DesktopMenu from "./Header/DesktopMenu";
import MobileMenu from "./Header/MobileMenu";

const PROMO_CODE = '';
const MOBILE_BREAKPOINT = 500;

const Header = (props) => {
  const { shouldDisplayWhiteLogo, headerAbsolute, hideTopbar, setPaddingTop } = props;
	const { t } = useTranslation('common');

	const [collapsed, setCollapsed] = useState(false);
	const [dropdownOpen, setDropdownOpen] = useState({});
	const [dropdownTimeouts, setDropdownTimeouts] = useState({});
	const [searchToggle, setSearchToggle] = useState(false);
	const [additionalNavClasses, setAdditionalNavClasses] = useState("");
	const {
		searchTerm,
		setSearchTerm,
		searchResults,
		isSearchLoading
	} = useSearchbar(searchToggle);
	const [mobileDropdownOpen, setMobileDropdownOpen] = useState({});

	const isSmallScreen = useIsMobile(MOBILE_BREAKPOINT);
	const scrollY = useScrollPosition();
	const navbarRef = useRef(null);
	const topbarRef = useRef(null);
	const [, topbarHeight] = useSize(topbarRef);
	const [, navbarHeight] = useSize(navbarRef);
	const textColor = shouldDisplayWhiteLogo || additionalNavClasses ? 'text-primary-700' : 'text-white';

	const toggleDropdown = useCallback((name) => {
		setDropdownOpen(prev => ({ ...prev, [name]: !prev[name] }));
	}, []);

	const closeAllMenus = useCallback(() => {
		setDropdownOpen({});
		setMobileDropdownOpen({});
		// Clear all dropdown timeouts
		Object.values(dropdownTimeouts).forEach(timeout => {
			if (timeout) clearTimeout(timeout);
		});
		setDropdownTimeouts({});
		if (isSmallScreen) setCollapsed(false);
	}, [isSmallScreen, dropdownTimeouts]);

	const handleMobileToggle = useCallback(() => {
		setCollapsed(prev => !prev);
	}, []);

	const handleSearchToggle = useCallback(() => {
		setSearchToggle(prev => !prev);
	}, []);

const makeNavbarSticky = useCallback(() => {
	const shouldBeSticky = scrollY > topbarHeight;
	const newClasses = shouldBeSticky
		? "fixed top-0 left-0 w-full z-50 shadow-lg bg-white"
		: "";

	setAdditionalNavClasses(newClasses);

	if (shouldBeSticky && navbarHeight > 0 && !headerAbsolute) {
		setPaddingTop?.(navbarHeight);
	} else {
		setPaddingTop?.(0);
	}
}, [scrollY, topbarHeight, navbarHeight, additionalNavClasses, headerAbsolute, setPaddingTop]);

	useEffect(() => {
		makeNavbarSticky();
	}, [makeNavbarSticky]);

	// Accessibility focus management
	useEffect(() => {
		const handleKeyDown = (e) => {
			if (e.key === 'Escape') {
				setDropdownOpen({});
				setMobileDropdownOpen({});
				setSearchToggle(false);
				if (collapsed) setCollapsed(false);
			}
		};

		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [collapsed]);

	// Close menus when clicking outside
	useEffect(() => {
		const handleClickOutside = (e) => {
			if (navbarRef.current && !navbarRef.current.contains(e.target)) {
				setDropdownOpen({});
				setMobileDropdownOpen({});
				if (collapsed) setCollapsed(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [collapsed]);

	const handleDropdownEnter = useCallback((itemTitle) => {
		// Clear any existing timeout for this dropdown
		if (dropdownTimeouts[itemTitle]) {
			clearTimeout(dropdownTimeouts[itemTitle]);
			setDropdownTimeouts(prev => ({ ...prev, [itemTitle]: null }));
		}

		// Close all other dropdowns and clear their timeouts
		setDropdownOpen(prev => {
			const newState = {};
			Object.keys(prev).forEach(key => {
				if (key !== itemTitle) {
					newState[key] = false;
					// Clear timeout for closing dropdown
					if (dropdownTimeouts[key]) {
						clearTimeout(dropdownTimeouts[key]);
					}
				}
			});
			newState[itemTitle] = true;
			return newState;
		});

		// Clear timeouts for all other dropdowns
		setDropdownTimeouts(prev => {
			const newTimeouts = {};
			Object.keys(prev).forEach(key => {
				if (key !== itemTitle && prev[key]) {
					clearTimeout(prev[key]);
				}
			});
			return newTimeouts;
		});
	}, [dropdownTimeouts]);

	const handleDropdownLeave = useCallback((itemTitle) => {
		// Add a small delay to prevent dropdown from closing when moving between trigger and dropdown
		const timeoutId = setTimeout(() => {
			setDropdownOpen(prev => ({ ...prev, [itemTitle]: false }));
		}, 150);

		setDropdownTimeouts(prev => ({ ...prev, [itemTitle]: timeoutId }));
	}, []);


	return (
		<header
			className={`w-full ${props.headerClasses || ""} ${headerAbsolute ? "absolute top-0 left-0 w-full z-50" : ""}`}
			itemScope
			itemType="https://schema.org/SiteNavigationElement"
		>
			{/* Skip to main content */}
			<a
				href="#main-content"
				className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:bg-primary-700 focus:text-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium outline-none"
			>
				{t('skip_to_main_content')}
			</a>

			{/* Topbar promo */}
			{!hideTopbar && (
				<div ref={topbarRef} className="w-full bg-primary-700 text-white text-center py-2 text-sm font-medium tracking-wide">
					{t('topbar_label')}
					{PROMO_CODE && <strong className="ml-2">{PROMO_CODE}</strong>}
				</div>
			)}

			{/* Main navigation bar */}
			<nav
				ref={navbarRef}
				className={`px-4 lg:px-4 transition-all duration-300 ${additionalNavClasses}`}
				role="navigation"
				aria-label={t('main_navigation')}
				itemScope
				itemType="https://schema.org/SiteNavigationElement"
			>
				<div className="flex items-center h-20 min-w-0">
					{/* Mobile burger menu */}
					<button
						className={`md:hidden p-2 rounded outline-none ${textColor} flex-shrink-0`}
						onClick={handleMobileToggle}
						aria-label={collapsed ? t('close_menu') : t('open_menu')}
						aria-expanded={collapsed}
						aria-controls="mobile-menu"
					>
						{collapsed ? (
							<XMarkIcon className="w-6 h-6" />
						) : (
							<Bars3Icon className="w-6 h-6" />
						)}
					</button>

					{/* Desktop layout: 3 balanced columns */}
					<div className="hidden md:flex w-full items-center">
						{/* Main desktop menu - left column */}
						<DesktopMenu
							MENU={MENU}
							t={t}
							textColor={textColor}
							dropdownOpen={dropdownOpen}
							toggleDropdown={toggleDropdown}
							handleDropdownEnter={handleDropdownEnter}
							handleDropdownLeave={handleDropdownLeave}
							closeAllMenus={closeAllMenus}
						/>

						{/* Centered logo - middle column */}
						<div className="flex-1 flex justify-center">
							<Link
								href="/"
								className="outline-none rounded"
								itemProp="url"
								aria-label={t('home')}
							>
								<Image
									src="/svg/logo.svg"
									alt={t('logo_alt')}
									style={shouldDisplayWhiteLogo || additionalNavClasses ? { filter: undefined } : { filter: 'brightness(0) invert(1)' }}
									className="h-6 w-auto transition-all duration-300"
									width={100}
									height={100}
									priority
									itemProp="logo"
								/>
							</Link>
						</div>

						{/* Right icons - right column */}
						<div className="flex-1 flex justify-end">
							<div className="flex items-center gap-4 flex-shrink-0">
								<button
									className={`text-xl ${textColor} flex-shrink-0 outline-none rounded`}
									onClick={handleSearchToggle}
									aria-label={t('search')}
									aria-expanded={searchToggle}
									type="button"
								>
									<MagnifyingGlassIcon className="w-6 h-6" />
								</button>

								<Link
									className={`text-xl ${textColor} flex-shrink-0 outline-none rounded`}
									href={`https://${process.env.NEXT_PUBLIC_PUBLIC_STORE_DOMAIN}/account`}
									aria-label={t('account')}
									itemProp="url"
								>
									<UserIcon className="w-6 h-6" />
								</Link>

								<div className="flex-shrink-0">
									<CartDropdown textColorClassName={textColor} />
								</div>
							</div>
						</div>
					</div>

					{/* Layout mobile: logo centré, icônes à droite */}
					<div className="md:hidden flex-1 flex justify-center">
						<Link
							href="/"
							className="outline-none rounded"
							itemProp="url"
							aria-label={t('home')}
						>
							<Image
								src="/svg/logo.svg"
								alt={t('logo_alt')}
								style={shouldDisplayWhiteLogo || additionalNavClasses ? { filter: undefined } : { filter: 'brightness(0) invert(1)' }}
								className="h-6 w-auto transition-all duration-300"
								width={100}
								height={100}
								priority
								itemProp="logo"
							/>
						</Link>
					</div>

					<div className="md:hidden flex items-center gap-3 flex-shrink-0">
						<button
							className={`text-xl ${textColor} flex-shrink-0 outline-none rounded`}
							onClick={handleSearchToggle}
							aria-label={t('search')}
							aria-expanded={searchToggle}
							type="button"
						>
							<MagnifyingGlassIcon className="w-6 h-6" />
						</button>

						<div className="flex-shrink-0">
							<CartDropdown textColorClassName={textColor} />
						</div>
					</div>
				</div>

				{/* Mobile menu (accordion) */}
				{collapsed && (
					<div
						id="mobile-menu"
						className="md:hidden bg-white border-t border-gray-100 shadow-lg absolute left-0 w-full z-40 animate-fade-in"
						style={{ maxHeight: '80vh', top: '5rem', overflowY: 'auto' }}
						role="menu"
						aria-label={t('mobile_menu')}
						itemScope
						itemType="https://schema.org/SiteNavigationElement"
					>
						<MobileMenu
							MENU={MENU}
							t={t}
							mobileDropdownOpen={mobileDropdownOpen}
							setMobileDropdownOpen={setMobileDropdownOpen}
							closeAllMenus={closeAllMenus}
						/>
					</div>
				)}
			</nav>

			<Searchbar
				searchToggle={searchToggle}
				setSearchToggle={setSearchToggle}
				searchTerm={searchTerm}
				setSearchTerm={setSearchTerm}
				searchResults={searchResults}
				isLoading={isSearchLoading}
			/>
		</header>
	);
};

export default Header;