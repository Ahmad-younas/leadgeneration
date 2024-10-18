declare module 'react-lottie' {
  import { Component } from 'react';

  export interface Options {
    loop?: boolean;
    autoplay?: boolean;
    animationData: any;
    rendererSettings?: {
      preserveAspectRatio?: string;
    };
  }

  export interface LottieProps {
    options: Options;
    height?: number | string;
    width?: number | string;
    isStopped?: boolean;
    isPaused?: boolean;
    speed?: number;
    direction?: number;
    ariaRole?: string;
    ariaLabel?: string;
    title?: string;
    eventListeners?: Array<{
      eventName: string;
      callback: () => void;
    }>;
  }

  export default class Lottie extends Component<LottieProps> {}
}
