// client/src/pages/UsersPage.tsx
// صفحه مدیریت کاربران

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  CircularProgress,
  Snackbar,
  Alert,
  Avatar,
  useTheme,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { User, Role, CreateUserInput, UpdateUserInput } from '../types/user.types';
import userService from '../services/userService';
import { useAuth } from '../hooks/useAuth';
import { SelectChangeEvent } from '@mui/material/Select';
import { convertPersianToEnglishNumbers } from '../utils/stringUtils';
import AvatarUploader from '../components/avatar/AvatarUploader';
import { useImages } from '../contexts/ImageContext';
import UserAvatar from '../components/common/UserAvatar';

const UsersPage: React.FC = () => {
  const theme = useTheme();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userInput, setUserInput] = useState<CreateUserInput | UpdateUserInput>({
    username: '',
    password: '',
    fullName: '',
    email: '',
    phone: '',
    role: 'ADMIN',
    isActive: true,
  });
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [toast, setToast] = useState<{ open: boolean; message: string; type: 'success' | 'error' }>({
    open: false,
    message: '',
    type: 'success',
  });
  const { getImageUrl } = useImages();
  const [avatarRefreshKey, setAvatarRefreshKey] = useState(0);

  // بارگذاری لیست کاربران
  useEffect(() => {
    fetchUsers();
  }, []);
  
  // رفرش تصویر آواتار هنگام باز شدن دیالوگ ویرایش
  useEffect(() => {
    if (openDialog && dialogMode === 'edit') {
      setAvatarRefreshKey(prev => prev + 1);
    }
  }, [openDialog, dialogMode]);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getUsers();
      setUsers(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // باز کردن دیالوگ ایجاد کاربر جدید
  const handleOpenCreateDialog = () => {
    setUserInput({
      username: '',
      password: '',
      fullName: '',
      email: '',
      phone: '',
      role: 'ADMIN',
      isActive: true,
    });
    setDialogMode('create');
    setOpenDialog(true);
  };

  // باز کردن دیالوگ ویرایش کاربر
  const handleOpenEditDialog = (user: User) => {
    setSelectedUser(user);
    setUserInput({
      fullName: user.fullName,
      email: user.email || '',
      phone: user.phone || '',
      role: user.role,
      isActive: user.isActive,
      password: '', // رمز عبور خالی - فقط در صورت تغییر پر می‌شود
    });
    setDialogMode('edit');
    setOpenDialog(true);
  };

  // بستن دیالوگ
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // تغییر مقادیر فرم
  const handleTextFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    // تبدیل اعداد فارسی به انگلیسی برای شماره موبایل
    if (name === 'phone') {
      const convertedValue = convertPersianToEnglishNumbers(value);
      setUserInput((prev) => ({
        ...prev,
        [name]: convertedValue,
      }));
    } else {
      setUserInput((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setUserInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // تغییر وضعیت فعال/غیرفعال
  const handleActiveChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput((prev) => ({
      ...prev,
      isActive: e.target.checked,
    }));
  };

  // ثبت فرم
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (dialogMode === 'create') {
        const newUser = await userService.createUser(userInput as CreateUserInput);
        setUsers((prev) => [...prev, newUser]);
        setToast({
          open: true,
          message: 'کاربر با موفقیت ایجاد شد',
          type: 'success',
        });
      } else if (dialogMode === 'edit' && selectedUser) {
        // اگر رمز عبور خالی باشد، از درخواست حذف می‌شود
        const userDataToUpdate = { ...userInput };
        if (!userDataToUpdate.password) {
          delete userDataToUpdate.password;
        }
        
        const updatedUser = await userService.updateUser(selectedUser.id, userDataToUpdate);
        setUsers((prev) =>
          prev.map((u) => (u.id === selectedUser.id ? { ...u, ...updatedUser } : u))
        );
        setToast({
          open: true,
          message: 'کاربر با موفقیت به‌روزرسانی شد',
          type: 'success',
        });
      }
      
      handleCloseDialog();
    } catch (err) {
      setToast({
        open: true,
        message: (err as Error).message,
        type: 'error',
      });
    }
  };

  // تایید حذف کاربر
  const handleConfirmDelete = (userId: number) => {
    setConfirmDelete(userId);
  };

  // حذف کاربر
  const handleDeleteUser = async () => {
    if (confirmDelete) {
      try {
        await userService.deleteUser(confirmDelete);
        setUsers((prev) => prev.filter((u) => u.id !== confirmDelete));
        setToast({
          open: true,
          message: 'کاربر با موفقیت حذف شد',
          type: 'success',
        });
      } catch (err) {
        setToast({
          open: true,
          message: (err as Error).message,
          type: 'error',
        });
      } finally {
        setConfirmDelete(null);
      }
    }
  };

  // ترجمه نقش کاربر به فارسی
  const getRoleName = (role: Role): string => {
    switch (role) {
      case 'ADMIN':
        return 'مدیر سیستم';
      case 'FINANCIAL_MANAGER':
        return 'مدیر مالی';
      case 'ACCOUNTANT':
        return 'حسابدار';
      case 'SELLER':
        return 'فروشنده';
      case 'CEO':
        return 'مدیرعامل';
      case 'PROCUREMENT':
        return 'کارپرداز';
      default:
        return 'نامشخص';
    }
  };

  // تغییر آواتار کاربر
  const handleAvatarChange = async (avatarPath: string) => {
    // به‌روزرسانی state فرم
    setUserInput((prev) => ({
      ...prev,
      avatar: avatarPath,
    }));

    // اگر در حالت ویرایش هستیم و کاربری انتخاب شده است
    if (dialogMode === 'edit' && selectedUser) {
      try {
        // به‌روزرسانی فوری اطلاعات کاربر در سرور
        const userDataToUpdate = { avatar: avatarPath };
        const updatedUser = await userService.updateUser(selectedUser.id, userDataToUpdate);
        
        // به‌روزرسانی لیست کاربران
        setUsers((prev) =>
          prev.map((u) => (u.id === selectedUser.id ? { ...u, ...updatedUser } : u))
        );
        
        // رفرش تصاویر آواتار
        setAvatarRefreshKey(prev => prev + 1);
        
        // به‌روزرسانی اطلاعات کاربر انتخاب شده
        setSelectedUser(prev => prev ? { ...prev, avatar: avatarPath } : null);
        
        // تاخیر کوتاه برای اطمینان از به‌روزرسانی UI
        setTimeout(() => {
          // نمایش پیام موفقیت
          setToast({
            open: true,
            message: 'تصویر کاربر با موفقیت به‌روزرسانی شد',
            type: 'success',
          });
        }, 500);
      } catch (err) {
        console.error('خطا در به‌روزرسانی آواتار:', err);
        setToast({
          open: true,
          message: (err as Error).message,
          type: 'error',
        });
      }
    }
  };

  // اضافه کردن پارامتر refresh به URL آواتار
  const getAvatarUrl = (relativePath: string | null | undefined): string => {
    if (!relativePath) return '';
    return `${getImageUrl(relativePath)}?refresh=${avatarRefreshKey}&t=${new Date().getTime()}`;
  };

  return (
    <Box>
      {/* هدر صفحه */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          مدیریت کاربران
        </Typography>
        
   <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenCreateDialog}
        >
          ایجاد کاربر جدید
        </Button>
      </Box>
      
      {/* نمایش خطا */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {/* جدول کاربران */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>آواتار</TableCell>
                <TableCell>نام کاربری</TableCell>
                <TableCell>نام و نام خانوادگی</TableCell>
                <TableCell>ایمیل</TableCell>
                <TableCell>شماره موبایل</TableCell>
                <TableCell>نقش</TableCell>
                <TableCell>وضعیت</TableCell>
                <TableCell>عملیات</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <CircularProgress size={40} />
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
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <UserAvatar 
                          user={user}
                          size={40}
                          sx={{
                            bgcolor: 'primary.main',
                            color: 'primary.contrastText',
                          }}
                        />
                        <Box>
                          <Typography variant="body1" fontWeight="medium">
                            {user.fullName}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {user.username}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.fullName}</TableCell>
                    <TableCell>{user.email || '-'}</TableCell>
                    <TableCell dir="ltr" style={{ textAlign: 'right' }}>{user.phone || '-'}</TableCell>
                    <TableCell>{getRoleName(user.role)}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.isActive ? 'فعال' : 'غیرفعال'}
                        color={user.isActive ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenEditDialog(user)}
                        disabled={currentUser?.id === user.id}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleConfirmDelete(user.id)}
                        disabled={currentUser?.id === user.id}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      
      {/* دیالوگ ایجاد/ویرایش کاربر */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialogMode === 'create' ? 'ایجاد کاربر جدید' : 'ویرایش کاربر'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            {/* استفاده از کامپوننت AvatarUploader به جای کد قبلی */}
            <AvatarUploader
              currentAvatar={userInput.avatar}
              onAvatarChange={handleAvatarChange}
              size={120}
            />
            
            {/* ادامه فرم موجود */}
            <TextField
              margin="dense"
              required
              fullWidth
              label="نام کاربری"
              name="username"
              value={userInput.username || ''}
              onChange={handleTextFieldChange}
              disabled={dialogMode === 'edit'}
            />
            
            <TextField
              margin="dense"
              required={dialogMode === 'create'}
              fullWidth
              label="رمز عبور"
              name="password"
              type="password"
              value={userInput.password || ''}
              onChange={handleTextFieldChange}
              helperText={dialogMode === 'edit' ? 'در صورت عدم تغییر، خالی بگذارید' : ''}
            />
            
            <TextField
              margin="dense"
              required
              fullWidth
              label="نام و نام خانوادگی"
              name="fullName"
              value={userInput.fullName || ''}
              onChange={handleTextFieldChange}
            />
            
            <TextField
              margin="dense"
              fullWidth
              label="ایمیل"
              name="email"
              type="email"
              value={userInput.email || ''}
              onChange={handleTextFieldChange}
            />
            
            <TextField
              margin="dense"
              fullWidth
              label="شماره موبایل"
              name="phone"
              value={userInput.phone || ''}
              onChange={handleTextFieldChange}
              helperText="اعداد فارسی به انگلیسی تبدیل می‌شوند"
              inputProps={{ 
                dir: "ltr",
                style: { textAlign: 'right' }
              }}
            />
            
            <FormControl fullWidth margin="dense">
              <InputLabel>نقش کاربری</InputLabel>
              <Select
                name="role"
                value={userInput.role || 'ADMIN'}
                onChange={handleSelectChange}
              >
                <MenuItem value="ADMIN">مدیر سیستم</MenuItem>
                <MenuItem value="FINANCIAL_MANAGER">مدیر مالی</MenuItem>
                <MenuItem value="ACCOUNTANT">حسابدار</MenuItem>
                <MenuItem value="SELLER">فروشنده</MenuItem>
                <MenuItem value="CEO">مدیرعامل</MenuItem>
                <MenuItem value="PROCUREMENT">کارپرداز</MenuItem>
              </Select>
            </FormControl>
            
            <FormControlLabel
              control={
                <Switch
                  checked={userInput.isActive !== undefined ? userInput.isActive : true}
                  onChange={handleActiveChange}
                  color="primary"
                />
              }
              label="کاربر فعال است"
              sx={{ mt: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>انصراف</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            ذخیره
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* دیالوگ تایید حذف */}
      <Dialog
        open={confirmDelete !== null}
        onClose={() => setConfirmDelete(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>تایید حذف کاربر</DialogTitle>
        <DialogContent>
          <Typography>
            آیا از حذف این کاربر اطمینان دارید؟
            این عملیات غیرقابل بازگشت است.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(null)}>انصراف</Button>
          <Button onClick={handleDeleteUser} variant="contained" color="error">
            حذف
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* نمایش پیام‌ها */}
      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={() => setToast({ ...toast, open: false })}
      >
        <Alert
          onClose={() => setToast({ ...toast, open: false })}
          severity={toast.type}
          sx={{ width: '100%' }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UsersPage;