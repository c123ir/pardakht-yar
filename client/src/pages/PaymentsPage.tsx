// client/src/pages/PaymentsPage.tsx
// صفحه مدیریت پرداخت‌ها

import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const PaymentsPage: React.FC = () => {
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          مدیریت پرداخت‌ها
        </Typography>
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => {/* اینجا باید مودال ایجاد پرداخت باز شود */}}
        >
          ایجاد درخواست جدید
        </Button>
      </Box>
      
      <Paper sx={{ p: 2 }}>
        <Typography variant="body1">
          جدول مدیریت پرداخت‌ها در اینجا قرار می‌گیرد.
        </Typography>
      </Paper>
    </Box>
  );
};

export default PaymentsPage;