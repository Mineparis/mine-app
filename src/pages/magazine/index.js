import { Container, Row, Col } from 'reactstrap';
import Link from 'next/link';
import Image from "next/image";
import dynamic from 'next/dynamic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { fetchAPI } from '../../lib/api';
import { getStrapiMedia } from '../../lib/media';
import { DEFAULT_LANG, REVALIDATE_PAGE_SECONDS } from '../../utils/constants';

const Post = dynamic(() => import('../../components/Post'));

export async function getStaticProps({ locale }) {
	const lang = locale || DEFAULT_LANG;
	const allPosts = await fetchAPI('/blogs?_sort=created_at:DESC');

	return {
		props: {
			...(await serverSideTranslations(lang, 'common')),
			allPosts,
		},
		revalidate: REVALIDATE_PAGE_SECONDS
	};
}

const Magazine = ({ allPosts = [] }) => {
	const [mainPost, ...posts] = allPosts;

	return (<>
		{mainPost && (
			<section className="position-relative py-6 mb-30px">
				<Image
					src={getStrapiMedia(mainPost.thumbnail)}
					className="bg-image"
					alt={mainPost.slug}
					fill
					sizes="100vw"
					style={{
						objectFit: "cover"
					}} />
				<Container>
					<Row className="d-flex justify-content-center">
						<Col lg="6">
							<div className="bg-white p-5">
								<Link
									href="/magazine/[slug]"
									as={`/magazine/${mainPost.slug}`}
									className='text-decoration-none'>

									<h2 className="mb-3">{mainPost.title}</h2>

								</Link>
								<Link
									href="/magazine/[slug]"
									as={`/magazine/${mainPost.slug}`}
									className='text-decoration-none'>

									<p className="text-muted">{mainPost.summary}</p>

								</Link>
							</div>
						</Col>
					</Row>
				</Container>
			</section>
		)}
		<section>
			<Container>
				<Row>
					{posts.map(({ slug, thumbnail, title, summary, created_at }) => (
						<Col xs="6" lg="4" key={slug}>
							<Post
								slug={slug}
								thumbnail={thumbnail}
								title={title}
								summary={summary}
								createdAt={created_at}
								withoutSummary={!summary}
							/>
						</Col>
					))}
				</Row>
			</Container>
		</section>
	</>);
};

export default Magazine;
