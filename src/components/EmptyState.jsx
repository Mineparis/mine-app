import React from 'react';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { MagnifyingGlassIcon, HomeIcon } from '@heroicons/react/24/outline';

const EmptyState = () => {
	const { t } = useTranslation('common');

	return (
		<div className="col-span-full flex flex-col items-center justify-center py-16 px-4">
			<div className="w-24 h-24 mx-auto mb-6 bg-neutral-100 rounded-full flex items-center justify-center">
				<MagnifyingGlassIcon className="w-10 h-10 text-neutral-400" />
			</div>
			<h3 className="text-xl font-light text-neutral-700 mb-3 text-center">
				{t('no_products_found')}
			</h3>
			<p className="text-neutral-500 text-center max-w-md mb-8 leading-relaxed">
				{t('no_products_found_description')}
			</p>
			<p className="text-sm text-neutral-400 text-center max-w-md mb-8">
				{t('try_different_filters')}
			</p>
			<div className="flex flex-col sm:flex-row gap-3">
				<Link 
					href="/"
					className="inline-flex items-center justify-center px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-sm transition-colors duration-200 space-x-2"
				>
					<HomeIcon className="w-4 h-4" />
					<span>{t('back_to_home')}</span>
				</Link>
			</div>
		</div>
	);
};

export default EmptyState;
