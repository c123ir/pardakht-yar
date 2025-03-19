import React from 'react';
import { Box, Typography, Paper, alpha, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

const RequestsPage: React.FC = () => {
  const theme = useTheme();

  return (
    <Box sx={{ p: 3 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          درخواست‌ها
        </Typography>

        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 3,
            background: alpha(theme.palette.background.paper, 0.8),
            backdropFilter: 'blur(10px)',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            mt: 3,
          }}
        >
          <Typography variant="body1">
            صفحه مدیریت درخواست‌ها - این صفحه در حال توسعه است.
          </Typography>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default RequestsPage; 