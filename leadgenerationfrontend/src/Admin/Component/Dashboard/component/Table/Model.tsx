// AuthModal.tsx
import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  useToast, Select,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';

interface FormData {
  name: string;
  email: string;
  password: string;
  role:string;
  id:string;
}

interface AuthModalProps {
  isOpenModel: boolean;
  onCloseModel: () => void;
  data: FormData
}

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup
    .string()
    .email('Invalid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  role:yup.string().required('Role is required'),
  id:yup.string().required('Id is required'),
});

export const Model: React.FC<AuthModalProps> = ({
  isOpenModel,
  onCloseModel,
  data
}) => {
  const initialRef = useRef<HTMLInputElement>(null);
  const finalRef = useRef<HTMLInputElement>(null);
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({ resolver: yupResolver(schema) });
  const token = localStorage.getItem('authToken');
  const onSubmit = async (data: FormData) => {
    try{
      const response = await axios.patch(
        'http://localhost:3002/api/update-employee',
        {
          email: data.email,
          name: data.name,
          password: data.password,
          role: data.role,
          id: data.id
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
          }
        }
      );
      if(response.status === 200){
        toast({
          title: 'Update Status.',
          description: 'Successfully Update the Employee Information.',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
      }
      reset();
      onCloseModel();
    }catch (error){
      if (axios.isAxiosError(error)) {
        toast({
          title: 'Employee Update Status.',
          description: error.response?.data.error.errors[0].message,
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
      } else {
        console.error('An unexpected error occurred', error);
      }
    }

  };

  return (
    <Modal
      initialFocusRef={initialRef}
      finalFocusRef={finalRef}
      isOpen={isOpenModel}
      onClose={onCloseModel}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Update Information</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={!!errors.name}>
              <FormLabel>Name</FormLabel>
              <Input
                placeholder="Enter Name"
                defaultValue={data.name}
                {...register('name', { required: 'Name is required' })}
              />
              <FormErrorMessage>
                {errors.name && errors.name.message}
              </FormErrorMessage>
            </FormControl>
            <Input type="hidden" defaultValue={data.id} {...register('id')} />


            <FormControl mt={4} isInvalid={!!errors.email}>
              <FormLabel>Email</FormLabel>
              <Input
                defaultValue={data.email}
                placeholder="Email"
                {...register('email', { required: 'Email is required' })}
              />
              <FormErrorMessage>
                {errors.email && errors.email.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl mt={4} isInvalid={!!errors.password}>
              <FormLabel>Password</FormLabel>
              <Input
                defaultValue={data.password}
                placeholder="Password"
                {...register('password', { required: 'Password is required' })}
              />
              <FormErrorMessage>
                {errors.password && errors.password.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.role} mt={4}>
              <FormLabel htmlFor="heatingType">Employee Role</FormLabel>
              <Select
                defaultValue={data.role}
                id="role"
                placeholder="Select Role"
                {...register('role')}
              >
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
              </Select>
              <FormErrorMessage>{errors.role?.message}</FormErrorMessage>
            </FormControl>

            <ModalFooter>
              <Button colorScheme="teal"  variant="solid" mr={3} type="submit">
                Save
              </Button>
              <Button onClick={onCloseModel}>Cancel</Button>
            </ModalFooter>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
