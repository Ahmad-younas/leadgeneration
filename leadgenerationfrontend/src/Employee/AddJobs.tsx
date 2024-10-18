import React, { useState, useEffect } from 'react';
import { EmployeeNavbarLink } from './EmployeeNavbarLink';
import {
  getLastPathSegment,
  getSecondLastPathSegment,
} from '../RoutePath/Path';
import {
  useColorModeValue,
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Select,
  Spinner,
  Spacer,
  InputGroup,
  InputLeftAddon,
  InputLeftElement,
  Stack,
  Textarea,
  Heading, useToast, Divider,
} from '@chakra-ui/react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { EmailIcon } from '@chakra-ui/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import { faAddressBook } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faStarHalfStroke } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import Logger from '../Logger';
import { AdminNavbarLink } from '../Admin/Component/Dashboard/component/Table/AdminNavbarLink';

const schema = yup.object().shape({
  title: yup.string(),
  firstName: yup.string().required("First name is required"),
  lastName: yup.string(),
  dateOfBirth: yup
    .string(),
  email: yup
    .string()
    .email('Invalid email address'),
  contactNumber: yup.string(),
  address: yup.string(),
  postcode: yup.string(),
  landlordName: yup.string(),
  landlordContactNumber: yup
    .string(),
  landlordEmail: yup
    .string()
    .email('Invalid email address'),
  agentName: yup.string(),
  agentContactNumber: yup.string(),
  agentEmail: yup
    .string()
    .email('Invalid email address'),
  heatingType: yup.string(),
  propertyType: yup.string(),
  epcRating: yup.string(),
  serviceType: yup.string(),
  assessmentDate: yup
    .string(),
  notes: yup.string(),
});

type FormData = yup.InferType<typeof schema>;

