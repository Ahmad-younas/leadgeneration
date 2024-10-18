export const getLastPathSegment = (pathname: string): string => {
  const segments = pathname.split('/');
  return segments[segments.length - 1];
};

export const getSecondLastPathSegment = (pathname: string): string => {
  const segments = pathname.split('/');
  return segments[segments.length - 2];
};
