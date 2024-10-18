import React, { useEffect, useRef } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  Box,
  FormControl,
  Button,
  FormLabel,
  Input,
  Heading,
  Stack,
  Spacer,
  InputGroup,
  InputLeftElement, InputLeftAddon, Textarea, Select, FormErrorMessage, useToast,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressBook, faCalendarDays, faUser } from '@fortawesome/free-solid-svg-icons';
import { EmailIcon } from '@chakra-ui/icons';
import axios from 'axios';

interface Data {
  id:string;
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
  propertyType: string;
  epcRating: string;
  serviceType: string;
  assessmentDate: string;
  notes: string;
  status:string;
  year:string;
  month:string;

}


interface AuthModalProps {
  isOpenModel: boolean;
  onCloseModel: () => void;
  data: Data;
}

// Validation schema using yup
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
  status: yup.string(),
  month: yup.string(),
  year: yup.string(),
  id:yup.string()
});

type FormData = yup.InferType<typeof schema>;


export const EditEmployeeJob: React.FC<AuthModalProps> = ({ isOpenModel, onCloseModel, data }) => {
  const initialRef = useRef<HTMLInputElement>(null);
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
      setValue('id',data.id);
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
      setValue('month',data.month);
      setValue('year',data.year);
      setValue('status',data.status);
    }
  }, [isOpenModel,data, setValue]);

  const token = localStorage.getItem('authToken');
  const onSubmit = async (formData: FormData) => {
    try {
      const response = await axios.put('http://localhost:3002/api/updateEmployeeJob', formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
        }
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
        onCloseModel();
      }
    } catch (error) {
      console.error('Error updating employee job:', error);
    }
  };

  return (
    <Modal initialFocusRef={initialRef} finalFocusRef={finalRef} isOpen={isOpenModel} onClose={onCloseModel}>
      <ModalOverlay />
      <ModalContent maxWidth={"70%"}>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Box display='flex' justifyContent='center'>
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
                          {...register('epcRating')}
                          defaultValue={data.epcRating}
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
                          value={data.serviceType}
                          id='serviceType'
                          {...register('serviceType')}
                          defaultValue={data.serviceType}
                        >
                          <option value='Loft Insulation'>Loft Insulation</option>
                          <option value='Electric Storage Heater'>
                            Electric Storage Heater
                          </option>
                          <option value='Solar PV'>Solar PV</option>
                          <option value='Solar PV'>Solar PV</option>
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
                        <Select
                          id='status'
                          {...register('status')}
                          defaultValue={data.status}
                        >
                          <option value='Submitted'>Submitted</option>
                          <option value='Canceled'>Canceled</option>
                          <option value='Insulated'>Insulated</option>
                          <option value='Booked'>Booked</option>
                        </Select>
                        <FormErrorMessage>
                          {errors.status?.message}
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
  );
};
