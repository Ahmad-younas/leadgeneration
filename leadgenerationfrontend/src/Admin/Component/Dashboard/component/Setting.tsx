import { Header } from '../../../../Components/Sidebar/Header';
import React, { useState } from 'react';
import {
  Box,
  Button,
  Heading,
  List,
  ListItem,
  UnorderedList,
  useToast,
} from '@chakra-ui/react';
import { ProfileModal } from '../../../../Components/Profile/ProfileModel';
import { LogoutIcon } from '../../../../Components/Icons/Icons';
import { EditIcon } from '@chakra-ui/icons';
import { logout } from '../../../../redux/authSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../../redux/store';
import { FaDropbox } from 'react-icons/fa';
import axios from 'axios';
import { ENDPOINTS } from '../../../../utils/apiConfig';

export const Setting = () => {
  const [isOpenModel, setIsOpenModel] = useState<boolean>(false);
  const onCloseModel = () => setIsOpenModel(false);
  const dispatch = useDispatch<AppDispatch>();
  const token = localStorage.getItem('authToken');
  const toast = useToast();
  const authWithDropBox = async () => {
    try {
      const response = await axios.get(ENDPOINTS.authWithDropBox, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        toast({
          title: 'DropBox.',
          description: 'Already authenticated With Dropbox.',
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
      } else if (response.status === 204) {
        await initiateDropboxAuth();
      }
    } catch (error) {
      if(axios.isAxiosError(error)){
        if (error?.response?.status === 403 || error?.response?.status === 401) {
          dispatch(logout());
        }
      }
    }
  };

  const initiateDropboxAuth = async () => {
    try {
      const response = await axios.get(
        'http://localhost:3002/api/dropbox/auth-url',{
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      window.location.href = response.data.url; // This triggers the OAuth flow
    } catch (error) {
      if(axios.isAxiosError(error)){
        if (error?.response?.status === 403 || error?.response?.status === 401) {
          dispatch(logout());
        }
      }
      console.error('Error fetching Dropbox Auth URL:', error);
    }
  };
  return (
    <React.Fragment>
      <ProfileModal isOpen={isOpenModel} onClose={onCloseModel} />
      <Header />
      <Box p={6} maxW="100%" borderWidth={1} borderRadius="lg">
        <Heading as="h3" size="lg" mb={4}>
          Profile Settings
        </Heading>
        <UnorderedList styleType="'-'">
          <List spacing={3}>
            <ListItem display={'flex'} justifyContent={'space-between'}>
              <Heading as="h5" size="sm">
                Edit your Profile
              </Heading>
              <Button
                leftIcon={<EditIcon />}
                onClick={() => {
                  setIsOpenModel(true);
                }}
                colorScheme="teal"
                size="sm"
                ml={4}
              >
                Edit
              </Button>
            </ListItem>
            <ListItem display={'flex'} justifyContent={'space-between'}>
              <Heading as="h5" size="sm">
                Logout from Profile
              </Heading>
              <Button
                leftIcon={<LogoutIcon />}
                onClick={() => dispatch(logout())}
                colorScheme="teal"
                size="sm"
                ml={4}
              >
                Logout
              </Button>
            </ListItem>
            <ListItem display={'flex'} justifyContent={'space-between'}>
              <Heading as="h5" size="sm">
                Authenticate with dropbox
              </Heading>
              <Button
                leftIcon={<FaDropbox />}
                onClick={authWithDropBox}
                colorScheme="teal"
                size="sm"
                ml={4}
              >
                Authenticate
              </Button>
            </ListItem>
          </List>
        </UnorderedList>
      </Box>
    </React.Fragment>
  );
};
