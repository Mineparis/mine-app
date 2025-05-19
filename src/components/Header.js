import React, { useState, useEffect, useRef, useCallback } from "react";

import Link from "next/link";
import Router from "next/router";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import {
	Collapse,
	Navbar,
	NavbarToggler,
	Nav,
	NavItem,
	NavLink,
	Dropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
	Container,
	Row,
	Col,
	Badge,
} from "reactstrap";

import useScrollPosition from "@react-hook/window-scroll";
import useSize from "@react-hook/size";

import UseWindowSize from "@hooks/UseWindowSize";
import ActiveLink from "./ActiveLink";
import Searchbar from "./Searchbar";

const PROMO_CODE = 'MAMAN30';

const Header = ({ menu, shouldDisplayWhiteLogo, locale, ...props }) => {
	const { t } = useTranslation('common');
	const [collapsed, setCollapsed] = useState(false);
	const [dropdownOpen, setDropdownOpen] = useState({});
	const [searchToggle, setSearchToggle] = useState(false);
	const [parentName, setParentName] = useState(false);
	const [additionalNavClasses, setAdditionalNavClasses] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	const [searchTimeout, setSearchTimeout] = useState(null);
	const [isSearchLoading, setIsSearchLoading] = useState(false);

	const size = UseWindowSize();
	const scrollY = useScrollPosition();
	const [itemsCount, setItemsCount] = useState(0);

	const navbarRef = useRef(null);
	const topbarRef = useRef(null);
	const [, topbarHeight] = useSize(topbarRef);
	const [, navbarHeight] = useSize(navbarRef);

	const Snip = typeof window !== 'undefined' && window?.Snipcart;
	const isSmallScreen = size.width < 500;
	const hasDropdown = Object.values(dropdownOpen).some((dropdown) => dropdown);

	const toggleDropdown = (name) => {
		setDropdownOpen({ ...dropdownOpen, [name]: !dropdownOpen[name] });
	};

	const onLinkClick = (parent) => {
		if (isSmallScreen) setCollapsed(!collapsed);
		if (parent) setParentName(parent);
	};

	const makeNavbarSticky = () => {
		if (!props.nav.sticky) {
			if (additionalNavClasses) {
				setAdditionalNavClasses("");
				props.setPaddingTop(0);
			}
			return;
		}

		if (scrollY > topbarHeight) {
			setAdditionalNavClasses("fixed-top");
			if (navbarHeight > 0 && !props.headerAbsolute) {
				props.setPaddingTop(navbarHeight);
			}
		} else {
			setAdditionalNavClasses("");
			props.setPaddingTop(0);
		}
	};

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
				throw new Error('Search error:', error);
			} finally {
				setIsSearchLoading(false);
			}
		}, 500);

		setSearchTimeout(timeout);
	}, [searchTimeout]);

	// highlight not only active dropdown item, but also its parent, i.e. dropdown toggle
	const highlightDropdownParent = () => {
		menu.forEach((item) => {
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

	const CartOverviewWithLogo = () => {
		if (collapsed) return null;
		const colSizeSnipcart = isSmallScreen ? 'col-1' : 'col-3';
		const logoStyle = { filter: additionalNavClasses || shouldDisplayWhiteLogo ? undefined : 'invert(1)' };

		return (
			<>
				<Link className="mx-auto" href="/" passHref>

					<img src="/svg/logo.svg" alt="" style={logoStyle} />

				</Link>
				<div className={`d-flex justify-content-end snipcart-summary ${colSizeSnipcart}`} >
					<div
						className="navbar-icon-link"
						data-toggle="search"
						onClick={() => setSearchToggle(!searchToggle)}
					>
						<i className="bi bi-search" />
					</div>
					{!isSmallScreen && (
						<div className="navbar-icon-link snipcart-customer-signin">
							<i className="bi bi-person-circle" />
						</div>
					)}
					<div className="navbar-icon-link snipcart-checkout">
						<i className="bi bi-cart" />
						<div className="navbar-icon-link-badge snipcart-items-count">{itemsCount}</div>
					</div>
				</div>
			</>
		);
	};

	useEffect(() => {
		return () => {
			if (searchTimeout) clearTimeout(searchTimeout);
		};
	}, [searchTimeout]);

	useEffect(() => {
		makeNavbarSticky();
	}, [scrollY, topbarHeight]);

	useEffect(highlightDropdownParent, []);

	useEffect(() => {
		if (!Snip) return;
		const initialState = Snip.store.getState();
		setItemsCount(initialState.cart.items.count);

		const unsubscribe = Snip.store.subscribe(() => {
			const newState = Snip.store.getState();
			setItemsCount(newState.cart.items.count);
		});

		return () => unsubscribe();
	}, [Snip]);

	return (
		<header
			className={`header ${props.headerClasses ? props.headerClasses : ""} ${props.headerAbsolute ? "header-absolute" : ""
				}`}
		>
			{!props.hideTopbar && (
				<div className="top-bar" ref={topbarRef}>
					<Container fluid>
						<Row className="d-flex justify-content-center">
							{t('topbar_label')}
							<b className="ml-1">{PROMO_CODE}</b>
						</Row>
					</Container>
				</div>
			)}
			<div ref={navbarRef} className="d-flex flex-column justify-content-space-between">
				<Navbar
					color={
						props.nav.color
							? hasDropdown || collapsed
								? "white"
								: props.nav.color
							: "white"
					}
					light={props.nav.light || hasDropdown || collapsed}
					dark={props.nav.dark && !hasDropdown && !collapsed}
					fixed={props.nav.fixed ? props.nav.fixed : ""}
					expand="lg"
					className={`${props.nav.classes ? props.nav.classes : "navbar-sticky bg-fixed-white"} ${additionalNavClasses || ""}`}
				>
					<Container fluid>
						<NavbarToggler
							onClick={() => setCollapsed(!collapsed)}
							className="navbar-toggler-right"
						>
							<i className="fa fa-bars" />
						</NavbarToggler>
						{/* Navbar Collapse */}
						<Collapse isOpen={collapsed} navbar>
							<Nav navbar>
								{menu?.map((item) =>
									item.dropdown || item.megamenu ? (
										// show entire menu to unlogged user or hide items that have hideToLoggedUser set to true
										(!props.loggedUser ||
											(props.loggedUser && !item.hideToLoggedUser) ? (<Dropdown
												nav
												inNavbar
												key={item.title}
												className={
													item.position ? `position-${item.position}` : ``
												}
												isOpen={dropdownOpen[item.title]}
												toggle={() => toggleDropdown(item.title)}
											>
												<DropdownToggle
													nav
													caret
													className={
														parentName === item.title ? "active" : ""
													}
												>
													{t(item.title)}
												</DropdownToggle>
												<DropdownMenu
													className={` ${item.megamenu ? "megamenu py-lg-0" : ""
														}`}
												>
													{item?.dropdown?.map((dropdownItem) =>
														dropdownItem.links ? (
															<React.Fragment key={dropdownItem.title}>
																{dropdownItem.divider && (
																	<DropdownItem divider />
																)}
																<h6 className="dropdown-header font-weight-normal">
																	{t(dropdownItem.title)}
																</h6>
																{dropdownItem.links.map((link) => (
																	<ActiveLink
																		key={link.title}
																		activeClassName="active"
																		href={link.link}
																	>
																		<DropdownItem onClick={() => onLinkClick(item.title)}>
																			{t(link.title)}
																			{link.new && (
																				<Badge color="warning" className="ml-1 mt-n1">
																					{t('new')}
																				</Badge>
																			)}
																		</DropdownItem>
																	</ActiveLink>
																))}
															</React.Fragment>
														) : (
															<ActiveLink
																key={dropdownItem.title}
																activeClassName="active"
																href={dropdownItem.link}
																passHref
															>
																<DropdownItem onClick={() => onLinkClick(item.title)}>
																	{t(dropdownItem.title)}
																	{dropdownItem.new && (
																		<Badge color="warning" className="ml-1 mt-n1">
																			{t('new')}
																		</Badge>
																	)}
																</DropdownItem>
															</ActiveLink>
														)
													)}
													<Row>
														<Col lg="9" md="4">
															<Row className="pr-lg-0 pl-lg-5 pt-lg-5">
																{item?.megamenu?.map((megamenuItem, index) => (
																	<Col key={index} lg="3">
																		{megamenuItem?.map(({ title, links, categoryTypeLink }, index) => (
																			<React.Fragment key={index}>
																				<h6 className="text-uppercase">
																					<Link href={categoryTypeLink.link} onClick={() => onLinkClick()}>

																						{t(title)}

																					</Link>
																				</h6>
																				<ul className="megamenu-list list-unstyled">
																					{links.map((link, index) => (
																						<li key={index} className="megamenu-list-item">
																							<ActiveLink
																								activeClassName="active"
																								href={link.link}
																								as={link.as}
																								passHref
																							>
																								<DropdownItem
																									className="megamenu-list-link"
																									onClick={() =>
																										link.parent
																											? onLinkClick(link.parent)
																											: onLinkClick(item.title)
																									}
																								>
																									{t(link.title)}
																									{link.new && (
																										<Badge color="warning" className="ml-1 mt-n1">
																											{t('new')}
																										</Badge>
																									)}
																								</DropdownItem>
																							</ActiveLink>
																						</li>
																					)
																					)}
																				</ul>
																			</React.Fragment>
																		))}
																	</Col>
																)
																)}
															</Row>
														</Col>
														{item.image && (
															<Col lg="3" className="d-none d-lg-block">
																<Image layout="fill" src={item.image} alt="" className="bg-image" />
															</Col>
														)}
													</Row>
												</DropdownMenu>
											</Dropdown>) : (""))
									) : (props.loggedUser && !item.hideToLoggedUser) ||
										!props.loggedUser ? (
										<NavItem
											key={item.title}
											className={
												item.button
													? "mt-3 mt-lg-0 ml-lg-3 d-lg-none d-xl-inline-block"
													: ""
											}
										>
											{item.button ? (
												item.showToLoggedUser && (
													<ActiveLink activeClassName="active" href={item.link}>
														<a className="btn btn-primary" onClick={() => onLinkClick(item.title)}>
															{t(item.title)}
														</a>
													</ActiveLink>
												)
											) : (
												<ActiveLink
													activeClassName="active"
													href={item.link}
													passHref
												>
													<NavLink onClick={() => onLinkClick(item.title)}>
														{t(item.title)}
													</NavLink>
												</ActiveLink>
											)}
										</NavItem>
									) : (
										""
									)
								)}
							</Nav>
						</Collapse>
						<CartOverviewWithLogo />
					</Container>
				</Navbar>
			</div>

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
