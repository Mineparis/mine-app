import React, { useState, useEffect } from 'react';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import range from 'ramda/src/range';

const CustomPagination = ({ currentPage, totalItems, itemsPerPage = 5, nbPagesDisplayed = 5, handleChangePage }) => {
	const nbPages = Math.floor(totalItems / itemsPerPage) + 1;
	const isShort = nbPages <= nbPagesDisplayed;
	const limit = isShort ? nbPages : nbPagesDisplayed;

	const [pageLimit, setPageLimit] = useState(limit);
	const [start, setStart] = useState(1);
	const [end, setEnd] = useState(limit + 1);

	useEffect(() => {
		if (isShort) return;
		// increment start page when current page is greater than the number of pages displayed
		if (currentPage - pageLimit >= 0) {
			setStart(currentPage - 4);
		}

		// if reaching end of pagination stop increment 
		if (start + pageLimit >= nbPages) {
			setStart(nbPages - pageLimit);
		}

		// increment end page when current + 5 exceeds page limit
		if (currentPage >= pageLimit) {
			setEnd(currentPage + nbPagesDisplayed);
			setPageLimit(end);
			if (nbPages <= pageLimit) {
				setPageLimit(nbPages);
			}
		}
	}, [currentPage]);


	const handlePrevPage = () => {
		if (currentPage - 1 >= 0) {
			handleChangePage(currentPage - 1);
		}
	};

	const handleUpdatePage = (page) => {
		handleChangePage(page);
	};

	const handleNextPage = () => {
		if (currentPage + 1 <= nbPages) {
			handleChangePage(currentPage + 1);
		}
	};

	if (nbPages <= 1) return null;

	const isFirst = currentPage === 1;
	const isLast = nbPages === currentPage;

	return (
		<nav aria-label="Pagination">
			<ul class="pagination d-flex justify-content-center mt-3">
				<li class={`page-item ${isFirst ? 'disabled' : ''}`}>
					<a class="page-link" aria-label="Precedent" onClick={handlePrevPage}>
						<span aria-hidden="true">&laquo;</span>
					</a>
				</li>
				{range(start, end).map((pageIndex) => {
					const isActive = pageIndex === currentPage ? 'active' : '';
					return (
						<li class={`page-item ${isActive}`} key={pageIndex} onClick={() => handleUpdatePage(pageIndex)}>
							<a class="page-link">{pageIndex}</a>
						</li>
					);
				})}
				<li class={`page-item ${isLast ? 'disabled' : ''}`}>
					<a class="page-link" aria-label="Suivant" onClick={handleNextPage}>
						<span aria-hidden="true">&raquo;</span>
					</a>
				</li>
			</ul>
		</nav>
	);
};

export default CustomPagination;