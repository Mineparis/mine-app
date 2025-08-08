import React, { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import BlogArticle from "./BlogArticle";

const getArticlesPerSlide = () =>
	typeof window !== "undefined" && window.innerWidth < 800 ? 2 : 4;

const BlogsCarousel = ({ title, blogArticles = [] }) => {
	const { t } = useTranslation("common");
	const [articlesPerSlide, setArticlesPerSlide] = useState(getArticlesPerSlide());

	useEffect(() => {
		const handleResize = () => setArticlesPerSlide(getArticlesPerSlide());
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const [emblaRef, emblaApi] = useEmblaCarousel({
		align: "start",
		slidesToScroll: 1,
		containScroll: "trimSnaps",
		dragFree: false,
		loop: false,
	});

	const slides = [];
	for (let i = 0; i < blogArticles.length; i += articlesPerSlide) {
		slides.push(blogArticles.slice(i, i + articlesPerSlide));
	}

	const [canScrollPrev, setCanScrollPrev] = useState(false);
	const [canScrollNext, setCanScrollNext] = useState(slides.length > 1);

	useEffect(() => {
		if (!emblaApi) return;
		const onSelect = () => {
			setCanScrollPrev(emblaApi.canScrollPrev());
			setCanScrollNext(emblaApi.canScrollNext());
		};
		emblaApi.on("select", onSelect);
		onSelect();
		return () => emblaApi.off("select", onSelect);
	}, [emblaApi, slides.length]);

	const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
	const scrollNext = () => emblaApi && emblaApi.scrollNext();

	if (!blogArticles.length) return null;

	return (
		<section className="w-full max-w-7xl mx-auto px-4">
			<div className="flex items-center justify-between mb-4">
				<h3 className="text-2xl font-bold text-white">{title}</h3>
				<div className="flex gap-2">
					<button
						onClick={scrollPrev}
						aria-label="Précédent"
						className="w-10 p-2 rounded-full bg-primary hover:bg-primary/80 transition disabled:opacity-40 shadow-md text-white flex items-center justify-center"
						disabled={!canScrollPrev}
						type="button"
						style={{ borderRadius: "100%" }}
					>
						<ChevronLeftIcon className="w-full" />
					</button>
					<button
						onClick={scrollNext}
						aria-label="Suivant"
						className="w-10 p-2 rounded-full bg-primary hover:bg-primary/80 transition disabled:opacity-40 shadow-md text-white flex items-center justify-center"
						disabled={!canScrollNext}
						type="button"
						style={{ borderRadius: "100%" }}
					>
						<ChevronRightIcon className="w-full" />
					</button>
				</div>
			</div>
			<div ref={emblaRef} className="overflow-hidden">
				<div className="flex">
					{slides.map((slideArticles, idx) => (
						<div
							key={idx}
							className="min-w-full max-w-full px-1"
							role="group"
							aria-roledescription="slide"
							aria-label={`Groupe ${idx + 1}`}
						>
							<div className={`grid grid-cols-2 sm:grid-cols-${articlesPerSlide} gap-6`}>
								{slideArticles.map(({ id, handle, image, title }) => (
									<BlogArticle
										key={id}
										slug={handle}
										imageSrc={image.src}
										title={title}
										withoutSummary
										withoutDate
									/>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
			
			<div className="flex justify-center mt-5">
				<Link
					href="/magazine"
					className="inline-block"
					style={{ textDecoration: 'none' }}
				>
					<span className="px-6 py-2 rounded-full border border-white text-sm text-secondary hover:bg-secondary-600 transition font-semibold">
						{t("see_more")}
					</span>
				</Link>
			</div>
		</section>
	);
};

export default BlogsCarousel;
