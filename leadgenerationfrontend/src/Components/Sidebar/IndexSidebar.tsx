import React, { useRef } from 'react';
import { Box, useColorModeValue } from '@chakra-ui/react';
import { SidebarProps } from '../../interfaces';
import { SidebarContent } from './SidebarContent';
export const IndexSidebar: React.FC<SidebarProps> = ({
  logoText,
  routes,
  sidebarVariant,
}) => {
  const mainPanel = useRef<HTMLDivElement>(null);
  const variantChange = '0.2s linear';

  const opaqueBg = useColorModeValue('white', 'gray.700');
  const transparentBg = 'none';
  const opaqueRadius = '16px';
  const transparentRadius = '0px';
  const opaqueMargins = '16px 0px 16px 16px';
  const transparentMargins = '0px';
  const sidebarBg = sidebarVariant === 'opaque' ? opaqueBg : transparentBg;
  const sidebarRadius =
    sidebarVariant === 'opaque' ? opaqueRadius : transparentRadius;
  const sidebarMargins =
    sidebarVariant === 'opaque' ? opaqueMargins : transparentMargins;

  return (
    <Box ref={mainPanel}>
      <Box display={{ sm: 'none', xl: 'block' }} position="fixed">
        <Box
          bg={sidebarBg}
          transition={variantChange}
          w="260px"
          maxW="260px"
          ms={{ sm: '16px' }}
          my={{ sm: '16px' }}
          h="calc(100vh - 32px)"
          ps="20px"
          pe="20px"
          m={sidebarMargins}
          borderRadius={sidebarRadius}
        >
          <SidebarContent
            routes={routes}
            logoText={'PURITY UI DASHBOARD'}
            display="block"
            sidebarVariant={sidebarVariant}
          />
        </Box>
      </Box>
    </Box>
  );
};
