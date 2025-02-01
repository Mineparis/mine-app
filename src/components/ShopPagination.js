import { range } from 'ramda';

const LEFT_PAGE = 'LEFT';
const RIGHT_PAGE = 'RIGHT';
const PAGE_NEIGHBOURS = 2;

const fetchPageNumbers = (page, totalPages) => {
	const totalNumbers = PAGE_NEIGHBOURS * 2 + 3;
	const totalBlocks = totalNumbers + 2;

	if (totalPages <= totalBlocks) {
		return range(1, totalPages + 1);
	}

	const startPage = Math.max(2, page - PAGE_NEIGHBOURS);
	const endPage = Math.min(totalPages - 1, page + PAGE_NEIGHBOURS);
	let pages = range(startPage, endPage);

	const hasLeftSpill = startPage > 2;
	const hasRightSpill = (totalPages - endPage) > 1;
	const spillOffset = totalNumbers - (pages.length + 1);

	if (hasLeftSpill && !hasRightSpill) {
		const extraPages = range(startPage - spillOffset, startPage - 1);
		pages = [LEFT_PAGE, ...extraPages, ...pages];
	} else if (!hasLeftSpill && hasRightSpill) {
		const extraPages = range(endPage + 1, endPage + spillOffset);
		pages = [...pages, ...extraPages, RIGHT_PAGE];
	} else {
		pages = [LEFT_PAGE, ...pages, RIGHT_PAGE];
	}

	return [1, ...pages, totalPages];
};

const ShopPagination = ({ page, totalItems, totalPages, handleChangePage }) => {
	if (!totalItems || totalPages === 1) return null;

	const pages = fetchPageNumbers(page, totalPages);

	const goToPage = (pageIndex) => {
		const validPage = Math.max(1, Math.min(pageIndex, totalPages));
		handleChangePage(validPage);
	};

	const handleClick = (pageIndex) => (event) => {
		event.preventDefault();
		goToPage(pageIndex);
		window.scrollTo(0, 300); // Optionnel, pour faire défiler vers le haut lors du changement de page
	};

	const handleMove = (direction) => (event) => {
		event.preventDefault();
		goToPage(page + direction);
	};

	return (
		<nav className="d-flex justify-content-center mb-5 mt-3" aria-label="page navigation">
			<ul className="pagination">
				{pages.map((pageIndex, index) => {
					const isActive = pageIndex === page;
					if (pageIndex === LEFT_PAGE) {
						return (
							<li key={index} className="page-item">
								<a className="page-link" href="#" aria-label="Previous" onClick={handleMove(-(PAGE_NEIGHBOURS * 2) - 1)}>
									<span aria-hidden="true">&laquo;</span>
									<span className="sr-only">Previous</span>
								</a>
							</li>
						);
					}
					if (pageIndex === RIGHT_PAGE) {
						return (
							<li key={pageIndex} className="page-item">
								<a className="page-link" href="#" aria-label="Next" onClick={handleMove(PAGE_NEIGHBOURS * 2 + 1)}>
									<span aria-hidden="true">&raquo;</span>
									<span className="sr-only">Next</span>
								</a>
							</li>
						);
					}
					return (
						<li key={pageIndex} className={`page-item${isActive ? ' active' : ''}`}>
							<a className="page-link" href="#" onClick={handleClick(pageIndex)}>{pageIndex}</a>
						</li>
					);
				})}
			</ul>
		</nav>
	);
};

export default ShopPagination;
