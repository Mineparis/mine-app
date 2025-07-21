import React from 'react';
import { useTranslation } from 'next-i18next';
import { SparklesIcon, ShieldCheckIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid';

const items = [
	{
		icon: <SparklesIcon className="w-5 h-5" />,
		titleKey: 'reassurance_eco_title',
		descriptionKey: 'reassurance_eco_desc',
	},
	{
		icon: <ShieldCheckIcon className="w-5 h-5" />,
		titleKey: 'reassurance_secure_title',
		descriptionKey: 'reassurance_secure_desc',
	},
	{
		icon: <ChatBubbleLeftRightIcon className="w-5 h-5" />,
		titleKey: 'reassurance_support_title',
		descriptionKey: 'reassurance_support_desc',
	},
];

const ReassuranceBanner = () => {
		const { t } = useTranslation('common');

		return (
			<div className="flex flex-col md:flex-row justify-between max-w-7xl mx-auto px-4 gap-3">
				{items.map((item, idx) => (
					<div
						key={item.titleKey}
						className="flex flex-1 flex-col md:flex-row items-center text-center md:text-left gap-3 px-4 min-h-[120px] relative"
					>
						<div className="flex-shrink-0 flex items-center justify-center w-10 h-10 mx-auto md:mx-0 rounded-full shadow bg-white">
								{item.icon}
						</div>
						<div className="flex flex-col justify-center w-full">
							<div className="font-semibold text-gray-900 text-lg whitespace-normal break-words">
								{t(item.titleKey)}
							</div>
							<div className="text-gray-500 text-sm whitespace-normal break-words">
								{t(item.descriptionKey)}
							</div>
						</div>
						{/* Separator: vertical on desktop */}
						{idx < items.length - 1 && (
							<>
								<span
									className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 h-10 w-[1px] bg-gray-200"
									aria-hidden="true"
								/>
							</>
						)}
					</div>
				))}
			</div>
		);
	};

export default ReassuranceBanner;