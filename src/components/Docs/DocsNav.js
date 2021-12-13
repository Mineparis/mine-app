import React from 'react'

import {
    Nav,
    NavLink
} from 'reactstrap'

import ActiveLink from '../ActiveLink'

const DocsNav = () => {
    return (
        <div style={{ top: "40px", zIndex: '1' }} className="sticky-top mb-5">
            <div className="sidebar-block">
                <h6 className="sidebar-heading">Documentation</h6>
                <Nav tag="nav" pills className="flex-column">
                    <ActiveLink activeClassName="active" href="/docs/introduction" passHref>
                        <NavLink className="mb-2">Introduction</NavLink>
                    </ActiveLink>
                    <ActiveLink activeClassName="active" href="/docs/directory-structure" passHref>
                        <NavLink className="mb-2">Directory structure</NavLink>
                    </ActiveLink>
                    <ActiveLink activeClassName="active" href="/docs/next" passHref>
                        <NavLink className="mb-2">Next.js</NavLink>
                    </ActiveLink>
                    <ActiveLink activeClassName="active" href="/docs/customizing-css" passHref>
                        <NavLink className="mb-2">Customizing CSS</NavLink>
                    </ActiveLink>
                    <ActiveLink activeClassName="active" href="/docs/demo-data" passHref>
                        <NavLink className="mb-2">Demo data</NavLink>
                    </ActiveLink>
                    <ActiveLink activeClassName="active" href="/docs/credits" passHref>
                        <NavLink className="mb-2">Credits</NavLink>
                    </ActiveLink>
                    <ActiveLink activeClassName="active" href="/docs/changelog" passHref>
                        <NavLink className="mb-2">Changelog</NavLink>
                    </ActiveLink>
                </Nav>
            </div>
            <div className="sidebar-block">
                <h6 className="sidebar-heading">Components</h6>
                <Nav tag="nav" pills className="flex-column">
                    <ActiveLink activeClassName="active" href="/docs/components-bootstrap" passHref>
                        <NavLink className="mb-2">Bootstrap</NavLink>
                    </ActiveLink>
                    <ActiveLink activeClassName="active" href="/docs/components-theme" passHref>
                        <NavLink className="mb-2">Theme</NavLink>
                    </ActiveLink>
                </Nav>
            </div>
        </div>
    )
};

export default DocsNav;