import {
  Calendar as BigCalendar,
  CalendarProps,
  momentLocalizer,
} from 'react-big-calendar';
import moment from 'moment';
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Spacer,
  Spinner,
  Stack,
  Text,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import customToolbar from './CustomToolbar';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAddressBook,
  faCalendarDays,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { EmailIcon } from '@chakra-ui/icons';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ENDPOINTS } from '../../../../utils/apiConfig';
import { logout } from '../../../../redux/authSlice';
import { useDispatch } from 'react-redux';

const localizer = momentLocalizer(moment);

interface Event {
  id: number;
  title: string;
  start: Date;
  end: Date;
  description?: string;
}

const schema = yup.object().shape({
  title: yup.string(),
  firstName: yup.string().required('First name is required'),
  lastName: yup.string(),
  dateOfBirth: yup.string(),
  email: yup.string().email('Invalid email address'),
  contactNumber: yup.string(),
  address: yup.string(),
  postcode: yup.string(),
  landlordName: yup.string(),
  landlordContactNumber: yup.string(),
  landlordEmail: yup.string().email('Invalid email address'),
  agentName: yup.string(),
  agentContactNumber: yup.string(),
  agentEmail: yup.string().email('Invalid email address'),
  heatingType: yup.string(),
  propertyType: yup.string(),
  epcRating: yup.string(),
  serviceType: yup.string(),
  assessmentDate: yup.string(),
  notes: yup.string(),
  status: yup.string(),
  month: yup.string(),
  year: yup.string(),
  id: yup.string(),
  epcBand: yup.string(),
  waterType: yup.string(),
});

type FormData = yup.InferType<typeof schema>;

export const ConfigureCalendar: React.FC<
  Omit<CalendarProps<any, object>, 'localizer'>
