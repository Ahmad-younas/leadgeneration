import React from 'react';
import { NavbarLinks } from '../../../../Components/Navbar/NavbarLinks';
import {
  getLastPathSegment,
  getSecondLastPathSegment,
} from '../../../../RoutePath/Path';
import { Stack, useColorModeValue } from '@chakra-ui/react';
import { AllJobsTable } from './Table/AllJobsTable';
import { AdminNavbarLink } from './Table/AdminNavbarLink';

export const AllJobs = () => {
  const navbarIcon = useColorModeValue('gray.500', 'gray.200');
  const mainText = useColorModeValue('gray.700', 'gray.200');
  const secondaryText = useColorModeValue('gray.700', 'white');
  const backGroundColor = useColorModeValue('white', 'white');
  return (
    <React.Fragment>
      <Stack spacing={4}>
        <AdminNavbarLink brandText={getSecondLastPathSegment(window.location.pathname)}
                         brandTextS={getLastPathSegment(window.location.pathname)}
                         mainTextColor={mainText}
                         secondaryTextColor={secondaryText}
                         navbarIconColor={navbarIcon}
                         backgroundColor={backGroundColor}/>
        <AllJobsTable />
      </Stack>
    </React.Fragment>
  );
};
