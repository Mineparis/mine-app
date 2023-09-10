import { range } from 'ramda';

const LEFT_PAGE = 'LEFT';
const RIGHT_PAGE = 'RIGHT';
const PAGE_NEIGHBOURS = 2;

/**
 * Let's say we have 10 pages and we set PAGE_NEIGHBOURS to 2
 * Given that the current page is 6
 * The pagination control will look like the following:
 *
 * (1) < {4 5} [6] {7 8} > (10)
 *
 * (x) => terminal pages: first and last page(always visible)
 * [x] => represents current page
 * {...x} => represents page neighbours
 */
const fetchPageNumbers = (page, totalPages) => {
	/**
	 * totalNumbers: the total page numbers to show on the control
	 * totalBlocks: totalNumbers + 2 to cover for the left(<) and right(>) controls
	 */
	const totalNumbers = (PAGE_NEIGHBOURS * 2) + 3;
	const totalBlocks = totalNumbers + 2;

	if (totalPages > totalBlocks) {
		const startPage = Math.max(2, page - PAGE_NEIGHBOURS);
		const endPage = Math.min(totalPages - 1, page + PAGE_NEIGHBOURS);
		let pages = range(startPage, endPage);

		/**
		 * hasLeftSpill: has hidden pages to the left
		 * hasRightSpill: has hidden pages to the right
		 * spillOffset: number of hidden pages either to the left or to the right
		 */
		const hasLeftSpill = startPage > 2;
		const hasRightSpill = (totalPages - endPage) > 1;
		const spillOffset = totalNumbers - (pages.length + 1);

		switch (true) {
			// handle: (1) < {5 6} [7] {8 9} (10)
			case (hasLeftSpill && !hasRightSpill): {
				const extraPages = range(startPage - spillOffset, startPage - 1);
				pages = [LEFT_PAGE, ...extraPages, ...pages];
				break;
			}

			// handle: (1) {2 3} [4] {5 6} > (10)
			case (!hasLeftSpill && hasRightSpill): {
				const extraPages = range(endPage + 1, endPage + spillOffset);
				pages = [...pages, ...extraPages, RIGHT_PAGE];
				break;
			}

			// handle: (1) < {4 5} [6] {7 8} > (10)
			case (hasLeftSpill && hasRightSpill):
			default: {
				pages = [LEFT_PAGE, ...pages, RIGHT_PAGE];
				break;
			}
		}

		return [1, ...pages, totalPages];
	}

	return range(1, totalPages + 1);
};

const ShopPagination = ({ page, totalItems, totalPages, handleChangePage }) => {
	if (!totalItems || totalPages === 1) return null;
	const pages = fetchPageNumbers(page, totalPages);

	const goToPage = (pageIndex) => {
		const page = Math.max(0, Math.min(pageIndex, totalPages));
		handleChangePage(page);
	};

	const handleClick = (page) => (event) => {
		event.preventDefault();
		goToPage(page);
		window.scrollTo(0, 300);
	};

	const handleMoveLeft = (event) => {
		event.preventDefault();
		gotoPage(page - (PAGE_NEIGHBOURS * 2) - 1);
	};

	const handleMoveRight = (event) => {
		event.preventDefault();
		gotoPage(page + (PAGE_NEIGHBOURS * 2) + 1);
	};

	return (
		<nav
			className="d-flex justify-content-center mb-5 mt-3"
			aria-label="page navigation"
		>
			<ul className="pagination">
				{pages.map((pageIndex, index) => {
					if (pageIndex === LEFT_PAGE) {
						return (
							<li key={index} className="page-item">
								<a className="page-link" href="#" aria-label="Previous" onClick={handleMoveLeft}>
									<span aria-hidden="true">&laquo;</span>
									<span className="sr-only">Previous</span>
								</a>
							</li>
						);
					}
					if (pageIndex === RIGHT_PAGE) {
						return (
							<li key={pageIndex} className="page-item">
								<a className="page-link" href="#" aria-label="Next" onClick={handleMoveRight}>
									<span aria-hidden="true">&raquo;</span>
									<span className="sr-only">Next</span>
								</a>
							</li>
						);
					}

					return (
						<li key={pageIndex} className={`page-item${pageIndex === page ? ' active' : ''}`}>
							<a className="page-link" href="#" onClick={handleClick(pageIndex)}>{pageIndex}</a>
						</li>
					);
				})
				}
			</ul>
		</nav>
	);
};

export default ShopPagination;;
