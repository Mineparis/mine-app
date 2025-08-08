import React, { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

import ProductGrid from "@components/ProductGrid";

const getProductsPerSlide = () => (window.innerWidth >= 640 ? 4 : 2);

const ProductsCarousel = ({ products, title }) => {
	const [productsPerSlide, setProductsPerSlide] = useState(
		typeof window !== "undefined" ? getProductsPerSlide() : 4
	);

	useEffect(() => {
		const handleResize = () => setProductsPerSlide(getProductsPerSlide());
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
	for (let i = 0; i < products.length; i += productsPerSlide) {
		slides.push(products.slice(i, i + productsPerSlide));
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
	}, [emblaApi]);

	const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
	const scrollNext = () => emblaApi && emblaApi.scrollNext();

	if (!products?.length) return null;

	return (
		<section className="w-full">
			<div className="flex items-center justify-between mb-4 px-2">
				<h3 className="text-xl font-bold">{title}</h3>
				<div className="flex gap-2">
					<button
						onClick={scrollPrev}
						aria-label="Précédent"
						className="w-10 p-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 transition disabled:opacity-40 shadow-md"
						disabled={!canScrollPrev}
						type="button"
						style={{ borderRadius: "100%" }}
					>
						<ChevronLeftIcon className="w-full" />
					</button>
					<button
						onClick={scrollNext}
						aria-label="Suivant"
						className="w-10 p-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 transition disabled:opacity-40 shadow-md"
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
					{slides.map((slideProducts, idx) => (
						<div
							key={idx}
							className="min-w-full max-w-full px-1"
							role="group"
							aria-roledescription="slide"
							aria-label={`Groupe ${idx + 1}`}
						>
							<div
								className="flex gap-4 justify-center w-full"
								role="grid"
								aria-label={`${title} ligne de produits`}
								aria-rowcount={Math.ceil(products.length / productsPerSlide)}
							>
								{slideProducts.map((product, i) => (
									<div
										key={product.id || i}
										className={`
											flex-shrink-0
											w-[38vw] 
											sm:w-[20vw]
											lg:w-[22vw]
											max-w-[290px]
											min-w-[120px]
											transition-all
										`}
									>
										<ProductGrid products={[product]} />
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default ProductsCarousel;
