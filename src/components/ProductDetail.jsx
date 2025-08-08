import Stars from "./Stars";

const ProductDetail = ({ averageRating, comments }) => {
	const nbComments = comments?.length ?? 0;

	// Only show reviews section if there are reviews to display
	if (!averageRating && (!comments || comments.length === 0)) {
		return null;
	}

	return (
		<div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200 mb-8">
			<h3 className="text-xl font-semibold text-neutral-900 mb-4">
				Avis clients
			</h3>
			
			{/* Reviews */}
			{averageRating && (
				<div className="flex items-center gap-3 mb-4">
					<Stars
						stars={averageRating}
						secondColor="gray-300"
						starClass="text-amber-400"
						className="flex"
					/>
					<span className="text-sm text-neutral-600 font-medium">
						{averageRating}/5 ({nbComments} {nbComments === 1 ? 'avis' : 'avis'})
					</span>
				</div>
			)}

			{/* Comments preview */}
			{comments && comments.length > 0 && (
				<div className="space-y-3">
					{comments.slice(0, 2).map((comment, index) => (
						<div key={index} className="bg-neutral-50 rounded-lg p-4">
							<div className="flex items-start justify-between mb-2">
								<div className="font-medium text-neutral-900">
									{comment.author || 'Client vérifié'}
								</div>
								{comment.rating && (
									<Stars
										stars={comment.rating}
										secondColor="gray-300"
										starClass="text-amber-400"
										className="flex"
										size="sm"
									/>
								)}
							</div>
							<p className="text-neutral-700 text-sm leading-relaxed">
								{comment.text || comment.content}
							</p>
						</div>
					))}
					
					{comments.length > 2 && (
						<button className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors duration-200 font-medium">
							Voir tous les avis ({comments.length})
						</button>
					)}
				</div>
			)}
		</div>
	);
};

export default ProductDetail;
