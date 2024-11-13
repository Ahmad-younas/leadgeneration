import React from 'react';
import axios from 'axios';
import { ENDPOINTS } from '../utils/apiConfig';
import { logout } from '../redux/authSlice';
import { useDispatch } from 'react-redux';

const SpreadSheetIntegration: React.FC = () => {
  const token = localStorage.getItem('authToken');
  const dispatch = useDispatch();
  const initiateDropboxAuth = async () => {
    try {
      const response = await axios.get(ENDPOINTS.authGoogle, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Extract the URL from the response data
      const { url } = response.data;

      // Redirect the user to Google's authorization page
      window.location.href = url;
    } catch (error) {
      // Check if the error is an Axios error and handle accordingly
      if (axios.isAxiosError(error)) {
        if (
          error?.response?.status === 403 ||
          error?.response?.status === 401
        ) {
          dispatch(logout());
        }
        console.error(
          'Error generating authorization URL:',
          error.response?.data || error.message
        );
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  return (
    <div>
      <button onClick={initiateDropboxAuth}>Authenticate with Google</button>
    </div>
  );
};

export default SpreadSheetIntegration;
