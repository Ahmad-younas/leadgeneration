import React, { useEffect, useState } from 'react';
import { Box, Center, Spinner, Text } from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Lottie from 'lottie-react';
import Animation from '../assets/Animation.json';
import { ENDPOINTS } from '../utils/apiConfig';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';

export const DropboxCallback: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [showLottie, setShowLottie] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const extractAccessToken = () => {
      const params = new URLSearchParams(location.search); // Remove the leading "#" and parse the hash
      const code = params.get('code'); // Get the access token
      const token = localStorage.getItem('authToken');
      if (code) {
        setAccessToken(code); // Set the access token state
        axios
          .post(
            ENDPOINTS.dropboxCallback,
            { code },
            {
              headers: {
                Authorization: `Bearer ${token}`, // Include the token in the Authorization header
              },
            }
          )
          .then((response) => {
            setLoading(false);
            setShowLottie(true);
            setTimeout(() => {
              navigate('/admin/setting');
            }, 2000);
            // Redirect to a success page or handle as needed
          })
          .catch((err) => {
            if (axios.isAxiosError(error)) {
              if (error?.response?.status === 403 || error?.response?.status === 401 ) {
                dispatch(logout());
              }
            }
            console.error('Error saving token:', err);
            setError('Failed to save access token.');
            setLoading(false);
          });
      } else {
        setError('No access token found.');
        setLoading(false);
      }
    };

    extractAccessToken();
  }, [location, navigate]);

  return (
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
          {accessToken && !error ? (
            <Text fontSize="xl" mb={4} color="green.500">
              Access Token Retrieved and Saved Successfully!
            </Text>
          ) : (
            <Text fontSize="xl" mb={4} color="red.500">
              {error || 'Failed to Retrieve Access Token.'}
            </Text>
          )}
        </Box>
      )}
    </Box>
  );
};

export default DropboxCallback;
