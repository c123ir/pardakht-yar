// client/src/components/layout/SideMenu.tsx
// کامپوننت منوی کناری

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Box,
  Typography,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Event as EventIcon,
  Settings as SettingsIcon,
  Description as DescriptionIcon,
  Payment as PaymentIcon,
  Category as CategoryIcon,
  Inventory as InventoryIcon,
  Summarize as SummarizeIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import AnimatedLogo from './AnimatedLogo';

interface SideMenuProps {
  open: boolean;
  onClose: () => void;
}

interface MenuItemType {
  title: string;
  path: string;
  icon: React.ReactNode;
  divider?: boolean;
}

const SideMenu: React.FC<SideMenuProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems: MenuItemType[] = [
    { title: 'داشبورد', path: '/', icon: <DashboardIcon /> },
    { title: 'درخواست‌ها', path: '/requests', icon: <DescriptionIcon /> },
    { title: 'پرداخت‌ها', path: '/payments', icon: <PaymentIcon /> },
    { title: 'انواع درخواست', path: '/request-types', icon: <CategoryIcon /> },
    { title: 'طرف‌حساب‌ها', path: '/accounts', icon: <PeopleIcon />, divider: true },
    { title: 'رویدادها', path: '/events', icon: <EventIcon /> },
    { title: 'موجودی‌ها', path: '/inventory', icon: <InventoryIcon /> },
    { title: 'گزارش‌ها', path: '/reports', icon: <SummarizeIcon />, divider: true },
    { title: 'تنظیمات', path: '/settings', icon: <SettingsIcon /> },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
    if (window.innerWidth < 900) {
      onClose();
    }
  };

  const container  = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
  };

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        width: 240,
        flexShrink: 0,
        zIndex: theme.zIndex.drawer,
        '& .MuiDrawer-paper': {
          width: 240,
          top:50,
          boxSizing: 'border-box',
          background: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: 'blur(10px)',
          borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          boxShadow: `4px 0 15px ${alpha(theme.palette.common.black, 0.05)}`,
          paddingY: 1,
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 2,
          mb: 2,
        }}
      >
        <AnimatedLogo size="medium" colorMode="dark" />
      </Box>

      <Divider sx={{ opacity: 0.1 }} />

      <List component={motion.ul} variants={container} initial="hidden" animate="show" >
        {menuItems.map((menuItem) => (
          <React.Fragment key={menuItem.path}>
            <Box
              component={motion.li}
              variants={item}
              sx={{ display: 'block', px: 2, py: 0.5 }}
            >
              <ListItem disablePadding>
                <ListItemButton
                  selected={location.pathname === menuItem.path}
                  onClick={() => handleNavigate(menuItem.path)}
                  sx={{
                    borderRadius: '12px',
                    px: 2,
                    py: 1.5,
                    background: location.pathname === menuItem.path ? 
                      alpha(theme.palette.primary.main, 0.1) : 'transparent',
                    '&:hover': {
                      background: location.pathname === menuItem.path ?
                        alpha(theme.palette.primary.main, 0.15) : 
                        alpha(theme.palette.primary.main, 0.05),
                    },
                    '&.Mui-selected': {
                      background: alpha(theme.palette.primary.main, 0.1),
                      '&:hover': {
                        background: alpha(theme.palette.primary.main, 0.15),
                      },
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 40,
                      color: location.pathname === menuItem.path ? 
                        theme.palette.primary.main : 
                        theme.palette.text.secondary,
                    }}
                  >
                    {menuItem.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: location.pathname === menuItem.path ? 600 : 400,
                          fontSize: '0.95rem',
                          color: location.pathname === menuItem.path ? 
                            theme.palette.primary.main : 
                            theme.palette.text.primary,
                        }}
                      >
                        {menuItem.title}
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            </Box>
            {menuItem.divider && (
              <Divider sx={{ my: 1.5, opacity: 0.1 }} />
            )}
          </React.Fragment>
        ))}
      </List>

      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          textAlign: 'center',
          padding: 2,
        }}
      >
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ opacity: 0.6 }}
        >
          سامانت - نسخه ۱.۰.۰
        </Typography>
      </Box>
    </Drawer>
  );
};

export default SideMenu;