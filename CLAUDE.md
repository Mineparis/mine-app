# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Static export
npm run export
```

## Architecture Overview

This is a **Next.js e-commerce application** for Mine Paris, a beauty brand, built with:

- **Framework**: Next.js 15 with React 18
- **Styling**: Tailwind CSS 4 (migrated from Bootstrap/SCSS)
- **E-commerce**: Shopify Storefront API integration via @shopify/hydrogen-react
- **Internationalization**: next-i18next (French as default locale)
- **Analytics**: Google Analytics 4, Sentry error tracking
- **State Management**: React Context (CartDropdownContext)

### Key Architecture Patterns

**Directory Structure**:
- `/src/components/` - Reusable UI components + page-specific components
- `/src/pages/` - Next.js file-based routing with dynamic routes
- `/src/lib/shopify/` - Shopify API integration layer
- `/src/contexts/` - React context providers
- `/src/hooks/` - Custom React hooks
- `/src/data/` - Static data files (menu, content)
- `/src/utils/` - Utility functions

**Path Aliases**: The project uses webpack aliases configured in both `next.config.js` and `jsconfig.json`:
- `@components/*` → `./src/components/*`
- `@hooks/*` → `./src/hooks/*`
- `@contexts/*` → `./src/contexts/*`
- `@utils/*` → `./src/utils/*`
- `@lib/*` → `./src/lib/*`
- `@data/*` → `./src/data/*`
- `@styles/*` → `./src/styles/*`

**Shopify Integration**:
- Uses Shopify Storefront API 2025-04
- GraphQL queries organized in `/src/lib/shopify/requests/`
- Product data managed through Hydrogen React components
- Cart functionality via ShopifyProvider and CartProvider

**Routing Strategy**:
- Dynamic category pages: `[category].jsx`, `[category]/[subCategory].jsx`
- Product pages: `/products/[productSlug].jsx`
- Brand pages: `/brands/[brandSlug].jsx`
- Magazine/blog: `/magazine/[slug].jsx`

**Styling Migration**:
- Recently migrated from Bootstrap/SCSS to Tailwind CSS
- Custom color scheme defined in `/src/styles/globals.css` (primary: #191919, secondary: #fff)
- Legacy SCSS files have been removed

**Layout System**:
- Single Layout component wraps all pages
- Conditional header styling based on page type (white pages vs. others)
- Cookie consent integration with Google Analytics

## Environment Configuration

Required environment variables:
- `NEXT_PUBLIC_PUBLIC_STORE_DOMAIN` - Shopify store domain
- `NEXT_PUBLIC_PUBLIC_STOREFRONT_API_TOKEN` - Shopify Storefront API token
- `PRIVATE_STOREFRONT_API_TOKEN` - Private Shopify API token
- `NEXT_PUBLIC_GOOGLE_ANALYTICS` - GA tracking ID
- `NEXT_PUBLIC_GOOGLE_ANALYTICS_GA4` - GA4 tracking ID
- `NEXT_PUBLIC_GOOGLE_ADS` - Google Ads tracking ID

## Development Notes

- **TypeScript**: Project uses JSConfig for type checking, not full TypeScript
- **Images**: Configured for WebP format, supports Cloudinary and Shopify CDN
- **i18n**: French-first localization with fallback support
- **Build Mode**: Configured for server-side rendering (can switch to static export)
- **Git Branch**: Currently on `refacto-urls-and-ui` branch for UI/URL refactoring

When working with this codebase:
1. Use the established path aliases for imports
2. Follow the existing component structure in `/src/components/`
3. Maintain Shopify API patterns for e-commerce functionality
4. Use Tailwind classes for styling (avoid custom CSS unless necessary)
5. Respect the French-first internationalization approach