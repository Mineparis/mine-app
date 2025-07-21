import Link from "next/link";
import Image from "next/image";
import { dateFormat } from "../utils/date";

const BlogArticle = ({
  slug,
  imageSrc,
  title,
  summary,
  publishedAt,
  withoutSummary = false,
  withoutDate = false,
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl group transition-transform duration-300 hover:scale-95">
      <Link
        href="/magazine/[slug]"
        as={`/magazine/${slug}`}
        className="block relative w-full h-[340px] lg:h-[420px]"
      >
        <Image
          className="object-cover w-full h-full"
          src={imageSrc}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={false}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        <div className="absolute bottom-0 left-0 w-full px-4 pb-3">
          <h5 className="text-white text-lg font-semibold drop-shadow-lg line-clamp-2">{title}</h5>
        </div>
      </Link>

      <>
        {!withoutDate && publishedAt && (
          <p className="text-gray-400 text-xs mb-2">{dateFormat(publishedAt)}</p>
        )}
        {!withoutSummary && summary && (
          <Link
            href="/magazine/[slug]"
            as={`/magazine/${slug}`}
            className="block text-gray-700 text-sm mt-1 line-clamp-3 hover:underline"
          >
            <p>{summary}</p>
          </Link>
        )}
      </>
    </div>
  );
};

export default BlogArticle;
