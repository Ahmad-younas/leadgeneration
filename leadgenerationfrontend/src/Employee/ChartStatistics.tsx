// Chakra imports
import { Box, Flex, Text, useColorModeValue } from '@chakra-ui/react';
// Custom components

import React from 'react';
import { Card } from '../Components/Card/Card';
import CardHeader from '../Components/Card/CardHeader';

// Define the prop types using an interface
interface SalesOverviewProps {
  title: string;
  percentage: number;
  chart: React.ReactNode;
}

export const ChartStatistics: React.FC<SalesOverviewProps> = ({
  title,
  percentage,
  chart,
}) => {
  const textColor = useColorModeValue('gray.700', 'white');
  return (
    <Card
      p="28px 10px 16px 0px"
      mb={{ sm: '26px', lg: '0px' }}
      bg={'white'}
      borderRadius="15px"
    >
      <CardHeader mb="20px" pl="22px">
        <Flex direction="column" alignSelf="flex-start">
          <Text fontSize="lg" color={textColor} fontWeight="bold" mb="6px">
            {title}
          </Text>
          <Text fontSize="md" fontWeight="medium" color="gray.400">
            <Text
              as="span"
              color={percentage > 0 ? 'green.400' : 'red.400'}
              fontWeight="bold"
            >
              {`${percentage}%`} more
            </Text>
            {'  in '}
            {new Date().getFullYear()}
          </Text>
        </Flex>
      </CardHeader>
      <Box w="100%" h={{ sm: '300px' }} ps="8px">
        {chart}
      </Box>
    </Card>
  );
};
