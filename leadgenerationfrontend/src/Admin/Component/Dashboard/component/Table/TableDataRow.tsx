import React, { useState } from 'react';
import {
  Flex,
  Td,
  Tr,
  Text,
  Button,
  useColorModeValue,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useDisclosure,
  Box, useToast,
} from '@chakra-ui/react';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { Model } from './Model';
import { AiFillDropboxCircle } from 'react-icons/ai';
import axios from 'axios';

interface TableDataRowProps {
  name: string;
  email: string;
  password: string;
  role: string;
  id: string;
  link: string | null;
}

export const TableDataRow: React.FC<TableDataRowProps> = (props) => {
  const { name, email, password, role, id, link } = props;
  const toast = useToast();
  const textColor = useColorModeValue('gray.400', 'white');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement | null>(null);
  const [isOpenModel, setIsOpenModel] = useState<boolean>(false);
  const [editData, setEditData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    id: '',
  });

  const onCloseModel = () => setIsOpenModel(false);

  const handleEditClick = () => {
    setEditData({ name, email, password, role, id });
    setIsOpenModel(true);
  };

  const handleDeleteEmployee = async (id: string) => {
    try {
      // Send a POST request to the backend with the selected employee IDs
      const response = await axios.post('http://localhost:3002/api/deleteSelectedEmployees', {
        employeeIds: id, // Pass the selected employee IDs to the backend
      });
      if(response.status === 200){
        toast({
          title: 'Employee Status.',
          description: ' Employee Successfully Added.',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
      }
      onClose();
    } catch (error) {
      console.error('Error deleting selected employees:', error);
    }
  };

  return (
    <React.Fragment>
      <Model isOpenModel={isOpenModel} onCloseModel={onCloseModel} data={editData} />
      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Employee
            </AlertDialogHeader>

            <AlertDialogBody>Are you sure? You can't undo this action afterwards.</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={() => handleDeleteEmployee(id)} // Call the delete function here
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <Td minWidth={{ sm: '250px', md: '200px', lg: '100px' }} pl="0px">
        <Flex align="center" py=".8rem" minWidth="100%" flexWrap="nowrap">
          <Flex direction="column">
            <Text fontSize="sm" color={textColor} fontWeight="normal" minWidth="100%">
              {name}
            </Text>
          </Flex>
        </Flex>
      </Td>
      <Td>
        <Text fontSize="sm" color="gray.400" fontWeight="normal">
          {email}
        </Text>
      </Td>
      <Td>
        <Text fontSize="sm" color={textColor} fontWeight="normal">
          {password}
        </Text>
      </Td>
      <Td>
        <Text fontSize="sm" color={textColor} fontWeight="normal">
          {role}
        </Text>
      </Td>
      <Td>
        <Button leftIcon={<EditIcon />} colorScheme="teal" variant="solid" onClick={handleEditClick}>
          Edit
        </Button>
      </Td>
      <Td>
        <Button leftIcon={<DeleteIcon />} colorScheme="teal" variant="solid" onClick={onOpen}>
          Delete
        </Button>
      </Td>
      <Td>
        <Button
          colorScheme={'teal'}
          leftIcon={<AiFillDropboxCircle />}
          isDisabled={link === null}
          onClick={() => {
            window.open(link!, '_blank');
          }}
        >
          Dropbox
        </Button>
      </Td>
    </React.Fragment>
  );
};
