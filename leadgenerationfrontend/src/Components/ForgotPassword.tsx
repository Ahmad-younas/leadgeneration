import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Flex,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  useToast,
  Link as ChakraLink,
  Text,
  useColorModeValue,
  FormErrorMessage,
} from '@chakra-ui/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import signInImage from '../assets/signInImage.png';
import { Footer } from '../Components/Footer';
import axios from 'axios';
import Lottie from 'react-lottie';
import forgotPassword from '../assets/forgotpassword.json';

// Define validation schema using Yup
const schema = yup.object().shape({
  email: yup
    .string()
    .email('Invalid email address')
    .required('Email is required'),
});
interface IFormInput {
  email: string;
}
const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: forgotPassword,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
};
export const ForgotPassword: React.FC = () => {
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
    try {
      const response = await axios.post('http://localhost:3002/api/forgetPassword', {
        email: data.email,
      });
      console.log("response",response.data);
      if (response.status === 200) {
        toast({
          title: 'Mail Sent.',
          description: "We've sent Reset password link to your email.",
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
        reset();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('An unexpected error occurred', error.response?.status);
        let status:number | undefined = error.response?.status;
        let message:string = error.response?.data.message;
        if (error.response?.status === status) {
          toast({
            title: 'Mail Sent.',
            description: message,
            status: 'error',
            duration: 5000,
            isClosable: true,
            position: 'top-right',
          });
        }
        console.error("error",error.response?.data ?? "'An unknown error occurred'");
      } else {
        console.error('An unexpected error occurred', error);
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
                Forgot Password
              </Heading>
              <Text
                mb="36px"
                ms="4px"
                color={textColor}
                fontWeight="bold"
                fontSize="14px"
              >
                Enter your email to receive a password reset link
              </Text>
              <form onSubmit={handleSubmit(onSubmit)}>
                <FormControl isInvalid={!!errors.email}>
                  <FormLabel ms="4px" fontSize="sm" fontWeight="normal">
                    Email
                  </FormLabel>
                  <Input
                    borderRadius="15px"
                    mb={errors.email ? '0px' : '15px'}
                    fontSize="sm"
                    type="text"
                    placeholder="Your email address"
                    size="lg"
                    {...register('email')}
                  />
                  <FormErrorMessage>
                    {errors.email && errors.email.message}
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
                  SEND RESET LINK
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
                  Remember your password?
                  <ChakraLink
                    as={RouterLink}
                    to="/"
                    color={titleColor}
                    ms="5px"
                    fontWeight="bold"
                  >
                    Sign In
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
            <Lottie options={defaultOptions} height={'100%'} width={'100%'} />
            {/*<Box*/}
            {/*    bgImage={signInImage} // Update the image path if necessary*/}
            {/*    w='100%'*/}
            {/*    h='100%'*/}
            {/*    bgSize='cover'*/}
            {/*    bgPosition='50%'*/}
            {/*    position='absolute'*/}
            {/*    borderBottomLeftRadius='20px'></Box>*/}
          </Box>
        </Flex>
      </Flex>
      <Footer />
    </React.Fragment>
  );
};
