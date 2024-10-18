import { Box, useStyleConfig, BoxProps } from '@chakra-ui/react';
import React, { ReactNode } from 'react';

interface CardHeaderProps extends BoxProps {
  variant?: string;
  children: ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = (props) => {
  const { variant, children, ...rest } = props;
  const styles = useStyleConfig('CardHeader', { variant });

  return (
    <Box __css={styles} {...rest}>
      {children}
    </Box>
  );
};

export default CardHeader;
