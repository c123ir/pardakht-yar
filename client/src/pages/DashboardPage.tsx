// client/src/pages/DashboardPage.tsx
// صفحه داشبورد با طراحی مدرن و شیشه‌ای

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Chip,
  Avatar,
  IconButton,
  useTheme,
  alpha,
  LinearProgress,
  Divider
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  AccountBalance as AccountBalanceIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  EventNote as EventNoteIcon,
  MoreVert as MoreVertIcon,
  ReceiptLong as ReceiptIcon,
  CreditCard as CreditCardIcon,
  Email as EmailIcon,
  Notifications as NotificationsIcon,
  CalendarMonth as CalendarIcon,
  Check as CheckIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';

// کامپوننت سربرگ
const Header = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  const formatDate = () => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Intl.DateTimeFormat('fa-IR', options).format(currentTime);
  };
  
  return (
    <Box
      component={motion.div}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 4,
      }}
    >
      <Box>
        <Typography
          variant="h4"
          component="h1"
          fontWeight="bold"
          sx={{
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            backgroundClip: 'text',
            textFillColor: 'transparent',
            mb: 1,
          }}
        >
          {user ? `سلام، ${user.username}!` : 'داشبورد'}
        </Typography>
        <Typography color="text.secondary" variant="body2">
          {formatDate()}
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', gap: 1 }}>
        <IconButton 
          sx={{ 
            background: alpha(theme.palette.background.paper, 0.1),
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            p: 1,
            '&:hover': {
              background: alpha(theme.palette.background.paper, 0.2),
            }
          }}
        >
          <CalendarIcon fontSize="small" />
        </IconButton>
        
        <IconButton 
          sx={{ 
            background: alpha(theme.palette.background.paper, 0.1),
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            p: 1,
            '&:hover': {
              background: alpha(theme.palette.background.paper, 0.2),
            }
          }}
        >
          <NotificationsIcon fontSize="small" />
        </IconButton>
        
        <Box 
          component={motion.div}
          whileHover={{ scale: 1.05 }}
          sx={{ 
            ml: 1, 
            cursor: 'pointer',
            position: 'relative',
          }}
        >
          <Avatar 
            alt={user?.username} 
            src="/user-avatar.jpg"
            sx={{ 
              width: 40, 
              height: 40,
              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
              border: `2px solid ${alpha(theme.palette.background.paper, 0.8)}`,
            }}
          />
          <Box 
            sx={{ 
              position: 'absolute', 
              bottom: 0, 
              right: 0, 
              width: 12, 
              height: 12, 
              borderRadius: '50%', 
              background: theme.palette.success.main,
              border: `2px solid ${theme.palette.background.paper}` 
            }} 
          />
        </Box>
      </Box>
    </Box>
  );
};

