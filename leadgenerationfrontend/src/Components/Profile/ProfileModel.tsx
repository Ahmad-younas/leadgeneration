import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { ENDPOINTS } from '../../utils/apiConfig';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/authSlice';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AdminData {
  username: string;
  password: string;
  email: string;
}

// Yup schema for validation
const schema = yup.object().shape({
  username: yup.string().required('Name is required'),
  email: yup
    .string()
    .email('Invalid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
}) => {
  const initialRef = useRef<HTMLInputElement>(null);
  const finalRef = useRef<HTMLInputElement>(null);
  const token = localStorage.getItem('authToken');
  const toast = useToast();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  // Initialize default data
  const [defaultData, setDefaultData] = useState<AdminData>({
    username: '',
    email: '',
    password: '',
  });

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AdminData>({
    resolver: yupResolver(schema),
    defaultValues: defaultData,
  });

  // Fetch data when modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const response = await axios.get(ENDPOINTS.getEmployeeById, {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`, // Fixed token issue
            },
          });
          setDefaultData(response.data.employee);
          reset(response.data.employee); // Set default values in form
          setLoading(false);
        } catch (error) {
          if (axios.isAxiosError(error)) {
            if (error?.response?.status === 403 || error?.response?.status === 401) {
              dispatch(logout());
            }
          }
          console.error('Error fetching data:', error);
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [isOpen, token, reset]);

  // Handle form submission
  const onSubmit = async (formData: AdminData) => {
    try {
      const response = await axios.patch(
        ENDPOINTS.updateAdmin,
        {
          email: formData.email,
          name: formData.username,
          password: formData.password,
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Fixed token issue
          },
        }
      );
      if (response.status === 200) {
        toast({
          title: 'Update Status.',
          description: 'Successfully updated the employee information.',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
        onClose(); // Close modal after success
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error?.response?.status === 403 || error?.response?.status === 401) {
          dispatch(logout());
        }
      }
      console.error('Error updating employee:', error);
    }
  };

  return (
    <Modal
      initialFocusRef={initialRef}
      finalFocusRef={finalRef}
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Update Information</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl isInvalid={!!errors.username}>
                <FormLabel>Name</FormLabel>
                <Input placeholder="Enter Name" {...register('username')} />
                <FormErrorMessage>{errors.username?.message}</FormErrorMessage>
              </FormControl>

              <FormControl mt={4} isInvalid={!!errors.email}>
                <FormLabel>Email</FormLabel>
                <Input placeholder="Email" {...register('email')} />
                <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
              </FormControl>

              <FormControl mt={4} isInvalid={!!errors.password}>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    placeholder="Password"
                    type={show ? 'text' : 'password'}
                    {...register('password')}
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleClick}>
                      {show ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
              </FormControl>

              <ModalFooter>
                <Button colorScheme="teal" variant="solid" mr={3} type="submit">
                  Save
                </Button>
                <Button onClick={onClose}>Cancel</Button>
              </ModalFooter>
            </form>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
