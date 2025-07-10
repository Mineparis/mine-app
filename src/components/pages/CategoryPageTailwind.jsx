import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

export default function CategoryPageTailwind({
	categoryName,
	subCategoryName,
	products,
	subCategories,
	nbProducts,
	page,
	totalPages,
	sortOptionSelected,
	sortOptions,
}) {
	const { t } = useTranslation('common');
	const router = useRouter();
	const [selectedSubCategory, setSelectedSubCategory] = useState(subCategoryName);
	const [selectedSort, setSelectedSort] = useState(sortOptionSelected || 'newest');

	useEffect(() => {
		setSelectedSubCategory(subCategoryName);
	}, [subCategoryName]);

	const handleSubCategoryChange = (subCat) => {
		setSelectedSubCategory(subCat);
		router.push({
			pathname: `/` + categoryName + '/' + subCat,
			query: { ...router.query, page: 1 },
		});
	};

	const handleSortChange = (e) => {
		setSelectedSort(e.target.value);
		router.push({
			pathname: router.pathname,
			query: { ...router.query, sort: e.target.value, page: 1 },
		});
	};

	const handlePageChange = (newPage) => {
		router.push({
			pathname: router.pathname,
			query: { ...router.query, page: newPage },
		});
	};

	return (
		<div className="min-h-screen bg-neutral-900 text-white">
			<Head>
				<title>{t(categoryName)} - {t(subCategoryName)} | Mine Paris</title>
				<meta name="description" content={t(subCategoryName)} />
			</Head>
			<section className="container mx-auto px-4 py-8">
				<div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
					<div>
						<h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">{t(subCategoryName)}</h1>
						<div className="flex flex-wrap gap-2 mt-2">
							{subCategories?.map((subCat) => (
								<button
									key={subCat}
									className={`px-4 py-2 rounded-full border border-neutral-700 text-sm font-medium transition-colors duration-150 ${selectedSubCategory === subCat ? 'bg-white text-black' : 'bg-neutral-900 text-white hover:bg-neutral-800'}`}
									onClick={() => handleSubCategoryChange(subCat)}
								>
									{t(subCat)}
								</button>
							))}
						</div>
					</div>
					<div className="flex items-center gap-2">
						<label htmlFor="sort" className="text-sm text-neutral-400">{t('sort_by')}</label>
						<select
							id="sort"
							value={selectedSort}
							onChange={handleSortChange}
							className="bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white focus:outline-none"
						>
							{sortOptions.map(opt => (
								<option key={opt.value} value={opt.value}>{t(opt.label)}</option>
							))}
						</select>
					</div>
				</div>
				{/* Produits */}
				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
					{products.length === 0 && (
						<div className="col-span-full text-center text-neutral-400 py-16">{t('no_results')}</div>
					)}
					{products.map(product => (
						<div key={product.id} className="bg-neutral-800 rounded-lg shadow hover:shadow-lg transition-shadow duration-200 flex flex-col">
							<div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-lg bg-neutral-700">
								{product.images?.[0]?.src && (
									<img src={product.images[0].src} alt={product.images[0].altText || product.name} className="object-cover w-full h-full" />
								)}
							</div>
							<div className="p-4 flex-1 flex flex-col justify-between">
								<div>
									<h2 className="text-lg font-semibold mb-1 text-white">{product.name}</h2>
									<div className="text-sm text-neutral-400 mb-2">{product.brand}</div>
								</div>
								<div className="mt-auto flex items-center justify-between">
									<span className="text-base font-bold text-white">{product.price} €</span>
									<button className="ml-2 px-3 py-1 rounded bg-white text-black font-semibold text-sm hover:bg-neutral-200 transition-colors">{t('add_to_cart')}</button>
								</div>
							</div>
						</div>
					))}
				</div>
				{/* Pagination */}
				{totalPages > 1 && (
					<div className="flex justify-center mt-10 gap-2">
						{Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
							<button
								key={pageNum}
								className={`px-4 py-2 rounded border border-neutral-700 text-sm font-medium transition-colors duration-150 ${pageNum === page ? 'bg-white text-black' : 'bg-neutral-900 text-white hover:bg-neutral-800'}`}
								onClick={() => handlePageChange(pageNum)}
							>
								{pageNum}
							</button>
						))}
					</div>
				)}
			</section>
		</div>
	);
}