// کارت آماری
const StatCard = ({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  color = 'primary',
  trendValue,
  delay = 0 
}: { 
  title: string; 
  value: string; 
  description: string; 
  icon: React.ElementType;
  color?: 'primary' | 'secondary' | 'success' | 'info' | 'warning';
  trendValue?: string;
  delay?: number;
}) => {
  const theme = useTheme();
  
  return (
    <Card
      component={motion.div}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, type: 'spring', stiffness: 100 }}
      sx={{
        height: '100%',
        borderRadius: '16px',
        background: alpha(theme.palette.background.paper, 0.1),
        backdropFilter: 'blur(10px)',
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        boxShadow: `0 10px 30px -5px ${alpha(theme.palette.common.black, 0.1)}`,
        overflow: 'hidden',
        position: 'relative',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: `0 15px 40px -5px ${alpha(theme.palette.common.black, 0.15)}`,
        },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0.03,
          background: `radial-gradient(circle at 30% 30%, ${theme.palette[color].main} 0%, transparent 70%)`,
          zIndex: 0,
        }}
      />
      
      <CardContent sx={{ position: 'relative', zIndex: 1, p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography 
            color="text.secondary" 
            variant="subtitle2"
            sx={{ fontWeight: 500 }}
          >
            {title}
          </Typography>
          
          <Box
            sx={{
              borderRadius: '12px',
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: alpha(theme.palette[color].main, 0.1),
              color: theme.palette[color].main,
              boxShadow: `0 4px 12px ${alpha(theme.palette[color].main, 0.2)}`,
            }}
          >
            <Icon fontSize="small" />
          </Box>
        </Box>
        
        <Typography 
          variant="h4" 
          component="div" 
          sx={{ 
            my: 2, 
            fontWeight: 'bold',
            color: theme.palette.text.primary
          }}
        >
          {value}
        </Typography>
        
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography 
            variant="body2" 
            color="text.secondary"
          >
            {description}
          </Typography>
          
          {trendValue && (
            <Chip
              size="small"
              label={trendValue}
              icon={<TrendingUpIcon fontSize="small" />}
              sx={{
                background: alpha(theme.palette.success.main, 0.1),
                color: theme.palette.success.main,
                borderRadius: '6px',
                fontSize: '0.75rem',
                height: 24,
                '& .MuiChip-icon': {
                  color: theme.palette.success.main,
                }
              }}
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

// کامپوننت لیست کارها
const TodoList = () => {
  const theme = useTheme();
  
  const todos = [
    { 
      id: 1, 
      title: 'بررسی صورت‌حساب شرکت الف', 
      date: 'امروز - ساعت ۱۵:۰۰', 
      icon: <ReceiptIcon fontSize="small" /> 
    },
    { 
      id: 2, 
      title: 'پرداخت حقوق کارمندان', 
      date: 'فردا - ساعت ۱۰:۰۰', 
      icon: <CreditCardIcon fontSize="small" /> 
    },
    { 
      id: 3, 
      title: 'جلسه با بخش مالی', 
      date: 'پنج‌شنبه - ساعت ۱۳:۳۰', 
      icon: <PeopleIcon fontSize="small" /> 
    }
  ];
  
  return (
    <Card
      component={motion.div}
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.4, type: 'spring' }}
      sx={{
        borderRadius: '16px',
        background: alpha(theme.palette.background.paper, 0.1),
        backdropFilter: 'blur(10px)',
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        boxShadow: `0 10px 30px -5px ${alpha(theme.palette.common.black, 0.1)}`,
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <CardContent sx={{ p: 3, height: '100%' }}>
        <Typography 
          variant="h6" 
          fontWeight="bold" 
          gutterBottom
          sx={{ mb: 3 }}
        >
          کارهای امروز
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {todos.map((todo, index) => (
            <Box 
              key={todo.id}
              component={motion.div}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 + (index * 0.1) }}
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                p: 2,
                borderRadius: '12px',
                background: alpha(theme.palette.background.paper, 0.3),
                border: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: alpha(theme.palette.background.paper, 0.5),
                  transform: 'translateY(-2px)',
                  boxShadow: `0 5px 15px ${alpha(theme.palette.common.black, 0.05)}`,
                },
              }}
            >
              <Box 
                sx={{ 
                  mr: 2, 
                  borderRadius: '10px',
                  width: 36,
                  height: 36,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main
                }}
              >
                {todo.icon}
              </Box>
              
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="body1" fontWeight="500">
                  {todo.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {todo.date}
                </Typography>
              </Box>
              
              <IconButton 
                size="small" 
                sx={{ 
                  color: theme.palette.success.main,
                  background: alpha(theme.palette.success.main, 0.1),
                  width: 30,
                  height: 30,
                  '&:hover': {
                    background: alpha(theme.palette.success.main, 0.2),
                  }
                }}
              >
                <CheckIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

// کامپوننت آخرین ایمیل‌ها
const RecentEmails = () => {
  const theme = useTheme();
  
  const emails = [
    {
      id: 1,
      sender: 'محمد محمدی',
      subject: 'گزارش مالی هفتگی',
      preview: 'طبق درخواست شما، گزارش مالی هفته گذشته به پیوست...',
      time: '۱۳:۴۵',
      avatar: '/avatar1.jpg'
    },
    {
      id: 2,
      sender: 'سارا حسینی',
      subject: 'پیش‌نویس قرارداد جدید',
      preview: 'سلام، پیش‌نویس قرارداد با شرکت فرآیند را بررسی کردم...',
      time: '۱۱:۲۰',
      avatar: '/avatar2.jpg'
    },
    {
      id: 3,
      sender: 'علی کریمی',
      subject: 'جلسه بررسی پروژه',
      preview: 'با سلام، زمان جلسه هفتگی بررسی پروژه به ساعت...',
      time: 'دیروز',
      avatar: '/avatar3.jpg'
    }
  ];
  
  return (
    <Card
      component={motion.div}
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.3, type: 'spring' }}
      sx={{
        borderRadius: '16px',
        background: alpha(theme.palette.background.paper, 0.1),
        backdropFilter: 'blur(10px)',
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        boxShadow: `0 10px 30px -5px ${alpha(theme.palette.common.black, 0.1)}`,
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <CardContent sx={{ p: 3, height: '100%' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6" fontWeight="bold">
            پیام‌های اخیر
          </Typography>
          
          <IconButton 
            size="small" 
            sx={{ 
              borderRadius: '8px',
              background: alpha(theme.palette.background.paper, 0.2),
              backdropFilter: 'blur(10px)',
              '&:hover': {
                background: alpha(theme.palette.background.paper, 0.3),
              }
            }}
          >
            <EmailIcon fontSize="small" />
          </IconButton>
        </Box>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {emails.map((email, index) => (
            <React.Fragment key={email.id}>
              <Box 
                component={motion.div}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + (index * 0.1) }}
                sx={{ 
                  display: 'flex', 
                  alignItems: 'flex-start',
                  cursor: 'pointer',
                  py: 1,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'translateX(-5px)',
                  }
                }}
              >
                <Avatar
                  src={email.avatar}
                  alt={email.sender}
                  sx={{ 
                    mr: 2, 
                    width: 48, 
                    height: 48,
                    boxShadow: `0 4px 8px ${alpha(theme.palette.common.black, 0.1)}`,
                    border: `2px solid ${alpha(theme.palette.background.paper, 0.2)}`,
                  }}
                />
                
                <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body1" fontWeight="500" noWrap>
                      {email.sender}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {email.time}
                    </Typography>
                  </Box>
                  
                  <Typography variant="subtitle2" fontWeight="medium" noWrap>
                    {email.subject}
                  </Typography>
                  
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {email.preview}
                  </Typography>
                </Box>
              </Box>
              
              {index < emails.length - 1 && (
                <Divider sx={{ borderColor: alpha(theme.palette.divider, 0.08) }} />
              )}
            </React.Fragment>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

// کامپوننت کارت پیشرفت
const ProgressCard = () => {
  const theme = useTheme();
  
  return (
    <Card
      component={motion.div}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, type: 'spring' }}
      sx={{
        borderRadius: '16px',
        background: alpha(theme.palette.background.paper, 0.1),
        backdropFilter: 'blur(10px)',
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        boxShadow: `0 10px 30px -5px ${alpha(theme.palette.common.black, 0.1)}`,
        overflow: 'hidden',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box 
          sx={{ 
            borderRadius: '12px',
            background: alpha(theme.palette.primary.dark, 0.9),
            p: 3,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '200%',
              height: '200%',
              background: `radial-gradient(circle at top right, ${alpha(theme.palette.primary.light, 0.2)}, transparent 70%)`,
              transform: 'translate(-25%, -25%)',
            }}
          />
          
          <Typography 
            variant="h6" 
            fontWeight="bold" 
            color="common.white"
          >
            ارتقای سیستم
          </Typography>
          
          <Typography 
            variant="body2" 
            color="common.white" 
            sx={{ opacity: 0.8, mb: 2 }}
          >
            در دست پیاده‌سازی...
          </Typography>
          
          <Box sx={{ mb: 1 }}>
            <LinearProgress 
              variant="determinate" 
              value={70} 
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: alpha(theme.palette.common.white, 0.2),
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(90deg, #fff, #f0f0f0)',
                  borderRadius: 4,
                }
              }}
            />
          </Box>
          
          <Box display="flex" justifyContent="space-between">
            <Typography variant="caption" color="common.white">
              پیشرفت: ۷۰٪
            </Typography>
            <Typography variant="caption" color="common.white">
              ۶ روز باقی‌مانده
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const DashboardPage: React.FC = () => {
  const theme = useTheme();
  
  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 80px)',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.03)} 0%, ${alpha(theme.palette.secondary.dark, 0.03)} 100%)`,
        borderRadius: '24px',
        p: { xs: 2, md: 3 },
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* پس‌زمینه دکوراتیو */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0.02,
          backgroundImage: `radial-gradient(circle at 30% 20%, ${theme.palette.primary.main} 0%, transparent 80%),
                           radial-gradient(circle at 70% 70%, ${theme.palette.secondary.main} 0%, transparent 70%)`,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Header />
        
        <Grid container spacing={3}>
          {/* کارت‌های آماری */}
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="موجودی حساب"
              value="۱۲۲,۴۵۶,۰۰۰ ریال"
              description="موجودی فعلی"
              icon={AccountBalanceIcon}
              color="primary"
              delay={0.1}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="درخواست‌های ماه"
              value="۱۵ مورد"
              description="افزایش نسبت به ماه قبل"
              icon={EventNoteIcon}
              color="info"
              trendValue="+۱۲.۵٪"
              delay={0.2}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="پرداخت‌های هفته"
              value="۳,۲۸۶,۰۰۰ ریال"
              description="۱۲ پرداخت انجام شده"
              icon={CreditCardIcon}
              color="success"
              delay={0.3}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="طرف‌حساب‌های فعال"
              value="۲۴ مورد"
              description="۳ طرف‌حساب جدید"
              icon={PeopleIcon}
              color="secondary"
              delay={0.4}
            />
          </Grid>
          
          {/* کارت پیشرفت و کارهای در انتظار */}
          <Grid item xs={12} md={5}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <ProgressCard />
              </Grid>
              <Grid item xs={12}>
                <TodoList />
              </Grid>
            </Grid>
          </Grid>
          
          {/* پیام‌های اخیر */}
          <Grid item xs={12} md={7}>
            <RecentEmails />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default DashboardPage;