import { Container } from "reactstrap";
import Image from "../components/CustomImage";

const ComingSoon = () => {
	return (
		<>
			<div className="mh-full-screen d-flex align-items-center dark-overlay">
				<Image
					className="bg-image"
					src="https://source.unsplash.com/featured/?black,models,fashion"
					alt=""
					layout="fill"
				/>

				<Container className="text-white text-center text-lg overlay-content py-6 py-lg-0">
					<h1 className="text-hide">Coming soon</h1>
					<div className=" mx-auto mb-6">
						<Image
							className="bg-image"
							src="/img/coming-soon.png"
							alt=""
							width={489}
							height={279}
						/>
					</div>
					<h3 className="mb-5 font-weight-normal">
						The box is coming to you soon.
					</h3>
					<ul className="list-inline">
						<li className="list-inline-item">
							<a
								className="text-white"
								href="https://www.instagram.com/_mineparis"
								target="_blank"
								title="instagram"
							>
								<i className="fab fa-instagram"></i>
							</a>
						</li>
					</ul>
				</Container>
			</div>
		</>
	);
};

export default ComingSoon;