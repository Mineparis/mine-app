import Link from "next/link";
import Image from "next/image";

import { dateFormat } from '../utils/date';
import { getStrapiMedia } from '../lib/media';

const Post = ({
	slug,
	thumbnail,
	title,
	summary,
	createdAt,
	withoutSummary = false,
	withoutDate = false,
}) => {
	return (
		<div className="card mb-30px">
			<Link href="/magazine/[slug]" as={`/magazine/${slug}`} className="card-title text-dark text-decoration-none">
				<div>
					<Image
						className="card-img-top"
						src={getStrapiMedia(thumbnail)}
						alt={slug}
						width={1000}
						height={300}
					/>
				</div>
			</Link>

			<div className="card-body">
				<Link
					href="/magazine/[slug]"
					as={`/magazine/${slug}`}
					className="card-title text-dark text-decoration-none">

					<h5 className="my-2 line-clamp">{title}</h5>

				</Link>
				{!withoutDate && (
					<p className="text-gray-500 text-sm my-3">
						{dateFormat(createdAt)}
					</p>
				)}
				{!withoutSummary && (
					<Link
						href="/magazine/[slug]"
						as={`/magazine/${slug}`}
						className="card-text text-dark text-decoration-none"
					>
						<p className="my-2 text-muted">{summary}</p>
					</Link>
				)}
			</div>
		</div>
	);
};

export default Post;
