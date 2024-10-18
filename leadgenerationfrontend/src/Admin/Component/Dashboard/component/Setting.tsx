import { Header } from '../../../../Components/Sidebar/Header';
import React, {useState } from 'react';
import {
  Box,
  Button,
  Heading,
  List,
  ListItem,
  UnorderedList,
} from '@chakra-ui/react';
import { ProfileModal } from '../../../../Components/Profile/ProfileModel';
import { LogoutIcon } from '../../../../Components/Icons/Icons';
import { EditIcon } from '@chakra-ui/icons';
import { logout } from '../../../../redux/authSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../../redux/store';

export const Setting = () => {
  const [isOpenModel, setIsOpenModel] = useState<boolean>(false);
  const onCloseModel = () => setIsOpenModel(false);
  const dispatch = useDispatch<AppDispatch>();
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
              <Heading as='h5' size='sm'>
                Edit your Profile
              </Heading>
              <Button leftIcon={<EditIcon/>} onClick={()=>{setIsOpenModel(true)}}  colorScheme='teal' variant='outline' size='sm' ml={4}>
                Edit
              </Button>
            </ListItem>
            <ListItem display={'flex'} justifyContent={'space-between'}>
              <Heading as='h5' size='sm'>
                Logout from Profile
              </Heading>
              <Button leftIcon={<LogoutIcon />} onClick={()=>dispatch(logout())} colorScheme="red" variant='outline' size="sm" ml={4}>
                Logout
              </Button>
            </ListItem>
          </List>
        </UnorderedList>
      </Box>
    </React.Fragment>
  );
};