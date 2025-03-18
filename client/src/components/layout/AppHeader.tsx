// client/src/components/layout/AppHeader.tsx
// کامپوننت هدر برنامه

import React from 'react';
import { 
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Tooltip,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAuth } from '../../hooks/useAuth';

const drawerWidth = 240;

interface AppHeaderProps {
  open: boolean;
  children?: React.ReactNode;
}

// هدر با پشتیبانی از منوی کشویی
const StyledAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<{
  open?: boolean;
}>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const AppHeader: React.FC<AppHeaderProps> = ({ open, children }) => {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
  };

  return (
    <StyledAppBar position="absolute" open={open}>
      <Toolbar
        sx={{
          pr: '24px',
        }}
      >
        {children}
        
        <Typography
          component="h1"
          variant="h6"
          color="inherit"
          noWrap
          sx={{ flexGrow: 1 }}
        >
          پرداخت‌یار
        </Typography>
        
        {/* آیکون اعلان‌ها */}
        <IconButton color="inherit">
          <Badge badgeContent={4} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        
        {/* منوی کاربر */}
        <Tooltip title="تنظیمات حساب کاربری">
          <IconButton
            onClick={handleMenu}
            size="large"
            sx={{ ml: 2 }}
            aria-controls="menu-appbar"
            aria-haspopup="true"
          >
            <Avatar sx={{ width: 32, height: 32 }}>
              {user?.fullName.charAt(0)}
            </Avatar>
          </IconButton>
        </Tooltip>
        
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <AccountCircleIcon fontSize="small" />
            </ListItemIcon>
            پروفایل
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            تنظیمات
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            خروج
          </MenuItem>
        </Menu>
      </Toolbar>
    </StyledAppBar>
  );
};

export default AppHeader;
