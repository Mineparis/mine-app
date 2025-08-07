import React from 'react';
import Image from 'next/image';
import { XMarkIcon, MagnifyingGlassIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

const NB_PRODUCTS_RESULTS_MAX = 4;

const Searchbar = ({
	searchToggle,
	setSearchToggle,
	searchTerm,
	setSearchTerm,
	searchResults = [],
	isLoading = false,
}) => {
	const { t } = useTranslation('common');
	const router = useRouter();

	if (!searchToggle) return null;

	const handleToggleSearch = () => {
		setSearchToggle(false);
		setSearchTerm('');
	};

	const handleInputChange = (e) => {
		setSearchTerm(e.target.value);
	};

	const handleSeeMore = () => {
		router.push(`/search?keyword=${encodeURIComponent(searchTerm)}`);
		setSearchToggle(false);
	};

	const displayedResults = searchResults?.slice(0, NB_PRODUCTS_RESULTS_MAX) || [];

	return (
		<div
			className="fixed inset-0 z-50 bg-black/70 flex flex-col items-center transition-all duration-300"
			aria-modal="true"
			role="dialog"
			tabIndex={-1}
		>
			{/* Overlay click to close */}
			<div
				className="absolute inset-0 cursor-pointer"
				aria-label={t('close')}
				tabIndex={-1}
				onClick={handleToggleSearch}
			/>
			<div
				className={`relative w-full max-w-lg mx-auto flex flex-col z-10 ${displayedResults.length || isLoading ? 'mt-8 md:mt-16 items-start' : 'items-center justify-center h-[60vh] md:h-[70vh]'}`}
				style={{ top: displayedResults.length || isLoading ? '3.5rem' : '0', position: 'relative' }}
			>
				{/* Search bar container */}
				<div className="relative w-full flex items-center justify-center">
					<span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-400 pointer-events-none">
						<MagnifyingGlassIcon className="w-5 h-5" aria-hidden="true" />
					</span>
					<input
						className="w-full pl-12 pr-10 py-3 text-md md:text-sm font-semibold rounded-full bg-white shadow-xl border-0 focus:ring-2 focus:ring-primary-400 focus:outline-none placeholder-gray-400 transition-all duration-300 tracking-[.01em]"
						type="search"
						name="search"
						id="search"
						value={searchTerm}
						onChange={handleInputChange}
						autoFocus
						placeholder={t('search_placeholder')}
						aria-label={t('search_placeholder')}
					/>
					<button
						className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-600 focus:outline-none rounded-full p-2 transition"
						onClick={handleToggleSearch}
						aria-label={t('close') || 'Fermer'}
						tabIndex={0}
					>
						<XMarkIcon className="w-5 h-5" aria-hidden="true" />
					</button>
				</div>
				{/* Results dropdown */}
				<div className="relative w-full max-w-lg">
					<div className="absolute left-0 right-0 mt-2">
						{isLoading ? (
							<div className="flex flex-col justify-center items-center py-8 bg-white rounded-2xl shadow-xl animate-pulse">
								<svg className="animate-spin h-7 w-7 text-primary-500 mb-3" fill="none" viewBox="0 0 24 24">
									<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
									<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
								</svg>
								<span className="text-primary-600 font-medium text-xs">{t('searching')}</span>
							</div>
						) : displayedResults.length ? (
							<>
								<ul className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden divide-y divide-gray-100">
									{displayedResults.map(({ id, handle, images, brand, name }) => (
										<li key={id} className="py-3 px-4 flex items-center gap-4 cursor-pointer hover:bg-primary-50/60 transition group" onClick={() => {
											router.push(`/products/${handle}`);
											handleToggleSearch();
										}}>
											<div className="w-10 h-10 flex-shrink-0 overflow-hidden relative group-hover:scale-105 group-hover:shadow-lg group-hover:rounded-xl transition">
												{images && images.length > 0 ? (
													<Image
														src={images[0].src}
														alt={images[0].alt || 'image du produit'}
														width={40}
														height={40}
														className="object-cover rounded-xl"
														style={{ objectFit: 'cover' }}
														priority={true}
													/>
												) : null}
											</div>
											<div className="flex-1 min-w-0">
												<div className="font-semibold text-xs text-gray-900 truncate group-hover:text-primary-700 transition">{name}</div>
												<div className="text-xs text-gray-500 truncate mt-1">{brand}</div>
											</div>
										</li>
									))}
								</ul>
								{/* See more button just below results */}
								{displayedResults.length > NB_PRODUCTS_RESULTS_MAX - 1 && (
									<div className="w-full flex justify-center mt-4">
										<button
											className="pointer-events-auto block w-full max-w-md mx-auto py-2 md:py-2.5 rounded-full bg-white text-black font-semibold text-xs shadow-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:ring-2 focus:ring-primary-400 transition-all duration-200"
											style={{ boxShadow: '0 4px 16px 0 rgba(0,0,0,0.08)' }}
											onClick={handleSeeMore}
											aria-label={t('see_more_results')}
										>
											<span className="inline-flex items-center gap-2">
												<ArrowRightIcon className="w-5 h-5 text-primary-600" aria-hidden="true" />
												<span className="tracking-wide">{t('see_more_results')}</span>
												<span className="ml-1 font-bold">({searchResults.length - NB_PRODUCTS_RESULTS_MAX}+)</span>
											</span>
										</button>
									</div>
								)}
							</>
						) : searchTerm && !isLoading ? (
							<div className="flex flex-col items-center justify-center py-8 bg-white rounded-2xl shadow-xl text-gray-400">
								<MagnifyingGlassIcon className="w-8 h-8 mb-3" aria-hidden="true" />
								<p className="text-xs font-medium">{t('no_results_found')}</p>
							</div>
						) : null}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Searchbar;
