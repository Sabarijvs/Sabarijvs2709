# Sabarijvs2709
Testing
import React, { useState } from 'react';
import { Box, TextField, Typography, Paper, Button } from '@mui/material'; // Import MUI components

const MyComponent = () => {
  const [inputValue, setInputValue] = useState('');
  const [apiResponse, setApiResponse] = useState(null);
  const [apiError, setApiError] = useState(null);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const apiUrl = '/your-api-endpoint'; // Replace with your actual endpoint

    try {
      const response = await fetch(apiUrl, { // Using fetch API directly
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: inputValue }),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Try to get error details from the server
        throw new Error(`${response.status} ${response.statusText}: ${errorData.message || 'API request failed'}`);
      }

      const responseData = await response.json();
      setApiResponse(responseData);
      setApiError(null);
    } catch (error) {
      console.error('API Error:', error);
      setApiError(error.message); // Display the error message
      setApiResponse(null);
    }
  };

  return (
    <Paper className="paper" sx={{ padding: 5, margin: 5, height: '100vh' }}> {/* MUI Paper for styling */}
      <Typography variant="h6" color="primary" sx={{ margin: '0 0 20px 0' }}> {/* MUI Typography */}
        Enter Test Input
      </Typography>

      <Box sx={{ width: '50%', height: 100, mt: 15, ml: 15 }}>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}> {/* MUI Box for layout */}
            <TextField
              id="outlined-multiline-static"
              label="Enter Test Input"
              multiline
              placeholder="Enter Testsuite Name"
              name="Input"
              sx={{ width: '80%' }}
              value={inputValue}
              onChange={handleInputChange}
            />
            <Button variant="contained" type="submit" sx={{ ml: 2 }}> {/* MUI Button */}
              Submit
            </Button>
          </Box>
        </form>

        {apiResponse && (
          <Box sx={{ mt: 2 }}> {/* MUI Box for spacing */}
            <Typography variant="h6">API Response:</Typography>
            <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
          </Box>
        )}

        {apiError && (
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            {apiError}
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default MyComponent;
