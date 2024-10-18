import React, { useRef } from 'react';
import {
  Box,
  Button,
  Flex,
  Icon,
  Portal,
  Spacer,
  Text,
} from '@chakra-ui/react';
import { BsArrowRight } from 'react-icons/bs';
import { Card } from '../../../../../Components/Card/Card';
import { CardBody } from '../../../../../Components/Card/Cardbody';

interface WorkWithTheRocketsProps {
  title: string;
  description: string;
  backgroundImage: string;
}

export const Divider: React.FC<WorkWithTheRocketsProps> = ({
  title,
  description,
  backgroundImage,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  return (
    <Card maxHeight="290.5px" p="1rem" bg={'white'} borderRadius={'15px'}>
      <CardBody
        p="0px"
        backgroundImage={backgroundImage}
        bgPosition="center"
        bgRepeat="no-repeat"
        w="100%"
        h={{ base: '200px' }}
        bgSize="cover"
        position="relative"
        borderRadius="15px"
      >
        <Box
          bg="linear-gradient(360deg, rgba(49, 56, 96, 0.16) 0%, rgba(21, 25, 40, 0.88) 100%)"
          w="100%"
          position="absolute"
          h="inherit"
          borderRadius="inherit"
          ref={overlayRef}
        ></Box>
        <Portal containerRef={overlayRef}>
          <Flex
            flexDirection="column"
            color="white"
            p="1.5rem 1.2rem 0.3rem 1.2rem"
            lineHeight="1.6"
          >
            <Text fontSize="xl" fontWeight="bold" pb=".3rem">
              {title}
            </Text>
            <Text fontSize="sm" fontWeight="normal" w={{ lg: '92%' }}>
              {description}
            </Text>
            {/*<Spacer />*/}
            <Flex align="center" mt={{ sm: '70px', lg: '80px', xl: '90px' }}>
              <Button
                p="0px"
                variant="no-hover"
                bg="transparent"
                pb={{ lg: '30px' }}
              >
                <Text
                  fontSize="sm"
                  fontWeight="bold"
                  _hover={{ me: '4px' }}
                  transition="all .5s ease"
                >
                  Read more
                </Text>
                <Icon
                  as={BsArrowRight}
                  w="20px"
                  h="20px"
                  fontSize="xl"
                  transition="all .5s ease"
                  mx=".3rem"
                  cursor="pointer"
                  _hover={{ transform: 'translateX(20%)' }}
                  pt="4px"
                />
              </Button>
            </Flex>
          </Flex>
        </Portal>
      </CardBody>
    </Card>
  );
};
