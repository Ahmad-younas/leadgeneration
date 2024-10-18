import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Callback = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Extract the authorization code from the URL query parameters
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get('code');
    console.log('Code:', code);

    // If the code is present, send it to the server to exchange for tokens
    if (code) {
      handleAuthorizationCode(code);
    } else {
      // Handle error or redirect to the appropriate page if no code is found
      console.error('No authorization code found.');
      navigate('/error'); // Redirect to an error page or handle accordingly
    }
  }, []);

  const handleAuthorizationCode = async (code: string) => {
    try {
      // Retrieve the token from local storage
      const token = localStorage.getItem('authToken'); // Replace 'yourTokenKey' with the actual key you used to store the token
      if (!token) {
        console.error('Token not found in local storage.');
        navigate('/login');
        return;
      }
      const response = await axios.post(
        'http://localhost:3002/api/auth/callback',
        { code },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Authorization successful:', response.data);
     navigate(response.data);
    } catch (error) {
      console.error('Error handling authorization code:', error);
    }
  };

  return (
    <div>
      <h1>Hello-World</h1>
    </div>
  );
};

export default Callback;
