import React from 'react';
import { Statistics } from './Statistics';
import { AddEmployee } from './Table/AddEmployee';
import { SimpleGrid, Stack, useColorModeValue } from '@chakra-ui/react';
import { Divider } from './Table/Divider';
import peopleImage from '../../../../../src/assets/people-image.png';
import { Footer } from '../../../../Components/Footer';
import { ChartStatistics } from './Table/ChartStatistics';
import { WalletIcon } from '../../../../Components/Icons/Icons';
import { LineChart } from './Table/LineChart';
import { EmployeeHeader } from '../../../../Employee/EmployeeHeader';
import { Header } from '../../../../Components/Sidebar/Header';
export const Dashboard = () => {
  const iconBoxInside = useColorModeValue('white', 'white');
  return (
    <React.Fragment>
      <Header/>
      <Stack spacing={'50px'}>
        <Statistics />
        <Divider
          title={'Lead Generation'}
          description={'Some thi g else'}
          backgroundImage={peopleImage}
        />

        <SimpleGrid gap={{ sm: '12px' }} columns={1}>
          <ChartStatistics
            title={'Job Overview'}
            percentage={5}
            chart={<LineChart />}
          />
        </SimpleGrid>
        <AddEmployee />
      </Stack>
    </React.Fragment>
  );
};
