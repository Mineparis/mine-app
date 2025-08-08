import React from "react";
import Link from "next/link";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

export default function DesktopMenu({ MENU, t, textColor, dropdownOpen, toggleDropdown, handleDropdownEnter, handleDropdownLeave, closeAllMenus, loggedUser }) {
  return (
    <div className="flex-1 flex items-center h-full" itemScope itemType="https://schema.org/SiteNavigationElement">
      {MENU.map((item) => {
        const shouldShowItem = !loggedUser || !item.hideToLoggedUser;
        if (!shouldShowItem) return null;
        const isDropdown = item.subCategories || item.preoccupations;
        const baseLinkClass = `${textColor} px-3 py-2 font-semibold capitalize transition-colors duration-200 outline-none`;
        if (!isDropdown) return null;
        const dropdownId = `dropdown-${item.title.replace(/\s+/g, '-').toLowerCase()}`;
        const isOpen = dropdownOpen[item.title] || false;
        return (
          <div key={item.title} className="relative group">
            <button
              id={`${dropdownId}-trigger`}
              className={`${baseLinkClass} flex items-center gap-1 hover:text-primary-300`}
              onClick={() => toggleDropdown(item.title)}
              onMouseEnter={() => handleDropdownEnter(item.title)}
              aria-haspopup="true"
              aria-expanded={isOpen}
              aria-controls={isOpen ? dropdownId : undefined}
              type="button"
            >
              <span itemProp="name">{t(item.title)}</span>
              <ChevronDownIcon className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
              <div
                id={dropdownId}
                role="menu"
                aria-labelledby={`${dropdownId}-trigger`}
                className="absolute left-0 mt-2 w-max min-w-[320px] bg-white shadow-xl border border-gray-100 z-30 rounded-lg overflow-hidden group-hover:block"
                onMouseEnter={() => handleDropdownEnter(item.title)}
                onMouseLeave={() => handleDropdownLeave(item.title)}
              >
                <div className="flex flex-col md:flex-row gap-5 p-5">
                  {item.subCategories && (
                    <div>
                      <div className="mb-3 text-xs font-font-light uppercase text-gray-500">
                        {t('sub_categories')}
                      </div>
                      <ul className="flex flex-col gap-1" role="none">
                        {item.subCategories.map((cat) => {
                          const catUrl = `/${item.title}/${cat.slug}`;
                          return (
                            <li key={cat.title} role="none">
                              <Link
                                role="menuitem"
                                className="block px-3 py-2 rounded text-sm text-primary-700 hover:bg-black hover:text-white transition-colors duration-150 outline-none"
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
                    <div>
                      <div className="mb-3 text-xs font-light uppercase text-gray-500">
                        {t('concerns')}
                      </div>
                      <ul className="flex flex-col gap-1" role="none">
                        {item.preoccupations.map((cat) => {
                          const catUrl = `/${item.title}/preoccupations/${cat.slug}`;
                          return (
                            <li key={cat.title} role="none">
                              <Link
                                role="menuitem"
                                className="block px-3 py-2 rounded text-sm text-primary-700 hover:bg-black hover:text-white transition-colors duration-150 outline-none"
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
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
