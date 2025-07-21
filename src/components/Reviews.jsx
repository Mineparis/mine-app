import React from 'react';
import { useTranslation } from 'next-i18next';

const Reviews = ({ comments, averageRating }) => {
  const { t } = useTranslation('common');

  if (!comments || comments.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-500 text-lg">
          {t('no_reviews_yet')}
        </p>
        <p className="text-neutral-400 text-sm mt-2">
          {t('be_first_to_review', 'Be the first to share your experience with this product.')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {comments.map((comment, index) => (
        <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-neutral-100">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center">
                  <span className="text-neutral-600 font-medium text-sm">
                    {comment.author?.charAt(0)?.toUpperCase() || 'A'}
                  </span>
                </div>
                <div>
                  <h4 className="font-medium text-neutral-900">
                    {comment.author || 'Anonymous customer'}
                  </h4>
                  {comment.date && (
                    <p className="text-sm text-neutral-500">
                      {new Date(comment.date).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Comment title if available */}
              {comment.title && (
                <h5 className="font-medium text-neutral-900 mb-2">
                  {comment.title}
                </h5>
              )}
              
              {/* Comment content */}
              <div className="text-neutral-700 leading-relaxed">
                {typeof comment.content === 'string' ? (
                  <p>{comment.content}</p>
                ) : (
                  <div 
                    dangerouslySetInnerHTML={{ 
                      __html: comment.content || comment.text || comment.body || '' 
                    }} 
                  />
                )}
              </div>
              
              {/* Additional information */}
              {comment.verified && (
                <div className="mt-3 flex items-center gap-1 text-sm text-green-600">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {t('verified_purchase', 'Verified purchase')}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Simple pagination if many comments */}
      {comments.length > 5 && (
        <div className="text-center pt-8">
          <button className="px-6 py-2 border border-neutral-300 text-neutral-700 hover:bg-neutral-50 transition-colors duration-200">
            {t('load_more_reviews', 'See more reviews')}
          </button>
        </div>
      )}
    </div>
  );
};

export default Reviews;
