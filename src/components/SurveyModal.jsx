import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

const SurveyModal = ({ survey, isOpen = false, onToggleModal }) => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const [page, setPage] = useState(0);
  const [responsesSelected, setResponsesSelected] = useState([]);
  const { questions, redirectionMessage, redirections } = survey;

  const handleToggleModal = () => {
    onToggleModal(!isOpen);
  };

  const handleGoPrevPage = () => {
    setPage(page - 1);
  };

  const handleSelectResponse = (responseNumber) => {
    const nextPage = page + 1;
    setResponsesSelected([...responsesSelected, `${nextPage}-${responseNumber}`]);
    setPage(nextPage);
  };

  const getRedirectionLink = () => {
    const redirection = redirections.find(({ responsesSerie }) => {
      const responsesSelectedStringify = responsesSelected.join();
      const series = responsesSerie.split('|');
      const hasValidConditionedSeries = series.some(serie => {
        const seriesConditioned = serie.split('&');
        return seriesConditioned.every(serieConditioned => responsesSelectedStringify.includes(serieConditioned));
      });
      return hasValidConditionedSeries;
    });
    return redirection?.link;
  };

  const getQuestion = () => {
    if (page >= questions.length) {
      const redirectionLink = getRedirectionLink();

      if (!redirectionLink) {
        return (
          <div className="flex flex-col justify-center items-center h-full">
            <h3>{t('error_default_message')}</h3>
          </div>
        );
      }

      setTimeout(() => {
        router.push(redirectionLink);
      }, 1500);

      return (
        <div className="flex flex-col justify-center items-center h-full">
          <h4>{redirectionMessage}</h4>
        </div>
      );
    } else {
      const { question, responses } = questions[page];

      return (
        <>
          <div className="my-4 flex justify-center">
            <h4>{question}</h4>
          </div>
          <div className="flex flex-col gap-2 w-full max-w-lg mx-auto">
            {responses
              .sort((a, b) => a.number - b.number)
              .map(({ label, number }, index) => (
                <button
                  key={`${index}-${number}`}
                  className="my-2 w-full rounded-lg border border-primary text-primary py-2 px-4 font-semibold hover:bg-primary hover:text-white transition focus:outline-primary focus-visible:ring-2 focus-visible:ring-primary"
                  onClick={() => handleSelectResponse(number)}
                  type="button"
                >
                  {label}
                </button>
              ))}
          </div>
        </>
      );
    }
  };

  const progressValue = (page * 100) / questions.length;
  const hasPrevBtn = page > 0 && page !== questions.length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full h-full max-w-full flex items-center justify-center">
        <div className="relative bg-white rounded-lg shadow-lg w-full h-full flex flex-col max-w-2xl">
          {/* Progress bar */}
          <div className="w-full h-[3px] bg-gray-200">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${progressValue}%` }}
            />
          </div>
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div style={{ height: "3rem" }}>
              {hasPrevBtn && (
                <button
                  type="button"
                  onClick={handleGoPrevPage}
                  className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition"
                  aria-label={t('previous')}
                >
                  <span aria-hidden="true">←</span>
                </button>
              )}
            </div>
            <div className="flex-1 flex justify-center pl-5">
              <img src="/svg/logo.svg" alt="Mine logo" className="h-8" />
            </div>
            <button
              type="button"
              onClick={handleToggleModal}
              className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition ml-2"
              aria-label={t('close')}
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col justify-center">
            {getQuestion()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyModal;