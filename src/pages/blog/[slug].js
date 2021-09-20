import React, { useState } from "react";

import {
	Container,
	Row,
	Col,
	Button,
	Media,
	Collapse,
	Form,
	Input,
	Label,
	FormGroup,
} from "reactstrap";
import Link from "next/link";
import Image from "../../components/CustomImage";

import Hero from "../../components/Hero";

import blog from "../../data/blog.json";
import postDummyData from "../../data/post.json";

const getAllPostIds = () => blog.posts.map((post) => ({ params: { slug: post.slug } }));

const getPostData = (slug) => blog.posts.find((post) => post.slug === slug);

export const getStaticPaths = async () => {
	return {
		paths: getAllPostIds(),
		fallback: false,
	};
};

export const getStaticProps = async ({ params }) => {
	const postData = getPostData(params.slug);
	return {
		props: {
			nav: {
				light: true,
			},
			title: postData.title,
			postData,
		},
	};
};

const BlogPost = ({ postData }) => {
	const [formCollapse, setFormCollapse] = useState(false);

	const breadcrumbs = [
		{
			name: 'Home',
			link: '/',
		},
		{
			name: 'Blog',
			link: '/blog',
		},
		{
			name: postData.title,
			active: true,
		},
	];

	return (
		<>
			<Hero title={postData.title} breadcrumbs={breadcrumbs}>
				<Row>
					<Col lg="10" xl="8" className="mx-auto">
						<div className="py-3 mb-5 text-muted text-center font-weight-light d-flex align-items-center justify-content-center">
							{postDummyData.authorLink && (
								<Link href={postDummyData.authorLink}>
									<a className="mr-2">
										<Image
											src={postDummyData.authorAvatar}
											alt=""
											className="w-2rem rounded-circle"
											width={64}
											height={64}
										/>
									</a>
								</Link>
							)}
							<div>
								Written by&nbsp;
                {postDummyData.authorLink && (
									<Link href={postDummyData.authorLink}>
										<a className="text-muted font-weight-bold">
											{postDummyData.author}
										</a>
									</Link>
								)}
								<span className="mx-1">|</span>{" "}
								{postDummyData.date && postDummyData.date} in&nbsp;
                {postDummyData.categoryLink && (
									<Link href={postDummyData.categoryLink}>
										<a className="font-weight-bold">{postDummyData.category}</a>
									</Link>
								)}
								<span className="mx-1">|</span>
								<a href="#" className="text-muted">
									{postDummyData.comments && postDummyData.comments.length}{" "}
                  comments{" "}
								</a>
							</div>
						</div>
					</Col>
				</Row>
				<Row>
					<Col xl="10" className="mx-auto">
						<Image
							src="/img/photo/kyle-loftus-589740-unsplash.jpg"
							alt=""
							className="img-fluid mb-5"
							width={1000}
							height={667}
							sizes="100vw"
						/>
					</Col>
				</Row>
				<Row>
					<Col lg="10" xl="8" className="mx-auto">
						<p
							className="lead mb-5 text-left"
							dangerouslySetInnerHTML={{ __html: postDummyData.excerpt }}
						/>
					</Col>
				</Row>
			</Hero>

			<section>
				<Container>
					<Row>
						<Col xl="8" lg="10" className="mx-auto">
							<div className="text-content text-lg">
								<div
									dangerouslySetInnerHTML={{ __html: postDummyData.content }}
								/>
								<hr />
							</div>
							{postDummyData.comments && (
								<div className="mt-5">
									<h6 className="text-uppercase text-muted mb-4">
										{postDummyData.comments.length} comments
                  </h6>
									{postDummyData.comments.map((comment, index) => (
										<Media key={index} className="mb-4">
											<div className="mr-4">
												<Image
													src={comment.avatar}
													alt={comment.title}
													className="img-fluid rounded-circle"
													style={{ maxWidth: "100px" }}
													width={100}
													height={100}
												/>
											</div>
											<Media body>
												<h5>{comment.title}</h5>
												<p className="text-uppercase text-sm text-muted">
													<i className="far fa-clock" /> {comment.date}
												</p>
												<p className="text-muted">{comment.content}</p>
												<p>
													<Button
														color="link"
														href="#"
														className="text-primary"
													>
														<i className="fa fa-reply" /> Reply
                          </Button>
												</p>
											</Media>
										</Media>
									))}
								</div>
							)}
							<div className="mb-5">
								<Button
									type="button"
									aria-expanded={formCollapse}
									aria-controls="leaveComment"
									color="outline-dark"
									onClick={() => setFormCollapse(!formCollapse)}
								>
									Leave a comment
                </Button>
								<Collapse
									id="leaveComment"
									isOpen={formCollapse}
									className="mt-5"
								>
									<h5 className="mb-4">Leave a comment</h5>
									<Form method="post">
										<Row>
											<Col md="6">
												<FormGroup>
													<Label for="name" className="form-label">
														Name <span className="required">*</span>
													</Label>
													<Input
														id="name"
														type="text"
														className="form-control-underlined"
													/>
												</FormGroup>
											</Col>
											<Col md="6">
												<FormGroup>
													<Label for="email" className="form-label">
														Email <span className="required">*</span>
													</Label>
													<Input
														id="email"
														type="text"
														className="form-control-underlined"
													/>
												</FormGroup>
											</Col>
										</Row>
										<FormGroup className="mb-4">
											<Label for="comment" className="form-label">
												Comment <span className="required">*</span>
											</Label>
											<Input
												id="comment"
												type="textarea"
												className="form-control form-control-underlined"
												rows="4"
											/>
										</FormGroup>
										<Button type="submit" color="outline-dark">
											<i className="far fa-comment" /> Comment
                    </Button>
									</Form>
								</Collapse>
							</div>
						</Col>
					</Row>
				</Container>
			</section>
		</>
	);
};

export default BlogPost;