export const AddJobs: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [Loading, setLoading] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);
  const toast = useToast();
  const navigation = useNavigate();
  useEffect(() => {
    // Simulate loading time
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const backGroundColor = useColorModeValue('white', 'white');
  const navbarIcon = useColorModeValue('gray.500', 'gray.200');
  const mainText = useColorModeValue('gray.700', 'gray.200');
  const secondaryText = useColorModeValue('gray.700', 'white');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });
  const token = localStorage.getItem('authToken');
 const id = user?.id;
  const onSubmit:  SubmitHandler<FormData> = async (data) => {
    const newData = {
      user_id:id,
      ...data
    }
    try{
      setLoading(true);
      const response = await  axios.post('http://localhost:3002/api/add-job', newData, {
        withCredentials:true,
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      });
      console.log("Response",response);
      if (response.status === 201) {
        toast({
          title: 'Job Status.',
          description: 'Job Successfully Added.',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
        setLoading(false);
        reset();
      }else if(response.status === 204){
        setLoading(true);
        await initiateDropboxAuth();
        reset();
      }
    }catch (error){
      console.log("error",error);
      if (axios.isAxiosError(error)) {
        if(error?.response?.data.error ==="Employee not authenticated with Google"){
          axios.get('http://localhost:3002/api/auth/google')
            .then((response) => {
              const { url } = response.data;
              console.log("URL", url);
              window.location.href = url;
            })
            .catch((error) => {
              if (axios.isAxiosError(error)) {
                console.error('Error generating authorization URL:', error.response?.data || error.message);
              } else {
                console.error('Unexpected error:', error);
              }
            });
        }
        console.log("error",error?.response?.status);
        console.log("error",error?.response?.data.error);
        toast({
          title: 'Job Status.',
          //description: error.response?.data.error.errors[0].message,
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
      } else {
        if (error instanceof Error) {
          console.error('Error message:', error.message);
        }
      }
    }

  };
  const initiateDropboxAuth = async () => {
    try {
      // Fetch the Dropbox authentication URL from the backend using Axios
      const response = await axios.get('http://localhost:3002/api/dropbox/auth-url');
      // Redirect the user to the Dropbox authorization page
      window.location.href = response.data.url; // This triggers the OAuth flow
    } catch (error) {
      console.error('Error fetching Dropbox Auth URL:', error);
    }
  };

  return (
    <React.Fragment>
      <AdminNavbarLink
        brandText={getSecondLastPathSegment(window.location.pathname)}
        brandTextS={getLastPathSegment(window.location.pathname)}
        mainTextColor={mainText}
        secondaryTextColor={secondaryText}
        navbarIconColor={navbarIcon}
        backgroundColor={backGroundColor}
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

      ):null
      }
      <Box width="100%" mx="auto" mt={5}>
        {isLoading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="200px"
          >
            <Spinner size="xl" />
          </Box>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box
              style={{
                backgroundColor: 'white',
                borderRadius: '15px',
              }}
            >
              <Heading
                pt={'4'}
                fontSize={"x-large"}
                display={'flex'}
                justifyContent={'center'}
                alignItems={'center'}
              >
                Tenant Details
              </Heading>
              <Box
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  backgroundColor: 'white',
                  borderRadius: '15px',
                }}
              >
                <Box w={'100%'} p={'15px'} m={'15px'} borderRadius={'15px'}>
                  <Stack spacing={4}>
                    <FormControl isInvalid={!!errors.title}>
                      <FormLabel htmlFor="title">Title</FormLabel>
                      <Select
                        id="title"
                        placeholder="e.g Mr"
                        variant="flushed"
                        {...register('title')}
                      >
                        <option value="Miss">Miss</option>
                        <option value="Mr">Mr</option>
                        <option value="Mrs">Mrs</option>
                      </Select>
                      <FormErrorMessage>
                        {errors.title?.message}
                      </FormErrorMessage>
                      <Spacer />
                    </FormControl>
                    <FormControl isInvalid={!!errors.firstName} isRequired>
                      <FormLabel htmlFor="firstName">First Name</FormLabel>
                      <InputGroup>
                        <InputLeftElement pointerEvents={'none'}>
                          <FontAwesomeIcon icon={faUser} color="#CBD5E0" />
                        </InputLeftElement>
                        <Input
                          id="firstName"
                          placeholder="Enter your first name"
                          variant={'flushed'}
                          {...register('firstName')}
                        />
                      </InputGroup>
                      <FormErrorMessage>
                        {errors.firstName?.message}
                      </FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.lastName}>
                      <FormLabel htmlFor="lastName">Last Name</FormLabel>
                      <InputGroup>
                        <InputLeftElement>
                          <FontAwesomeIcon icon={faUser} color="#CBD5E0" />
                        </InputLeftElement>
                        <Input
                          id="lastName"
                          placeholder="Enter your last name"
                          variant={'flushed'}
                          {...register('lastName')}
                        />
                      </InputGroup>
                      <FormErrorMessage>
                        {errors.lastName?.message}
                      </FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.dateOfBirth}>
                      <FormLabel htmlFor="dateOfBirth">Date of Birth</FormLabel>
                      <InputGroup>
                        <InputLeftElement pointerEvents={'none'}>
                          <FontAwesomeIcon
                            icon={faCalendarDays}
                            color="#CBD5E0"
                          />
                        </InputLeftElement>
                        <Input
                          id="dateOfBirth"
                          placeholder="Enter your date of birth"
                          variant={'flushed'}
                          type={'date'}
                          {...register('dateOfBirth')}
                        />
                      </InputGroup>
                      <FormErrorMessage>
                        {errors.dateOfBirth?.message}
                      </FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.email}>
                      <FormLabel htmlFor="email">Email</FormLabel>
                      <InputGroup>
                        <InputLeftElement pointerEvents={'none'}>
                          <EmailIcon color={'gray.300'} />
                        </InputLeftElement>
                        <Input
                          id="email"
                          variant={'flushed'}
                          placeholder="Enter your email"
                          type={'email'}
                          {...register('email')}
                        />
                      </InputGroup>
                      <FormErrorMessage>
                        {errors.email?.message}
                      </FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.contactNumber}>
                      <FormLabel htmlFor="contactNumber">
                        Contact Number
                      </FormLabel>
                      <InputGroup>
                        <InputLeftAddon>+44</InputLeftAddon>
                        <Input
                          id="contactNumber"
                          placeholder="phone number"
                          type={'tel'}
                          {...register('contactNumber')}
                        />
                      </InputGroup>
                      <FormErrorMessage>
                        {errors.contactNumber?.message}
                      </FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.address}>
                      <FormLabel htmlFor="address">Address</FormLabel>
                      <InputGroup>
                        <InputLeftElement pointerEvents={'none'}>
                          <FontAwesomeIcon
                            icon={faAddressBook}
                            color="#CBD5E0"
                          />
                        </InputLeftElement>
                        <Input
                          id="address"
                          variant={'flushed'}
                          placeholder="Enter your address"
                          {...register('address')}
                        />
                      </InputGroup>
                      <FormErrorMessage>
                        {errors.address?.message}
                      </FormErrorMessage>
                    </FormControl>
                  </Stack>
                </Box>
                <Box w={'100%'} bg={'white'} p={'15px'} m={'15px'}>
                  <Stack spacing={4}>
                    <FormControl isInvalid={!!errors.postcode}>
                      <FormLabel htmlFor="postcode">Postcode</FormLabel>

                      <Input
                        id="postcode"
                        placeholder="Enter your postcode"
                        variant={'flushed'}
                        {...register('postcode')}
                      />
                      <FormErrorMessage>
                        {errors.postcode?.message}
                      </FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.landlordName}>
                      <FormLabel htmlFor="landlordName">
                        Landlord Name
                      </FormLabel>
                      <InputGroup>
                        <InputLeftElement pointerEvents={'none'}>
                          <FontAwesomeIcon icon={faUser} color="#CBD5E0" />
                        </InputLeftElement>
                        <Input
                          id="landlordName"
                          variant={'flushed'}
                          placeholder="Enter your landlord's name"
                          {...register('landlordName')}
                        />
                      </InputGroup>
                      <FormErrorMessage>
                        {errors.landlordName?.message}
                      </FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.landlordContactNumber}>
                      <FormLabel htmlFor="landlordContactNumber">
                        Landlord Contact Number
                      </FormLabel>
                      <InputGroup>
                        <InputLeftAddon>+44</InputLeftAddon>
                        <Input
                          id="landlordContactNumber"
                          placeholder="Enter your landlord's contact number"
                          {...register('landlordContactNumber')}
                        />
                      </InputGroup>
                      <FormErrorMessage>
                        {errors.landlordContactNumber?.message}
                      </FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.landlordEmail}>
                      <FormLabel htmlFor="landlordEmail">
                        Landlord Email
                      </FormLabel>
                      <InputGroup>
                        <InputLeftElement pointerEvents={'none'}>
                          <EmailIcon color="#CBD5E0" />
                        </InputLeftElement>
                        <Input
                          id="landlordEmail"
                          variant={'flushed'}
                          type={'email'}
                          placeholder="Enter your landlord's email"
                          {...register('landlordEmail')}
                        />
                      </InputGroup>
                      <FormErrorMessage>
                        {errors.landlordEmail?.message}
                      </FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.agentName}>
                      <FormLabel htmlFor="agentName">Agent Name</FormLabel>
                      <InputGroup>
                        <InputLeftElement pointerEvents={'none'}>
                          <FontAwesomeIcon icon={faUser} color="#CBD5E0" />
                        </InputLeftElement>
                        <Input
                          id="agentName"
                          placeholder="Enter your agent's name"
                          type={'text'}
                          variant={'flushed'}
                          {...register('agentName')}
                        />
                      </InputGroup>
                      <FormErrorMessage>
                        {errors.agentName?.message}
                      </FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.agentContactNumber}>
                      <FormLabel htmlFor="agentContactNumber">
                        Agent Contact Number
                      </FormLabel>
                      <InputGroup>
                        <InputLeftAddon>+44</InputLeftAddon>
                        <Input
                          id="agentContactNumber"
                          placeholder="Enter your agent's contact number"
                          type={'tel'}
                          {...register('agentContactNumber')}
                        />
                      </InputGroup>
                      <FormErrorMessage>
                        {errors.agentContactNumber?.message}
                      </FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.agentEmail}>
                      <FormLabel htmlFor="agentEmail">Agent Email</FormLabel>
                      <InputGroup>
                        <InputLeftElement pointerEvents={'none'}>
                          <EmailIcon color="#CBD5E0" />
                        </InputLeftElement>
                        <Input
                          id="agentEmail"
                          variant={'flushed'}
                          placeholder="Enter your agent's email"
                          type={'email'}
                          {...register('agentEmail')}
                        />
                      </InputGroup>
                      <FormErrorMessage>
                        {errors.agentEmail?.message}
                      </FormErrorMessage>
                    </FormControl>
                  </Stack>
                </Box>
              </Box>
              <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '15px',
                    width: '100%',
                    padding: '15px',
                    margin: '15px 10px 10px 0px',
                  }}
                >
                  <Stack spacing={4}>
                    <Heading fontSize={"x-large"}>Property Details Section</Heading>
                    <FormControl isInvalid={!!errors.heatingType}>
                      <FormLabel htmlFor="heatingType">Heating Type</FormLabel>
                      <Select
                        id="heatingType"
                        placeholder="Select Heating Type"
                        {...register('heatingType')}
                      >
                        <option value="Central Heating">Central Heating</option>
                        <option value="Electric Heating">Electric Heating</option>
                        <option value="Gas Heating">Gas Heating</option>
                        <option value="Other">Other</option>
                      </Select>
                      <FormErrorMessage>
                        {errors.heatingType?.message}
                      </FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.propertyType}>
                      <FormLabel htmlFor="propertyType">
                        Property Type
                      </FormLabel>
                      <Select
                        id="propertyType"
                        placeholder="Select Property Type"
                        {...register('propertyType')}
                      >
                        <option value="House">House</option>
                        <option value="Apartment">Apartment</option>
                        <option value="Bungalow">Bungalow</option>
                        <option value="Other">Other</option>
                      </Select>
                      <FormErrorMessage>
                        {errors.propertyType?.message}
                      </FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.epcRating}>
                      <FormLabel htmlFor="epcRating">
                        Current EPC Rating
                      </FormLabel>
                      <Select
                        id="epcRating"
                        placeholder="Select Rating "
                        {...register('epcRating')}
                      >
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                        <option value="E">E</option>
                        <option value="F">F</option>
                        <option value="G">G</option>
                      </Select>
                      <FormErrorMessage>
                        {errors.epcRating?.message}
                      </FormErrorMessage>
                    </FormControl>
                  </Stack>
                </Box>
                <Box
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '15px',
                    width: '100%',
                    padding: '15px',
                    margin: '15px 10px 10px 0px',
                  }}
                >
                  <Stack spacing={4}>
                    <Heading fontSize={'x-large'}>Measures Details</Heading>
                    <FormControl isInvalid={!!errors.serviceType}>
                      <FormLabel htmlFor="serviceType">Service Type</FormLabel>
                      <Select
                        id='serviceType'
                        placeholder='Select Service Type'
                        {...register('serviceType')}
                      >
                        <option value='Loft'>Loft Insulation</option>
                        <option value='Electric'>
                          Electric Storage Heater
                        </option>
                        <option value='Solar PV'>Solar PV</option>
                        <option value='Internal'>Internal</option>
                        <option value='External'>External</option>
                        <option value='Air Source Heating Pump'>Air Source Heating Pump</option>
                      </Select>
                      <FormErrorMessage>
                      {errors.serviceType?.message}
                      </FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.assessmentDate}>
                      <FormLabel htmlFor="assessmentBirth">
                        Retrofit Assessment Date
                      </FormLabel>
                      <InputGroup>
                        <InputLeftElement pointerEvents={'none'}>
                          <FontAwesomeIcon
                            icon={faCalendarDays}
                            color="#CBD5E0"
                          />
                        </InputLeftElement>
                        <Input
                          id="assessmentBirth"
                          placeholder="Enter Retrofit Assessment Date"
                          variant={'flushed'}
                          {...register('assessmentDate')}
                          type={'date'}
                        />
                      </InputGroup>
                      <FormErrorMessage>
                        {errors.assessmentDate?.message}
                      </FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.notes}>
                      <FormLabel htmlFor="note">Note</FormLabel>
                      <Textarea
                        id="note"
                        placeholder="Enter Note here..."
                        {...register('notes')}
                        maxLength={1000}
                      />

                      <FormErrorMessage>
                        {errors.notes?.message}
                      </FormErrorMessage>
                    </FormControl>
                  </Stack>
                </Box>
              </Box>
            </Box>
            <Button mt={4} colorScheme="teal" type="submit">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </React.Fragment>
  );
};

