import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Avatar,
  IconButton,
  useTheme,
  alpha,
  Tooltip,
  Badge,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  MenuOpen as MenuOpenIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  AutoAwesome,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import AnimatedLogo from './AnimatedLogo';

interface HeaderProps {
  onToggleSidebar: () => void;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
  open?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  isDarkMode = true,
  onToggleTheme,
  open = true,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationsAnchor, setNotificationsAnchor] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationsOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchor(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchor(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
  };

  const notifications = [
    { id: 1, title: 'درخواست جدید ثبت شده است', time: '10 دقیقه پیش', read: false },
    { id: 2, title: 'تراکنش پرداخت با موفقیت انجام شد', time: '1 ساعت پیش', read: true },
    { id: 3, title: 'یادآوری جلسه فردا ساعت 10 صبح', time: '2 ساعت پیش', read: true },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AppBar 
      position="fixed"
      elevation={0}
      sx={{ 
        zIndex: theme.zIndex.drawer + 1,
        background: alpha(theme.palette.background.paper, 0.7),
        backdropFilter: 'blur(10px)',
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        width: '100%',
      }}
    >
      <Toolbar 
        component={motion.div}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        sx={{ 
          display: 'flex',
          justifyContent: 'space-between',
          height: 64
        }}
      >
        {/* سمت راست - لوگو و منوی همبرگری */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton 
            color="inherit" 
            onClick={onToggleSidebar}
            edge="start"
            sx={{ 
              ml: 1,
              color: theme.palette.text.primary,
              background: alpha(theme.palette.primary.main, 0.1),
              borderRadius: '12px',
              width: 40,
              height: 40,
              '&:hover': {
                background: alpha(theme.palette.primary.main, 0.2),
              }
            }}
          >
            <MenuOpenIcon sx={{ transform: open ? 'rotate(0deg)' : 'rotate(180deg)' }} />
          </IconButton>
          
          {!isMobile && (
            <Box 
              component={motion.div}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              sx={{ cursor: 'pointer' }}
            >
              <AnimatedLogo size="small" colorMode={isDarkMode ? 'dark' : 'light'} />
            </Box>
          )}
        </Box>

        {/* سمت چپ - پروفایل و تنظیمات */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* تغییر تم */}
          {onToggleTheme && (
            <Tooltip title={isDarkMode ? 'حالت روشن' : 'حالت تاریک'}>
              <IconButton 
                onClick={onToggleTheme}
                sx={{ 
                  mr: 1,
                  color: theme.palette.text.primary,
                  background: alpha(theme.palette.background.paper, 0.2),
                  borderRadius: '12px',
                  width: 40,
                  height: 40,
                  '&:hover': {
                    background: alpha(theme.palette.background.paper, 0.4),
                  },
                  transition: 'transform 0.3s ease',
                  transform: isDarkMode ? 'rotate(0deg)' : 'rotate(180deg)',
                }}
              >
                {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Tooltip>
          )}
          
          {/* اعلان‌ها */}
          <Tooltip title="اعلان‌ها">
            <IconButton 
              onClick={handleNotificationsOpen}
              sx={{ 
                mr: 1,
                color: theme.palette.text.primary,
                background: alpha(theme.palette.background.paper, 0.2),
                borderRadius: '12px',
                width: 40,
                height: 40,
                '&:hover': {
                  background: alpha(theme.palette.background.paper, 0.4),
                }
              }}
            >
              <Badge 
                badgeContent={unreadCount} 
                color="error"
                sx={{ 
                  '& .MuiBadge-badge': {
                    backgroundColor: theme.palette.error.main,
                    color: theme.palette.error.contrastText,
                    fontSize: '0.7rem',
                    minWidth: 18,
                    height: 18,
                    top: 6,
                    right: 6,
                  }
                }}
              >
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          
          {/* منوی اعلان‌ها */}
          <Menu
            anchorEl={notificationsAnchor}
            open={Boolean(notificationsAnchor)}
            onClose={handleNotificationsClose}
            PaperProps={{
              sx: {
                mt: 1.5,
                width: 320,
                background: alpha(theme.palette.background.paper, 0.9),
                backdropFilter: 'blur(8px)',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.2)}`,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                '& .MuiList-root': {
                  py: 0,
                }
              }
            }}
            transformOrigin={{ horizontal: 'left', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
          >
            {notifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                <MenuItem 
                  onClick={handleNotificationsClose}
                  sx={{ 
                    py: 1.5, 
                    px: 2,
                    borderRight: notification.read ? 'none' : `3px solid ${theme.palette.primary.main}`,
                    background: notification.read ? 'transparent' : alpha(theme.palette.primary.main, 0.05),
                    '&:hover': {
                      background: alpha(theme.palette.primary.main, 0.1),
                    }
                  }}
                >
                  <Box sx={{ width: '100%' }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <ListItemText 
                        primary={notification.title}
                        primaryTypographyProps={{ 
                          fontSize: '0.9rem',
                          fontWeight: notification.read ? 'normal' : 'bold',
                          textAlign: 'right'
                        }}
                      />
                    </Box>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mt={0.5}>
                      <ListItemText 
                        secondary={notification.time}
                        secondaryTypographyProps={{ 
                          fontSize: '0.75rem',
                          color: theme.palette.text.secondary,
                          textAlign: 'right'
                        }}
                      />
                    </Box>
                  </Box>
                </MenuItem>
                {index < notifications.length - 1 && (
                  <Divider sx={{ opacity: 0.1 }} />
                )}
              </React.Fragment>
            ))}
          </Menu>
          
          {/* آواتار کاربر */}
          <Tooltip title="پروفایل">
            <IconButton
              onClick={handleMenu}
              sx={{
                mr: 1,
                width: 40,
                height: 40,
                p: 0,
                background: alpha(theme.palette.primary.main, 0.1),
                '&:hover': {
                  background: alpha(theme.palette.primary.main, 0.2),
                },
                borderRadius: '12px',
                overflow: 'hidden',
              }}
            >
              <Avatar 
                sx={{ 
                  width: 36, 
                  height: 36,
                  transition: 'all 0.2s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  }
                }}
              >
                {user?.fullName?.charAt(0) || 'U'}
              </Avatar>
            </IconButton>
          </Tooltip>
          
          {/* منوی پروفایل */}
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={Boolean(anchorEl)}
            onClose={handleClose}
            transformOrigin={{ horizontal: 'left', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
            PaperProps={{
              sx: {
                mt: 1.5,
                width: 220,
                background: alpha(theme.palette.background.paper, 0.9),
                backdropFilter: 'blur(8px)',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.2)}`,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              }
            }}
          >
            <MenuItem onClick={handleClose} sx={{ py: 1.5 }}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="پروفایل" />
            </MenuItem>
            <MenuItem onClick={handleClose} sx={{ py: 1.5 }}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="تنظیمات" />
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout} sx={{ py: 1.5 }}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="خروج" />
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 