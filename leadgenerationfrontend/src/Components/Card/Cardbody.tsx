import { Box, useStyleConfig } from '@chakra-ui/react';
import React from 'react';

interface CardBodyProps {
  variant?: string;
  children: React.ReactNode;
  [key: string]: any; // For any additional props
}

export const CardBody: React.FC<CardBodyProps> = (props) => {
  const { variant, children, ...rest } = props;
  const styles = useStyleConfig('CardBody', { variant });
  // Pass the computed styles into the `__css` prop
  return (
    <Box __css={styles} {...rest}>
      {children}
    </Box>
  );
};
