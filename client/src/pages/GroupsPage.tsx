// client/src/pages/GroupsPage.tsx
// صفحه مدیریت گروه‌ها

import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const GroupsPage: React.FC = () => {
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          مدیریت گروه‌ها
        </Typography>
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => {/* اینجا باید مودال ایجاد گروه باز شود */}}
        >
          ایجاد گروه جدید
        </Button>
      </Box>
      
      <Paper sx={{ p: 2 }}>
        <Typography variant="body1">
          جدول مدیریت گروه‌ها در اینجا قرار می‌گیرد.
        </Typography>
      </Paper>
    </Box>
  );
};

export default GroupsPage;