import React, { useState, useEffect, useReducer } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
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
  Typography,
  Chip,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  MenuOpen as MenuOpenIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  Refresh as RefreshIcon,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import AnimatedLogo from './AnimatedLogo';
import UserAvatar from '../common/UserAvatar';
import CSSAnimation from '../common/CSSAnimation';

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
  const [avatarRefreshKey, setAvatarRefreshKey] = useState(Date.now());
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  useEffect(() => {
    if (user?.avatar || user?._avatarUpdated) {
      setAvatarRefreshKey(Date.now());
      forceUpdate();
      
      const timer = setTimeout(() => {
        setAvatarRefreshKey(Date.now());
        forceUpdate();
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [user?.avatar, user?._avatarUpdated, user?.id]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (user?.avatar) {
        setAvatarRefreshKey(Date.now());
        forceUpdate();
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [user]);

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

  const handleRefreshAvatar = () => {
    setAvatarRefreshKey(Date.now());
    forceUpdate();
    
    setTimeout(() => {
      setAvatarRefreshKey(Date.now());
      forceUpdate();
    }, 100);
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
          
          {/* پروفایل کاربر */}
          <CSSAnimation animation="fadeIn" duration={0.5}>
            <Box sx={{ position: 'relative' }}>
              <Tooltip title="پروفایل کاربر">
                <IconButton
                  onClick={handleMenu}
                  sx={{
                    p: 0.5,
                    border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                    borderRadius: '12px',
                    transition: 'all 0.3s ease',
                    transform: 'scale(1)',
                    '&:hover': {
                      border: `2px solid ${alpha(theme.palette.primary.main, 0.5)}`,
                      transform: 'scale(1.05)',
                      boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
                    }
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <UserAvatar 
                      avatar={user?.avatar}
                      name={user?.fullName || ''}
                      size={36}
                      key={`avatar-${avatarRefreshKey}`}
                      forceRefresh={true}
                    />
                  </Box>
                </IconButton>
              </Tooltip>
              
              {/* دکمه رفرش آواتار */}
              <Tooltip title="به‌روزرسانی آواتار">
                <IconButton
                  size="small"
                  onClick={handleRefreshAvatar}
                  sx={{
                    position: 'absolute',
                    right: -10,
                    bottom: -8,
                    bgcolor: alpha(theme.palette.background.paper, 0.9),
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.1)}`,
                    width: 22,
                    height: 22,
                    fontSize: '0.75rem',
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'rotate(180deg)',
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                    }
                  }}
                >
                  <RefreshIcon fontSize="inherit" />
                </IconButton>
              </Tooltip>

              {/* منوی پروفایل */}
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                  sx: {
                    mt: 1.5,
                    minWidth: 230,
                    maxWidth: 280,
                    background: alpha(theme.palette.background.paper, 0.9),
                    backdropFilter: 'blur(8px)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.2)}`,
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  }
                }}
                transformOrigin={{ horizontal: 'left', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
              >
                <Box sx={{ 
                  px: 2, 
                  py: 2, 
                  textAlign: 'center',
                  background: theme => alpha(theme.palette.primary.main, 0.05),
                  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                }}>
                  <Box sx={{ position: 'relative', display: 'inline-block', mb: 1 }}>
                    <UserAvatar 
                      avatar={user?.avatar}
                      name={user?.fullName || 'کاربر مهمان'}
                      size={64}
                      key={`profile-menu-avatar-${avatarRefreshKey}`}
                      forceRefresh={true}
                      sx={{
                        mx: 'auto',
                        border: `3px solid ${alpha(theme.palette.background.paper, 0.9)}`,
                        boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.1)}`,
                      }}
                    />
                    <Tooltip title="به‌روزرسانی آواتار">
                      <IconButton
                        size="small"
                        onClick={handleRefreshAvatar}
                        sx={{
                          position: 'absolute',
                          right: -8,
                          bottom: -4,
                          bgcolor: alpha(theme.palette.background.paper, 0.9),
                          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                          boxShadow: `0 2px 8px ${alpha(theme.palette.common.black, 0.1)}`,
                          width: 24,
                          height: 24,
                          fontSize: '0.85rem',
                          '&:hover': {
                            transform: 'rotate(180deg)',
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                          }
                        }}
                      >
                        <RefreshIcon fontSize="inherit" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Typography 
                    variant="subtitle1" 
                    fontWeight="bold" 
                    sx={{ mb: 0.5 }}
                  >
                    {user?.fullName || 'کاربر مهمان'}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    display="block" 
                    color="textSecondary"
                    sx={{ mb: 0.5 }}
                  >
                    {user?.username}
                  </Typography>
                  <Chip 
                    size="small" 
                    label={user?.role === 'ADMIN' ? 'مدیر سیستم' : 'کاربر عادی'} 
                    color={user?.role === 'ADMIN' ? 'primary' : 'default'}
                    variant="outlined"
                    sx={{ 
                      borderRadius: '4px',
                      height: 20,
                      fontSize: '0.7rem'
                    }}
                  />
                </Box>
  
                <MenuItem onClick={handleClose} sx={{ py: 1.5 }}>
                  <ListItemIcon>
                    <PersonIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="پروفایل کاربری" />
                </MenuItem>
                <MenuItem onClick={handleClose} sx={{ py: 1.5 }}>
                  <ListItemIcon>
                    <DashboardIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="داشبورد" />
                </MenuItem>
                <MenuItem onClick={handleClose} sx={{ py: 1.5 }}>
                  <ListItemIcon>
                    <SettingsIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="تنظیمات" />
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout} sx={{ py: 1.5, color: 'error.main' }}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" color="error" />
                  </ListItemIcon>
                  <ListItemText primary="خروج از سیستم" primaryTypographyProps={{ color: 'error' }} />
                </MenuItem>
              </Menu>
            </Box>
          </CSSAnimation>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 