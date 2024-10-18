import { Flex, Link, List, ListItem, Text } from '@chakra-ui/react';
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
        <Text
          color="gray.400"
          textAlign={{
            base: 'center',
            xl: 'start',
          }}
          mb={{ base: '20px', xl: '0px' }}
        >
          &copy; {new Date().getFullYear()},{' '}
          <Text as="span">All Right Reserved Made with ❤️ by</Text>
          <Link
            // color={linkTeal}
            color="teal.400"
            //href="https://www.creative-tim.com"
            //target="_blank"
          >
            {' BinaryBrilliance'}
          </Link>
        </Text>
      </Flex>
    </React.Fragment>
  );
};
