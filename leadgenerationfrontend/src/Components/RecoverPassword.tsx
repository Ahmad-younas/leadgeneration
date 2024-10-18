import React from 'react';
import {
  Box,
  Flex,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link as ChakraLink,
  useToast,
  Text,
  useColorModeValue,
  FormErrorMessage,
} from '@chakra-ui/react';
import Logger from "../Logger";
import { useLocation } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Lottie from 'react-lottie';
import resetpassword from '../assets/resetpassword.json';
import { Footer } from '../Components/Footer';
import axios from 'axios';

// Define validation schema using Yup
const schema = yup.object().shape({
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), ''], 'Passwords must match')
    .required('Confirm Password is required'),
});

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: resetpassword,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
};

// Define the form data interface
interface IFormInput {
  password: string;
  confirmPassword: string;
}
export const RecoverPassword: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');

  const toast = useToast();
  const titleColor = useColorModeValue('teal.300', 'teal.200');
  const textColor = useColorModeValue('gray.400', 'white');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IFormInput>({
    resolver: yupResolver(schema),
  });
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const newData = {
      newPassword:data.password,
      token
    }
    try{
      const response = await axios.post("http://localhost:3002/api/resetPassword",newData );
      if(response.status === 200){
        toast({
          title: 'Password Status',
          description: 'Your password has been successfully updated.',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        });
        reset();
      }
    }catch (error){
      if (axios.isAxiosError(error)) {
        console.error('An unexpected error occurred', error.response?.status);
        let status:number | undefined = error.response?.status;
        let message:string = error.response?.data.message;
        if (error.response?.status === status) {
          toast({
            title: 'Password Status.',
            description: message,
            status: 'error',
            duration: 5000,
            isClosable: true,
            position: 'top-right',
          });
        }
        Logger.error("error",error.response?.data.message);
      } else {
        Logger.error('An unexpected error occurred', error);
      }
    }
  };

  return (
    <React.Fragment>
      <Flex position="relative" mb="40px">
        <Flex
          h={{ sm: 'initial', md: '75vh', lg: '85vh' }}
          w="100%"
          maxW="1044px"
          mx="auto"
          justifyContent="space-between"
          mb="30px"
          pt={{ sm: '100px', md: '0px' }}
        >
          <Flex
            alignItems="center"
            justifyContent="start"
            style={{ userSelect: 'none' }}
            w={{ base: '100%', md: '50%', lg: '42%' }}
          >
            <Flex
              direction="column"
              w="100%"
              background="transparent"
              p="48px"
              mt={{ md: '150px', lg: '80px' }}
            >
              <Heading color={titleColor} fontSize="32px" mb="10px">
                Recover Password
              </Heading>
              <Text
                mb="36px"
                ms="4px"
                color={textColor}
                fontWeight="bold"
                fontSize="14px"
              >
                Enter your new password to reset it
              </Text>
              <form onSubmit={handleSubmit(onSubmit)}>
                <FormControl isInvalid={!!errors.password}>
                  <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                    New Password
                  </FormLabel>
                  <Input
                    borderRadius="15px"
                    mb={errors.password ? '0px' : '24px'}
                    fontSize="sm"
                    type="password"
                    placeholder="Your new password"
                    size="lg"
                    {...register('password')}
                  />
                  <FormErrorMessage>
                    {errors.password && errors.password.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!errors.confirmPassword}>
                  <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                    Confirm Password
                  </FormLabel>
                  <Input
                    borderRadius="15px"
                    mb={errors.confirmPassword ? '0px' : '24px'}
                    fontSize="sm"
                    type="password"
                    placeholder="Confirm your new password"
                    size="lg"
                    {...register('confirmPassword')}
                  />
                  <FormErrorMessage>
                    {errors.confirmPassword && errors.confirmPassword.message}
                  </FormErrorMessage>
                </FormControl>
                <Button
                  type="submit"
                  fontSize="10px"
                  bg="teal.300"
                  w="100%"
                  h="45"
                  mb="20px"
                  color="white"
                  mt="20px"
                  _hover={{
                    bg: 'teal.500',
                  }}
                  _active={{
                    bg: 'teal.400',
                  }}
                >
                  RESET PASSWORD
                </Button>
              </form>
            </Flex>
          </Flex>
          <Box
            display={{ base: 'none', md: 'block' }}
            overflowX="hidden"
            h="100%"
            w="40vw"
            position="absolute"
            right="0px"
          >
            <Box
              // Update the image path if necessary
              w="100%"
              h="100%"
              bgSize="cover"
              bgPosition="50%"
              position="absolute"
              marginRight={'50px'}
            >
              <Lottie options={defaultOptions} />
            </Box>
          </Box>
        </Flex>
      </Flex>
      <Footer />
    </React.Fragment>
  );
};
