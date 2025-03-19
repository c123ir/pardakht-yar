// client/src/pages/DashboardPage.tsx
// صفحه داشبورد با طراحی مدرن و شیشه‌ای

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  useTheme, 
  alpha,
  LinearProgress,
  Divider,
  Container,
  Button
} from '@mui/material';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import {
  TrendingUp as TrendingUpIcon,
  AttachMoney as AttachMoneyIcon,
  Description as DescriptionIcon,
  People as PeopleIcon,
  CheckCircle as CheckCircleIcon,
  CalendarToday as CalendarTodayIcon,
  Error as ErrorIcon,
  ArrowUpward as ArrowUpwardIcon,
} from '@mui/icons-material';

// کامپوننت سربرگ
const Header = ({ date }: { date: Date }) => {
  const theme = useTheme();
  const { user } = useAuth();
  
  const formatDate = () => {
    const options = { 
      weekday: 'long' as const, 
      year: 'numeric' as const, 
      month: 'long' as const, 
      day: 'numeric' as const 
    };
    return new Intl.DateTimeFormat('fa-IR', options).format(date);
    
  };
  
  const greeting = () => {
    const hour = date.getHours();
    if (hour < 12) {
      return 'صبح بخیر';
    } else if (hour < 17) {
      return 'ظهر بخیر';
    } else {
      return 'عصر بخیر';
    }
  };

  return (
    <Box 
    
      component={motion.div}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      sx={{
        mb: 4,
        p: 3,
        borderRadius: 4,
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.8)}, ${alpha(theme.palette.secondary.dark, 0.8)})`,
        
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* افکت کریستالی در پس‌زمینه */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          background: `radial-gradient(circle at 20% 20%, ${alpha(theme.palette.common.white, 0.3)} 0%, transparent 50%),
                       radial-gradient(circle at 80% 80%, ${alpha(theme.palette.primary.light, 0.3)} 0%, transparent 50%)`,
          zIndex: 0,
        }}
      />
      
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {`${greeting()}، ${user?.username || 'کاربر گرامی'}`}
            </Typography>
            <Typography variant="body1">
              {formatDate()}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
            <Typography variant="h6" fontWeight="medium">
              سامانت - سامانه مدیریت عملیات تحت شبکه
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

// کامپوننت کارت آمار
const StatCard = ({ 
  title, 
  value, 
  icon, 
  color, 
  increase, 
  delay = 0
}: { 
  title: string; 
  value: string; 
  icon: React.ReactNode; 
  color: string; 
  increase?: string;
  delay?: number;
}) => {
  const theme = useTheme();

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, duration: 0.5 }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 3,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 4,
          background: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: 'blur(8px)',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          transition: 'transform 0.3s, box-shadow 0.3s',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: `0 12px 24px ${alpha(theme.palette.common.black, 0.15)}`,
          },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* گرادیان رنگی در گوشه کارت */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 130,
            height: 130,
            background: `linear-gradient(135deg, ${alpha(color, 0.3)} 0%, transparent 60%)`,
            borderRadius: '0 0 0 100%',
            zIndex: 0,
          }}
        />

        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'flex-start', 
            justifyContent: 'space-between',
            mb: 2,
            zIndex: 1,
          }}
        >
          <Typography color="text.secondary" variant="subtitle2">
            {title}
          </Typography>
          <Box 
            sx={{ 
              background: alpha(color, 0.1), 
              borderRadius: '50%', 
              p: 1,
              display: 'flex',
              color
            }}
          >
            {icon}
          </Box>
        </Box>
        
        <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ zIndex: 1 }}>
          {value}
        </Typography>
        
        {increase && (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto', zIndex: 1 }}>
            <ArrowUpwardIcon sx={{ color: 'success.main', fontSize: 16, mr: 0.5 }} />
            <Typography color="success.main" variant="body2" fontWeight="medium">
              {increase}
            </Typography>
          </Box>
        )}
      </Paper>
    </motion.div>
  );
};

// کامپوننت کارت کارهای در انتظار
const TasksCard = ({ delay = 0 }: { delay?: number }) => {
  const theme = useTheme();
  
  const tasks = [
    { id: 1, title: 'بررسی درخواست‌های جدید', status: 'در انتظار' },
    { id: 2, title: 'تایید پرداخت‌های معلق', status: 'در انتظار' },
    { id: 3, title: 'پاسخ به تیکت‌های پشتیبانی', status: 'تکمیل شده' },
    { id: 4, title: 'بروزرسانی اطلاعات کاربران', status: 'در حال انجام' },
    { id: 5, title: 'گزارش عملکرد ماهانه', status: 'در انتظار' },
  ];

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, duration: 0.5 }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 3,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 4,
          background: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: 'blur(8px)',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Typography variant="h6" fontWeight="medium" mb={2}>
          کارهای در انتظار
        </Typography>
        
        <Box sx={{ flexGrow: 1 }}>
          {tasks.map((task) => (
            <Box 
              key={task.id}
              sx={{ 
                py: 1.5, 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {task.status === 'تکمیل شده' ? (
                  <CheckCircleIcon sx={{ color: 'success.main', mr: 1, fontSize: 20 }} />
                ) : task.status === 'در حال انجام' ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                  >
                    <CalendarTodayIcon sx={{ color: theme.palette.primary.main, mr: 1, fontSize: 20 }} />
                  </motion.div>
                ) : (
                  <ErrorIcon sx={{ color: theme.palette.warning.main, mr: 1, fontSize: 20 }} />
                )}
                <Typography 
                  variant="body2"
                  sx={{ 
                    textDecoration: task.status === 'تکمیل شده' ? 'line-through' : 'none',
                    color: task.status === 'تکمیل شده' ? 'text.secondary' : 'text.primary'
                  }}
                >
                  {task.title}
                </Typography>
              </Box>
              <Typography 
                variant="caption" 
                sx={{ 
                  px: 1.5, 
                  py: 0.5, 
                  borderRadius: 1,
                  backgroundColor: task.status === 'تکمیل شده' 
                    ? alpha(theme.palette.success.main, 0.1)
                    : task.status === 'در حال انجام'
                      ? alpha(theme.palette.primary.main, 0.1)
                      : alpha(theme.palette.warning.main, 0.1),
                  color: task.status === 'تکمیل شده' 
                    ? theme.palette.success.main
                    : task.status === 'در حال انجام'
                      ? theme.palette.primary.main
                      : theme.palette.warning.main,
                }}
              >
                {task.status}
              </Typography>
            </Box>
          ))}
        </Box>
      </Paper>
    </motion.div>
  );
};

// کامپوننت کارت پیام‌های اخیر
const MessagesCard = ({ delay = 0 }: { delay?: number }) => {
  const theme = useTheme();
  
  const messages = [
    { id: 1, sender: 'علی محمدی', content: 'درخواست جدید ثبت شده است', time: '10:30', avatar: '/avatars/avatar1.jpg' },
    { id: 2, sender: 'سارا احمدی', content: 'گزارش ماهانه آماده بررسی است', time: '09:15', avatar: '/avatars/avatar2.jpg' },
    { id: 3, sender: 'محمد رضایی', content: 'تیکت جدید در سیستم پشتیبانی', time: 'دیروز', avatar: '/avatars/avatar3.jpg' },
  ];

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, duration: 0.5 }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 3,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 4,
          background: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: 'blur(8px)',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Typography variant="h6" fontWeight="medium" mb={2}>
          پیام‌های اخیر
        </Typography>
        
        <Box sx={{ flexGrow: 1 }}>
          {messages.map((message) => (
            <Box 
              key={message.id}
              sx={{ 
                py: 1.5, 
                display: 'flex',
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              }}
            >
              <Box 
                sx={{ 
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  mr: 2,
                  flexShrink: 0,
                }}
              >
                {message.sender.charAt(0)}
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" fontWeight="medium">
                    {message.sender}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {message.time}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {message.content}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
        
        <Button 
          variant="text" 
          fullWidth 
          sx={{ mt: 2 }}
          component={motion.button}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          مشاهده همه پیام‌ها
        </Button>
      </Paper>
    </motion.div>
  );
};

// کامپوننت کارت پروژه
const ProjectCard = ({ delay = 0 }: { delay?: number }) => {
  const theme = useTheme();
  
  const project = {
    name: 'سامانت - نسخه ۱.۰',
    description: 'پروژه توسعه سامانه مدیریت عملیات تحت شبکه',
    progress: 72,
    tasks: { completed: 45, total: 78 },
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, duration: 0.5 }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 3,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 4,
          background: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: 'blur(8px)',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Typography variant="h6" fontWeight="medium" gutterBottom>
          {project.name}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" paragraph>
          {project.description}
        </Typography>
        
        <Box sx={{ mb: 2, mt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">پیشرفت پروژه</Typography>
            <Typography variant="body2" fontWeight="medium">{project.progress}%</Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={project.progress} 
            sx={{ 
              height: 6, 
              borderRadius: 3,
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              '& .MuiLinearProgress-bar': {
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
              }
            }} 
          />
        </Box>
        
        <Divider sx={{ my: 2, opacity: 0.1 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 'auto' }}>
          <Typography variant="body2" color="text.secondary">
            تکمیل شده: {project.tasks.completed} از {project.tasks.total}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              px: 1.5, 
              py: 0.5, 
              borderRadius: 1,
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main
            }}
          >
            در حال پیشرفت
          </Typography>
        </Box>
      </Paper>
    </motion.div>
  );
};

const DashboardPage = () => {
  const [date, setDate] = useState(new Date());
  const [showEasterEgg, setShowEasterEgg] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date());
    }, 60000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  // تابع برای شمارش کلیک‌ها
  const handleHeaderClick = () => {
    setShowEasterEgg(prev => !prev);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* سورپرایز مخفی */}
      {showEasterEgg && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            flexDirection: 'column',
            backdropFilter: 'blur(8px)',
          }}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ 
              scale: [0.5, 1.2, 1],
              opacity: 1,
              rotate: [0, 10, 0, -10, 0]
            }}
            transition={{ 
              duration: 1.5,
              ease: "easeInOut"
            }}
          >
            <Typography
              variant="h2"
              component="div"
              sx={{
                fontWeight: 'bold',
                background: 'linear-gradient(90deg, #ff9a9e, #fad0c4, #a1c4fd)',
                backgroundClip: 'text',
                textFillColor: 'transparent',
                textAlign: 'center',
                mb: 3
              }}
            >
              🎉 آفرین! شما ویژگی مخفی را پیدا کردید 🎉
            </Typography>
          </motion.div>
          
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Typography 
              variant="h5" 
              sx={{ 
                color: '#ffffff',
                textAlign: 'center',
                maxWidth: '600px',
                mb: 4
              }}
            >
              ممنون از اینکه از سامانت استفاده می‌کنید! ما برای بهترین کاربران خود سورپرایز‌های مخفی داریم.
            </Typography>
          </motion.div>
          
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              y: [0, -10, 0],
            }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 2,
            }}
          >
            <Button
              variant="contained"
              sx={{
                background: 'linear-gradient(90deg, #a1c4fd, #c2e9fb)',
                color: '#1a1a1a',
                fontWeight: 'bold',
                padding: '12px 24px',
                borderRadius: '12px',
                boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
                '&:hover': {
                  background: 'linear-gradient(90deg, #c2e9fb, #a1c4fd)',
                }
              }}
              onClick={() => setShowEasterEgg(false)}
            >
              ادامه استفاده از داشبورد
            </Button>
          </motion.div>
        </motion.div>
      )}

      {/* هدر */}
      <motion.div 
        whileHover={{ scale: 1.01 }}
        onClick={handleHeaderClick}
        style={{ cursor: 'pointer' }}
      >
        <Header date={date} />
      </motion.div>

      <Grid container spacing={3}>
        {/* ردیف اول - کارت‌های آمار */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="درخواست‌ها" 
            value="856" 
            icon={<DescriptionIcon />}
            color={useTheme().palette.primary.main}
            increase="12% از ماه گذشته"
            delay={0.1}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="پرداخت‌ها" 
            value="۱,۵۴۰,۰۰۰ تومان" 
            icon={<AttachMoneyIcon />}
            color={useTheme().palette.success.main}
            increase="8% از ماه گذشته"
            delay={0.2}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="کاربران" 
            value="35" 
            icon={<PeopleIcon />}
            color={useTheme().palette.warning.main}
            increase="3 کاربر جدید"
            delay={0.3}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="رشد" 
            value="24%" 
            icon={<TrendingUpIcon />}
            color={useTheme().palette.secondary.main}
            increase="2% از ماه گذشته"
            delay={0.4}
          />
        </Grid>

        {/* ردیف دوم - کارت‌های اطلاعات تفصیلی */}
        <Grid item xs={12} md={5}>
          <TasksCard delay={0.5} />
        </Grid>
        <Grid item xs={12} md={4}>
          <MessagesCard delay={0.6} />
        </Grid>
        <Grid item xs={12} md={3}>
          <ProjectCard delay={0.7} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardPage;