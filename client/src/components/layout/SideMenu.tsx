// client/src/components/layout/SideMenu.tsx
// کامپوننت منوی کناری

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
  Tooltip,
  Badge,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  Description as DescriptionIcon,
  Payment as PaymentIcon,
  Category as CategoryIcon,
  Sms as SmsIcon,
  Group as GroupIcon,
  Contacts as ContactsIcon,
  FormatListBulleted as ListIcon,
  Add as AddIcon,
  ListAlt as RequestsIcon,
  Collections as ImagesIcon,
  AccountBalance as PaymentListIcon,
  NoteAdd as NewPaymentIcon,
  PhotoLibrary as GalleryIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';

interface SideMenuProps {
  open: boolean;
  onClose: () => void;
}

interface MenuItemType {
  title: string;
  path: string;
  icon: React.ReactNode;
  divider?: boolean;
  adminOnly?: boolean;
  adminOrFinancialOnly?: boolean;
  badge?: number;
}

const SideMenu: React.FC<SideMenuProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const isFinancialManager = user?.role === 'FINANCIAL_MANAGER';
  const isAdminOrFinancial = isAdmin || isFinancialManager;

  useEffect(() => {
    setCollapsed(!open);
  }, [open]);

  // منوهای برنامه - بدون زیرمنو
  const menuItems: MenuItemType[] = [
    { 
      title: 'داشبورد', 
      path: '/dashboard', 
      icon: <DashboardIcon />
    },
    { 
      title: 'پرداخت‌ها', 
      path: '/payments', 
      icon: <PaymentListIcon />,
      badge: 3
    },
    { 
      title: 'افزودن پرداخت', 
      path: '/payments/new', 
      icon: <NewPaymentIcon />
    },
    { 
      title: 'گروه‌ها', 
      path: '/groups', 
      icon: <GroupIcon /> 
    },
    { 
      title: 'مخاطبین', 
      path: '/contacts', 
      icon: <ContactsIcon />,
      divider: true,
    },
    { 
      title: 'انواع درخواست', 
      path: '/request-types', 
      icon: <CategoryIcon />,
      adminOrFinancialOnly: true
    },
    { 
      title: 'گروه‌های درخواست', 
      path: '/request-groups', 
      icon: <ListIcon />,
      adminOrFinancialOnly: true,
      divider: true,
    },
    { 
      title: 'مدیریت کاربران', 
      path: '/users', 
      icon: <PeopleIcon />,
      adminOnly: true,
    },
    { 
      title: 'تنظیمات پیامک', 
      path: '/settings/sms', 
      icon: <SmsIcon />,
      adminOnly: true,
    },
  ];

  const drawerWidth = collapsed ? 70 : 240;

  // انیمیشن‌های فریمر موشن
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
  };

  const renderMenuItems = (items: MenuItemType[]) => {
    return items.map((menuItem) => {
      // بررسی دسترسی‌ها
      if (menuItem.adminOnly && !isAdmin) return null;
      if (menuItem.adminOrFinancialOnly && !isAdminOrFinancial) return null;
      
      // بررسی مسیر فعال
      const isActive = location.pathname === menuItem.path ||
                      (menuItem.path !== '/dashboard' && location.pathname.startsWith(menuItem.path));
      
      return (
        <React.Fragment key={menuItem.path}>
          <Box
            component={motion.div}
            variants={item}
            sx={{ 
              display: 'block', 
              px: collapsed ? 0.5 : 1.5, 
              py: 0.5,
            }}
          >
            <Tooltip 
              title={collapsed ? menuItem.title : ""}
              placement="left"
              disableHoverListener={!collapsed}
              arrow
            >
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    navigate(menuItem.path);
                    if (isMobile) onClose();
                  }}
                  selected={isActive}
                  sx={{
                    borderRadius: '12px',
                    px: collapsed ? 1 : 2,
                    py: 1.5,
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    background: isActive ? 
                      alpha(theme.palette.primary.main, 0.15) : 'transparent',
                    '&:hover': {
                      background: isActive ?
                        alpha(theme.palette.primary.main, 0.25) : 
                        alpha(theme.palette.background.default, 0.8),
                    },
                    transition: 'all 0.2s ease',
                    minHeight: collapsed ? 45 : 48,
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': isActive ? {
                      content: '""',
                      position: 'absolute',
                      right: 0,
                      top: '20%',
                      height: '60%',
                      width: '4px',
                      background: theme.palette.primary.main,
                      borderTopLeftRadius: '4px',
                      borderBottomLeftRadius: '4px',
                    } : {},
                  }}
                >
                  {menuItem.badge && !collapsed ? (
                    <Badge 
                      badgeContent={menuItem.badge} 
                      color="error"
                      sx={{ 
                        position: 'absolute',
                        top: 10,
                        left: 10,
                        '& .MuiBadge-badge': {
                          fontSize: '0.7rem',
                          minWidth: 18,
                          height: 18,
                        }
                      }}
                    />
                  ) : menuItem.badge && collapsed ? (
                    <Badge 
                      badgeContent={menuItem.badge} 
                      color="error"
                      sx={{ 
                        position: 'absolute',
                        top: 5,
                        left: 5,
                        '& .MuiBadge-badge': {
                          fontSize: '0.7rem',
                          minWidth: 16,
                          height: 16,
                        }
                      }}
                    />
                  ) : null}
                  
                  <ListItemIcon
                    sx={{
                      minWidth: collapsed ? 0 : 40,
                      color: isActive ? 
                        theme.palette.primary.main : 
                        theme.palette.text.secondary,
                      mr: collapsed ? 0 : 2,
                      ml: collapsed ? 0 : 0,
                      justifyContent: 'center',
                      fontSize: isActive ? '1.2rem' : '1.1rem',
                    }}
                  >
                    {menuItem.icon}
                  </ListItemIcon>
                  
                  {!collapsed && (
                    <ListItemText
                      primary={
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: isActive ? 600 : 400,
                            fontSize: '0.95rem',
                            color: isActive ? 
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
            </Tooltip>
          </Box>
          
          {!collapsed && menuItem.divider && (
            <Divider sx={{ my: 1.5, opacity: 0.1, mx: 2 }} />
          )}
        </React.Fragment>
      );
    });
  };

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
          height: 'calc(100% - 64px)',
          boxSizing: 'border-box',
          background: alpha(theme.palette.background.paper, 0.9),
          backdropFilter: 'blur(10px)',
          borderLeft: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          borderRight: 'none',
          boxShadow: `-4px 0 15px ${alpha(theme.palette.common.black, 0.05)}`,
          paddingY: 2,
          paddingX: collapsed ? 0.5 : 0,
          overflowX: 'hidden',
          transition: theme.transitions.create(['width', 'padding'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.standard,
          }),
        },
      }}
    >
      <motion.div
        animate={{ 
          width: drawerWidth,
          paddingLeft: collapsed ? 4 : 0,
          paddingRight: collapsed ? 4 : 0,
        }}
        transition={{ 
          type: "spring", 
          stiffness: 400, 
          damping: 30 
        }}
      >
        <Box
          component={motion.div}
          variants={container}
          initial="hidden"
          animate="show"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
          }}
        >
          {/* آیتم‌های منو */}
          <Box sx={{ flex: 1, overflowY: 'auto', pb: 8 }}>
            {renderMenuItems(menuItems)}
          </Box>

          {/* پاورقی */}
          {!collapsed && (
            <Box
              component={motion.div}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                textAlign: 'center',
                padding: 2,
                borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                background: alpha(theme.palette.background.paper, 0.8),
                backdropFilter: 'blur(8px)',
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ 
                  opacity: 0.6,
                  display: 'block'
                }}
              >
                پرداخت‌یار - نسخه ۰.۵.۰
              </Typography>
            </Box>
          )}
        </Box>
      </motion.div>
    </Drawer>
  );
};

export default SideMenu;