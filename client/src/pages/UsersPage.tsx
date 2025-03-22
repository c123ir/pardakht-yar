// client/src/pages/UsersPage.tsx
// صفحه مدیریت کاربران

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Grid,
  InputAdornment,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { Edit as EditIcon, Close as CloseIcon, Add as AddIcon, Save as SaveIcon, Person as PersonIcon, Lock as LockIcon, Badge as BadgeIcon, Email as EmailIcon, Phone as PhoneIcon, AdminPanelSettings as AdminPanelSettingsIcon, Circle as CircleIcon } from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../contexts/NotificationContext';
import { User, CreateUserInput, UpdateUserInput, UserRole } from '../types/user';
import userService from '../services/userService';
import { convertPersianToEnglishNumbers } from '../utils/numbers';
import UserAvatar from '../components/common/UserAvatar';
import AvatarUploader from '../components/avatar/AvatarUploader';

interface DialogState {
  isOpen: boolean;
  mode: 'create' | 'edit';
}

const initialUserInput: CreateUserInput = {
  username: '',
  password: '',
  fullName: '',
  email: '',
  phone: '',
  isActive: true,
  role: 'USER',
};

const UsersPage: React.FC = () => {
  const { user: currentUser, updateUserDetails } = useAuth();
  const { showNotification } = useNotification();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [dialogState, setDialogState] = useState<DialogState>({
    isOpen: false,
    mode: 'create'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userInput, setUserInput] = useState<CreateUserInput>(initialUserInput);
  const [forceAvatarRefresh, setForceAvatarRefresh] = useState(0);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedUsers = await userService.getUsers();
      setUsers(fetchedUsers);
    } catch (err) {
      setError((err as Error).message);
      showNotification({
        message: 'خطا در دریافت لیست کاربران',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCreateDialog = () => {
    setUserInput(initialUserInput);
    setDialogState({ isOpen: true, mode: 'create' });
  };

  const handleOpenEditDialog = (user: User) => {
    setSelectedUser(user);
    setUserInput({
      username: user.username,
      password: '',
      fullName: user.fullName,
      email: user.email || '',
      phone: user.phone || '',
      isActive: user.isActive,
      role: user.role as UserRole,
      avatar: user.avatar,
    });
    setDialogState({ isOpen: true, mode: 'edit' });
  };

  const handleCloseDialog = () => {
    setDialogState({ isOpen: false, mode: 'create' });
    setSelectedUser(null);
    setUserInput(initialUserInput);
  };

  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      const convertedValue = convertPersianToEnglishNumbers(value);
      setUserInput(prev => ({
        ...prev,
        [name]: convertedValue,
      }));
    } else {
      setUserInput(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // تغییر آواتار کاربر
  const handleAvatarChange = (avatarPath: string) => {
    console.log('دریافت مسیر آواتار جدید در UsersPage:', avatarPath);

    // فقط state فرم را به‌روزرسانی کنید
    setUserInput(prev => ({
      ...prev,
      avatar: avatarPath,
    }));

    // حذف به‌روزرسانی مستقیم users و selectedUser از اینجا
    // if (dialogState.mode === 'edit' && selectedUser) {
    //   // به‌روزرسانی لیست کاربران در UI با ایجاد مرجع جدید برای هر آبجکت
    //   setUsers(prev => {
    //     return prev.map(u => {
    //       if (u.id === selectedUser.id) {
    //         // ایجاد یک آبجکت کاملاً جدید
    //         return { ...u, avatar: avatarPath, _avatarUpdated: Date.now() };
    //       }
    //       return u;
    //     });
    //   });

    //   // به‌روزرسانی اطلاعات کاربر انتخاب شده با ایجاد مرجع جدید
    //   setSelectedUser(prev => {
    //     if (!prev) return null;
    //     return { ...prev, avatar: avatarPath, _avatarUpdated: Date.now() };
    //   });

    //   // افزایش شمارنده رفرش آواتار برای مجبور کردن همه آواتارها به بارگذاری مجدد
    //   setForceAvatarRefresh(prev => prev + 1);

    //   setUsers(prev => [...prev]); // رفرش فوری لیست کاربران
    //   setForceAvatarRefresh(prev => prev + 1); // افزایش فوری شمارنده رفرش آواتار

    //   showNotification({
    //     message: 'تصویر کاربر با موفقیت به‌روزرسانی شد',
    //     type: 'success',
    //   });
    // }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (dialogState.mode === 'create') {
        const newUser = await userService.createUser(userInput);
        setUsers(prev => [...prev, newUser]);
        showNotification({
          message: 'کاربر با موفقیت ایجاد شد',
          type: 'success',
        });
      } else if (dialogState.mode === 'edit' && selectedUser) {
        const updateData: UpdateUserInput = {
          fullName: userInput.fullName,
          email: userInput.email,
          phone: userInput.phone,
          isActive: userInput.isActive,
          avatar: userInput.avatar || selectedUser.avatar,
          role: userInput.role as UserRole,
        };

        if (userInput.password) {
          updateData.password = userInput.password;
        }

        const updatedUser = await userService.updateUser(selectedUser.id, updateData);
        
        // اضافه کردن _avatarUpdated برای اجبار به رندر مجدد
        const userWithTimestamp = { 
          ...updatedUser, 
          _avatarUpdated: Date.now() 
        };
        
        // به‌روزرسانی لیست کاربران
        setUsers(prev => prev.map(user =>
          user.id === updatedUser.id ? userWithTimestamp : user
        ));
        
        // اگر کاربر جاری به‌روزرسانی شده، در AuthContext نیز به‌روزرسانی کنیم
        if (currentUser?.id && currentUser.id.toString() === selectedUser.id.toString()) {
          console.log('Updating current user details:', userWithTimestamp);
          
          // ایجاد یک کپی از کاربر جاری با اطلاعات جدید
          const updatedCurrentUser = {
            ...currentUser,
            fullName: updatedUser.fullName,
            email: updatedUser.email,
            phone: updatedUser.phone,
            isActive: updatedUser.isActive,
            role: updatedUser.role,
            avatar: updatedUser.avatar,
            _avatarUpdated: Date.now()
          };
          
          // ذخیره مستقیم در localStorage برای اطمینان
          localStorage.setItem('user', JSON.stringify(updatedCurrentUser));
          
          // به‌روزرسانی کاربر در AuthContext
          updateUserDetails(updatedCurrentUser);
          
          // اجبار به به‌روزرسانی UI
          setForceAvatarRefresh(prev => prev + 1);
          
          // رفرش صفحه برای اطمینان از به‌روزرسانی کامل (اختیاری - در صورت نیاز)
          // window.location.reload();
        }

        showNotification({
          message: 'اطلاعات کاربر با موفقیت به‌روزرسانی شد',
          type: 'success',
        });
      }
      handleCloseDialog();
    } catch (error) {
      showNotification({
        message: (error as Error).message || 'خطا در ذخیره اطلاعات کاربر',
        type: 'error',
      });
    }
  };

  return (
    <Box>
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5" component="h2">
              مدیریت کاربران
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenCreateDialog}
            >
              کاربر جدید
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>آواتار</TableCell>
                  <TableCell>نام کاربری</TableCell>
                  <TableCell>نام و نام خانوادگی</TableCell>
                  <TableCell>ایمیل</TableCell>
                  <TableCell>شماره تماس</TableCell>
                  <TableCell>وضعیت</TableCell>
                  <TableCell>عملیات</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      در حال بارگذاری...
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" color="error">
                      {error}
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      کاربری یافت نشد
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <UserAvatar
                          avatar={user.avatar}
                          name={user.fullName}
                          size={40}
                          key={`${user.id}-${user._avatarUpdated || ''}-${forceAvatarRefresh}`}
                          forceRefresh={true}
                        />
                      </TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.fullName}</TableCell>
                      <TableCell>{user.email || '-'}</TableCell>
                      <TableCell dir="ltr" style={{ textAlign: 'right' }}>{user.phone || '-'}</TableCell>
                      <TableCell>{user.isActive ? 'فعال' : 'غیرفعال'}</TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleOpenEditDialog(user)}
                          disabled={currentUser?.id ? String(currentUser.id) === user.id : false}
                        >
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog 
        open={dialogState.isOpen} 
        onClose={handleCloseDialog} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
          }
        }}
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle sx={{ 
            borderBottom: '1px solid rgba(0, 0, 0, 0.08)', 
            pb: 2,
            bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
          }}>
            <Typography variant="h6" component="div">
              {dialogState.mode === 'create' ? 'ایجاد کاربر جدید' : 'ویرایش کاربر'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {dialogState.mode === 'create' 
                ? 'لطفاً اطلاعات کاربر جدید را وارد کنید'
                : 'می‌توانید اطلاعات کاربر را ویرایش کنید'}
            </Typography>
          </DialogTitle>
          
          <DialogContent dividers sx={{ p: 3 }}>
            {/* بخش آواتار */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              mb: 3, 
              p: 2, 
              bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
              borderRadius: 2,
            }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, alignSelf: 'flex-start' }}>
                تصویر پروفایل
              </Typography>
              <AvatarUploader
                currentAvatar={userInput.avatar}
                onAvatarChange={handleAvatarChange}
                userId={selectedUser?.id}
                size={120}
              />
            </Box>
            
            {/* اطلاعات اصلی */}
            <Typography variant="subtitle2" color="primary" sx={{ mb: 1, mt: 1 }}>
              اطلاعات اصلی
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="نام کاربری"
                  name="username"
                  value={userInput.username}
                  onChange={handleTextFieldChange}
                  disabled={dialogState.mode === 'edit'}
                  variant="outlined"
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required={dialogState.mode === 'create'}
                  fullWidth
                  label="رمز عبور"
                  name="password"
                  type="password"
                  value={userInput.password}
                  onChange={handleTextFieldChange}
                  helperText={dialogState.mode === 'edit' ? 'در صورت عدم تغییر، خالی بگذارید' : ''}
                  variant="outlined"
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="نام و نام خانوادگی"
                  name="fullName"
                  value={userInput.fullName}
                  onChange={handleTextFieldChange}
                  variant="outlined"
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BadgeIcon fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
            
            {/* اطلاعات تماس */}
            <Typography variant="subtitle2" color="primary" sx={{ mb: 1, mt: 3 }}>
              اطلاعات تماس
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="ایمیل"
                  name="email"
                  type="email"
                  value={userInput.email}
                  onChange={handleTextFieldChange}
                  variant="outlined"
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="شماره تماس"
                  name="phone"
                  value={userInput.phone}
                  onChange={handleTextFieldChange}
                  helperText="اعداد فارسی به انگلیسی تبدیل می‌شوند"
                  variant="outlined"
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon fontSize="small" color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
            
            {/* تنظیمات دسترسی */}
            <Typography variant="subtitle2" color="primary" sx={{ mb: 1, mt: 3 }}>
              تنظیمات دسترسی
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel id="role-select-label">نقش کاربر</InputLabel>
                  <Select
                    labelId="role-select-label"
                    id="role-select"
                    name="role"
                    value={userInput.role}
                    label="نقش کاربر"
                    onChange={(e) => setUserInput(prev => ({ ...prev, role: e.target.value as 'ADMIN' | 'USER' }))}
                    startAdornment={
                      <InputAdornment position="start">
                        <AdminPanelSettingsIcon fontSize="small" color="action" />
                      </InputAdornment>
                    }
                  >
                    <MenuItem value="ADMIN">
                      <ListItemIcon>
                        <AdminPanelSettingsIcon fontSize="small" color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="مدیر" />
                    </MenuItem>
                    <MenuItem value="USER">
                      <ListItemIcon>
                        <PersonIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="کاربر عادی" />
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl
                  component="fieldset"
                  variant="outlined"
                  sx={{ 
                    p: 1, 
                    border: '1px solid rgba(0, 0, 0, 0.23)', 
                    borderRadius: 1, 
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <FormControlLabel
                    control={
                      <Switch
                        checked={userInput.isActive}
                        onChange={(e) => setUserInput(prev => ({ ...prev, isActive: e.target.checked }))}
                        name="isActive"
                        color="primary"
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CircleIcon 
                          fontSize="small" 
                          sx={{ 
                            mr: 1, 
                            color: userInput.isActive ? 'success.main' : 'text.disabled',
                            fontSize: 12
                          }} 
                        />
                        <Typography variant="body2">
                          {userInput.isActive ? 'کاربر فعال است' : 'کاربر غیرفعال است'}
                        </Typography>
                      </Box>
                    }
                  />
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          
          <DialogActions sx={{ px: 3, py: 2, bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)' }}>
            <Button 
              onClick={handleCloseDialog} 
              variant="outlined" 
              color="inherit"
              startIcon={<CloseIcon />}
            >
              انصراف
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              startIcon={dialogState.mode === 'create' ? <AddIcon /> : <SaveIcon />}
            >
              {dialogState.mode === 'create' ? 'ایجاد کاربر' : 'ذخیره تغییرات'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default UsersPage;