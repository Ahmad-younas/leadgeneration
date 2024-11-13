import React from 'react';
import ProfileBgImage from '../../assets/ProfileBackground.png';
import {
  Avatar,
  Box,
  Button,
  Flex,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  getLastPathSegment,
  getSecondLastPathSegment,
} from '../../RoutePath/Path';
import { RiFileExcel2Fill } from 'react-icons/ri';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { IoAddCircle } from 'react-icons/io5';
import { FiExternalLink } from 'react-icons/fi';

import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AdminNavbarLink } from '../../Admin/Component/Dashboard/component/Table/AdminNavbarLink';
import { ENDPOINTS } from '../../utils/apiConfig';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/authSlice';

interface Job {
  title: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  contactNumber: string;
  address: string;
  postcode: string;
  landlordName: string | null;
  landlordContactNumber: string | null;
  landlordEmail: string | null;
  heatingType: string | null;
  propertyType: string | null;
  epcRating: string | null;
  serviceType: string | null;
  assessmentDate: string | null;
  notes: string | null;
  user_id: number;
  month: string;
  year: string;
}

interface User {
  username: string;
  password: string;
  role: string;
  email: string;
  jobs: Job[];
}

export const Header: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');
  const fetchDataAndExportToExcel = async () => {
    try {
      const response = await axios.get(ENDPOINTS.getEmployeeWithJobInfo, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      exportToExcel(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (
          error?.response?.status === 403 ||
          error?.response?.status === 401
        ) {
          dispatch(logout());
        }
      }
      console.error('Error fetching data or exporting to Excel:', error);
    }
  };

  const exportToExcel = (data: User[]) => {
    const flattenedData = data.flatMap((user) =>
      user.jobs.map((job) => ({
        Title: job.title,
        FirstName: job.firstName,
        LastName: job.lastName,
        DateOfBirth: job.dateOfBirth,
        Email: job.email,
        ContactNumber: job.contactNumber,
        Address: job.address,
        PostCode: job.postcode,
        LandLordName: job.landlordName,
        LandLordContactNumber: job.landlordContactNumber,
        LandLordEmail: job.landlordEmail,
        HeatingType: job.heatingType,
        PropertyType: job.propertyType,
        RPCRating: job.epcRating,
        ServiceType: job.serviceType,
        AssessmentDate: job.assessmentDate,
        Notes: job.notes,
        Month: job.month,
        Year: job.year,
      }))
    );

    const worksheet = XLSX.utils.json_to_sheet(
      flattenedData.length > 0
        ? flattenedData
        : [{ id: '', name: '', email: '' }]
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const dataBlob = new Blob([excelBuffer], {
      type: 'application/octet-stream',
    });
    saveAs(dataBlob, 'DataExport.xlsx');
  };

  // Chakra color mode
  const textColor = useColorModeValue('gray.700', 'white');
  const bgProfile = useColorModeValue(
    'hsla(0,0%,100%,.8)',
    'linear-gradient(112.83deg, rgba(255, 255, 255, 0.21) 0%, rgba(255, 255, 255, 0) 110.84%)'
  );
  const borderProfileColor = useColorModeValue(
    'white',
    'rgba(255, 255, 255, 0.31)'
  );
  const navbarIcon = useColorModeValue('white', 'white');
  const mainText = useColorModeValue('white', 'white');
  const secondaryText = useColorModeValue('white', 'white');
  const emailColor = useColorModeValue('gray.400', 'gray.300');

  return (
    <Box
      mb={{ sm: '205px', md: '75px', xl: '70px' }}
      borderRadius="15px"
      px="0px"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        bgImage={ProfileBgImage}
        w="100%"
        h="300px"
        borderRadius="25px"
        bgPosition="50%"
        bgRepeat="no-repeat"
        position="relative"
        display="flex"
        justifyContent="center"
      >
        <Box
          w="100%"
          height={'auto'}
          bgSize="cover"
          p={'15px'}
          display={'flex'}
          justifyContent="space-between"
        >
          <AdminNavbarLink
            brandText={getSecondLastPathSegment(window.location.pathname)}
            brandTextS={getLastPathSegment(window.location.pathname)}
            mainTextColor={mainText}
            secondaryTextColor={secondaryText}
            navbarIconColor={navbarIcon}
            backgroundColor={'transparent'}
          />
        </Box>
        <Flex
          direction={{ sm: 'column', md: 'row' }}
          mx="1.5rem"
          maxH="330px"
          w={{ sm: '90%', xl: '95%' }}
          justifyContent={{ sm: 'center', md: 'space-between' }}
          align="center"
          backdropFilter="saturate(200%) blur(50px)"
          position="absolute"
          boxShadow="0px 2px 5.5px rgba(0, 0, 0, 0.02)"
          border="2px solid"
          borderColor={borderProfileColor}
          bg={bgProfile}
          p="24px"
          borderRadius="20px"
          transform={{
            sm: 'translateY(45%)',
            md: 'translateY(110%)',
            lg: 'translateY(160%)',
          }}
        >
          <Flex
            align="center"
            mb={{ sm: '10px', md: '0px' }}
            direction={{ sm: 'column', md: 'row' }}
            w={{ sm: '100%' }}
            textAlign={{ sm: 'center', md: 'start' }}
          >
            <Avatar
              me={{ md: '22px' }}
              src={ProfileBgImage}
              w="80px"
              h="80px"
              borderRadius="15px"
            />
            <Flex direction="column" maxWidth="100%" my={{ sm: '14px' }}>
              <Text
                fontSize={{ sm: 'lg', lg: 'xl' }}
                color={textColor}
                fontWeight="bold"
                ms={{ sm: '8px', md: '0px' }}
              >
                {'ahmad'}
              </Text>
              <Text
                fontSize={{ sm: 'sm', md: 'md' }}
                color={emailColor}
                fontWeight="semibold"
              >
                {'ahmadyounas2k18'}
              </Text>
            </Flex>
          </Flex>
          <Flex
            direction={{ sm: 'column', lg: 'row' }}
            w={{ sm: '100%', md: '50%', lg: 'auto' }}
          >
            <Button
              p="0px"
              bg="transparent"
              _hover={{ bg: 'none' }}
              onClick={() => fetchDataAndExportToExcel()}
            >
              <Flex
                align="center"
                w={{ sm: '100%', lg: '135px' }}
                bg="hsla(0,0%,100%,.3)"
                borderRadius="15px"
                justifyContent="center"
                py="10px"
                boxShadow="inset 0 0 1px 1px hsl(0deg 0% 100% / 90%), 0 20px 27px 0 rgb(0 0 0 / 5%)"
                border="1px solid gray.200"
                cursor="pointer"
              >
                <RiFileExcel2Fill />
                <Text
                  fontSize={{ sm: 'sm', md: 'md', xl: '12px' }}
                  color={textColor}
                  fontWeight="semibold"
                  textTransform={'uppercase'}
                  p={'5px'}
                >
                  Export Jobs
                </Text>
              </Flex>
            </Button>
            <Button
              p="0px"
              bg="transparent"
              _hover={{ bg: 'none' }}
              onClick={() => {
                navigate('/admin/addjobs');
              }}
            >
              <Flex
                align="center"
                w={{ lg: '135px' }}
                borderRadius="15px"
                justifyContent="center"
                py="10px"
                mx={{ lg: '1rem' }}
                cursor="pointer"
              >
                <IoAddCircle />
                <Text
                  fontSize={{ sm: 'sm', md: 'md', xl: '12px' }}
                  p={'5px'}
                  color={textColor}
                  fontWeight="semibold"
                  textTransform={'uppercase'}
                >
                  Add Job
                </Text>
              </Flex>
            </Button>
            <Button
              p="0px"
              bg="transparent"
              _hover={{ bg: 'none' }}
              onClick={() => {
                navigate('/admin/alljobs');
              }}
            >
              <Flex
                align="center"
                w={{ lg: '135px' }}
                borderRadius="15px"
                justifyContent="center"
                py="10px"
                cursor="pointer"
              >
                <FiExternalLink />
                <Text
                  fontSize={{ sm: 'sm', md: 'md', xl: '12px' }}
                  p={'5px'}
                  color={textColor}
                  fontWeight="semibold"
                  textTransform={'uppercase'}
                >
                  All Job
                </Text>
              </Flex>
            </Button>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};
