import NextProgress from 'nextjs-progressbar';

const ProgressBar = () => (
  <NextProgress
    color="#191919"
    startPosition={0.3}
    stopDelayMs={100}
    height={3}
    options={{
      showSpinner: false,
      trickleSpeed: 100,
    }}
    nonce={undefined}
  />
);

export default ProgressBar;