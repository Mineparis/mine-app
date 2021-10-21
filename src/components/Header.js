import React, { useState, useEffect, useRef } from "react";

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

import UseWindowSize from "../hooks/UseWindowSize";
import useScrollPosition from "@react-hook/window-scroll";
import useSize from "@react-hook/size";

import Logo from "../../public/svg/logo.svg";

import ActiveLink from "./ActiveLink";

const Header = ({ menu, ...props }) => {
	const { t } = useTranslation('common');
	const [collapsed, setCollapsed] = useState(false);
	const [dropdownOpen, setDropdownOpen] = useState({});
	const [parentName, setParentName] = useState(false);
	const [additionalNavClasses, setAdditionalNavClasses] = useState("");

	const size = UseWindowSize();
	const scrollY = useScrollPosition();

	const navbarRef = useRef(null);
	const topbarRef = useRef(null);
	const [topbarWidth, topbarHeight] = useSize(topbarRef);
	const [navbarWidth, navbarHeight] = useSize(navbarRef);

	const isSmallScreen = size.width < 991;
	const hasDropdown = Object.values(dropdownOpen).some((dropdown) => dropdown);

	const toggleDropdown = (name) => {
		setDropdownOpen({ ...dropdownOpen, [name]: !dropdownOpen[name] });
	};

	const onLinkClick = (parent) => {
		if (isSmallScreen) setCollapsed(!collapsed);
		setParentName(parent);
	};

	const makeNavbarSticky = () => {
		if (props.nav.sticky) {
			if (scrollY > topbarHeight) {
				setAdditionalNavClasses("fixed-top");
				if (navbarHeight > 0 && !props.headerAbsolute) {
					props.setPaddingTop(navbarHeight);
				}
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

	const CartOverviewWithLogo = ({ shouldDisplay }) => {
		if (!shouldDisplay) return null;

		return (
			<>
				<Link className="mx-auto" href="/" passHref>
					<a className="py-1 navbar-brand col-2">
						<Logo />
					</a>
				</Link>
				<div className="d-flex justify-content-end col-1">
					<div className="navbar-icon-link snipcart-checkout">
						<i className="bi bi-cart" />
						<div className="navbar-icon-link-badge snipcart-items-count">0</div>
					</div>
				</div>
			</>
		);
	};

	return (
		<header
			className={`header ${props.headerClasses ? props.headerClasses : ""} ${props.headerAbsolute ? "header-absolute" : ""
				}`}
		>
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
																<Image layout="fill" src={item.image} alt="" className="bg-image" />
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
							<CartOverviewWithLogo shouldDisplay={!isSmallScreen} />
						</Collapse>
						<CartOverviewWithLogo shouldDisplay={isSmallScreen && !collapsed} />
					</Container>
				</Navbar>
			</div>
		</header>
	);
};

export default Header;
