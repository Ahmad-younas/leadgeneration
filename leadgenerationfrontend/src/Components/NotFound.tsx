import React from 'react';
import Lottie from 'react-lottie';
import NotFoundPage from '../assets/404page.json';

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: NotFoundPage,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
};
export const NotFound: React.FC = () => {
  return <Lottie options={defaultOptions} height={'50%'} width={'50%'} />;
};
