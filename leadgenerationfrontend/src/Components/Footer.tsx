import {
  Box,
  Container,
  Flex,
  Link as ChakraLink,
  Stack,
  Text,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import React from 'react';

export const Footer = () => {
  return (
    <React.Fragment>
      <Flex
        flexDirection={{
          base: 'column',
          xl: 'row',
        }}
        alignItems={{
          base: 'center',
          xl: 'start',
        }}
        justifyContent="center"
        px="30px"
        // pb="20px"
      >
        {/*<Text*/}
        {/*  color="gray.400"*/}
        {/*  textAlign={{*/}
        {/*    base: 'center',*/}
        {/*    xl: 'start',*/}
        {/*  }}*/}
        {/*  mb={{ base: '20px', xl: '0px' }}*/}
        {/*>*/}
        {/*  &copy; {new Date().getFullYear()},{' '}*/}
        {/*  <Text as="span">All Right Reserved Made by</Text>*/}
        {/*  <Link color="teal.400">{' BinaryBrilliance'}</Link>*/}
        {/*</Text>*/}
        {/*© {new Date().getFullYear()}, All Rights Reserved | Made by*/}
        {/*<strong style={{ color: 'teal' }}>BinaryBrilliance</strong> |*/}
        {/*<Link to="/terms-and-conditions" color="teal.400">*/}
        {/*  {' '}*/}
        {/*  <Text color={'teal.400'} fontSize="md">*/}
        {/*    Terms & Conditions*/}
        {/*  </Text>*/}
        {/*</Link>{' '}*/}
        {/*|{' '}*/}
        {/*<Link to="/privacy-policy" color="teal.400">*/}
        {/*  <Text color={'teal.400'} fontSize="md">*/}
        {/*    {'      Privacy Policy'}*/}
        {/*  </Text>*/}
        {/*</Link>*/}
        <Box py={4}>
          <Container maxW="container.lg" centerContent>
            <Stack
              direction={['column', 'row']}
              spacing={4}
              align="center"
              justify="center"
            >
              <Text fontSize="sm">
                © 2024, All Rights Reserved | Made by{' '}
                <ChakraLink
                  color="teal.400"
                  cursor={'default'}
                  textDecoration={'none'}
                >
                  <strong>BinaryBrilliance</strong>
                </ChakraLink>
              </Text>
              <Text fontSize="sm">
                <ChakraLink
                  as={Link}
                  to="/terms-and-conditions"
                  color="teal.300"
                >
                  Terms & Conditions
                </ChakraLink>
              </Text>
              <Text fontSize="sm">
                <ChakraLink as={Link} to="/privacy-policy" color="teal.300">
                  Privacy Policy
                </ChakraLink>
              </Text>
            </Stack>
          </Container>
        </Box>
      </Flex>
    </React.Fragment>
  );
};
