// client/src/components/common/LoadingIndicator.tsx
// کامپوننت نشانگر بارگذاری

import React from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';

interface LoadingIndicatorProps {
  text?: string;
  size?: number;
  showText?: boolean;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ 
  text = 'در حال بارگذاری...',
  size = 40,
  showText = true
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4
      }}
    >
      <CircularProgress size={size} thickness={4} />
      {showText && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          {text}
        </Typography>
      )}
    </Box>
  );
};

export default LoadingIndicator; 