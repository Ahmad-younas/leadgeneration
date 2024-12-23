import React, { useState } from 'react';
import { Flex } from '@chakra-ui/react';
import { EmployeeTable } from './Table/EmployeeTable';

export const Employees: React.FC = (props) => {
  const [fixed, setFixed] = useState(false);
  return (
    <React.Fragment>
      <Flex justifyContent={'space-between'}>
        <EmployeeTable />
      </Flex>
    </React.Fragment>
  );
};
