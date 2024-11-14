import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { GrDropbox, GrEdit, GrView } from 'react-icons/gr';
import {
  Box,
  Button,
  Checkbox,
  Flex,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { ViewEmployeeJob } from './ViewEmployeeJob';
import { ArrowBackIcon, ArrowForwardIcon, SearchIcon } from '@chakra-ui/icons';
import { EditEmployeeJob } from './EditEmployeeJob';
import { Jobs } from '../../../../../Employee/Jobs';
import { ENDPOINTS } from '../../../../../utils/apiConfig';
import { logout } from '../../../../../redux/authSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'redux/store';

interface Jobs {
  title: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  contactNumber: string;
  address: string;
  id: number;
  user_id: number;
}

interface MetaData {
  totalPages: number;
  currentPage: number;
}

export const AllJobsTable = () => {
  let mainTeal = useColorModeValue('teal.300', 'teal.300');
  let inputBg = useColorModeValue('white', 'gray.800');
  let mainText = useColorModeValue('gray.700', 'gray.200');
  let searchIcon = useColorModeValue('gray.700', 'gray.200');
  const [Loading, setLoading] = useState(false);
  const [isOpenViewEmployeeModel, setIsOpenViewEmployeeModel] =
    useState<boolean>(false);
  const [isOpenEditEmployeeModel, setIsOpenEditEmployeeModel] =
    useState<boolean>(false);
  const [jobs, setJobs] = useState<Jobs[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const [selectedJobs, setSelectedJobs] = useState<number[]>([]);
  const onCloseViewModel = () => setIsOpenViewEmployeeModel(false);
  const onCloseEditModel = () => setIsOpenEditEmployeeModel(false);
  const [metaData, setMetaData] = useState<MetaData | null>(null);
  const totalPages = metaData?.totalPages ?? 5;
  const currentPage = metaData?.currentPage ?? 1;
  const toast = useToast();
  const token = localStorage.getItem('authToken');
  const [editData, setEditData] = useState({
    id: '',
    title: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    contactNumber: '',
    address: '',
    postcode: '',
    landlordName: '',
    landlordContactNumber: '',
    landlordEmail: '',
    agentName: '',
    agentContactNumber: '',
    agentEmail: '',
    heatingType: '',
    propertyType: '',
    epcRating: '',
    serviceType: '',
    assessmentDate: '',
    notes: '',
    month: '',
    year: '',
    username: '',
    role: '',
    userEmail: '',
    status: '',
    epcBand: '',
    waterType: '',
  });
  useEffect(() => {
    setLoading(true);
    axios
      .get(ENDPOINTS.getAllJobs, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      })
      .then((response) => {
        setJobs(response.data.jobs);
        setLoading(false);
        setMetaData(response.data.meta);
      })
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          if (
            error?.response?.status === 403 ||
            error?.response?.status === 401
          ) {
            dispatch(logout());
          }
        }
      });
  }, []);

  const handleSelectAll = () => {
    if (selectedJobs.length === jobs.length) {
      setSelectedJobs([]); // Deselect all
    } else {
      setSelectedJobs(jobs.map((job) => job.id)); // Select all
    }
  };
  const handleCheckboxChange = (jobId: number) => {
    setSelectedJobs((prevSelectedJobs) =>
      prevSelectedJobs.includes(jobId)
        ? prevSelectedJobs.filter((id) => id !== jobId)
        : [...prevSelectedJobs, jobId]
    );
  };

  const handleDeleteSelected = () => {
    if (selectedJobs.length === 0) {
      toast({
        title: 'No Jobs Selected',
        position: 'top-right',
        description: 'Please select at least one job to delete.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    axios
      .post(
        ENDPOINTS.deleteSelectedJob,
        {
          jobIds: selectedJobs,
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          toast({
            title: 'Jobs Status',
            position: 'top-right',
            description: response.data.message,
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
        }
        setJobs(jobs.filter((job) => !selectedJobs.includes(job.id))); // Update the jobs state after deletion
        setSelectedJobs([]); // Clear selected jobs
      })
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          if (
            error?.response?.status === 403 ||
            error?.response?.status === 401
          ) {
            dispatch(logout());
          }
        }
        console.log('Error deleting jobs:', error);
      });
  };

  const handleDeleteAllJob = async () => {
    if (jobs.length === 0) {
      toast({
        title: 'No Jobs Found',
        position: 'top-right',
        description: 'Please enter the job first.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    try {
      const response = await axios.post(
        ENDPOINTS.deleteAllJobs,
        { jobIds: jobs },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const responseData = response.data;

      if (response.status === 200) {
        toast({
          title: 'Jobs Status',
          position: 'top-right',
          description: responseData.message,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setJobs([]);
        setSelectedJobs([]); // Clear selected jobs
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (
          error?.response?.status === 403 ||
          error?.response?.status === 401
        ) {
          dispatch(logout());
        }
      }
      console.log('Error deleting jobs:', error);
    }
  };

  const fetchEmployeeInfoForView = (id: number, user_id: number) => {
    axios
      .post(
        ENDPOINTS.getEmployeeInfoAndEmployeeJobInfo,
        {
          employeeJobId: id,
          employeeId: user_id,
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      )
      .then((response) => {
        const { employeeInfo, employeeJobInfo } = response.data;
        setEditData({
          id: employeeJobInfo.id || '',
          title: employeeJobInfo.title || '',
          firstName: employeeJobInfo.firstName || '',
          lastName: employeeJobInfo.lastName || '',
          dateOfBirth: employeeJobInfo.dateOfBirth || '',
          email: employeeJobInfo.email || '',
          contactNumber: employeeJobInfo.contactNumber || '',
          address: employeeJobInfo.address || '',
          postcode: employeeJobInfo.postcode || '',
          landlordName: employeeJobInfo.landlordName || '',
          landlordContactNumber: employeeJobInfo.landlordContactNumber || '',
          landlordEmail: employeeJobInfo.landlordEmail || '',
          agentName: employeeJobInfo.agentName || '',
          agentContactNumber: employeeJobInfo.agentContactNumber || '',
          agentEmail: employeeJobInfo.agentEmail || '',
          heatingType: employeeJobInfo.heatingType || '',
          propertyType: employeeJobInfo.propertyType || '',
          epcRating: employeeJobInfo.epcRating || '',
          serviceType: employeeJobInfo.serviceType || '',
          assessmentDate: employeeJobInfo.assessmentDate || '',
          notes: employeeJobInfo.notes || '',
          month: employeeJobInfo.month || '',
          year: employeeJobInfo.year || '',
          username: employeeInfo.username || '',
          role: employeeInfo.role || '',
          userEmail: employeeInfo.email || '',
          status: employeeJobInfo.status || '',
          epcBand: employeeJobInfo.epcBand || '',
          waterType: employeeJobInfo.waterType || '',
        });
        setIsOpenViewEmployeeModel(true);
      })
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          if (
            error?.response?.status === 403 ||
            error?.response?.status === 401
          ) {
            dispatch(logout());
          }
        }
        console.log('error', error);
      });
  };

  const fetchEmployeeInfoForEdit = (id: number, user_id: number) => {
    axios
      .post(
        ENDPOINTS.getEmployeeInfoAndEmployeeJobInfo,
        {
          employeeJobId: id, // Replace with actual employeeJobId
          employeeId: user_id, // Replace with actual employeeId
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      )
      .then((response) => {
        const { employeeInfo, employeeJobInfo } = response.data;
        setEditData({
          id: employeeJobInfo.id || '',
          title: employeeJobInfo.title || '',
          firstName: employeeJobInfo.firstName || '',
          lastName: employeeJobInfo.lastName || '',
          dateOfBirth: employeeJobInfo.dateOfBirth || '',
          email: employeeJobInfo.email || '',
          contactNumber: employeeJobInfo.contactNumber || '',
          address: employeeJobInfo.address || '',
          postcode: employeeJobInfo.postcode || '',
          landlordName: employeeJobInfo.landlordName || '',
          landlordContactNumber: employeeJobInfo.landlordContactNumber || '',
          landlordEmail: employeeJobInfo.landlordEmail || '',
          agentName: employeeJobInfo.agentName || '',
          agentContactNumber: employeeJobInfo.agentContactNumber || '',
          agentEmail: employeeJobInfo.agentEmail || '',
          heatingType: employeeJobInfo.heatingType || '',
          propertyType: employeeJobInfo.propertyType || '',
          epcRating: employeeJobInfo.epcRating || '',
          serviceType: employeeJobInfo.serviceType || '',
          assessmentDate: employeeJobInfo.assessmentDate || '',
          notes: employeeJobInfo.notes || '',
          month: employeeJobInfo.month || '',
          year: employeeJobInfo.year || '',
          username: employeeInfo.username || '',
          role: employeeInfo.role || '',
          userEmail: employeeInfo.email || '',
          status: employeeJobInfo.status || '',
          epcBand: employeeJobInfo.epcBand || '',
          waterType: employeeJobInfo.waterType || '',
        });
        setIsOpenEditEmployeeModel(true);
      })
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          if (
            error?.response?.status === 403 ||
            error?.response?.status === 401
          ) {
            dispatch(logout());
          }
        }
        console.log('error', error);
      });
  };

  const createDropBoxFolder = async (id: number, address: string) => {
    try {
      setLoading(true);
      const response = await axios.post(
        ENDPOINTS.createDropBoxLink + id,
        { address },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        toast({
          title: 'DropBox Folder Status.',
          description: 'Folder Successfully Created in Dropbox ',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
        setLoading(false);
      } else if (response.status === 409) {
        toast({
          title: 'DropBox Folder Status.',
          description: 'Folder Already Exist.',
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
        setLoading(false);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
          if (
            error?.response?.status === 403 ||
            error?.response?.status === 401
          ) {
            dispatch(logout());
          }
        if (error?.response?.status === 409) {
          toast({
            title: 'DropBox Folder Status.',
            description: 'Folder Already Exist.',
            status: 'warning',
            duration: 5000,
            isClosable: true,
            position: 'top-right',
          });
        } else if (error?.response?.data.error === 'Access token not found.') {
          toast({
            title: 'DropBox Folder Status.',
            description: 'Please Authenticate From Dropbox.',
            status: 'warning',
            duration: 5000,
            isClosable: true,
            position: 'top-right',
          });
        }

        setLoading(false);
      }
    }
  };

  const pageNumbers: number[] = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const handleButtonClicked = async (page: number) => {
    try {
      const response = await axios.get(ENDPOINTS.getAllJobs, {
        params: {
          page,
        },
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setJobs(response.data.jobs);
      setMetaData(response.data.meta);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (
          error?.response?.status === 403 ||
          error?.response?.status === 401
        ) {
          dispatch(logout());
        }
      }
      console.log('error', error);
    } finally {
      console.log('unCatch error');
    }
  };

  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = jobs.filter(
    (row) =>
      (row.title ? row.title.toLowerCase() : '').includes(
        searchQuery.toLowerCase()
      ) ||
      (row.email ? row.email.toLowerCase() : '').includes(
        searchQuery.toLowerCase()
      ) ||
      (row.firstName ? row.firstName.toLowerCase() : '').includes(
        searchQuery.toLowerCase()
      ) ||
      (row.lastName ? row.lastName.toLowerCase() : '').includes(
        searchQuery.toLowerCase()
      ) ||
      (row.address ? row.address.toLowerCase() : '').includes(
        searchQuery.toLowerCase()
      ) ||
      (row.contactNumber ? row.contactNumber.toLowerCase() : '').includes(
        searchQuery.toLowerCase()
      )
  );

  return (
    <React.Fragment>
      <ViewEmployeeJob
        isOpenModel={isOpenViewEmployeeModel}
        onCloseModel={onCloseViewModel}
        data={editData}
      />
      <EditEmployeeJob
        isOpenModel={isOpenEditEmployeeModel}
        onCloseModel={onCloseEditModel}
        data={editData}
      />
      {Loading ? (
        <Box
          position="fixed"
          top="0"
          left="0"
          right="0"
          bottom="0"
          display="flex"
          justifyContent="center"
          alignItems="center"
          backgroundColor="rgba(255, 255, 255, 0.8)" // Adjust opacity and color as needed
          zIndex="1000" // Ensure it's above other content
        >
          <Spinner size="xl" />
        </Box>
      ) : null}

      {jobs.length > 0 ? (
        <Box bg="white">
          <TableContainer p={'30px'}>
            <Box display={'flex'} justifyContent={'end'} pb={'10px'}>
              <Button
                onClick={handleDeleteSelected}
                colorScheme="teal"
                isDisabled={jobs.length === 0}
                w={{
                  sm: '100px',
                  md: '170px',
                }}
              >
                {' '}
                Delete Selected Jobs
              </Button>
              <Button
                onClick={handleDeleteAllJob}
                colorScheme="teal"
                isDisabled={jobs.length === 0}
                marginX={'20px'}
                w={{
                  sm: '100px',
                  md: '150px',
                }}
              >
                Delete All Job
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
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </InputGroup>
            </Box>
            <Table size="sm">
              <Thead>
                <Tr>
                  <Th>
                    <Checkbox
                      isChecked={selectedJobs.length === jobs.length}
                      onChange={handleSelectAll}
                      icon={<AiOutlineCheckCircle />} // Adding the custom icon
                    />
                  </Th>
                  <Th>Title</Th>
                  <Th>FirstName</Th>
                  <Th>LastName</Th>
                  <Th>Email</Th>
                  <Th>Phone Number</Th>
                  <Th>Address</Th>
                  <Th>Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredData && filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <Tr key={index}>
                      <Td>
                        <Checkbox
                          isChecked={selectedJobs.includes(item.id)}
                          onChange={() => handleCheckboxChange(item.id)}
                        />
                      </Td>
                      <Td>{item.title}</Td>
                      <Td>{item.firstName}</Td>
                      <Td>{item.lastName}</Td>
                      <Td>{item.email}</Td>
                      <Td>{item.contactNumber}</Td>
                      <Td>{item.address}</Td>
                      <Td>
                        <IconButton
                          aria-label={'view'}
                          icon={<GrView />}
                          color="teal"
                          onClick={() =>
                            fetchEmployeeInfoForView(item.id, item.user_id)
                          }
                          marginX={'5px'}
                        />
                        <IconButton
                          aria-label={'edit'}
                          icon={<GrEdit />}
                          color="teal"
                          onClick={() =>
                            fetchEmployeeInfoForEdit(item.id, item.user_id)
                          }
                          marginX={'5px'}
                        />
                        <IconButton
                          aria-label={'dropbox'}
                          icon={<GrDropbox />}
                          color="teal"
                          onClick={() =>
                            createDropBoxFolder(item.id, item.address)
                          }
                          marginX={'5px'}
                        />
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td textAlign="center">No Job is created</Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
            <Flex justify={'end'} mt={5} mb={5}>
              <HStack spacing={2}>
                <Button
                  leftIcon={<ArrowBackIcon />}
                  onClick={() => handleButtonClicked(currentPage - 1)}
                  isDisabled={currentPage === 1}
                  colorScheme="teal"
                >
                  Previous
                </Button>
                {pageNumbers.map((number) => (
                  <Button
                    key={number}
                    onClick={() => handleButtonClicked(number)}
                    variant={currentPage === number ? 'solid' : 'outline'}
                    colorScheme="teal"
                  >
                    {number}
                  </Button>
                ))}
                <Button
                  rightIcon={<ArrowForwardIcon />}
                  onClick={() => handleButtonClicked(currentPage + 1)}
                  isDisabled={currentPage === totalPages}
                  colorScheme="teal"
                >
                  Next
                </Button>
              </HStack>
            </Flex>
          </TableContainer>
        </Box>
      ) : (
        <div style={{ textAlign: 'center', color: '#555', padding: '20px' }}>
          <h2>Currently, no jobs have been added.</h2>
        </div>
      )}
    </React.Fragment>
  );
};
