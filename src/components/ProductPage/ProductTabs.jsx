
import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { renderShopifyRichText } from '@utils/shopifyRichText';

const ProductTabs = ({ descriptionHtml, instructions, composition }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { title: t('description'), content: descriptionHtml, type: 'shopifyHtml' },
    { title: t('using_advice'), content: instructions, type: 'shopifyRichText' },
    { title: t('composition'), content: composition, type: 'shopifyRichText' },
  ];

  // Keyboard navigation for tabs
  const handleKeyDown = (e, index) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextTab = index === tabs.length - 1 ? 0 : index + 1;
      setActiveTab(nextTab);
      document.getElementById(`tab-${nextTab}`)?.focus();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevTab = index === 0 ? tabs.length - 1 : index - 1;
      setActiveTab(prevTab);
      document.getElementById(`tab-${prevTab}`)?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActiveTab(0);
      document.getElementById('tab-0')?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      setActiveTab(tabs.length - 1);
      document.getElementById(`tab-${tabs.length - 1}`)?.focus();
    }
  };

  return (
    <div className="mb-16">
      {/* Tab Navigation - Responsive */}
      <div className="border-b border-gray-200 mb-8" role="tablist" aria-label={t('product_information_tabs')}>
        {/* Desktop version */}
        <div className="hidden md:flex">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={`flex-1 px-5 py-4 text-sm font-medium border-b-2 transition-all duration-200 text-center ${
                activeTab === index
                  ? 'border-black text-black bg-gray-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              role="tab"
              aria-selected={activeTab === index}
              aria-controls={`tabpanel-${index}`}
              id={`tab-${index}`}
              tabIndex={activeTab === index ? 0 : -1}
            >
              <span className="block truncate">{tab.title}</span>
            </button>
          ))}
        </div>
        {/* Mobile version - Stacked */}
        <div className="md:hidden">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={`w-full px-6 py-4 text-xs font-medium border-b transition-all duration-200 text-left ${
                activeTab === index
                  ? 'border-black text-black bg-gray-50 font-semibold'
                  : 'border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
              role="tab"
              aria-selected={activeTab === index}
              aria-controls={`tabpanel-${index}`}
              id={`tab-mobile-${index}`}
              tabIndex={activeTab === index ? 0 : -1}
            >
              {tab.title}
            </button>
          ))}
        </div>
      </div>
      {/* Tab Content */}
      <div className="prose prose-lg max-w-none">
        <div
          className="text-gray-700 leading-relaxed"
          role="tabpanel"
          id={`tabpanel-${activeTab}`}
          aria-labelledby={`tab-${activeTab}`}
          tabIndex={0}
        >
          {tabs[activeTab].content ? (
            tabs[activeTab].type === 'shopifyRichText' ? (
              <div
                className="shopify-rich-text rich-text-content"
                dangerouslySetInnerHTML={{ __html: renderShopifyRichText(tabs[activeTab].content) }}
              />
            ) : tabs[activeTab].type === 'shopifyHtml' ? (
              <div
                className="shopify-rich-text rich-text-content"
                dangerouslySetInnerHTML={{ __html: tabs[activeTab].content }}
              />
            ) : null
          ) : (
            <p className="text-gray-500 italic">{t('no_information_available')}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductTabs;
