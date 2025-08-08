import { useTranslation } from 'next-i18next';

const Pagination = ({ page, totalPages, onPageChange }) => {
	const { t } = useTranslation('common');
	
	if (totalPages <= 1) return null;

	const handleKeyDown = (e, pageNum) => {
		if (e.key === 'ArrowRight' && pageNum < totalPages) {
			e.preventDefault();
			onPageChange(pageNum + 1);
		} else if (e.key === 'ArrowLeft' && pageNum > 1) {
			e.preventDefault();
			onPageChange(pageNum - 1);
		} else if (e.key === 'Home') {
			e.preventDefault();
			onPageChange(1);
		} else if (e.key === 'End') {
			e.preventDefault();
			onPageChange(totalPages);
		}
	};

	return (
		<div className="flex justify-center mt-14">
			<nav className="flex gap-2" aria-label={t('pagination_navigation', 'Page navigation')} role="navigation">
				{/* Previous button */}
				{page > 1 && (
					<button
						className="px-4 py-2 border border-neutral-200 text-sm font-medium transition-colors duration-150 bg-white text-neutral-900 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-900"
						style={{ borderRadius: 0 }}
						onClick={() => onPageChange(page - 1)}
						onKeyDown={(e) => handleKeyDown(e, page - 1)}
						aria-label={t('previous_page', 'Previous page')}
					>
						{t('previous', 'Previous')}
					</button>
				)}

				{/* Page numbers */}
				{Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
					<button
						key={pageNum}
						className={`px-4 py-2 border border-neutral-200 text-sm font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-900 ${
							pageNum === page 
								? 'bg-neutral-900 text-white' 
								: 'bg-white text-neutral-900 hover:bg-neutral-100'
						}`}
						style={{ borderRadius: 0 }}
						onClick={() => onPageChange(pageNum)}
						onKeyDown={(e) => handleKeyDown(e, pageNum)}
						aria-current={pageNum === page ? 'page' : undefined}
						aria-label={pageNum === page ? 
							t('current_page', 'Current page, page {{page}}', { page: pageNum }) : 
							t('goto_page', 'Go to page {{page}}', { page: pageNum })
						}
					>
						{pageNum}
					</button>
				))}

				{/* Next button */}
				{page < totalPages && (
					<button
						className="px-4 py-2 border border-neutral-200 text-sm font-medium transition-colors duration-150 bg-white text-neutral-900 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-900"
						style={{ borderRadius: 0 }}
						onClick={() => onPageChange(page + 1)}
						onKeyDown={(e) => handleKeyDown(e, page + 1)}
						aria-label={t('next_page', 'Next page')}
					>
						{t('next', 'Next')}
					</button>
				)}
			</nav>
		</div>
	);
};

export default Pagination;
