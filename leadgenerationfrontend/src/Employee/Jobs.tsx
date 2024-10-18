import React from 'react';
import {
  getLastPathSegment,
  getSecondLastPathSegment,
} from '../RoutePath/Path';
import { EmployeeNavbarLink } from './EmployeeNavbarLink';
import { Stack, useColorModeValue } from '@chakra-ui/react';
import { AllJobsTable } from './AllJobsTable';
export const Jobs: React.FC = () => {
  const backGroundColor = useColorModeValue('white', 'white');
  const navbarIcon = useColorModeValue('gray.500', 'gray.200');
  const mainText = useColorModeValue('gray.700', 'gray.200');
  const secondaryText = useColorModeValue('gray.700', 'white');
  return (
    <React.Fragment>
      <Stack spacing={4}>
        <EmployeeNavbarLink
          brandText={getSecondLastPathSegment(window.location.pathname)}
          brandTextS={getLastPathSegment(window.location.pathname)}
          mainTextColor={mainText}
          secondaryTextColor={secondaryText}
          navbarIconColor={navbarIcon}
          backgroundColor={backGroundColor}
        />
        <AllJobsTable />
      </Stack>
    </React.Fragment>
  );
};
