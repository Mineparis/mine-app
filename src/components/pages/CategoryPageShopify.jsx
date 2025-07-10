
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';


export default function CategoryPageShopify({
	categoryName,
	subCategoryName,
	products,
	subCategories,
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
		// Redirige sans query params inutiles
		router.push({ pathname: `/${categoryName}/${subCat}` });
	};

	const handleSortChange = (e) => {
		setSelectedSort(e.target.value);
		router.push({
			pathname: router.pathname,
			query: { sort: e.target.value, page: 1 },
		});
	};

	const handlePageChange = (newPage) => {
		router.push({
			pathname: router.pathname,
			query: { ...('sort' in router.query ? { sort: router.query.sort } : {}), page: newPage },
		});
	};

	const titleLabel = `${t(categoryName)} - ${t(subCategoryName)} | Mine Paris`;
	const descriptionLabel = t(subCategoryName);

	return (
		<div className="min-h-screen bg-neutral-50 text-neutral-900">
			<Head>
				<title>{titleLabel}</title>
				<meta name="description" content={descriptionLabel} />
				<meta property="og:title" content={titleLabel} />
				<meta property="og:description" content={descriptionLabel} />
			</Head>
			<section className="max-w-7xl mx-auto px-4 py-12">
				{/* Header + Filtres */}
				<div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
					<div>
						<h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-neutral-900 leading-tight">
							{t(subCategoryName)}
						</h1>
						<div className="flex flex-wrap gap-2 mt-2">
							{subCategories?.map((subCat) => (
								<button
									key={subCat}
									className={`px-4 py-2 border border-neutral-200 text-sm font-medium transition-colors duration-150 ${selectedSubCategory === subCat ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-900 hover:bg-neutral-100'}`}
									style={{ borderRadius: 0 }}
									onClick={() => handleSubCategoryChange(subCat)}
									aria-pressed={selectedSubCategory === subCat}
								>
									{t(subCat)}
								</button>
							))}
						</div>
					</div>
					<div className="flex items-center gap-3">
						<label htmlFor="sort" className="text-sm text-neutral-500">
							{t('sort_by')}
						</label>
						<select
							id="sort"
							value={selectedSort}
							onChange={handleSortChange}
							className="bg-white border border-neutral-200 px-3 py-2 text-neutral-900 focus:outline-none shadow-sm"
							style={{ borderRadius: 0 }}
						>
							{sortOptions.map(opt => (
								<option key={opt.value} value={opt.value}>{t(opt.label)}</option>
							))}
						</select>
					</div>
				</div>

				{/* Grille de produits */}
				<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
					{products.length === 0 && (
						<div className="col-span-full text-center text-neutral-400 py-24 text-lg">
							{t('no_results')}
						</div>
					)}
					{products.map(product => {
						// Génère le slug produit (ex: "lait-capillaire")
						const productSlug = product.name
							.toLowerCase()
							.replace(/[^a-z0-9\s-]/g, '')
							.replace(/\s+/g, '-')
							.replace(/-+/g, '-');
						const brandSlug = product.brand
							? product.brand.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')
							: 'marque';
						const productUrl = `/products/${brandSlug}/${productSlug}`;
						return (
							<Link
								key={product.id}
								href={productUrl}
								className="bg-white shadow-sm hover:shadow-lg transition-shadow duration-200 flex flex-col border border-neutral-100 group focus:outline-none no_underline focus:no-underline hover:no-underline"
								tabIndex={-1}
							>
								<div className="w-full aspect-w-1 aspect-h-1 overflow-hidden bg-neutral-100 flex items-center justify-center border-b border-neutral-100" style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0, minHeight: 0, minWidth: 0, height: 260 }}>
									{product.images?.[0]?.src ? (
										<img
											src={product.images[0].src}
											alt={product.images[0].altText || product.name}
											className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
											style={{ borderRadius: 0, minHeight: 0, minWidth: 0, height: 260, width: '100%' }}
										/>
									) : (
										<div className="w-full h-full flex items-center justify-center text-neutral-300 text-2xl">—</div>
									)}
								</div>
								<div className="p-5 flex-1 flex flex-col justify-between">
									<div>
										<h2 className="text-base font-semibold mb-1 text-neutral-900 line-clamp-2 min-h-[2.2rem] group-hover:underline group-focus:underline group-focus:no-underline group-hover:no-underline">
											{product.name}
										</h2>
										{product.brand && (
											<div className="text-sm font-bold tracking-wide text-neutral-800 mb-2 uppercase group-hover:text-neutral-900 group-focus:text-neutral-900 transition-colors">
												{product.brand}
											</div>
										)}
									</div>
									<div className="mt-auto flex flex-col gap-2 pt-2">
										<span className="text-base font-medium text-neutral-500 whitespace-nowrap tracking-tight" style={{ letterSpacing: 0.5, fontVariantNumeric: 'lining-nums' }}>{product.price} €</span>
										<button
											className="w-full px-4 py-2 bg-neutral-900 text-white font-semibold text-sm hover:bg-neutral-800 transition-colors shadow-sm opacity-0 group-hover:opacity-100 group-focus:opacity-100 focus:opacity-100"
											style={{ borderRadius: 0, minHeight: 40 }}
											tabIndex={-1}
											onClick={e => { e.preventDefault(); /* TODO: add to cart */ }}
										>
											{t('add_to_cart')}
										</button>
									</div>
								</div>
							</Link>
						);
					})}
				</div>

				{/* Pagination */}
				{totalPages > 1 && (
					<nav className="flex justify-center mt-14 gap-2" aria-label="Pagination">
						{Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
							<button
								key={pageNum}
								className={`px-4 py-2 border border-neutral-200 text-sm font-medium transition-colors duration-150 ${pageNum === page ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-900 hover:bg-neutral-100'}`}
								style={{ borderRadius: 0 }}
								onClick={() => handlePageChange(pageNum)}
								aria-current={pageNum === page ? 'page' : undefined}
							>
								{pageNum}
							</button>
						))}
					</nav>
				)}
			</section>
		</div>
	);
}
