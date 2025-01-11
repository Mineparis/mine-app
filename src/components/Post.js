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
	const height = withoutSummary && withoutDate
		? '23rem'
		: withoutSummary && !withoutDate
			? '28rem'
			: '40rem';

	return (
		(<div className="card mb-30px" style={{ height }}>
			<Link href="/magazine/[slug]" as={`/magazine/${slug}`}>

				<Image
					className="card-img-top"
					layout="responsive"
					objectFit="cover"
					src={getStrapiMedia(thumbnail)}
					alt={slug}
					width={100}
					height={100}
				/>

			</Link>
			<div className="card-body mt-3">
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
						className="card-text text-dark text-decoration-none">

						<p className="my-2 text-muted">{summary}</p>

					</Link>
				)}
			</div>
		</div>)
	);
};

export default Post;
