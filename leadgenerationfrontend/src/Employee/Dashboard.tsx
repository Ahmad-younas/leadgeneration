import React from 'react';
import { EmployeeHeader } from './EmployeeHeader';
import { SimpleGrid, Stack } from '@chakra-ui/react';
import { Statistics } from '../Admin/Component/Dashboard/component/Statistics';
import { Divider } from '../Admin/Component/Dashboard/component/Table/Divider';
import peopleImage from '../assets/people-image.png';
import { ChartStatistics } from './ChartStatistics';
import LineChart  from './LineChart';
export const Dashboard = () => {
  return (
    <React.Fragment>
      <EmployeeHeader />
      <Stack spacing={'50px'}>
        <Statistics />
        <Divider
          title={'Lead Generation'}
          description={
            'Lead generation involves attracting potential customers through strategies like content marketing, social media, and SEO. It requires understanding the target audience and creating compelling offers to capture their interest. Effective lead generation drives revenue growth and builds lasting customer relationships.'
          }
          backgroundImage={peopleImage}
        />

        <SimpleGrid gap={{ sm: '12px' }} columns={1}>
          <ChartStatistics
            title={'Job Overview'}
            percentage={5}
            chart={<LineChart />}
          />
        </SimpleGrid>
      </Stack>
    </React.Fragment>
  );
};
