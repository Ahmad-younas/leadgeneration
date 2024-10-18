import {
  Box,
  Button,
  Flex,
  Link,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';

import IconBox from '../Icons/IconBox';
import React, { useState } from 'react';
import { Separator } from '../Seperator/Separator';
import { NavLink, useLocation } from 'react-router-dom';
import { SidebarProps, Route } from '../../interfaces';
import { Icon } from '@chakra-ui/icons';

export const SidebarContent: React.FC<SidebarProps> = ({
  logoText,
  routes = [],
}) => {
  let location = useLocation();
  const [state, setState] = useState<{ [key: string]: boolean }>({});
  const activeRoute = (routeName: string) => {
    return location.pathname === routeName ? 'active' : '';
  };
  const activeBg = useColorModeValue('#F7FAFC', 'gray.700');
  const inactiveBg = useColorModeValue('white', 'gray.700');
  const activeColor = useColorModeValue('gray.700', 'white');
  const inactiveColor = useColorModeValue('gray.400', 'gray.400');

  const createLinks = (
    routes: Route[],
    activeBg: string,
    inactiveBg: string,
    activeColor: string,
    inactiveColor: string
  ) => {
    return routes.map((props, key) => {
      if (props.redirect) {
        return null;
      }
      if (props.category) {
        let st: Record<string, boolean> = {};
        if (props.state) {
          st[props.state] = !state[props.state!];
        }
        return (
          <div key={props.name}>
            <Text
              color={activeColor}
              fontWeight={'bold'}
              mb={{ xl: '12px' }}
              mx="auto"
              ps={{ sm: '10px', xl: '16px' }}
              py="12px"
            >
              {props.name}
            </Text>
            {props.views &&
              createLinks(
                props.views,
                activeBg,
                inactiveBg,
                activeColor,
                inactiveColor
              )}
          </div>
        );
      }
      return (
        <NavLink to={props.layout + props.path} key={props.name}>
          {activeRoute(props.layout + props.path) === 'active' ? (
            <Button
              boxSize="initial"
              justifyContent="flex-start"
              alignItems="center"
              bg={activeBg}
              mb={{ xl: '12px' }}
              mx={{ xl: 'auto' }}
              ps={{ sm: '10px', xl: '16px' }}
              py="12px"
              borderRadius="15px"
              _hover={{ bg: 'none' }}
              w="100%"
              _active={{
                bg: 'inherit',
                transform: 'none',
                borderColor: 'transparent',
              }}
              _focus={{
                boxShadow: 'none',
              }}
            >
              <Flex>
                {typeof props.icon === 'string' ? (
                  <Icon>{props.icon}</Icon>
                ) : (
                  <IconBox
                    bg="teal.300"
                    color={activeBg}
                    h="30px"
                    w="30px"
                    me="12px"
                  >
                    {props.icon}
                  </IconBox>
                )}
                <Text color={activeColor} my="auto" fontSize="sm">
                  {props.name}
                </Text>
              </Flex>
            </Button>
          ) : (
            <Button
              boxSize="initial"
              justifyContent="flex-start"
              alignItems="center"
              bg="transparent"
              mb={{ xl: '12px' }}
              mx={{ xl: 'auto' }}
              py="12px"
              ps={{ sm: '10px', xl: '16px' }}
              borderRadius="15px"
              _hover={{ bg: 'none' }}
              w="100%"
              _active={{
                bg: 'inherit',
                transform: 'none',
                borderColor: 'transparent',
              }}
              _focus={{
                boxShadow: 'none',
              }}
            >
              <Flex>
                {typeof props.icon === 'string' ? (
                  <Icon>{props.icon}</Icon>
                ) : (
                  <IconBox
                    bg={'#F7FAFC'}
                    color="teal.300"
                    h="30px"
                    w="30px"
                    me="12px"
                  >
                    {props.icon}
                  </IconBox>
                )}
                <Text color={inactiveColor} my="auto" fontSize="sm">
                  {props.name}
                </Text>
              </Flex>
            </Button>
          )}
        </NavLink>
      );
    });
  };
  const links = (
    <>{createLinks(routes, activeBg, inactiveBg, activeColor, inactiveColor)}</>
  );
  return (
    <React.Fragment>
      <Box pt="25px" mb="12px">
        <Link
          href={`${process.env.PUBLIC_URL}/#/`}
          target="_blank"
          display="flex"
          lineHeight="100%"
          mb="30px"
          fontWeight="bold"
          justifyContent="center"
          alignItems="center"
          fontSize="11px"
        >
          {/*<CreativeTimLogo w="32px" h="32px" me="10px" />*/}
          <Text fontSize="sm" mt="3px">
            {logoText}
          </Text>
        </Link>
        <Separator />
      </Box>
      <Stack direction="column" mb="40px">
        <Box>{links}</Box>
      </Stack>
    </React.Fragment>
  );
};
