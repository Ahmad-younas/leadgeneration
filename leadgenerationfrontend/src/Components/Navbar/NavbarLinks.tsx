import React from 'react';
import {
  Box,
  Flex,
  useColorModeValue,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Link,
  Menu,
  MenuButton,
  MenuList,
} from '@chakra-ui/react';
import { Avatar, AvatarGroup } from '@chakra-ui/react';
import { NavbarLinkProps } from '../../interfaces';
import { BellIcon } from '@chakra-ui/icons';
import { AiOutlineUser } from 'react-icons/ai';
export const NavbarLinks: React.FC<NavbarLinkProps> = (props) => {
  const backgroundColor = useColorModeValue('white', 'white');
  const mainText = useColorModeValue('gray.700', 'gray.200');
  const secondaryText = useColorModeValue('gray.400', 'gray.200');
  let navbarIcon = useColorModeValue('gray.500', 'gray.200');
  return (
    <Flex
      minH={'75px'}
      borderRadius={'16px'}
      display={'flex'}
      flexDirection={'row'}
      justifyContent={'space-between'}
      bg={backgroundColor}
      line-height={'25.6px'}
      w={'100%'}
      pt="8px"
      top="18px"
      px={{
        sm: '15px',
        md: '30px',
      }}
      pb={'8px'}
      ps={{
        xl: '12px',
      }}
    >
      <Box>
        <Breadcrumb>
          <BreadcrumbItem color={mainText}>
            <BreadcrumbLink color={secondaryText}>Dashboard</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem color={mainText}>
            <BreadcrumbLink
              color={mainText}
              textTransform={'capitalize'}
              style={{ cursor: 'default' }}
            >
              {props.brandText}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <Link
          color={mainText}
          textTransform={'capitalize'}
          href="#"
          bg="inherit"
          borderRadius="inherit"
          fontWeight="bold"
          _hover={{ color: mainText }}
          _active={{
            bg: 'inherit',
            transform: 'none',
            borderColor: 'transparent',
          }}
          _focus={{
            boxShadow: 'none',
          }}
        >
          {props.brandTextS}
        </Link>
      </Box>
      <Box display={'flex'}>
        <Menu>
          <AvatarGroup spacing="1rem">
            <Avatar bg="gray.700" icon={<AiOutlineUser fontSize="1.5rem" />} />
          </AvatarGroup>
          <MenuButton style={{ marginLeft: '10px' }}>
            <BellIcon color={navbarIcon} w="25px" h="25px" />
          </MenuButton>
        </Menu>
      </Box>
    </Flex>
  );
};
