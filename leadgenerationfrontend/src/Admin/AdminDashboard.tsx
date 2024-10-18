import React, { useRef } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, ChakraProvider } from '@chakra-ui/react';
import { SidebarContent } from '../Components/Sidebar/SidebarContent';
import { dashRoutes } from '../Routes/AdminRoutes';
import { SideBarProps } from '../interfaces';
import { AdminTheme } from './AdminTheme';

export const AdminDashboard: React.FC<SideBarProps> = ({ sidebarVariant }) => {
  const variantChange = '0.2s linear';
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
              routes={dashRoutes}
              logoText={'LEADS DASHBOARD'}
              display="block"
              sidebarVariant={sidebarVariant}
            />
          </Box>

          {/* Main Content Section */}
          <Box w="75%" maxW={'75%'} ml="25%" p="4">
            <Routes>
              {dashRoutes.map((route, key) => (
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

// <Box
//   bg="white"
//   borderRight="1px"
//   borderRightColor="gray.200"
//   w={{ base: 'full', md: 60 }}
//   pos="fixed"
//   h="full"
// >
//   <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
//     <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
//       PURITY UI DASHBOARD
//     </Text>
//   </Flex>
//   <VStack spacing="4">
//
//     <NavItem icon={FaMoneyBill} to="/billing">
//       Billing
//     </NavItem>
//     <NavItem icon={FaTools} to="/rtl">
//       RTL
//     </NavItem>
//     <Text fontSize="sm" color="gray.500" mt="10" mb="2">
//       ACCOUNT PAGES
//     </Text>
//     <NavItem icon={FaUser} to="/profile">
//       Profile
//     </NavItem>
//     <NavItem icon={FaSignInAlt} to="/signin">
//       Sign In
//     </NavItem>
//     <NavItem icon={FaUserPlus} to="/signup">
//       Sign Up
//     </NavItem>
//   </VStack>
// </Box>
