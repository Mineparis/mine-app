import React from "react";
import Link from "next/link";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

export default function MobileMenu({ MENU, t, mobileDropdownOpen, setMobileDropdownOpen, closeAllMenus, loggedUser }) {
  return (
    <div className="flex flex-col gap-2 py-4 px-6">
      {MENU.map((item) => {
        const shouldShowItem = !loggedUser || !item.hideToLoggedUser;
        if (!shouldShowItem) return null;
        const hasDropdown = item.subCategories || item.preoccupations;
        const isExpanded = mobileDropdownOpen[item.title];
        const itemId = `mobile-${item.title.replace(/\s+/g, '-').toLowerCase()}`;
        const handleMobileDropdownToggle = () => {
          setMobileDropdownOpen((prev) => ({ ...prev, [item.title]: !prev[item.title] }));
        };
        return (
          <div key={item.title}>
            {hasDropdown ? (
              <button
                id={`${itemId}-trigger`}
                className="w-full flex items-center justify-between py-3 text-xs font-semibold tracking-wider outline-none transition-colors duration-200 text-gray-900 hover:text-primary-700"
                onClick={handleMobileDropdownToggle}
                aria-expanded={isExpanded}
                aria-controls={isExpanded ? `${itemId}-content` : undefined}
                type="button"
              >
                <span itemProp="name">{t(item.title.toUpperCase())}</span>
                <ChevronDownIcon className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </button>
            ) : (
              <Link
                href={item.url}
                className="w-full flex items-center justify-between py-3 text-xs font-semibold tracking-wider outline-none transition-colors duration-200 text-gray-900 hover:text-primary-700"
                onClick={closeAllMenus}
                itemProp="url"
              >
                <span itemProp="name">{t(item.title.toUpperCase())}</span>
              </Link>
            )}
            {hasDropdown && isExpanded && (
              <div
                id={`${itemId}-content`}
                className="pl-4 pb-2"
                role="region"
                aria-labelledby={`${itemId}-trigger`}
              >
                {item.subCategories && (
                  <div>
                    <div className="mb-2 text-xs uppercase tracking-widest text-gray-500">
                      {t('sub_categories')}
                    </div>
                    <ul className="space-y-1">
                      {item.subCategories.map((cat) => {
                        const catUrl = `/${item.title}/${cat.slug}`;
                        return (
                          <li key={cat.title}>
                            <Link
                              className="block text-sm font-normal hover:text-primary-600 transition-colors duration-200 outline-none py-1"
                              href={catUrl}
                              onClick={closeAllMenus}
                              itemProp="url"
                            >
                              <span itemProp="name">{t(cat.title)}</span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
                {item.preoccupations && (
                  <div className="mt-2">
                    <div className="mb-2 text-xs uppercase tracking-widest text-gray-500">
                      {t('concerns')}
                    </div>
                    <ul className="space-y-1">
                      {item.preoccupations.map((cat) => {
                        const catUrl = `/${item.title}/preoccupations/${cat.slug}`;
                        return (
                          <li key={cat.title}>
                            <Link
                              className="block text-sm font-normal hover:text-primary-600 transition-colors duration-200 outline-none py-1"
                              href={catUrl}
                              onClick={closeAllMenus}
                              itemProp="url"
                            >
                              <span itemProp="name">{t(cat.title)}</span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
