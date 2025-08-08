import { useRouter } from 'next/router';
import { useState, useEffect, useMemo } from 'react';
import { PAGE_LIMIT } from '@utils/constants';

/**
 * Hook for client-side sorting and pagination of products
 * @param {Array} allProducts - All products to sort and paginate
 * @returns {Object} Sorted and paginated products with controls
 */
export const useProductSortingAndPagination = (allProducts = []) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState('newest');

  useEffect(() => {
    const { sort = 'newest', page = 1 } = router.query;
    setSortOption(sort);
    setCurrentPage(Number(page));
  }, [router.query]);

  const sortedProducts = useMemo(() => {
    let products = [...allProducts];
    
    switch (sortOption) {
      case 'price-asc':
        products.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case 'price-desc':
        products.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case 'newest':
      default:
        // Sort by createdAt if available, otherwise keep original order
        if (products.length > 0 && products[0].createdAt) {
          products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
        break;
    }
    
    return products;
  }, [allProducts, sortOption]);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PAGE_LIMIT;
    return sortedProducts.slice(start, start + PAGE_LIMIT);
  }, [sortedProducts, currentPage]);

  const totalPages = Math.ceil(sortedProducts.length / PAGE_LIMIT);

  const handleSortChange = (newSort) => {
    setCurrentPage(1);
    router.push({
      pathname: router.pathname,
      query: { ...router.query, sort: newSort, page: 1 },
    }, undefined, { shallow: true });
  };

  const handlePageChange = (newPage) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, page: newPage },
    }, undefined, { shallow: true });
  };

  return {
    products: paginatedProducts,
    nbProducts: sortedProducts.length,
    page: currentPage,
    totalPages,
    sortOptionSelected: sortOption,
    handleSortChange,
    handlePageChange,
  };
};
