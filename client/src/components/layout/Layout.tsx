// client/src/components/layout/Layout.tsx
// کامپوننت لایه‌بندی اصلی برنامه

import React, { useState, useEffect } from 'react';
import { Box, CssBaseline, useTheme, alpha, useMediaQuery, GlobalStyles } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './Header';
import SideMenu from './SideMenu';

const Layout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const [open, setOpen] = useState(!isMobile);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // تغییر وضعیت منو بر اساس تغییر اندازه صفحه
  useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile]);

  // این فانکشن در واقعیت باید تم اصلی برنامه را تغییر دهد
  const handleToggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleToggleSidebar = () => {
    setOpen(!open);
  };

  const drawerWidth = open ? 240 : 70;
  
  // این مقدار برای تبلت و موبایل متفاوت است
  const contentMargin = isMobile ? 0 : (open ? drawerWidth : 70);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', direction: 'rtl' }}>
      <GlobalStyles 
        styles={{
          ':root': {
            '--header-height': '64px',
            '--drawer-width': `${drawerWidth}px`,
          },
          '*::-webkit-scrollbar': {
            width: '6px',
            height: '6px',
          },
          '*::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '*::-webkit-scrollbar-thumb': {
            backgroundColor: alpha(theme.palette.primary.main, 0.2),
            borderRadius: '3px',
          },
          '*::-webkit-scrollbar-thumb:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.4),
          },
        }} 
      />
      
      <CssBaseline />
      
      {/* هدر برنامه */}
      <Header 
        onToggleSidebar={handleToggleSidebar} 
        isDarkMode={isDarkMode}
        open={open}
        onToggleTheme={handleToggleTheme}
      />

      {/* منوی کناری */}
      <SideMenu open={open} onClose={() => setOpen(false)} />
      
      {/* محتوای اصلی */}
      <Box
        component={motion.main}
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: 1,
          marginRight: isMobile ? 0 : `${contentMargin}px`,
          width: isMobile ? '100%' : `calc(100% - ${contentMargin}px)`,
        }}
        transition={{ 
          duration: 0.3,
          type: 'spring',
          stiffness: 300,
          damping: 30
        }}
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 3 },
          mt: '64px', // ارتفاع هدر
          mr: 0,
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.03)} 0%, ${alpha(theme.palette.secondary.dark, 0.03)} 100%)`,
          minHeight: 'calc(100vh - 64px)',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </Box>
    </Box>
  );
};

export default Layout;