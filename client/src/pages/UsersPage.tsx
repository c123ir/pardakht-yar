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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { User, Role, CreateUserInput, UpdateUserInput } from '../types/user.types';
import userService from '../services/userService';
import { useAuth } from '../hooks/useAuth';

const UsersPage: React.FC = () => {
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

  // بارگذاری لیست کاربران
  useEffect(() => {
    fetchUsers();
  }, []);

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
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setUserInput((prev) => ({
      ...prev,
      [name as string]: value,
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
                <TableCell>نام کاربری</TableCell>
                <TableCell>نام کامل</TableCell>
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
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.fullName}</TableCell>
                    <TableCell>{user.email || '-'}</TableCell>
                    <TableCell>{user.phone || '-'}</TableCell>
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
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleConfirmDelete(user.id)}
                        size="small"
                        disabled={user.id === currentUser?.id} // نمی‌توان کاربر جاری را حذف کرد
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
            {dialogMode === 'create' && (
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="نام کاربری"
                name="username"
                autoComplete="username"
                autoFocus
                value={userInput.username || ''}
                onChange={handleInputChange}
              />
            )}
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="fullName"
              label="نام کامل"
              name="fullName"
              value={userInput.fullName || ''}
              onChange={handleInputChange}
            />
            
            <TextField
              margin="normal"
              fullWidth
              id="email"
              label="ایمیل"
              name="email"
              type="email"
              autoComplete="email"
              value={userInput.email || ''}
              onChange={handleInputChange}
            />
            
            <TextField
              margin="normal"
              fullWidth
              id="phone"
              label="شماره موبایل"
              name="phone"
              value={userInput.phone || ''}
              onChange={handleInputChange}
            />
            
            <TextField
              margin="normal"
              fullWidth
              id="password"
              label={dialogMode === 'create' ? 'رمز عبور' : 'رمز عبور جدید (اختیاری)'}
              name="password"
              type="password"
              autoComplete="new-password"
              required={dialogMode === 'create'}
              value={userInput.password || ''}
              onChange={handleInputChange}
            />
            
            <FormControl fullWidth margin="normal">
              <InputLabel id="role-label">نقش کاربر</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                name="role"
                value={userInput.role || 'ADMIN'}
                label="نقش کاربر"
                onChange={handleInputChange}
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
                  checked={userInput.isActive === undefined ? true : userInput.isActive}
                  onChange={handleActiveChange}
                  name="isActive"
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