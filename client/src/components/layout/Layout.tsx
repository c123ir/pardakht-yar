// client/src/components/layout/Layout.tsx
// کامپوننت لایه‌بندی اصلی برنامه

import React, { useState } from 'react';
import { Box, CssBaseline, useTheme, alpha } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from './Header';
import SideMenu from './SideMenu';

const Layout: React.FC = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true); // افزودن وضعیت برای حالت تاریک/روشن

  // این فانکشن در واقعیت باید تم اصلی برنامه را تغییر دهد
  // در این نمونه فقط وضعیت را برای نمایش مناسب لوگو ذخیره می‌کنیم
  const handleToggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleToggleSidebar = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      
      <CssBaseline />
      <Header 
        onToggleSidebar={handleToggleSidebar} 
        isDarkMode={isDarkMode}
        
        onToggleTheme={handleToggleTheme}
   />

      <SideMenu  open={open} onClose={() => setOpen(false)}   />
      <Box
        component={motion.main}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          mr: open ? '240px' : 0,
          ml: 0,
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.03)} 0%, ${alpha(theme.palette.secondary.dark, 0.03)} 100%)`,
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;