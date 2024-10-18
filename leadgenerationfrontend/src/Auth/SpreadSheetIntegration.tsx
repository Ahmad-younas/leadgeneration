import React from 'react';
import axios from 'axios';
import Logger from 'Logger';

const SpreadSheetIntegration: React.FC = () => {
  // Function to initiate the Dropbox OAuth flow
  const initiateDropboxAuth = async () => {
    console.log("HelloWorld");
    try {
      // Make a GET request to the server to get the Google authorization URL
      const response = await axios.get('http://localhost:3002/api/auth/google');

      // Extract the URL from the response data
      const { url } = response.data;
      console.log("URL",url);

      // Redirect the user to Google's authorization page
      window.location.href = url;
    } catch (error) {
      // Check if the error is an Axios error and handle accordingly
      if (axios.isAxiosError(error)) {
        console.error('Error generating authorization URL:', error.response?.data || error.message);
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
