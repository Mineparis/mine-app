import { useTranslation } from "next-i18next";

const ShopHeader = ({ nbProducts, sortOptionSelected, setSortOptionSelected }) => {
	const { t } = useTranslation('common');

	const sortOptions = ['popularity', 'newest', 'ascending_price', 'descending_price'];

	const handleChangeOption = (event) => {
		setSortOptionSelected(event.target.value);
	};

	return (
		<header className="product-grid-header">
			<p className="mr-3 mb-3">{`${nbProducts} ${t('product')}${nbProducts > 1 ? 's' : ''}`}</p>
			<div className="mb-3 d-flex align-items-center">
				<span className="d-inline-block mr-1">{t('sort_by')}</span>
				<select className="custom-select w-auto border-0" value={sortOptionSelected} onChange={handleChangeOption}>
					{sortOptions.map(option => <option key={option} value={option}>{t(option)}</option>)}
				</select>
			</div>
		</header>
	);
};

export default ShopHeader;
