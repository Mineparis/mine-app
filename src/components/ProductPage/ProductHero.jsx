import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@shopify/hydrogen-react';
import { useTranslation } from 'next-i18next';
import toast from 'react-hot-toast';
import { createShopifyGid } from '@utils/shopifyIds';
import { useCartDropdown } from '@contexts/CartDropdownContext';

const ProductHero = ({ product }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { linesAdd } = useCart();
  const { toggleCart } = useCartDropdown();
  const { t } = useTranslation('common');

  if (!product) {
    return <div>{t('loading')}</div>;
  }

  const { images = [], pricing = {}, variants = [] } = product;
  const {
    formattedCurrentPrice = '0,00 €',
    formattedComparePrice,
    hasDiscount,
    discountPercentage,
    formattedSavings
  } = pricing;

  const concerns = product.concerns || [];
  const mainImage = images[selectedImageIndex] || images[0];
  const selectedVariant = variants[0]; // Use first variant for now
  const brandSlug = (product.brand || product.vendor)?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || '';

  const handleAddToCart = async () => {
    if (!selectedVariant?.id || !product.availableForSale) {
      toast.error(t('product_unavailable'));
      return;
    }

    try {
      const formattedVariantId = createShopifyGid(selectedVariant.id);
      await linesAdd([{
        merchandiseId: formattedVariantId,
        quantity: 1,
      }]);
      toast.success(t('product_added_to_cart'));
      
      // Open cart dropdown after successful add
      toggleCart(true);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error(t('error_adding_to_cart'));
    }
  };

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image Gallery */}
          <div className="order-2 lg:order-1">
            {/* Main Image */}
            <div className="aspect-square overflow-hidden mb-6 relative group w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-full mx-auto">
              {hasDiscount && (
                <div className="absolute top-6 left-6 z-10">
                  <span className="bg-black text-white px-4 py-2 rounded-full text-sm font-semibold">
                    -{discountPercentage}%
                  </span>
                </div>
              )}

              {mainImage && (
                <Image
                  src={mainImage.url || mainImage.src}
                  alt={mainImage.altText || product.title}
                  fill
                  className="object-contain group-hover:scale-105 transition-transform duration-700"
                  priority
                  sizes="(max-width: 640px) 90vw, (max-width: 768px) 70vw, 40vw"
                />
              )}
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="flex space-x-4 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-24 h-24 mx-2 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index
                        ? 'border-black'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <Image
                      src={image.url || image.src}
                      alt={image.altText || `${product.title} ${index + 1}`}
                      width={96}
                      height={96}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="order-1 lg:order-2 space-y-6">
            {/* Brand - Made clickable */}
            <div>
              {brandSlug ? (
                <Link href={`/brands/${brandSlug}`}>
                  <span className="text-sm font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:text-black transition-colors">
                    {product.brand || product.vendor}
                  </span>
                </Link>
              ) : (
                <span className="text-sm font-medium text-gray-600 uppercase tracking-wider">
                  {product.brand || product.vendor}
                </span>
              )}
            </div>

            {/* Product Title */}
            <h1 className="text-xl font-medium text-black leading-tight">
              {product.title}
            </h1>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-baseline space-x-4">
                <span className="text-xl font-light text-black">
                  {formattedCurrentPrice}
                </span>
                {hasDiscount && formattedComparePrice && (
                  <span className="text-xl text-gray-500 line-through font-light">
                    {formattedComparePrice}
                  </span>
                )}
              </div>
              {hasDiscount && formattedSavings && (
                <p className="text-sm text-black font-medium">
                  {t('save_amount')} {formattedSavings}
                </p>
              )}
            </div>

            {/* Short Description */}
            {product.description && (
              <div className="text-gray-700 text-md leading-relaxed">
                <p className="m-0">{product.description.substring(0, 180)}...</p>
                <p className="underline">
                  <a href="#product-details-heading">{t('see_more')}</a>
                </p>
              </div>
            )}

            {/* Add to Cart */}
            <div className="space-y-4 pt-4">
              <button
                onClick={handleAddToCart}
                disabled={!product.availableForSale}
                className={`
                  w-full
                  py-3 px-4
                  text-base
                  font-medium
                  transition-all
                  rounded-lg
                  ${
                    product.availableForSale
                      ? 'bg-black text-white hover:bg-gray-800'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }
                  sm:py-4 sm:px-8 sm:text-lg
                `}
              >
                {product.availableForSale ? t('add_to_cart') : t('sold_out')}
              </button>

              {/* Concerns Tags under Add to Cart */}
              {concerns.length > 0 && (
                <div className="pt-4 border-t border-gray-100">
                  <h3 className="text-sm font-medium text-black uppercase tracking-wider mb-3">
                    {t('targeted_solutions')}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {concerns.map((concern, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-black border border-gray-200 capitalize"
                      >
                        {concern}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductHero;
