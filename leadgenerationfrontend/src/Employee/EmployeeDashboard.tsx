import React, { useRef } from 'react';
import { SideBarProps } from '../interfaces';
import { Box, ChakraProvider } from '@chakra-ui/react';
import { SidebarContent } from '../Components/Sidebar/SidebarContent';
import { EmployeeRoutes } from '../Routes/EmployeeRoutes';
import { Route, Routes } from 'react-router-dom';
import { AdminTheme } from '../Admin/AdminTheme';

export const EmployeeDashboard: React.FC<SideBarProps> = ({
  sidebarVariant,
}) => {
  const mainPanel = useRef<HTMLDivElement>(null);
  console.log('mainpanel' + mainPanel);
  const variantChange = '0.2s linear';

  console.log(window.location.pathname);
  const opaqueMargins = '16px 0px 16px 16px';
  const transparentMargins = '0px';
  const sidebarMargins =
    sidebarVariant === 'opaque' ? opaqueMargins : transparentMargins;

  return (
    <ChakraProvider theme={AdminTheme}>
      <React.Fragment>
        <Box display="flex" flexDirection="row" h="100vh">
          <Box
            w="260px"
            bg="white"
            position="fixed"
            display={{ sm: 'none', xl: 'block' }}
            h="calc(100vh - 32px)"
            transition={variantChange}
            ms={{ sm: '16px' }}
            my={{ sm: '16px' }}
            ps="20px"
            pe="20px"
            m={sidebarMargins}
            borderRadius={'16px'}
          >
            <SidebarContent
              routes={EmployeeRoutes}
              logoText={'Leads Generation'}
              display={'block'}
              sidebarVariant={sidebarVariant}
            />
          </Box>
          <Box w="75%" maxW={'75%'} ml="25%" p="4">
            <Routes>
              {EmployeeRoutes.map((route, key) => (
                <Route
                  path={route.path}
                  element={<route.component />}
                  key={key}
                />
              ))}
            </Routes>
          </Box>
        </Box>
      </React.Fragment>
    </ChakraProvider>
  );
};
