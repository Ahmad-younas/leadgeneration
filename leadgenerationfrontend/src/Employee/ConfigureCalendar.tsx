import React, { useState } from 'react';
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
  ModalFooter,
  ModalOverlay,
  Spacer,
  Stack,
  Text,
  Textarea,
} from '@chakra-ui/react';
import customToolbar from './CustomToolbar';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAddressBook,
  faCalendarDays,
  faStarHalfStroke,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { EmailIcon } from '@chakra-ui/icons';
import { ENDPOINTS } from '../utils/apiConfig';
import { logout } from '../redux/authSlice';
import { useDispatch } from 'react-redux';

const localizer = momentLocalizer(moment);

interface Event {
  id: number;
  title: string;
  start: Date;
  end: Date;
  description?: string;
}

type ConfigureCalendarProps = Omit<CalendarProps<Event, object>, 'localizer'>;

export const ConfigureCalendar: React.FC<ConfigureCalendarProps> = (props) => {
  const token = localStorage.getItem('authToken');
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [jobDetails, setJobDetails] = useState<any | null>(null);
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

  return (
    <React.Fragment>
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
                  <form>
                    <Box
                      style={{
                        backgroundColor: 'white',
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
                        }}
                      >
                        <Box w={'100%'} p={'15px'} m={'1px'}>
                          <Stack spacing={4}>
                            <FormControl>
                              <FormLabel htmlFor="title">Title</FormLabel>
                              <Input
                                defaultValue={jobDetails.title}
                                isReadOnly={true}
                              />
                              <Spacer />
                            </FormControl>
                            <FormControl>
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
                                  defaultValue={jobDetails.firstName}
                                  isReadOnly={true}
                                />
                              </InputGroup>
                            </FormControl>
                            <FormControl>
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
                                  defaultValue={jobDetails.lastName}
                                  isReadOnly={true}
                                />
                              </InputGroup>
                            </FormControl>
                            <FormControl>
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
                                  defaultValue={jobDetails.dateOfBirth}
                                  isReadOnly={true}
                                />
                              </InputGroup>
                            </FormControl>
                            <FormControl>
                              <FormLabel htmlFor="email">Email</FormLabel>
                              <InputGroup>
                                <InputLeftElement pointerEvents={'none'}>
                                  <EmailIcon color={'gray.300'} />
                                </InputLeftElement>
                                <Input
                                  defaultValue={jobDetails.username}
                                  isReadOnly={true}
                                />
                              </InputGroup>
                            </FormControl>
                            <FormControl>
                              <FormLabel htmlFor="contactNumber">
                                Contact Number
                              </FormLabel>
                              <InputGroup>
                                <InputLeftAddon>+44</InputLeftAddon>
                                <Input
                                  defaultValue={jobDetails.contactNumber}
                                  isReadOnly={true}
                                />
                              </InputGroup>
                            </FormControl>
                            <FormControl>
                              <FormLabel htmlFor="address">Address</FormLabel>
                              <InputGroup>
                                <InputLeftElement pointerEvents={'none'}>
                                  <FontAwesomeIcon
                                    icon={faAddressBook}
                                    color="#CBD5E0"
                                  />
                                </InputLeftElement>
                                <Input
                                  defaultValue={jobDetails.address}
                                  isReadOnly={true}
                                />
                              </InputGroup>
                            </FormControl>
                          </Stack>
                        </Box>
                        <Box w={'100%'} bg={'white'} p={'15px'} m={'15px'}>
                          <Stack spacing={4}>
                            <FormControl>
                              <FormLabel htmlFor="postcode">Postcode</FormLabel>

                              <Input
                                defaultValue={jobDetails.postcode}
                                isReadOnly={true}
                              />
                            </FormControl>
                            <FormControl>
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
                                  defaultValue={jobDetails.landlordName}
                                  isReadOnly={true}
                                />
                              </InputGroup>
                            </FormControl>
                            <FormControl>
                              <FormLabel htmlFor="landlordContactNumber">
                                Landlord Contact Number
                              </FormLabel>
                              <InputGroup>
                                <InputLeftAddon>+44</InputLeftAddon>
                                <Input
                                  defaultValue={
                                    jobDetails.landlordContactNumber
                                  }
                                  isReadOnly={true}
                                />
                              </InputGroup>
                            </FormControl>
                            <FormControl>
                              <FormLabel htmlFor="landlordEmail">
                                Landlord Email
                              </FormLabel>
                              <InputGroup>
                                <InputLeftElement pointerEvents={'none'}>
                                  <EmailIcon color="#CBD5E0" />
                                </InputLeftElement>
                                <Input
                                  defaultValue={jobDetails.landlordEmail}
                                  isReadOnly={true}
                                />
                              </InputGroup>
                            </FormControl>
                            <FormControl>
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
                                  defaultValue={jobDetails.agentName}
                                  isReadOnly={true}
                                />
                              </InputGroup>
                            </FormControl>
                            <FormControl>
                              <FormLabel htmlFor="agentContactNumber">
                                Agent Contact Number
                              </FormLabel>
                              <InputGroup>
                                <InputLeftAddon>+44</InputLeftAddon>
                                <Input
                                  defaultValue={jobDetails.agentContactNumber}
                                  isReadOnly={true}
                                />
                              </InputGroup>
                            </FormControl>
                            <FormControl>
                              <FormLabel htmlFor="agentEmail">
                                Agent Email
                              </FormLabel>
                              <InputGroup>
                                <InputLeftElement pointerEvents={'none'}>
                                  <EmailIcon color="#CBD5E0" />
                                </InputLeftElement>
                                <Input
                                  defaultValue={jobDetails.agentEmail}
                                  isReadOnly={true}
                                />
                              </InputGroup>
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
                            <Heading pt={'4'} fontSize={'x-large'}>
                              Property Details Section
                            </Heading>
                            <FormControl>
                              <FormLabel htmlFor="heatingType">
                                Heating Type
                              </FormLabel>
                              <Input
                                defaultValue={jobDetails.heatingType}
                                isReadOnly={true}
                              />
                            </FormControl>

                            <FormControl>
                              <FormLabel htmlFor="propertyType">
                                Property Type
                              </FormLabel>
                              <Input
                                defaultValue={jobDetails.propertyType}
                                isReadOnly={true}
                              />
                            </FormControl>

                            <FormControl>
                              <FormLabel htmlFor="epcRating">
                                Current EPC Band
                              </FormLabel>
                              <InputGroup>
                                <InputLeftElement pointerEvents={'none'}>
                                  <FontAwesomeIcon
                                    icon={faStarHalfStroke}
                                    color="#CBD5E0"
                                  />
                                </InputLeftElement>
                                <Input
                                  defaultValue={jobDetails.epcBand}
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
                            <Heading pt={'4'} fontSize={'x-large'}>
                              Measures Details
                            </Heading>
                            <FormControl>
                              <FormLabel htmlFor="serviceType">
                                Service Type
                              </FormLabel>
                              <Input
                                defaultValue={jobDetails.serviceType}
                                isReadOnly={true}
                              />
                            </FormControl>

                            <FormControl>
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
                                  defaultValue={jobDetails.assessmentDate}
                                  isReadOnly={true}
                                />
                              </InputGroup>
                            </FormControl>

                            <FormControl>
                              <FormLabel htmlFor="note">Note</FormLabel>
                              <Textarea
                                id="note"
                                defaultValue={jobDetails.notes}
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
                            <Heading pt={'4'} fontSize={'x-large'}>
                              Job Status
                            </Heading>
                            <FormControl>
                              <FormLabel htmlFor="serviceType">
                                Status
                              </FormLabel>
                              <Input
                                id={'status'}
                                defaultValue={jobDetails.status}
                                isReadOnly={true}
                              />
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
                              <FormControl>
                                <FormLabel htmlFor="waterType">
                                  Water Type
                                </FormLabel>
                                <Input
                                  defaultValue={jobDetails.waterType}
                                  isReadOnly={true}
                                />
                              </FormControl>
                              <Heading fontSize={'x-large'}>
                                Current EPC Rating
                              </Heading>
                              <FormControl>
                                <FormLabel htmlFor={'Current EPC Rating'}>
                                  <Input
                                    defaultValue={jobDetails.epcRating}
                                    isReadOnly={true}
                                  />
                                </FormLabel>
                              </FormControl>
                            </Stack>
                          </Box>
                        </Box>
                      </Box>
                      <ModalFooter>
                        <Button colorScheme="teal" size="lg" onClick={onClose}>
                          Close
                        </Button>
                      </ModalFooter>
                    </Box>
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
