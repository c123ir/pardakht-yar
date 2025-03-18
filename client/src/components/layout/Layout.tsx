// client/src/components/layout/Layout.tsx
// کامپوننت لایه‌بندی اصلی برنامه

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { 
  Box, 
  Toolbar, 
  CssBaseline, 
  Container,
  IconButton,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AppHeader from './AppHeader';
import SideMenu from './SideMenu';

const Layout: React.FC = () => {
  const [open, setOpen] = useState(true);
  
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* هدر برنامه */}
      <AppHeader open={open}>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={toggleDrawer}
          sx={{
            marginRight: '36px',
            ...(open && { display: 'none' }),
          }}
        >
          <MenuIcon />
        </IconButton>
      </AppHeader>
      
      {/* منوی کناری */}
      <SideMenu open={open} toggleDrawer={toggleDrawer} />
      
      {/* محتوای اصلی */}
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
