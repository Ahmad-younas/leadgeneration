// Chakra imports
import {
  Flex,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  useColorModeValue,
} from '@chakra-ui/react';
// Custom components
import { Card } from '../../../../Components/Card/Card';
import { CardBody } from '../../../../Components/Card/Cardbody';
import IconBox from '../../../../Components/Icons/IconBox';
import React from 'react';
import { MiniStatisticsProps } from '../../../../interfaces';

const MiniStatistics: React.FC<MiniStatisticsProps> = ({
  title,
  amount,
  percentage,
  icon,
}) => {
  const iconTeal = useColorModeValue('teal.300', 'teal.300');
  const textColor = useColorModeValue('gray.700', 'white');

  return (
    <Card
      bg={'white'}
      boxShadow={'rgba(0, 0, 0, 0.02) 0px 3.5px 5.5px'}
      borderRadius="15px"
    >
      <CardBody p={'12px'} justify={'center'}>
        <Flex
          flexDirection="row"
          align="center"
          justify="center"
          w="100%"
          p={'5px'}
        >
          <Stat me="auto">
            <StatLabel
              fontSize="sm"
              color="gray.400"
              fontWeight="bold"
              pb=".1rem"
            >
              {title}
            </StatLabel>
            <Flex>
              <StatNumber fontSize="lg" color={textColor}>
                {amount}
              </StatNumber>
              <StatHelpText
                alignSelf="flex-end"
                justifySelf="flex-end"
                m="0px"
                color={percentage > 0 ? 'green.400' : 'red.400'}
                fontWeight="bold"
                ps="3px"
                fontSize="md"
              >
                {percentage > 0 ? `+${percentage}%` : `${percentage}%`}
              </StatHelpText>
            </Flex>
          </Stat>
          <IconBox as="box" h="45px" w="45px" bg={iconTeal}>
            {icon}
          </IconBox>
        </Flex>
      </CardBody>
    </Card>
  );
};
export default MiniStatistics;
