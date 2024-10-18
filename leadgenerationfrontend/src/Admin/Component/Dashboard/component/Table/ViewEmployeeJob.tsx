import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  Box,
  FormControl,
  Button,
  ModalFooter,
  FormLabel,
  Input,
  Heading,
  Stack,
  Spacer,
  InputGroup,
  InputLeftElement, InputLeftAddon, Textarea,
} from '@chakra-ui/react';
import React, { useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressBook, faCalendarDays, faStarHalfStroke, faUser } from '@fortawesome/free-solid-svg-icons';
import { EmailIcon } from '@chakra-ui/icons';

interface FormData {
  username:string,
  role:string,
  userEmail:string,
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
  month: string;
  year: string;
  status:string;
}

interface AuthModalProps {
  isOpenModel: boolean;
  onCloseModel: () => void;
  data: FormData
}


export const ViewEmployeeJob: React.FC<AuthModalProps> = ({ isOpenModel, onCloseModel, data }) => {
  const initialRef = useRef<HTMLInputElement>(null);
  const finalRef = useRef<HTMLInputElement>(null);

  return (
    <Modal
      initialFocusRef={initialRef}
      finalFocusRef={finalRef}
      isOpen={isOpenModel}
      onClose={onCloseModel}
    >
      <ModalOverlay />
      <ModalContent maxWidth={"70%"}>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Box display='flex' justifyContent='center'>
            <form>
              <Box
                style={{
                  backgroundColor: 'white',
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
                  }}
                >
                  <Box w={'100%'} p={'15px'} m={'1px'}>
                    <Stack spacing={4}>
                      <FormControl>
                        <FormLabel htmlFor="title">Title</FormLabel>
                        <Input
                          defaultValue={data.title}
                          isReadOnly={true}
                        />
                        <Spacer />
                      </FormControl>
                      <FormControl>
                        <FormLabel htmlFor="firstName">First Name</FormLabel>
                        <InputGroup>
                          <InputLeftElement pointerEvents={'none'}>
                            <FontAwesomeIcon icon={faUser} color="#CBD5E0" />
                          </InputLeftElement>
                          <Input
                            defaultValue={data.firstName}
                            isReadOnly={true}
                          />
                        </InputGroup>
                      </FormControl>
                      <FormControl >
                        <FormLabel htmlFor="lastName">Last Name</FormLabel>
                        <InputGroup>
                          <InputLeftElement>
                            <FontAwesomeIcon icon={faUser} color="#CBD5E0" />
                          </InputLeftElement>
                          <Input
                            defaultValue={data.lastName}
                            isReadOnly={true}
                          />
                        </InputGroup>
                      </FormControl>
                      <FormControl >
                        <FormLabel htmlFor="dateOfBirth">Date of Birth</FormLabel>
                        <InputGroup>
                          <InputLeftElement pointerEvents={'none'}>
                            <FontAwesomeIcon
                              icon={faCalendarDays}
                              color="#CBD5E0"
                            />
                          </InputLeftElement>
                          <Input
                            defaultValue={data.dateOfBirth}
                            isReadOnly={true}
                          />
                        </InputGroup>
                      </FormControl>
                      <FormControl >
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <InputGroup>
                          <InputLeftElement pointerEvents={'none'}>
                            <EmailIcon color={'gray.300'} />
                          </InputLeftElement>
                          <Input
                            defaultValue={data.username}
                            isReadOnly={true}
                          />
                        </InputGroup>
                      </FormControl>
                      <FormControl >
                        <FormLabel htmlFor="contactNumber">
                          Contact Number
                        </FormLabel>
                        <InputGroup>
                          <InputLeftAddon>+44</InputLeftAddon>
                          <Input
                            defaultValue={data.contactNumber}
                            isReadOnly={true}
                          />
                        </InputGroup>
                      </FormControl>
                      <FormControl >
                        <FormLabel htmlFor="address">Address</FormLabel>
                        <InputGroup>
                          <InputLeftElement pointerEvents={'none'}>
                            <FontAwesomeIcon
                              icon={faAddressBook}
                              color="#CBD5E0"
                            />
                          </InputLeftElement>
                          <Input
                            defaultValue={data.address}
                            isReadOnly={true}
                          />
                        </InputGroup>
                      </FormControl>
                    </Stack>
                  </Box>
                  <Box w={'100%'} bg={'white'} p={'15px'} m={'15px'}>
                    <Stack spacing={4}>
                      <FormControl >
                        <FormLabel htmlFor="postcode">Postcode</FormLabel>

                        <Input
                          defaultValue={data.postcode}
                          isReadOnly={true}
                        />
                      </FormControl>
                      <FormControl >
                        <FormLabel htmlFor="landlordName">
                          Landlord Name
                        </FormLabel>
                        <InputGroup>
                          <InputLeftElement pointerEvents={'none'}>
                            <FontAwesomeIcon icon={faUser} color="#CBD5E0" />
                          </InputLeftElement>
                          <Input
                            defaultValue={data.landlordName}
                            isReadOnly={true}
                          />
                        </InputGroup>
                      </FormControl>
                      <FormControl >
                        <FormLabel htmlFor="landlordContactNumber">
                          Landlord Contact Number
                        </FormLabel>
                        <InputGroup>
                          <InputLeftAddon>+44</InputLeftAddon>
                          <Input
                            defaultValue={data.landlordContactNumber}
                            isReadOnly={true}
                          />
                        </InputGroup>
                      </FormControl>
                      <FormControl >
                        <FormLabel htmlFor="landlordEmail">
                          Landlord Email
                        </FormLabel>
                        <InputGroup>
                          <InputLeftElement pointerEvents={'none'}>
                            <EmailIcon color="#CBD5E0" />
                          </InputLeftElement>
                          <Input
                            defaultValue={data.landlordEmail}
                            isReadOnly={true}
                          />
                        </InputGroup>
                      </FormControl>
                      <FormControl >
                        <FormLabel htmlFor="agentName">Agent Name</FormLabel>
                        <InputGroup>
                          <InputLeftElement pointerEvents={'none'}>
                            <FontAwesomeIcon icon={faUser} color="#CBD5E0" />
                          </InputLeftElement>
                          <Input
                            defaultValue={data.agentName}
                            isReadOnly={true}
                          />
                        </InputGroup>
                      </FormControl>
                      <FormControl >
                        <FormLabel htmlFor="agentContactNumber">
                          Agent Contact Number
                        </FormLabel>
                        <InputGroup>
                          <InputLeftAddon>+44</InputLeftAddon>
                          <Input
                            defaultValue={data.agentContactNumber}
                            isReadOnly={true}
                          />
                        </InputGroup>
                      </FormControl>
                      <FormControl >
                        <FormLabel htmlFor="agentEmail">Agent Email</FormLabel>
                        <InputGroup>
                          <InputLeftElement pointerEvents={'none'}>
                            <EmailIcon color="#CBD5E0" />
                          </InputLeftElement>
                          <Input
                            defaultValue={data.agentEmail}
                            isReadOnly={true}
                          />
                        </InputGroup>
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
                      <Heading pt={'4'}
                               fontSize={"x-large"} >Property Details Section</Heading>
                      <FormControl >
                        <FormLabel htmlFor="heatingType">Heating Type</FormLabel>
                        <Input
                          defaultValue={data.heatingType}
                          isReadOnly={true}
                        />
                      </FormControl>

                      <FormControl >
                        <FormLabel htmlFor="propertyType">
                          Property Type
                        </FormLabel>
                        <Input
                          defaultValue={data.propertyType}
                          isReadOnly={true}
                        />

                      </FormControl>

                      <FormControl >
                        <FormLabel htmlFor="epcRating">
                          Current EPC Rating
                        </FormLabel>
                        <InputGroup>
                          <InputLeftElement pointerEvents={'none'}>
                            <FontAwesomeIcon
                              icon={faStarHalfStroke}
                              color="#CBD5E0"
                            />
                          </InputLeftElement>
                          <Input
                            defaultValue={data.epcRating}
                            isReadOnly={true}
                          />
                        </InputGroup>
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
                      <Heading pt={'4'}
                               fontSize={"x-large"}>Measures Details</Heading>
                      <FormControl >
                        <FormLabel htmlFor="serviceType">Service Type</FormLabel>
                        <Input
                          defaultValue={data.serviceType}
                          isReadOnly={true}
                        />
                      </FormControl>

                      <FormControl >
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
                            defaultValue={data.assessmentDate}
                            isReadOnly={true}
                          />
                        </InputGroup>
                      </FormControl>

                      <FormControl >
                        <FormLabel htmlFor="note">Note</FormLabel>
                        <Textarea
                          id="note"
                          defaultValue={data.notes}
                          isReadOnly={true}
                        />
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
                      <Heading pt={'4'}
                               fontSize={"x-large"}>Job Status</Heading>
                      <FormControl >
                        <FormLabel htmlFor="serviceType">Status</FormLabel>
                        <Input
                          id={"status"}
                          defaultValue={data.status}
                          isReadOnly={true}
                        />
                      </FormControl>
                    </Stack>
                  </Box>
                </Box>
                <ModalFooter>
                  <Button onClick={onCloseModel}>Close</Button>
                </ModalFooter>
              </Box>
            </form>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
