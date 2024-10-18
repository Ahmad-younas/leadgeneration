import { Flex, SimpleGrid, useColorModeValue } from '@chakra-ui/react';
import { BookedIcon, CancelIcon, IsolatedIcon, SubmittedIcon } from '../../../../Components/Icons/Icons';
import React, { useEffect, useState } from 'react'; // Import useEffect and useState
import axios from 'axios'; // Import Axios
import MiniStatistics from './MiniStatistics';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';

interface StatusCount {
  status: string;
  status_count: number;
}
type StatusCountResponse = StatusCount[];
export const Statistics: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const iconBoxInside = useColorModeValue('white', 'white');

  // State to store statistics
  const [statistics, setStatistics] = useState<StatusCountResponse>([]);

  useEffect(() => {
    if (user?.id) {
      axios
        .get<StatusCountResponse>(`http://localhost:3002/api/getStatusCountOfJobs`, { params: { user_id: user.id } })
        .then((response) => {
          setStatistics(response.data);
        })
        .catch((error) => {
          console.error('Error fetching statistics:', error);
        });
    }
  }, []);
  const totalBooked = statistics.find(item => item.status === 'Booked')?.status_count || 0;
  const totalInsulated = statistics.find(item => item.status === 'Insulated')?.status_count || 0;
  const totalSubmitted = statistics.find(item => item.status === 'Submitted')?.status_count || 0;
  const totalCanceled = statistics.find(item => item.status === 'Canceled')?.status_count || 0;
  return (
    <Flex flexDirection="column" pt={{ base: '120px', md: '60px' }}>
      <SimpleGrid columns={{ sm: 1, md: 2, xl: 4 }} spacing="24px">
        <MiniStatistics
          title={'Total Booked'}
          amount={totalBooked}
          percentage={0}
          icon={<BookedIcon h={'24px'} w={'24px'} color={'white'} />}
        />
        <MiniStatistics
          title={'Total Insulated'}
          amount={totalInsulated}
          percentage={0}
          icon={<IsolatedIcon h={'24px'} w={'24px'} color={iconBoxInside} />}
        />
        <MiniStatistics
          title={'Total Submitted'}
          amount={totalSubmitted}
          percentage={0}
          icon={<SubmittedIcon h={'24px'} w={'24px'} color={iconBoxInside} />}
        />
        <MiniStatistics
          title={'Total Canceled'}
          amount={totalCanceled}
          percentage={0}
          icon={<CancelIcon h={'24px'} w={'24px'} color={iconBoxInside} />}
        />
      </SimpleGrid>
    </Flex>
  );
};
