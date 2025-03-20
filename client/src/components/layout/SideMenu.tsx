// client/src/components/layout/SideMenu.tsx
// کامپوننت منوی کناری

import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Drawer,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Box,
  Typography,
  useTheme,
  alpha,
  useMediaQuery,
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
  Message as MessageIcon,
  Group as GroupIcon,
  DateRange as DateRangeIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

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
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setCollapsed(!open);
  }, [open]);

  const menuItems: MenuItemType[] = [
    { title: 'داشبورد', path: '/', icon: <DashboardIcon /> },
    { title: 'درخواست‌ها', path: '/requests', icon: <DescriptionIcon /> },
    { title: 'پرداخت‌ها', path: '/payments', icon: <PaymentIcon /> },
    { title: 'انواع درخواست', path: '/request-types', icon: <CategoryIcon /> },
    { title: 'طرف‌حساب‌ها', path: '/accounts', icon: <PeopleIcon />, divider: true },
    { title: 'رویدادها', path: '/events', icon: <EventIcon /> },
    { title: 'تقویم', path: '/calendar', icon: <DateRangeIcon /> },
    { title: 'موجودی‌ها', path: '/inventory', icon: <InventoryIcon /> },
    { title: 'گزارش‌ها', path: '/reports', icon: <SummarizeIcon />, divider: true },
    { title: 'تنظیمات پیامک', path: '/sms-settings', icon: <MessageIcon /> },
    { title: 'مدیریت کاربران', path: '/users', icon: <GroupIcon /> },
    { title: 'تنظیمات', path: '/settings', icon: <SettingsIcon /> },
  ];

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

  const drawerWidth = collapsed ? 70 : 240;

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      anchor="right"
      open={isMobile ? open : true}
      onClose={onClose}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        zIndex: theme.zIndex.drawer,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          top: 64,
          boxSizing: 'border-box',
          background: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: 'blur(10px)',
          borderLeft: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          borderRight: 'none',
          boxShadow: `-4px 0 15px ${alpha(theme.palette.common.black, 0.05)}`,
          paddingY: 1,
          overflowX: 'hidden',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        },
      }}
    >
      <Divider sx={{ opacity: 0.1 }} />

      <Box component={motion.div} variants={container} initial="hidden" animate="show">
        {menuItems.map((menuItem) => (
          <React.Fragment key={menuItem.path}>
            <Box
              component={motion.div}
              variants={item}
              sx={{ display: 'block', px: collapsed ? 1 : 2, py: 0.5 }}
            >
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to={menuItem.path}
                  selected={location.pathname === menuItem.path}
                  sx={{
                    borderRadius: '12px',
                    px: collapsed ? 1 : 2,
                    py: 1.5,
                    justifyContent: collapsed ? 'center' : 'flex-start',
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
                    minWidth: 0,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: collapsed ? 0 : 40,
                      color: location.pathname === menuItem.path ? 
                        theme.palette.primary.main : 
                        theme.palette.text.secondary,
                      mr: collapsed ? 0 : 2,
                      ml: collapsed ? 0 : 0,
                      justifyContent: 'center',
                    }}
                  >
                    {menuItem.icon}
                  </ListItemIcon>
                  {!collapsed && (
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
                            textAlign: 'right',
                          }}
                        >
                          {menuItem.title}
                        </Typography>
                      }
                    />
                  )}
                </ListItemButton>
              </ListItem>
            </Box>
            {!collapsed && menuItem.divider && (
              <Divider sx={{ my: 1.5, opacity: 0.1 }} />
            )}
          </React.Fragment>
        ))}
      </Box>

      {!collapsed && (
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
            textAlign: 'right',
            padding: 20,
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
      )}
    </Drawer>
  );
};

export default SideMenu;