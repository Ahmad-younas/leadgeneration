import {
  Box,
  Flex,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Switch,
  Link as ChakraLink,
  Text,
  FormErrorMessage,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import signInImage from '../assets/signInImage.png';
import { Footer } from '../Components/Footer';
import axios from 'axios';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { login } from '../redux/authSlice';


const schema = yup.object().shape({
  email: yup
    .string()
    .email('Invalid email address')
    .required('Email is required'),
  password: yup.string().required('Password is required'),
  remember: yup.boolean(),
});
interface IFormInput {
  email: string;
  password: string;
  remember?: boolean;
}
export const SignIn: React.FC = () => {
  const toast = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const titleColor = useColorModeValue('teal.300', 'teal.200');
  const textColor = useColorModeValue('gray.400', 'white');
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IFormInput>({
    resolver: yupResolver(schema),
  });
  const user = useSelector((state: RootState) => state.auth.user);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      const response = await axios.post(
        'http://localhost:3002/api/login/',
        {
          email: data.email,
          password: data.password,
          rememberMe: data.remember,
        },
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        const token = response.data.token;
        localStorage.setItem('authToken', token);
        dispatch(login(token));// This should be dynamically determined
        reset();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data ?? "'An unknown error occurred'");
        toast({
          title: 'Login Status.',
          description: 'Invalid Credentials',
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
  useEffect(() => {
    if (user) {
      console.log("inside the use Effect");
      // Navigate based on the user's role
      navigate(user.role === 'admin' ? '/admin' : '/employee');
    }
  }, [user, navigate]);
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
                Welcome Back
              </Heading>
              <Text
                mb="36px"
                ms="4px"
                color={textColor}
                fontWeight="bold"
                fontSize="14px"
              >
                Enter your email and password to sign in
              </Text>
              <form onSubmit={handleSubmit(onSubmit)}>
                <FormControl isInvalid={!!errors.email}>
                  <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                    Email
                  </FormLabel>
                  <Input
                    borderRadius="15px"
                    mb={errors.email ? '0px' : '24px'}
                    fontSize="sm"
                    type="text"
                    placeholder="Your email adress"
                    size="lg"
                    {...register('email')}
                  />
                  <FormErrorMessage>
                    {errors.email && errors.email.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!errors.password}>
                  <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                    Password
                  </FormLabel>
                  <Input
                    borderRadius="15px"
                    mb={errors.password ? '0px' : '36px'}
                    fontSize="sm"
                    type="password"
                    placeholder="Your password"
                    size="lg"
                    {...register('password')}
                  />
                  <FormErrorMessage>
                    {errors.password && errors.password.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl display="flex" alignItems="center">
                  <Switch
                    id="remember-login"
                    colorScheme="teal"
                    me="10px"
                    isChecked={rememberMe}
                    {...register('remember')}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <FormLabel
                    htmlFor="remember-login"
                    mb="0"
                    ms="1"
                    fontWeight="normal"
                  >
                    Remember me
                  </FormLabel>
                </FormControl>
                <Button
                  fontSize="10px"
                  type="submit"
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
                  SIGN IN
                </Button>
              </form>

              <Flex
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                maxW="100%"
                mt="0px"
              >
                <Text color={textColor} fontWeight="medium">
                  Forgot your password?
                  <ChakraLink
                    color={titleColor}
                    to="/forgot-password"
                    as={RouterLink}
                    ms="5px"
                    fontWeight="bold"
                  >
                    Recover it
                  </ChakraLink>
                </Text>
              </Flex>
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
              bgImage={signInImage}
              w="100%"
              h="100%"
              bgSize="cover"
              bgPosition="50%"
              position="absolute"
              borderBottomLeftRadius="20px"
            ></Box>
          </Box>
        </Flex>
      </Flex>
      <Footer />
    </React.Fragment>
  );
};
