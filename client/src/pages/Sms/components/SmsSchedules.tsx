import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SendIcon from '@mui/icons-material/Send';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFnsJalali } from '@mui/x-date-pickers/AdapterDateFnsJalali';
import { SmsSchedule } from '../types';
import { formatDate } from '../utils';

/**
 * کامپوننت مدیریت زمان‌بندی‌های پیامک
 */
const SmsSchedules: React.FC = () => {
  const [schedules, setSchedules] = useState<SmsSchedule[]>([
    {
      id: '1',
      title: 'تبریک تولد مشتریان',
      message: 'مشتری گرامی {name}، تولد شما را تبریک می‌گوییم. کد تخفیف {code} برای خرید بعدی شما فعال شد.',
      recipients: ['09121234567', '09351234567', '09331234567'],
      recipientCount: 45,
      scheduleTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'اطلاع‌رسانی تعطیلات',
      message: 'مشتری گرامی، به اطلاع می‌رساند فروشگاه ما در تاریخ ۱۴ و ۱۵ فروردین تعطیل می‌باشد.',
      recipients: [],
      recipientCount: 210,
      scheduleTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      title: 'یادآوری رویداد هفته آینده',
      message: 'یادآوری: رویداد معرفی محصولات جدید شرکت، ساعت ۱۰ صبح روز پنج‌شنبه هفته آینده برگزار می‌گردد.',
      recipients: [],
      recipientCount: 78,
      scheduleTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'completed',
      createdAt: new Date().toISOString(),
    },
  ]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  
  // وضعیت دیالوگ
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [editingSchedule, setEditingSchedule] = useState<SmsSchedule | null>(null);
  const [formErrors, setFormErrors] = useState<{
    title?: string;
    message?: string;
    scheduleTime?: string;
  }>({});
  
  // مدیریت باز و بسته کردن دیالوگ
  const handleOpenDialog = (schedule?: SmsSchedule) => {
    if (schedule) {
      setEditingSchedule(schedule);
    } else {
      setEditingSchedule({
        id: '',
        title: '',
        message: '',
        recipients: [],
        recipientCount: 0,
        scheduleTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        createdAt: new Date().toISOString(),
      });
    }
    setOpenDialog(true);
    setFormErrors({});
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingSchedule(null);
  };
  
  // ذخیره برنامه زمان‌بندی جدید یا ویرایش‌شده
  const handleSaveSchedule = () => {
    if (!editingSchedule) return;
    
    // اعتبارسنجی فرم
    const errors: {
      title?: string;
      message?: string;
      scheduleTime?: string;
    } = {};
    
    if (!editingSchedule.title.trim()) {
      errors.title = 'عنوان الزامی است';
    }
    
    if (!editingSchedule.message.trim()) {
      errors.message = 'متن پیامک الزامی است';
    }
    
    const scheduleDate = new Date(editingSchedule.scheduleTime);
    if (isNaN(scheduleDate.getTime()) || scheduleDate <= new Date()) {
      errors.scheduleTime = 'زمان ارسال باید در آینده باشد';
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setLoading(true);
    
    // در حالت واقعی، اینجا API call خواهد بود
    setTimeout(() => {
      if (editingSchedule.id) {
        // ویرایش برنامه زمان‌بندی موجود
        setSchedules(schedules.map(s => 
          s.id === editingSchedule.id ? { ...editingSchedule } : s
        ));
      } else {
        // ایجاد برنامه زمان‌بندی جدید
        const newSchedule = {
          ...editingSchedule,
          id: Math.random().toString(36).substring(2, 9),
          recipientCount: Math.floor(Math.random() * 100) + 20, // مقدار نمونه
        };
        setSchedules([...schedules, newSchedule]);
      }
      
      setLoading(false);
      handleCloseDialog();
    }, 500);
  };
  
  // حذف برنامه زمان‌بندی
  const handleDeleteSchedule = (id: string) => {
    if (window.confirm('آیا از حذف این برنامه زمان‌بندی اطمینان دارید؟')) {
      setLoading(true);
      
      // در حالت واقعی، اینجا API call خواهد بود
      setTimeout(() => {
        setSchedules(schedules.filter(s => s.id !== id));
        setLoading(false);
      }, 500);
    }
  };
  
  // تغییر وضعیت برنامه زمان‌بندی (فعال/غیرفعال)
  const handleToggleStatus = (id: string, currentStatus: string) => {
    setLoading(true);
    
    // در حالت واقعی، اینجا API call خواهد بود
    setTimeout(() => {
      setSchedules(schedules.map(s => 
        s.id === id 
          ? { ...s, status: currentStatus === 'active' ? 'paused' : 'active' } 
          : s
      ));
      setLoading(false);
    }, 500);
  };
  
  // تغییر مقدار فیلدهای فرم
  const handleInputChange = (field: keyof SmsSchedule, value: any) => {
    if (!editingSchedule) return;
    
    setEditingSchedule({ ...editingSchedule, [field]: value });
    
    // پاک کردن خطای مرتبط در صورت وجود
    if (formErrors[field as keyof typeof formErrors]) {
      setFormErrors({ ...formErrors, [field]: undefined });
    }
  };
  
  // تغییر صفحه
  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };
  
  // تغییر تعداد ردیف در صفحه
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };
  
  // نمایش وضعیت به صورت فارسی
  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'فعال';
      case 'paused':
        return 'متوقف';
      case 'completed':
        return 'انجام شده';
      case 'failed':
        return 'ناموفق';
      default:
        return 'نامشخص';
    }
  };
  
  // نمایش رنگ وضعیت
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'primary';
      case 'paused':
        return 'warning';
      case 'completed':
        return 'success';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };
  
  return (
    <Card variant="outlined">
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" component="h2">
            ارسال‌های زمان‌بندی شده
          </Typography>
          
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            ارسال جدید
          </Button>
        </Box>
        
        {loading && schedules.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>عنوان</TableCell>
                    <TableCell>زمان ارسال</TableCell>
                    <TableCell>تعداد گیرندگان</TableCell>
                    <TableCell>وضعیت</TableCell>
                    <TableCell>عملیات</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {schedules.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        هیچ ارسال زمان‌بندی شده‌ای وجود ندارد
                      </TableCell>
                    </TableRow>
                  ) : (
                    schedules.map((schedule) => (
                      <TableRow key={schedule.id} hover>
                        <TableCell>
                          <Typography variant="body2" noWrap>
                            {schedule.title}
                          </Typography>
                        </TableCell>
                        <TableCell>{formatDate(schedule.scheduleTime)}</TableCell>
                        <TableCell>{schedule.recipientCount}</TableCell>
                        <TableCell>
                          <Chip 
                            label={getStatusText(schedule.status)} 
                            color={getStatusColor(schedule.status) as any}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex' }}>
                            {schedule.status !== 'completed' && schedule.status !== 'failed' && (
                              <Tooltip title={schedule.status === 'active' ? 'توقف' : 'فعال‌سازی'}>
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleToggleStatus(schedule.id, schedule.status)}
                                >
                                  <MoreVertIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                            
                            <Tooltip title="ویرایش">
                              <IconButton 
                                size="small" 
                                onClick={() => handleOpenDialog(schedule)}
                                disabled={schedule.status === 'completed' || schedule.status === 'failed'}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="حذف">
                              <IconButton 
                                size="small" 
                                color="error"
                                onClick={() => handleDeleteSchedule(schedule.id)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            
            <Divider sx={{ my: 2 }} />

            <TablePagination
              component="div"
              count={schedules.length}
              rowsPerPage={rowsPerPage}
              page={page - 1}
              onPageChange={(_, newPage) => handleChangePage(newPage + 1)}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="تعداد در صفحه:"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} از ${count}`}
            />
          </>
        )}
      </CardContent>
      
      {/* دیالوگ افزودن/ویرایش برنامه زمان‌بندی */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        fullWidth 
        maxWidth="md"
      >
        <DialogTitle>
          {editingSchedule?.id ? 'ویرایش ارسال زمان‌بندی شده' : 'ارسال زمان‌بندی شده جدید'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ my: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="عنوان ارسال"
                  fullWidth
                  value={editingSchedule?.title || ''}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  error={!!formErrors.title}
                  helperText={formErrors.title}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  label="متن پیامک"
                  fullWidth
                  multiline
                  rows={4}
                  value={editingSchedule?.message || ''}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  error={!!formErrors.message}
                  helperText={formErrors.message || 'از {نام‌متغیر} برای شخصی‌سازی استفاده کنید'}
                  sx={{ mb: 2 }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFnsJalali}>
                  <DateTimePicker
                    label="زمان ارسال"
                    value={editingSchedule ? new Date(editingSchedule.scheduleTime) : null}
                    onChange={(newValue) => {
                      if (newValue) {
                        handleInputChange('scheduleTime', newValue.toISOString());
                      }
                    }}
                    slotProps={{ 
                      textField: { 
                        fullWidth: true,
                        error: !!formErrors.scheduleTime,
                        helperText: formErrors.scheduleTime
                      } 
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="recipient-group-label">گروه مخاطبان</InputLabel>
                  <Select
                    labelId="recipient-group-label"
                    value="all"
                    label="گروه مخاطبان"
                  >
                    <MenuItem value="all">همه مخاطبان</MenuItem>
                    <MenuItem value="1">مشتریان ویژه</MenuItem>
                    <MenuItem value="2">کاربران جدید</MenuItem>
                    <MenuItem value="3">مشتریان غیرفعال</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            انصراف
          </Button>
          <Button 
            onClick={handleSaveSchedule}
            color="primary"
            variant="contained"
            disabled={loading}
            startIcon={<SendIcon />}
          >
            {loading ? <CircularProgress size={24} /> : 'ذخیره'}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default SmsSchedules; 