// client/src/pages/GroupsPage.tsx
// صفحه مدیریت گروه‌ها با طراحی مدرن و شیشه‌ای

import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  IconButton, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  TextField,
  Avatar,
  Chip,
  alpha,
  Grow,
  useTheme,
  Fade
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  People as PeopleIcon,
  Visibility as VisibilityIcon,
  Payments as PaymentsIcon,
  Event as EventIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';

// داده‌های نمونه برای نمایش در صفحه
const SAMPLE_GROUPS = [
  { 
    id: 1, 
    title: 'گروه مالی', 
    description: 'گروه مربوط به امور مالی و حسابداری', 
    color: '#3f51b5',
    membersCount: 12,
    eventsCount: 24,
    lastActivity: '۱۴۰۳/۰۳/۱۵'
  },
  { 
    id: 2, 
    title: 'گروه فروش', 
    description: 'گروه مربوط به امور فروش و بازاریابی', 
    color: '#f44336',
    membersCount: 8,
    eventsCount: 16,
    lastActivity: '۱۴۰۳/۰۳/۱۴' 
  },
  { 
    id: 3, 
    title: 'گروه منابع انسانی', 
    description: 'گروه مربوط به امور کارکنان و استخدام', 
    color: '#4caf50',
    membersCount: 5,
    eventsCount: 10,
    lastActivity: '۱۴۰۳/۰۳/۱۰' 
  },
  { 
    id: 4, 
    title: 'گروه فنی', 
    description: 'گروه مربوط به توسعه و پشتیبانی فنی', 
    color: '#ff9800',
    membersCount: 15,
    eventsCount: 30,
    lastActivity: '۱۴۰۳/۰۳/۱۶' 
  },
];

