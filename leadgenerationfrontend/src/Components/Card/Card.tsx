import { Box, useStyleConfig } from '@chakra-ui/react';
import React from 'react';

interface CardProps {
  variant?: string;
  children: React.ReactNode;
  [key: string]: any; // For any additional props
}

export const Card: React.FC<CardProps> = (props) => {
  const { variant, children, ...rest } = props;
  const styles = useStyleConfig('Card', { variant });
  // Pass the computed styles into the `__css` prop
  return (
    <Box __css={styles} {...rest}>
      {children}
    </Box>
  );
};
