import React, { useState, useEffect } from 'react';
import { Spinner, Box, Center, Text } from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Lottie from 'lottie-react';
import Animation from "../assets/Animation.json";
export const DropboxCallback: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [showLottie, setShowLottie] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Function to extract the access token from the URL hash
    const extractAccessToken = () => {
      const hash = location.hash; // Get the hash from the URL (e.g., #access_token=...)
      const params = new URLSearchParams(hash.substring(1)); // Remove the leading "#" and parse the hash
      const accessToken = params.get('access_token');// Get the access token

      const token = localStorage.getItem('authToken');

      if (accessToken) {
        setAccessToken(accessToken); // Set the access token state
        console.log('Access Token:', accessToken);

        // Send the access token to the backend using Axios
        axios
          .post('http://localhost:3002/api/dropbox/callback', { accessToken},{
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            },
          })
          .then((response) => {
            console.log('Token saved successfully:', response.data);
            setLoading(false);
            setShowLottie(true);
            setTimeout(() => {
              navigate('/admin/addjobs');
            }, 2000);
            // Redirect to a success page or handle as needed
          })
          .catch((err) => {
            console.error('Error saving token:', err);
            setError('Failed to save access token.');
            setLoading(false);
          });
      } else {
        console.error('No access token found in URL');
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
      ): (
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
