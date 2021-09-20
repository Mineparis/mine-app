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

	return (
		<Pagination className="d-flex justify-content-center mt-3">
			<PaginationItem>
				<PaginationLink previous onClick={handlePrevPage} />
			</PaginationItem>
			{range(start, end).map((pageIndex) => (
				<PaginationItem active={pageIndex === currentPage} key={pageIndex}>
					<PaginationLink onClick={() => handleUpdatePage(pageIndex)}>
						{pageIndex}
					</PaginationLink>
				</PaginationItem>
			))}
			<PaginationItem>
				<PaginationLink next onClick={handleNextPage} />
			</PaginationItem>
		</Pagination>
	);
};

export default CustomPagination;