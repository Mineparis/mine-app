import { useState } from 'react';
import Head from 'next/head';
import { useTranslation } from 'next-i18next';

import Jumbotron from '@components/Jumbotron';
import SurveyModal from '@components/SurveyModal';
import BackgroundImage from "@components/BackgroundImage";
import ProductsCarousel from '@components/ProductsCarousel';
import BigCards from '@components/BigCards';
import BigCardsWithText from '@components/BigCardsWithText';
import BlogsCarousel from '@components/BlogsCarousel';
import VideoCarousel from '@components/VideosCarousel';
import ReassuranceBanner from '@components/ReassuranceBanner';
import { HOMEPAGE_JUMBOTRON } from '@data/homepage';

const Home = ({
	bestSellersProducts,
	newProducts,
	blogArticles,
	survey,
	surveySection,
	categoriesSection,
	routineSection,
}) => {
	const { t } = useTranslation('common');
	const [isSurveyOpen, setIsSurveyOpen] = useState(false);

	const handleToggleSurveyModal = (isOpen = true) => {
		setIsSurveyOpen(isOpen);
	};

	const metaTitle = t('meta_title');
	const metaDescription = t('meta_description');

	return (
		<>
			<Head>
				<title>{metaTitle}</title>
				<meta name="description" content={metaDescription} />
				<meta property="og:title" content={metaTitle} />
				<meta property="og:description" content={metaDescription} />
				<meta property="og:url" content="https://mineparis.com" />
				<meta name="language" content="fr" />
				<meta httpEquiv="Content-Language" content="fr" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="canonical" href="https://mineparis.com/" />
				<meta property="og:type" content="website" />
				<meta property="og:locale" content="fr_FR" />
				<meta property="og:image" content={HOMEPAGE_JUMBOTRON[2].image} />
			</Head>

			<Jumbotron slides={HOMEPAGE_JUMBOTRON} />

      <div className="w-full py-6 px-8 md:py-10 md:px-30 bg-secondary-50">
				<h2 className="sm:w-130 mx-auto text-lg text-gray-700 uppercase antialiased font-semibold font-stretch-semi-condensed">
					{t('home_page_banner')}
				</h2>
      </div>

			<section className="w-full lg:max-w-7xl lg:mx-auto p-8">
				<ProductsCarousel title={t('new_arrivals')} products={newProducts} />
			</section>

			{surveySection && (
				<section className="relative py-6">
					<BackgroundImage src={surveySection.staticImg} alt="survey" />
					<div className="absolute inset-0 flex items-center justify-center">
						<div className="bg-white/90 rounded-xl shadow-lg p-6 max-w-md w-full text-center">
							<h3 className="text-lg font-semibold italic">{surveySection.title}</h3>
						</div>
					</div>
				</section>
			)}

			<section className="pt-8">
				<BigCards data={categoriesSection} />
			</section>

			<section className="w-full lg:max-w-7xl lg:mx-auto p-8">
				<ProductsCarousel title={t('best_sellers')} products={bestSellersProducts} />
			</section>

			{routineSection && (
				<section className="bg-gray-50 py-8">
					<BigCardsWithText {...routineSection} />
				</section>
			)}

			{survey && (
				<section className="py-8">
					<BigCardsWithText
						title={t('section_survey_title')}
						description={t('section_survey_description')}
						imageName="skincare"
						onClick={handleToggleSurveyModal}
					/>
				</section>
			)}

			<div className="mx-auto my-4 w-50 border-t border-gray-300"></div>
			<section className="pb-5">
				<VideoCarousel />
			</section>

			<section className="py-10 bg-neutral-400">
				<BlogsCarousel title="Magazine" blogArticles={blogArticles} />
			</section>

			<section className="py-4">
				<ReassuranceBanner />
			</section>
			
			{survey && (
				<SurveyModal survey={survey} isOpen={isSurveyOpen} onToggleModal={handleToggleSurveyModal} />
			)}
		</>
	);
};

export default Home;