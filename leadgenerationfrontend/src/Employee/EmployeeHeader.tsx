import React, { useState } from 'react';
import ProfileBgImage from '../assets/ProfileBackground.png';
import {
  Avatar,
  Box,
  Button,
  Flex,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { RiFileExcel2Fill } from 'react-icons/ri';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { IoAddCircle } from 'react-icons/io5';
import { EmployeeNavbarLink } from '../Employee/EmployeeNavbarLink';
import {
  getLastPathSegment,
  getSecondLastPathSegment,
} from '../RoutePath/Path';
import { SiGoogleadsense } from 'react-icons/si';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
interface DataRow {
  id: number;
  name: string;
  email: string;
}

interface Job {
  id: number;
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
  agentName: string;
  agentContactNumber: string;
  agentEmail: string;
  heatingType: string;
  propertyType: string | null;
  epcRating: string;
  status: string;
  serviceType: string;
  assessmentDate: string;
  notes: string;
  user_id: number;
  month: string;
  year: string;
}

export const EmployeeHeader: React.FC = ({}) => {
  const navigate = useNavigate();

  // Chakra color mode
  const bgProfile = useColorModeValue(
    'hsla(0,0%,100%,.8)',
    'linear-gradient(112.83deg, rgba(255, 255, 255, 0.21) 0%, rgba(255, 255, 255, 0) 110.84%)'
  );
  const borderProfileColor = useColorModeValue(
    'white',
    'rgba(255, 255, 255, 0.31)'
  );
  const [data, setData] = useState<DataRow[]>([]);
  const emailColor = useColorModeValue('gray.400', 'gray.300');
  const navbarIcon = useColorModeValue('white', 'white');
  const mainText = useColorModeValue('white', 'white');
  const secondaryText = useColorModeValue('white', 'white');
  const textColor = useColorModeValue('gray.700', 'white');
  const user = useSelector((state: RootState) => state.auth.user);
  const id = user?.id;
  const userEmail = user?.email
  const fetchDataAndExportToExcel = async () => {
    try {
      const response = await axios.get('http://localhost:3002/api/getEmployeeJobs',{
        params:{
          id
        }
      });
        exportToExcel(response.data);
    } catch (error) {
      console.error('Error fetching data or exporting to Excel:', error);
    }
  };

  const replaceEmptyFields = (value: any, placeholder = 'N/A') => {
    return value === undefined || value === null || value === '' ? placeholder : value;
  };
  const exportToExcel = (data: Job[]) => {
    // Map over the data to replace empty fields with placeholders
    const flattenedData = data.map((job) => ({
      jobId: replaceEmptyFields(job.id),
      jobTitle: replaceEmptyFields(job.title),
      firstName: replaceEmptyFields(job.firstName),
      lastName: replaceEmptyFields(job.lastName),
      dateOfBirth: replaceEmptyFields(job.dateOfBirth),
      jobEmail: replaceEmptyFields(job.email),
      contactNumber: replaceEmptyFields(job.contactNumber),
      address: replaceEmptyFields(job.address),
      postcode: replaceEmptyFields(job.postcode),
      landlordName: replaceEmptyFields(job.landlordName),
      landlordContactNumber: replaceEmptyFields(job.landlordContactNumber),
      landlordEmail: replaceEmptyFields(job.landlordEmail),
      agentName: replaceEmptyFields(job.agentName),
      agentContactNumber: replaceEmptyFields(job.agentContactNumber),
      agentEmail: replaceEmptyFields(job.agentEmail),
      heatingType: replaceEmptyFields(job.heatingType),
      propertyType: replaceEmptyFields(job.propertyType),
      epcRating: replaceEmptyFields(job.epcRating),
      serviceType: replaceEmptyFields(job.serviceType),
      assessmentDate: replaceEmptyFields(job.assessmentDate),
      status: replaceEmptyFields(job.status),
      notes: replaceEmptyFields(job.notes),
      month: replaceEmptyFields(job.month),
      year: replaceEmptyFields(job.year),
    }));
    // Check if flattenedData is empty and add placeholder data if so
    const dataToExport = flattenedData.length > 0 ? flattenedData : [{ jobId: '', jobTitle: '', firstName: '' }];
console.log("DataToExport",dataToExport);
    // Create a worksheet and a workbook
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Generate Excel buffer and create a Blob
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });

    // Save the Excel file
    saveAs(dataBlob, 'DataExport.xlsx');
  };

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
          height={'75%'}
          bgSize="cover"
          p={'15px'}
          display={'flex'}
          justifyContent="space-between"
        >
          <EmployeeNavbarLink
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
                {userEmail}
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
              onClick={fetchDataAndExportToExcel}
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
                  Export to Excel
                </Text>
              </Flex>
            </Button>
            <Button
              p="0px"
              bg="transparent"
              _hover={{ bg: 'none' }}
              onClick={() => {
                navigate('/employee/jobs');
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
                <SiGoogleadsense />

                <Text
                  fontSize={{ sm: 'sm', md: 'md', xl: '12px' }}
                  p={'5px'}
                  color={textColor}
                  fontWeight="semibold"
                  textTransform={'uppercase'}
                >
                  All leads
                </Text>
              </Flex>
            </Button>
            <Button
              p="0px"
              bg="transparent"
              _hover={{ bg: 'none' }}
              onClick={() => {
                navigate('/employee/addjobs');
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
                <IoAddCircle />
                <Text
                  fontSize={{ sm: 'sm', md: 'md', xl: '12px' }}
                  p={'5px'}
                  color={textColor}
                  fontWeight="semibold"
                  textTransform={'uppercase'}
                >
                  Add Jobs
                </Text>
              </Flex>
            </Button>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};
