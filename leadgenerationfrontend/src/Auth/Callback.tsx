import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Center, Spinner, Text } from '@chakra-ui/react';
import { jwtDecode } from 'jwt-decode';
import Lottie from 'lottie-react';
import Animation from '../assets/Animation.json';
import { ENDPOINTS } from '../utils/apiConfig';
import { logout } from '../redux/authSlice';
import { useDispatch } from 'react-redux';

interface DecodedToken {
  id: string;
  email: string;
  role: 'admin' | 'employee';
}

const Callback = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showLottie, setShowLottie] = useState(false);
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get('code');
    if (code) {
      handleAuthorizationCode(code);
    } else {
      console.error('No authorization code found.');
      navigate('/error');
    }
  }, []);

  const handleAuthorizationCode = async (code: string) => {
    const token = localStorage.getItem('authToken');
    try {
      if (!token) {
        console.error('Token not found in local storage.');
        navigate('/login');
        return;
      }
      const user: DecodedToken = jwtDecode<DecodedToken>(token);
      const response = await axios.post(
        'http://localhost:3002/api/auth/callback',
        { code },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setLoading(false);
        setShowLottie(true);
        setTimeout(() => {
          navigate(
            user.role === 'employee' ? '/employee/addjobs' : '/admin/addjobs'
          );
        }, 2000);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (
          error?.response?.status === 403 ||
          error?.response?.status === 401
        ) {
          dispatch(logout());
        }
      }
      console.error('Error handling authorization code:', error);
      setLoading(false);
    }
  };

  return (
    <div>
      <Box>
        {loading ? (
          <Center height="100vh">
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="teal.500"
              size="xl"
            />
          </Center>
        ) : showLottie ? (
          <Center height="100vh">
            <Lottie
              animationData={Animation}
              loop={false}
              autoplay
              style={{ width: 200, height: 200 }}
            />
          </Center>
        ) : (
          <Box p={4}>
            <Text fontSize="xl" mb={4} color="red.500">
              {'Failed to Retrieve Access Token.'}
            </Text>
          </Box>
        )}
      </Box>
    </div>
  );
};

export default Callback;
