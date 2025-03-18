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

// آیتم‌های منو
const menuItems = [
  { text: 'داشبورد', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'پرداخت‌ها', icon: <PaymentsIcon />, path: '/payments' },
  { text: 'گروه‌ها', icon: <GroupsIcon />, path: '/groups' },
  { text: 'طرف‌حساب‌ها', icon: <ContactsIcon />, path: '/contacts' },
];

const SideMenu: React.FC<SideMenuProps> = ({ open, toggleDrawer }) => {
  const location = useLocation();
  
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
        {menuItems.map((item) => (
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
        <Divider sx={{ my: 1 }} />
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/settings">
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="تنظیمات" />
          </ListItemButton>
        </ListItem>
      </List>
    </StyledDrawer>
  );
};

export default SideMenu;
