import Link from "next/link";

const Post = ({ data }) => {
  return (
    <>
      <div className="mb-30px">
        <Link href="/blog/[slug]" as={`/blog/${data.slug}`}>
          <a>
            <img className="img-fluid" src={data.img} alt={data.title} />
          </a>
        </Link>
        <div className="mt-3">
          <small className="text-uppercase text-muted">{data.category}</small>
          <h5 className="my-2">
            <Link href="/blog/[slug]" as={`/blog/${data.slug}`}>
              <a className="text-dark">{data.title}</a>
            </Link>
          </h5>

          <p className="text-gray-500 text-sm my-3">
            <i className="far fa-clock mr-2" />
            {data.date}
          </p>
          <p className="my-2 text-muted">{data.content}</p>

          <Link href="/blog/[slug]" as={`/blog/${data.slug}`}>
            <a className="btn btn-link text-gray-700 pl-0">
              Read more <i className="fa fa-long-arrow-alt-right ml-2" />
            </a>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Post;
