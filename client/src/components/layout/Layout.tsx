// client/src/components/layout/Layout.tsx
// کامپوننت لایه‌بندی اصلی برنامه

import React, { useState, useEffect } from 'react';
import { Box, CssBaseline, useTheme, alpha, useMediaQuery } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from './Header';
import SideMenu from './SideMenu';

const Layout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(!isMobile);
  const [isDarkMode, setIsDarkMode] = useState(true); // افزودن وضعیت برای حالت تاریک/روشن

  // تغییر وضعیت منو بر اساس تغییر اندازه صفحه
  useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile]);

  // این فانکشن در واقعیت باید تم اصلی برنامه را تغییر دهد
  // در این نمونه فقط وضعیت را برای نمایش مناسب لوگو ذخیره می‌کنیم
  const handleToggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleToggleSidebar = () => {
    setOpen(!open);
  };

  const drawerWidth = open ? 240 : 70;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', direction: 'rtl' }}>
      
      <CssBaseline />
      <Header 
        onToggleSidebar={handleToggleSidebar} 
        isDarkMode={isDarkMode}
        open={open}
        onToggleTheme={handleToggleTheme}
      />

      <SideMenu open={open} onClose={() => setOpen(false)} />
      <Box
        component={motion.main}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          ml: { xs: 0, md: isMobile ? 0 : !open ? '70px' : '240px' },
          mr: 0,
          width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
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