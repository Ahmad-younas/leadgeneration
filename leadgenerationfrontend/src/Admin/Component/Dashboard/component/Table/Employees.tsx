import React, { useEffect, useState } from 'react';
import { Card } from '../../../../../Components/Card/Card';
import CardHeader from '../../../../../Components/Card/CardHeader';
import {
  Box, Button, Checkbox,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Table,
  Tbody,
  Th,
  Thead,
  Tr,
  useColorModeValue, useToast,
} from '@chakra-ui/react';
import { Text } from '@chakra-ui/react';
import { CardBody } from '../../../../../Components/Card/Cardbody';
import { TableDataRow } from './TableDataRow';
import { DeleteIcon, SearchIcon } from '@chakra-ui/icons';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import axios from 'axios';

interface DataRow {
  email: string;
  username: string;
  password: string;
  role:string
  id:string
  link:string
}
interface cardTableProps {
  title: string;
  data: DataRow[];
  captions: string[];
}
export const Employees: React.FC<cardTableProps> = ({
  title,
  data,
  captions,
}) => {
  const textColor = useColorModeValue('gray.700', 'white');
  let mainTeal = useColorModeValue('teal.300', 'teal.300');
  let inputBg = useColorModeValue('white', 'gray.800');
  let mainText = useColorModeValue('gray.700', 'gray.200');
  let navbarIcon = useColorModeValue('gray.500', 'gray.200');
  let searchIcon = useColorModeValue('gray.700', 'gray.200');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [employees, setEmployees] = useState(data);
  const toast = useToast();

  const filteredData = employees.filter((row) =>
    row.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row.password.toLowerCase().includes(searchQuery.toLowerCase())
  );
  useEffect(() => {
  }, [employees]);

  const handleSelectAll = (isChecked: boolean) => {
    if (isChecked) {
      setSelectedEmployees(filteredData.map((employee) => employee.id));
    } else {
      setSelectedEmployees([]);
    }
  };


  const handleSelectEmployee = (id: string) => {
    setSelectedEmployees((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((employeeId) => employeeId !== id)
        : [...prevSelected, id]
    );
  };

  const handleDeleteSelected = async () => {
    try {
      const response = await axios.post('http://localhost:3002/api/deleteSelectedEmployees', {
        employeeIds: selectedEmployees, // Pass the selected employee IDs to the backend
      });
      if(response.status === 200){
        toast({
          title: 'Employee Status.',
          description: ' Employee Successfully Added.',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
      }
      setEmployees((prevEmployees) =>
        prevEmployees.filter((employee) => !selectedEmployees.includes(employee.id))
      );
      setSelectedEmployees([]);
      setSelectedEmployees([]);
    } catch (error) {
      console.error('Error deleting selected employees:', error);
    }
  };


  return (
    <React.Fragment>
      <Card
        overflowX={{ sm: 'scroll', xl: 'auto' }}
        bg={'white'}
        padding={'22px'}
        borderRadius={'15px'}
        boxshadow={'rgba(0, 0, 0, 0.02) 0px 3.5px 5.5px'}
      >
        <CardHeader
          p="6px 0px 22px 0px"
          display={'flex'}
          justifyContent={'space-between'}
        >
          <Text fontSize="xl" color={textColor} fontWeight="bold">
            {title}
          </Text>
          <Box display={'flex'} justifyContent={'end'} >
            <Button
              leftIcon={<DeleteIcon />}
              colorScheme="teal"
              variant="solid"
              onClick={handleDeleteSelected}
              isDisabled={selectedEmployees.length === 0}
              marginX="10px"
            >
              Delete Selected
            </Button>
            <Button
              leftIcon={<DeleteIcon />}
              colorScheme="teal"
              variant="solid"
            >
              Delete All Employees
            </Button>

            <InputGroup
              cursor="pointer"
              bg={inputBg}
              borderRadius="10px"
              mx={'10'}
              w={{
                sm: '128px',
                md: '200px',
              }}
              me={{ sm: 'auto', md: '20px' }}
              _focus={{
                borderColor: { mainTeal },
              }}
              _active={{
                borderColor: { mainTeal },
              }}
            >
              <InputLeftElement
                children={
                  <IconButton
                    bg="inherit"
                    borderRadius="inherit"
                    _hover={{
                      cursor: 'pointer',
                    }}
                    _active={{
                      bg: 'inherit',
                      transform: 'none',
                      borderColor: 'transparent',
                    }}
                    _focus={{
                      boxShadow: 'none',
                    }}
                    icon={<SearchIcon color={searchIcon} w="15px" h="15px" />}
                    aria-label={'Search Employee'}
                  ></IconButton>
                }
              />
              <Input
                fontSize="xs"
                py="11px"
                color={mainText}
                placeholder="Type here..."
                borderRadius="inherit"
                value={searchQuery}
                onChange={(e)=> setSearchQuery(e.target.value)}
              />
            </InputGroup>
          </Box>

        </CardHeader>
        <CardBody>
          <Table variant="simple" color={textColor}>
            <Thead>
              <Tr my=".8rem" pl="0px" color="gray.400">
                <Th>
                  <Checkbox
                    isChecked={
                      selectedEmployees.length === filteredData.length &&
                      filteredData.length > 0
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    icon={<AiOutlineCheckCircle />}
                  />
                </Th>
                {captions.map((caption, idx) => {
                  return (
                    <Th
                      color="gray.400"
                      key={idx}
                    >
                      {caption}
                    </Th>
                  );
                })}
              </Tr>
            </Thead>
            <Tbody>
              {filteredData.map((row) => {
                return (
                  <Tr key={row.id}>
                    <Th>
                      <Checkbox
                        isChecked={selectedEmployees.includes(row.id)}
                        onChange={() => handleSelectEmployee(row.id)}
                      />
                    </Th>
                    <TableDataRow
                      name={row.username}
                      email={row.email}
                      password={row.password}
                      role={row.role}
                      id={row.id}
                      link={row.link}
                    />
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};
