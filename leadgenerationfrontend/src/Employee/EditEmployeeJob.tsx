import React, { useEffect, useRef, useState } from 'react';
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
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAddressBook,
  faCalendarDays,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { EmailIcon } from '@chakra-ui/icons';
import axios from 'axios';

interface Data {
  id: string;
  title: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  contactNumber: string;
  address: string;
  postcode: string;
  landlordName: string;
  landlordContactNumber: string;
  landlordEmail: string;
  agentName: string;
  agentContactNumber: string;
  agentEmail: string;
  heatingType: string;
  waterType: string;
  propertyType: string;
  epcRating: string;
  epcBand: string;
  serviceType: string;
  assessmentDate: string;
  notes: string;
  status: string;
  year: string;
  month: string;
}

interface AuthModalProps {
  isOpenModel: boolean;
  onCloseModel: () => void;
  data: Data;
}

// Validation schema using yup
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
  month: yup.string(),
  year: yup.string(),
  id: yup.string(),
  epcBand: yup.string(),
  waterType: yup.string(),
});

type FormData = yup.InferType<typeof schema>;

export const EditEmployeeJob: React.FC<AuthModalProps> = ({
  isOpenModel,
  onCloseModel,
  data,
}) => {
  const initialRef = useRef<HTMLInputElement>(null);
  const [Loading, setLoading] = useState(false);
  const toast = useToast();
  const finalRef = useRef<HTMLInputElement>(null);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: data, // set default values
    resolver: yupResolver(schema), // use yup for validation
  });

  useEffect(() => {
    if (isOpenModel && data) {
      setValue('id', data.id);
      setValue('title', data.title);
      setValue('firstName', data.firstName);
      setValue('lastName', data.lastName);
      setValue('dateOfBirth', data.dateOfBirth);
      setValue('email', data.email);
      setValue('contactNumber', data.contactNumber);
      setValue('address', data.address);
      setValue('postcode', data.postcode);
      setValue('landlordName', data.landlordName);
      setValue('landlordContactNumber', data.landlordContactNumber);
      setValue('landlordEmail', data.landlordEmail);
      setValue('agentName', data.agentName);
      setValue('agentContactNumber', data.agentContactNumber);
      setValue('agentEmail', data.agentEmail);
      setValue('heatingType', data.heatingType);
      setValue('propertyType', data.propertyType);
      setValue('epcRating', data.epcRating);
      setValue('serviceType', data.serviceType);
      setValue('assessmentDate', data.assessmentDate);
      setValue('notes', data.notes);
      setValue('month', data.month);
      setValue('year', data.year);
      setValue('epcBand', data.epcBand);
      setValue('waterType', data.waterType);
    }
  }, [isOpenModel, data, setValue]);
  const token = localStorage.getItem('authToken');
  const onSubmit = async (formData: FormData) => {
    try {
      setLoading(true);
      const response = await axios.put(
        'http://localhost:3002/api/updateEmployeeJob',
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      );
      if (response.status === 200) {
        toast({
          title: 'Job Status.',
          description: 'Job Successfully Updated.',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
        onCloseModel();
      }
    } catch (error) {
      console.error('Error updating employee job:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <React.Fragment>
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpenModel}
        onClose={onCloseModel}
      >
        {Loading ? (
          <Box
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            display="flex"
            justifyContent="center"
            alignItems="center"
            backgroundColor="rgba(255, 255, 255, 0.8)" // Adjust opacity and color as needed
            zIndex="2000" // Ensure it's above other content
          >
            <Spinner size="xl" />
          </Box>
        ) : null}
        <ModalOverlay />
        <ModalContent maxWidth={'70%'}>
          <ModalCloseButton />
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
                    <Box w={'100%'} p={'15px'} m={'15px'} borderRadius={'15px'}>
                      <Stack spacing={4}>
                        <FormControl isInvalid={!!errors.title}>
                          <FormLabel htmlFor="title">Title</FormLabel>
                          <Select
                            id="title"
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
                              defaultValue={data.firstName}
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
                              defaultValue={data.lastName}
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
                              defaultValue={data.dateOfBirth}
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
                    style={{ display: 'flex', justifyContent: 'space-between' }}
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
                            placeholder="Select Heating Type"
                            {...register('heatingType')}
                          >
                            <option value="Electric Room Heater">
                              Electric Room Heater
                            </option>
                            <option value="Electric Storage Heater">
                              Electric Storage Heater
                            </option>
                            <option value="Gas Boiler">Gas Boiler</option>
                            <option value="Electric Boiler">
                              Electric Boiler
                            </option>
                            <option value="No Heating">No Heating</option>
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
                            placeholder="Select Band "
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
                        <Heading fontSize={'x-large'}>Measures Details</Heading>
                        <FormControl isInvalid={!!errors.serviceType}>
                          <FormLabel htmlFor="serviceType">
                            Service Type
                          </FormLabel>
                          <Select
                            id="serviceType"
                            placeholder="Select Service Type"
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
                  </Box>
                  <Box
                    style={{ display: 'flex', justifyContent: 'space-between' }}
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
                          <FormLabel htmlFor="WaterType">Water Type</FormLabel>
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
                            Current EPC
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
                </Box>
                <Button mt={4} colorScheme="teal" type="submit">
                  Submit
                </Button>
              </form>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </React.Fragment>
  );
};