> = (props) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema), // use yup for validation
  });
  const token = localStorage.getItem('authToken');
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [jobDetails, setJobDetails] = useState<any | null>(null);
  const toast = useToast();

  useEffect(() => {
    if (isOpen && jobDetails) {
      setValue('id', jobDetails.id);
      setValue('title', jobDetails.title);
      setValue('firstName', jobDetails.firstName);
      setValue('lastName', jobDetails.lastName);
      setValue('dateOfBirth', jobDetails.dateOfBirth);
      setValue('email', jobDetails.email);
      setValue('contactNumber', jobDetails.contactNumber);
      setValue('address', jobDetails.address);
      setValue('postcode', jobDetails.postcode);
      setValue('landlordName', jobDetails.landlordName);
      setValue('landlordContactNumber', jobDetails.landlordContactNumber);
      setValue('landlordEmail', jobDetails.landlordEmail);
      setValue('agentName', jobDetails.agentName);
      setValue('agentContactNumber', jobDetails.agentContactNumber);
      setValue('agentEmail', jobDetails.agentEmail);
      setValue('heatingType', jobDetails.heatingType);
      setValue('propertyType', jobDetails.propertyType);
      setValue('epcRating', jobDetails.epcRating);
      setValue('serviceType', jobDetails.serviceType);
      setValue('assessmentDate', jobDetails.assessmentDate);
      setValue('notes', jobDetails.notes);
      setValue('month', jobDetails.month);
      setValue('year', jobDetails.year);
      setValue('status', jobDetails.status);
      setValue('epcBand', jobDetails.epcBand);
      setValue('waterType', jobDetails.waterType);
    }
  }, [isOpen, jobDetails, setValue]);

  const onEventClick = async (event: Event) => {
    setSelectedEvent(event);
    try {
      const response = await axios.get(
        ENDPOINTS.getEmployeeJobInfo + event.id,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setJobDetails(response.data); // Set the job details in state
      setIsOpen(true); // Open the modal
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (
          error?.response?.status === 403 ||
          error?.response?.status === 401
        ) {
          dispatch(logout());
        }
      }
      console.error('Error fetching job details:', error);
    }
  };

  const onClose = () => {
    setIsOpen(false);
    setSelectedEvent(null);
  };

  const onSubmit = async (formData: FormData) => {
    setIsLoading(true);
    const data = {
      id: selectedEvent?.id,
      ...formData,
    };
    try {
      const response = await axios.put(ENDPOINTS.updateEmployeeJob, data, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      });
      if (response.status === 200) {
        toast({
          title: 'Job Status.',
          description: 'Job Successfully Updated.',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
        setIsLoading(false);
        onClose();
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
      console.error('Error updating employee job:', error);
    }
  };

  return (
    <React.Fragment>
      {isLoading ? (
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
          zIndex="10000" // Ensure it's above other content
        >
          <Spinner size="xl" />
        </Box>
      ) : null}
      <BigCalendar
        {...props}
        localizer={localizer}
        startAccessor="start"
        endAccessor="end"
        titleAccessor="title"
        components={{
          toolbar: customToolbar,
        }}
        style={{
          height: '100%',
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '16px',
          marginTop: '50px',
        }}
        eventPropGetter={(event) => {
          let newStyle = {
            backgroundColor: '#FFFFFF',
            color: 'black',
            borderRadius: '10px',
            border: 'none',
          };

          switch (event.title) {
            case 'Booked':
              newStyle.backgroundColor = '#26A69A';
              newStyle.color = 'white';
              break;
            case 'Insulated':
              newStyle.backgroundColor = '#42A5F5';
              newStyle.color = 'white';
              break;
            case 'Canceled':
              newStyle.backgroundColor = '#EF5350';
              newStyle.color = 'white';
              break;
            case 'Submitted':
              newStyle.backgroundColor = '#FFA726';
              newStyle.color = 'white';
              break;
          }

          return {
            className: '',
            style: newStyle,
          };
        }}
        onSelectEvent={onEventClick}
      />

      {selectedEvent && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent maxWidth={'70%'}>
            <ModalCloseButton />
            {jobDetails ? (
              <ModalBody pb={6}>
                <Box display="flex" justifyContent="center">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <Box
                      style={{
                        backgroundColor: 'white',
                        borderRadius: '15px',
                      }}
                    >
                      <Heading
                        pt={'4'}
                        fontSize={'x-large'}
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
                        <Box
                          w={'100%'}
                          p={'15px'}
                          m={'15px'}
                          borderRadius={'15px'}
                        >
                          <Stack spacing={4}>
                            <FormControl isInvalid={!!errors.title}>
                              <FormLabel htmlFor="title">Title</FormLabel>
                              <Select
                                id="title"
                                variant="flushed"
                                placeholder="e.g Mr"
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
                            <FormControl
                              isInvalid={!!errors.firstName}
                              isRequired
                            >
                              <FormLabel htmlFor="firstName">
                                First Name
                              </FormLabel>
                              <InputGroup>
                                <InputLeftElement pointerEvents={'none'}>
                                  <FontAwesomeIcon
                                    icon={faUser}
                                    color="#CBD5E0"
                                  />
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
                              <FormLabel htmlFor="lastName">
                                Last Name
                              </FormLabel>
                              <InputGroup>
                                <InputLeftElement>
                                  <FontAwesomeIcon
                                    icon={faUser}
                                    color="#CBD5E0"
                                  />
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
                              <FormLabel htmlFor="dateOfBirth">
                                Date of Birth
                              </FormLabel>
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
                                  <FontAwesomeIcon
                                    icon={faUser}
                                    color="#CBD5E0"
                                  />
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
                            <FormControl
                              isInvalid={!!errors.landlordContactNumber}
                            >
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
                              <FormLabel htmlFor="agentName">
                                Agent Name
                              </FormLabel>
                              <InputGroup>
                                <InputLeftElement pointerEvents={'none'}>
                                  <FontAwesomeIcon
                                    icon={faUser}
                                    color="#CBD5E0"
                                  />
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
                            <FormControl
                              isInvalid={!!errors.agentContactNumber}
                            >
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
                              <FormLabel htmlFor="agentEmail">
                                Agent Email
                              </FormLabel>
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
                      <Box
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
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
                            <Heading fontSize={'x-large'}>
                              Property Details Section
                            </Heading>
                            <FormControl isInvalid={!!errors.heatingType}>
                              <FormLabel htmlFor="heatingType">
                                Heating Type
                              </FormLabel>
                              <Select
                                id="heatingType"
                                {...register('heatingType')}
                              >
                                <option value="Central Heating">
                                  Central Heating
                                </option>
                                <option value="Electric Heating">
                                  Electric Heating
                                </option>
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

                            <FormControl isInvalid={!!errors.epcBand}>
                              <FormLabel htmlFor="epcBand">
                                {' '}
                                Current EPC Band
                              </FormLabel>
                              <Select
                                id="epcBand"
                                placeholder="Select EPC Band "
                                {...register('epcBand')}
                              >
                                <option value="High B">High B</option>
                                <option value="Low B">Low B</option>
                                <option value="High C">High C</option>
                                <option value="Low C">Low C</option>
                                <option value="High D">High D</option>
                                <option value="Low D">Low D</option>
                                <option value="High E">High E</option>
                                <option value="Low E">Low E</option>
                                <option value="High F">High F</option>
                                <option value="Low F">Low F</option>
                                <option value="High G">High G</option>
                                <option value="Low G">Low G</option>
                              </Select>
                              <FormErrorMessage>
                                {errors.epcBand?.message}
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
                            <Heading fontSize={'x-large'}>
                              Measures Details
                            </Heading>
                            <FormControl isInvalid={!!errors.serviceType}>
                              <FormLabel htmlFor="serviceType">
                                Service Type
                              </FormLabel>
                              <Select
                                id="serviceType"
                                {...register('serviceType')}
                              >
                                <option value="Internal wall insulation">
                                  Internal wall insulation
                                </option>
                                <option value="External wall insulation">
                                  External wall insulation
                                </option>
                                <option value="Air source heat pump">
                                  Air source heat pump
                                </option>
                                <option value="other">other</option>
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
                            <Heading fontSize={'x-large'}>Jon Info</Heading>
                            <FormControl isInvalid={!!errors.status}>
                              <FormLabel htmlFor="status">Job Status</FormLabel>
                              <Select id="status" {...register('status')}>
                                <option value="Submitted">Submitted</option>
                                <option value="Canceled">Canceled</option>
                                <option value="Insulated">Insulated</option>
                                <option value="Booked">Booked</option>
                              </Select>
                              <FormErrorMessage>
                                {errors.status?.message}
                              </FormErrorMessage>
                            </FormControl>
                          </Stack>
                        </Box>
                      </Box>
                    </Box>

                    <Box
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
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
                          <Heading fontSize={'x-large'}>
                            Water Heating Type
                          </Heading>
                          <FormControl isInvalid={!!errors.waterType}>
                            <FormLabel htmlFor="WaterType">
                              Water Type
                            </FormLabel>
                            <Select
                              id="WaterType"
                              placeholder="Select Water Type"
                              {...register('waterType')}
                            >
                              <option value="Electric Instantaneous water Heater">
                                Electric Instantaneous water Heater
                              </option>
                              <option value="Electric Immersion">
                                Electric Immersion
                              </option>
                              <option value="From mains">From mains</option>
                              <option value="Other">Other</option>
                              <option value="Non">Non</option>
                            </Select>

                            <FormErrorMessage>
                              {errors.waterType?.message}
                            </FormErrorMessage>
                          </FormControl>
                          <FormControl isInvalid={!!errors.epcRating}>
                            <FormLabel htmlFor="agentEmail">
                              Current EPC Rating
                            </FormLabel>
                            <NumberInput max={100} min={0}>
                              <NumberInputField
                                id={'epcRating'}
                                maxLength={2}
                                placeholder={'Enter 1 to 100'}
                                {...register('epcRating')}
                              />
                              <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                              </NumberInputStepper>
                            </NumberInput>
                            <FormErrorMessage>
                              {errors.agentEmail?.message}
                            </FormErrorMessage>
                          </FormControl>
                        </Stack>
                      </Box>
                    </Box>
                    <Button mt={4} colorScheme="teal" type="submit">
                      Submit
                    </Button>
                  </form>
                </Box>
              </ModalBody>
            ) : (
              <Text>Loading job details...</Text>
            )}
          </ModalContent>
        </Modal>
      )}
    </React.Fragment>
  );
};
