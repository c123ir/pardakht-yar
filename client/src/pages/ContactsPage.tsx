// client/src/pages/ContactsPage.tsx
// صفحه مدیریت طرف‌حساب‌ها

import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const ContactsPage: React.FC = () => {
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          مدیریت طرف‌حساب‌ها
        </Typography>
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => {/* اینجا باید مودال ایجاد طرف‌حساب باز شود */}}
        >
          ثبت طرف‌حساب جدید
        </Button>
      </Box>
      
      <Paper sx={{ p: 2 }}>
        <Typography variant="body1">
          جدول مدیریت طرف‌حساب‌ها در اینجا قرار می‌گیرد.
        </Typography>
      </Paper>
    </Box>
  );
};

export default ContactsPage;