const GroupsPage: React.FC = () => {
  const theme = useTheme();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);

  // باز کردن دیالوگ ایجاد/ویرایش گروه
  const handleOpenDialog = (group: any = null) => {
    setSelectedGroup(group);
    setOpenDialog(true);
  };

  // بستن دیالوگ
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedGroup(null);
  };

  // استایل برای کارت‌های شیشه‌ای
  const glassCardStyle = {
    background: alpha(theme.palette.background.paper, 0.7),
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
    boxShadow: `0 8px 32px 0 ${alpha('#000', 0.18)}`,
    overflow: 'hidden',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: `0 12px 40px 0 ${alpha('#000', 0.25)}`,
      '& .card-actions': {
        opacity: 1,
        transform: 'translateY(0)',
      }
    }
  };

  return (
    <Box sx={{
      minHeight: 'calc(100vh - 80px)',
      background: `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0.6)} 0%, ${alpha(theme.palette.secondary.dark, 0.6)} 100%)`,
      borderRadius: '24px',
      p: 3,
    }}>
      {/* عنوان صفحه و دکمه افزودن */}
      <Box 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center" 
        mb={5}
        sx={{
          background: alpha(theme.palette.background.paper, 0.4),
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          p: 2,
          boxShadow: `0 4px 20px 0 ${alpha('#000', 0.1)}`
        }}
      >
        <Box display="flex" alignItems="center">
          <EventIcon 
            sx={{ 
              fontSize: 40, 
              mr: 2,
              color: theme.palette.primary.main
            }} 
          />
          <Typography 
            variant="h4" 
            component="h1"
            sx={{
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              textFillColor: 'transparent',
              fontWeight: 'bold'
            }}
          >
            مدیریت گروه‌ها و رویدادها
          </Typography>
        </Box>
        
        <Button
          variant="contained"
          size="large"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{
            borderRadius: '12px',
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            boxShadow: `0 10px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
            px: 3,
            py: 1.2,
            fontWeight: 'bold',
            '&:hover': {
              background: `linear-gradient(90deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
              transform: 'translateY(-2px)',
              boxShadow: `0 14px 28px ${alpha(theme.palette.primary.main, 0.4)}`,
            }
          }}
        >
          ایجاد گروه جدید
        </Button>
      </Box>
      
      {/* گرید کارت‌های گروه */}
      <Grid container spacing={3}>
        {SAMPLE_GROUPS.map((group, index) => (
          <Grow 
            in={true} 
            key={group.id}
            timeout={(index + 1) * 200}
            style={{ transformOrigin: '0 0 0' }}
          >
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Card sx={glassCardStyle}>
                <Box 
                  sx={{
                    height: '100px',
                    background: `linear-gradient(135deg, ${alpha(group.color, 0.8)} 0%, ${alpha(group.color, 0.6)} 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      width: '150%',
                      height: '150%',
                      background: `radial-gradient(circle, ${alpha('#fff', 0.1)} 0%, transparent 70%)`,
                      top: '-50%',
                      left: '-25%',
                    }
                  }}
                >
                  <Avatar 
                    sx={{ 
                      width: 70, 
                      height: 70, 
                      bgcolor: group.color,
                      boxShadow: `0 8px 32px 0 ${alpha(group.color, 0.4)}`,
                      border: `4px solid ${alpha('#fff', 0.2)}`
                    }}
                  >
                    {group.title.substring(0, 1)}
                  </Avatar>
                </Box>
                
                <CardContent sx={{ pb: 1 }}>
                  <Typography 
                    variant="h5" 
                    component="h2" 
                    gutterBottom
                    sx={{ 
                      fontWeight: 'bold',
                      color: theme.palette.text.primary
                    }}
                  >
                    {group.title}
                  </Typography>
                  
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      mb: 2,
                      height: '40px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {group.description}
                  </Typography>
                  
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Chip
                        icon={<PeopleIcon />}
                        label={`${group.membersCount} عضو`}
                        size="small"
                        sx={{ 
                          width: '100%',
                          background: alpha(theme.palette.primary.main, 0.1),
                          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                        }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Chip
                        icon={<EventIcon />}
                        label={`${group.eventsCount} رویداد`}
                        size="small"
                        sx={{ 
                          width: '100%',
                          background: alpha(theme.palette.secondary.main, 0.1),
                          border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`,
                        }}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
                
                <CardActions 
                  sx={{ 
                    justifyContent: 'flex-end',
                    background: alpha(theme.palette.background.paper, 0.5),
                    backdropFilter: 'blur(5px)',
                    borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    p: 1,
                  }}
                  className="card-actions"
                >
                  <IconButton 
                    size="small" 
                    onClick={() => console.log('نمایش جزئیات')}
                    sx={{ 
                      color: theme.palette.info.main,
                      background: alpha(theme.palette.info.main, 0.1),
                      '&:hover': { background: alpha(theme.palette.info.main, 0.2) }
                    }}
                  >
                    <VisibilityIcon fontSize="small" />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    onClick={() => handleOpenDialog(group)}
                    sx={{ 
                      color: theme.palette.warning.main,
                      background: alpha(theme.palette.warning.main, 0.1),
                      '&:hover': { background: alpha(theme.palette.warning.main, 0.2) }
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton 
                    size="small"
                    onClick={() => console.log('حذف گروه')}
                    sx={{ 
                      color: theme.palette.error.main,
                      background: alpha(theme.palette.error.main, 0.1),
                      '&:hover': { background: alpha(theme.palette.error.main, 0.2) }
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </CardActions>
                
                <Box 
                  sx={{ 
                    px: 2, 
                    py: 1, 
                    borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: alpha(theme.palette.background.paper, 0.3),
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    آخرین فعالیت: {group.lastActivity}
                  </Typography>
                  <IconButton size="small">
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Card>
            </Grid>
          </Grow>
        ))}
      </Grid>
      
      {/* دیالوگ ایجاد/ویرایش گروه */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
        TransitionComponent={Fade}
        transitionDuration={400}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            background: alpha(theme.palette.background.paper, 0.9),
            backdropFilter: 'blur(10px)',
            boxShadow: `0 10px 40px ${alpha('#000', 0.2)}`,
          }
        }}
      >
        <DialogTitle sx={{ 
          background: `linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.1)})`,
          backdropFilter: 'blur(5px)',
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          {selectedGroup ? <EditIcon color="warning" /> : <AddIcon color="primary" />}
          <Typography fontWeight="bold">
            {selectedGroup ? 'ویرایش گروه' : 'ایجاد گروه جدید'}
          </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="عنوان گروه"
                variant="outlined"
                defaultValue={selectedGroup?.title || ''}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    background: alpha(theme.palette.background.paper, 0.5),
                    backdropFilter: 'blur(5px)',
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.main,
                      borderWidth: '2px'
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="توضیحات"
                variant="outlined"
                multiline
                rows={4}
                defaultValue={selectedGroup?.description || ''}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    background: alpha(theme.palette.background.paper, 0.5),
                    backdropFilter: 'blur(5px)',
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.main,
                      borderWidth: '2px'
                    }
                  }
                }}
              />
            </Grid>
            {/* بخش انتخاب رنگ را اینجا اضافه کنید */}
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ 
          p: 2, 
          background: alpha(theme.palette.background.paper, 0.8),
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}>
          <Button 
            onClick={handleCloseDialog}
            variant="outlined"
            sx={{ 
              borderRadius: '8px',
              borderColor: alpha(theme.palette.primary.main, 0.5),
              '&:hover': {
                borderColor: theme.palette.primary.main,
                background: alpha(theme.palette.primary.main, 0.1)
              }
            }}
          >
            انصراف
          </Button>
          <Button 
            onClick={handleCloseDialog}
            variant="contained"
            sx={{
              borderRadius: '8px',
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
              '&:hover': {
                background: `linear-gradient(90deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.4)}`,
              }
            }}
          >
            {selectedGroup ? 'ذخیره تغییرات' : 'ایجاد گروه'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GroupsPage;