// client/src/components/layout/SideMenu.tsx
// کامپوننت منوی کناری

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Drawer,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PaymentsIcon from '@mui/icons-material/Payments';
import GroupsIcon from '@mui/icons-material/Groups';
import ContactsIcon from '@mui/icons-material/Contacts';
import SettingsIcon from '@mui/icons-material/Settings';
import PeopleIcon from '@mui/icons-material/People';
import SmsIcon from '@mui/icons-material/Sms';
import { useAuth } from '../../hooks/useAuth';

const drawerWidth = 240;

interface SideMenuProps {
  open: boolean;
  toggleDrawer: () => void;
}

// منوی کشویی با انیمیشن
const StyledDrawer = styled(Drawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

const SideMenu: React.FC<SideMenuProps> = ({ open, toggleDrawer }) => {
  const location = useLocation();
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  
  // آیتم‌های منوی اصلی
  const mainMenuItems = [
    { text: 'داشبورد', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'پرداخت‌ها', icon: <PaymentsIcon />, path: '/payments' },
    { text: 'گروه‌ها', icon: <GroupsIcon />, path: '/groups' },
    { text: 'طرف‌حساب‌ها', icon: <ContactsIcon />, path: '/contacts' },
  ];

  // آیتم‌های منوی مدیریت - فقط برای ادمین
  const adminMenuItems = [
    { text: 'مدیریت کاربران', icon: <PeopleIcon />, path: '/users' },
    { text: 'تنظیمات پیامک', icon: <SmsIcon />, path: '/settings/sms' },
  ];

  return (
    <StyledDrawer variant="permanent" open={open}>
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          px: [1],
        }}
      >
        <IconButton onClick={toggleDrawer}>
          <ChevronRightIcon />
        </IconButton>
      </Toolbar>
      <Divider />
      <List component="nav">
        {/* منوی اصلی */}
        {mainMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
        
        {/* منوی مدیریت - فقط برای ادمین */}
        {isAdmin && (
          <>
            <Divider sx={{ my: 1 }} />
            <ListItem>
              <ListItemText 
                primary="مدیریت سیستم" 
                primaryTypographyProps={{ 
                  variant: 'caption', 
                  color: 'text.secondary' 
                }} 
              />
            </ListItem>
            
            {adminMenuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  selected={location.pathname === item.path}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </>
        )}
      </List>
    </StyledDrawer>
  );
};

export default SideMenu;