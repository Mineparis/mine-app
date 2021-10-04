import React, { useState, useEffect, useRef } from "react";

import Link from "next/link";
import Router from "next/router";
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

import UseWindowSize from "../hooks/UseWindowSize";
import useScrollPosition from "@react-hook/window-scroll";
import useSize from "@react-hook/size";

import Logo from "../../public/svg/logo.svg";

import ActiveLink from "./ActiveLink";

import userMenu from "../data/user-menu.json";

import "bootstrap-icons/font/bootstrap-icons.css";

const Header = ({ menu, ...props }) => {
	const { t } = useTranslation('common');
	const [collapsed, setCollapsed] = useState(false);
	const [dropdownOpen, setDropdownOpen] = useState({});
	const [searchToggle, setSearchToggle] = useState(false);
	const [parentName, setParentName] = useState(false);
	const [additionalNavClasses, setAdditionalNavClasses] = useState("");

	const size = UseWindowSize();
	const scrollY = useScrollPosition();

	const navbarRef = useRef(null);
	const topbarRef = useRef(null);
	const [topbarWidth, topbarHeight] = useSize(topbarRef);
	const [navbarWidth, navbarHeight] = useSize(navbarRef);

	const hasDropdown = Object.values(dropdownOpen).some((dropdown) => dropdown);

	const toggleDropdown = (name) => {
		setDropdownOpen({ ...dropdownOpen, [name]: !dropdownOpen[name] });
	};

	const onLinkClick = (parent) => {
		size.width < 991 && setCollapsed(!collapsed);
		setParentName(parent);
	};

	const makeNavbarSticky = () => {
		if (props.nav.sticky !== false) {
			if (scrollY > topbarHeight) {
				setAdditionalNavClasses("fixed-top");
				navbarHeight > 0 &&
					props.headerAbsolute !== true &&
					props.setPaddingTop(navbarHeight);
			} else {
				setAdditionalNavClasses("");
				props.setPaddingTop(0);
			}
		} else {
			setAdditionalNavClasses("");
			props.setPaddingTop(0);
		}
	};

	useEffect(() => {
		makeNavbarSticky();
	}, [scrollY, topbarHeight]);

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

	useEffect(highlightDropdownParent, []);

	return (
		<header
			className={`header ${props.headerClasses ? props.headerClasses : ""} ${props.headerAbsolute ? "header-absolute" : ""
				}`}
		>
			{/* Navbar*/}
			<div ref={navbarRef}>
				<Navbar
					color={
						props.nav.color
							? hasDropdown ||
								collapsed
								? "white"
								: props.nav.color
							: "white"
					}
					light={
						props.nav.light ||
						hasDropdown ||
						collapsed
					}
					dark={
						props.nav.dark &&
						!hasDropdown &&
						!collapsed
					}
					fixed={props.nav.fixed ? props.nav.fixed : ""}
					expand="lg"
					className={` ${props.nav.classes
						? props.nav.classes
						: "navbar-sticky bg-fixed-white"
						} ${additionalNavClasses ? additionalNavClasses : ""}`}
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
										!props.loggedUser ||
											(props.loggedUser && !item.hideToLoggedUser) ? (
											<Dropdown
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
																		{megamenuItem?.map(({ title, links }, index) => (
																			<React.Fragment key={index}>
																				<h6 className="text-uppercase">
																					{t(title)}
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
																<img src={item.image} alt="" className="bg-image" />
															</Col>
														)}
													</Row>
												</DropdownMenu>
											</Dropdown>
										) : (
											""
										)
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

							{/* Navbar Header  */}
							<Link className="mx-auto" href="/" passHref>
								<a className="py-1 navbar-brand">
									<Logo />
								</a>
							</Link>

							<div className="d-flex align-items-center justify-content-between justify-content-lg-end mt-1 mb-2 my-lg-0 col-4">
								{/* Cart Overview */}
								<div className="navbar-icon-link snipcart-checkout">
									<i className="bi bi-cart" />
									<div className="navbar-icon-link-badge snipcart-items-count">0</div>
								</div>
							</div>
						</Collapse>
					</Container>
				</Navbar>
			</div>
			{/* /Navbar */}
			{/* Fullscreen search area*/}
			{searchToggle && (
				<div className="search-area-wrapper" style={{ display: "block" }}>
					<div className="search-area d-flex align-items-center justify-content-center">
						<div
							className="close-btn"
							onClick={() => setSearchToggle(!searchToggle)}
						>
							<i className="bi bi-search" />
						</div>
						<form className="search-area-form" action="#">
							<div className="form-group position-relative">
								<input
									className="search-area-input"
									type="search"
									name="search"
									id="search"
									autoFocus
									placeholder="What are you looking for?"
								/>
								<button className="search-area-button" type="submit">
									<i className="bi bi-search" />
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
			{/* /Fullscreen search area*/}
		</header>
	);
};

export default Header;
