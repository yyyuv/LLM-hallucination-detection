import React from 'react';
import { Typography, Container, Box, Paper } from '@mui/material';

const EndOfExperiment = ({ userId }) => {
  return (
    <Container maxWidth="sm" style={{ textAlign: 'center', padding: '2rem' }}>
      <Paper elevation={3} style={{ padding: '2rem', borderRadius: '10px' }}>
        <Typography variant="h4" gutterBottom>
          Experiment Completed
        </Typography>
        <Typography variant="body1" paragraph>
          Thank you for participating in the experiment. 
        </Typography>
        <Typography variant="body1" paragraph>
           Your data has been recorded.
        </Typography>
        <Box 
          bgcolor="primary.main" 
          color="primary.contrastText" 
          padding="1rem" 
          borderRadius="5px"
          display="inline-block"
          marginTop="1rem"
        >
          <Typography variant="h6">
            Your unique user ID:
          </Typography>
          <Typography variant="subtitle1" style={{ wordBreak: 'break-word' }}>
            {userId}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default EndOfExperiment;
