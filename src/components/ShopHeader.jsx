import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { MENU } from "@data/menu";

const ShopHeader = ({ 
	title,
	categoryName,
	subCategoryName,
	selectedSubCategory,
	onSubCategoryChange,
	onAllCategoryClick,
	sortOptions = [],
	selectedSort,
	onSortChange,
	nbProducts = 0,
	showSubCategories = true,
	showSort = true,
	isAllCategory = false,
	isPreoccupationPage = false,
	selectedPreoccupation = null,
	collectionInfo = null,
}) => {
	const { t } = useTranslation('common');
	const router = useRouter();
	
	const filteredCategory = MENU.find(({ title }) => title === categoryName);
	
	const filteredItems = isPreoccupationPage 
		? (filteredCategory?.preoccupations?.filter(({ slug }) => slug !== selectedPreoccupation) || [])
		: (filteredCategory?.subCategories?.filter(({ slug }) => slug !== selectedSubCategory) || []);

	return (
		<div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
			<div>
				{categoryName && subCategoryName && (
					<div className="mb-2">
						<span className="text-md text-neutral-500 font-light tracking-wide capitalize">
							{t(categoryName)}
						</span>
					</div>
				)}
				
				<h1 className="text-2xl font-bold italic capitalize tracking-tight mb-4 text-neutral-900 leading-tight">
					{title}
				</h1>
				
				{isAllCategory && collectionInfo?.description && (
					<div className="max-w-2xl mb-6">
						<p className="text-neutral-500 leading-relaxed">
							{collectionInfo.description}
						</p>
					</div>
				)}
				
				{showSubCategories && (categoryName || filteredItems.length > 0) && (
					<div className="flex flex-wrap gap-2 mt-2" role="group" aria-label={t('category_filters', 'Category filters')}>
						{categoryName && !isAllCategory && (
							<button
								className="px-4 py-2 border border-neutral-100 text-xs font-medium transition-all duration-150 bg-white text-neutral-900 hover:shadow-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-900"
								style={{ borderRadius: 0 }}
								onClick={onAllCategoryClick}
								aria-label={t('view_all_category_products', { category: t(categoryName) })}
							>
								{t('all')}
							</button>
						)}
						
						{filteredItems.map((item) => {
							const isSelected = isPreoccupationPage 
								? selectedPreoccupation === item.slug 
								: selectedSubCategory === item.slug;
								
							return (
								<button
									key={item.slug}
									className={`px-4 py-2 border border-neutral-100 text-xs font-medium transition-all duration-150 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-900 ${isSelected ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-900 hover:shadow-lg'}`}
									style={{ borderRadius: 0 }}
									onClick={() => {
										if (isPreoccupationPage) {
											router.push(`/${categoryName}/preoccupations/${item.slug}`);
										} else {
											onSubCategoryChange?.(item.slug);
										}
									}}
									aria-pressed={isSelected}
									aria-label={`${t('filter_by', 'Filter by')} ${t(item.title)}${isSelected ? ` (${t('currently_selected', 'currently selected')})` : ''}`}
								>
									{t(item.title)}
								</button>
							);
						})}
					</div>
				)}
				{nbProducts > 0 && (
					<p className="text-sm text-neutral-500 mt-4">
						{`${nbProducts} ${t('product')}${nbProducts > 1 ? 's' : ''}`}
					</p>
				)}
			</div>
			{showSort && sortOptions.length > 0 && (
				<div className="flex items-center gap-3">
					<label htmlFor="sort" className="text-sm text-neutral-500">
						{t('sort_by')}
					</label>
					<select
						id="sort"
						value={selectedSort}
						onChange={(e) => onSortChange?.(e.target.value)}
						className="bg-white px-3 py-2 text-xs text-neutral-900 focus:outline-none shadow-sm border border-neutral-100"
						style={{ borderRadius: 0 }}
					>
						{sortOptions.map(opt => (
							<option key={opt.value} value={opt.value}>{t(opt.label)}</option>
						))}
					</select>
				</div>
			)}
		</div>
	);
};

export default ShopHeader;
