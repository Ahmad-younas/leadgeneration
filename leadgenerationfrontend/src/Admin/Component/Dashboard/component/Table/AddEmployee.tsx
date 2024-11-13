import React from 'react';
import { useForm } from 'react-hook-form';
import { ENDPOINTS } from '../../../../../utils/apiConfig';
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Card } from '../../../../../Components/Card/Card';
import CardHeader from '../../../../../Components/Card/CardHeader';
import axios from 'axios';
import { logout } from '../../../../../redux/authSlice';
import { useDispatch } from 'react-redux';

interface FormValues {
  email: string;
  name: string;
  password: string;
  role: string;
}

const schema = yup.object().shape({
  email: yup
    .string()
    .email('Invalid email address')
    .required('Email is required'),
  name: yup.string().required('Name is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  role: yup.string().required('Role is required'),
});

export const AddEmployee: React.FC = () => {
  const token = localStorage.getItem('authToken');
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });
  const toast = useToast();
  const textColor = useColorModeValue('gray.700', 'white');
  const onSubmit = async (data: FormValues) => {
    try {
      const response = await axios.post(
        ENDPOINTS.addEmployee,
        {
          email: data.email,
          name: data.name,
          password: data.password,
          role: data.role,
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 201) {
        toast({
          title: 'Employee Status.',
          description: 'Employee Successfully Added.',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
        reset();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error?.response?.status === 403 || error?.response?.status === 401) {
          dispatch(logout());
        } else if (error?.response?.status === 302) {
          toast({
            title: 'Employee Status.',
            description: error?.response?.data?.message,
            status: 'warning',
            duration: 5000,
            isClosable: true,
            position: 'top-right',
          });
        }
      } else {
        console.error('An unexpected error occurred', error);
      }
    }
  };

  return (
    <React.Fragment>
      <Card
        overflowX={{ sm: 'scroll', xl: 'hidden' }}
        bg={'white'}
        padding={'22px'}
        borderRadius={'15px'}
        boxshadow={'rgba(0, 0, 0, 0.02) 0px 3.5px 5.5px'}
      >
        <CardHeader
          p="6px 0px 22px 0px"
          display={'flex'}
          flexDirection={'column'}
          justifyContent={'space-between'}
        >
          <Text fontSize="xl" color={textColor} fontWeight="bold">
            Add Employee
          </Text>
          <Box mx="auto" mt={5} display={'flex'} width={'100%'}>
            <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
              <FormControl isInvalid={!!errors.email}>
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input id="email" placeholder="Email" {...register('email')} />
                <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.name} mt={4}>
                <FormLabel htmlFor="name">Name</FormLabel>
                <Input id="name" placeholder="Name" {...register('name')} />
                <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.password} mt={4}>
                <FormLabel htmlFor="password">Password</FormLabel>
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  {...register('password')}
                />
                <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.role} mt={4}>
                <FormLabel htmlFor="heatingType">Employee Role</FormLabel>
                <Select
                  id="role"
                  placeholder="Select Role"
                  {...register('role')}
                >
                  <option value="employee">Employee</option>
                  <option value="admin">Admin</option>
                </Select>
                <FormErrorMessage>{errors.role?.message}</FormErrorMessage>
              </FormControl>

              <Button mt={4} colorScheme="teal" type="submit">
                Save
              </Button>
            </form>
          </Box>
        </CardHeader>
      </Card>
    </React.Fragment>
  );
};
