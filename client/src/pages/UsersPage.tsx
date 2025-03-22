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
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../contexts/NotificationContext';
import { User, CreateUserInput, UpdateUserInput } from '../types/user';
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
  const { user: currentUser } = useAuth();
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
      email: user.email,
      phone: user.phone,
      isActive: user.isActive,
      role: user.role,
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
          avatar: userInput.avatar, // ارسال مسیر آواتار جدید به سرور
        };

        if (userInput.password) {
          updateData.password = userInput.password;
        }

        const updatedUser = await userService.updateUser(selectedUser.id, updateData);

        // به‌روزرسانی لیست کاربران و کاربر انتخاب شده با آواتار جدید بعد از دریافت پاسخ موفقیت‌آمیز از سرور
        setUsers(prev => prev.map(user =>
          user.id === updatedUser.id ? { ...updatedUser, _avatarUpdated: Date.now() } : user
        ));
        setSelectedUser(updatedUser); // کاربر انتخاب شده را نیز به‌روزرسانی کنید

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

      <Dialog open={dialogState.isOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {dialogState.mode === 'create' ? 'ایجاد کاربر جدید' : 'ویرایش کاربر'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
              <AvatarUploader
                currentAvatar={userInput.avatar}
                onAvatarChange={handleAvatarChange}
                userId={selectedUser?.id}
                size={120}
              />
            </Box>
            
            <TextField
              margin="dense"
              required
              fullWidth
              label="نام کاربری"
              name="username"
              value={userInput.username}
              onChange={handleTextFieldChange}
              disabled={dialogState.mode === 'edit'}
            />
            
            <TextField
              margin="dense"
              required={dialogState.mode === 'create'}
              fullWidth
              label="رمز عبور"
              name="password"
              type="password"
              value={userInput.password}
              onChange={handleTextFieldChange}
              helperText={dialogState.mode === 'edit' ? 'در صورت عدم تغییر، خالی بگذارید' : ''}
            />
            
            <TextField
              margin="dense"
              required
              fullWidth
              label="نام و نام خانوادگی"
              name="fullName"
              value={userInput.fullName}
              onChange={handleTextFieldChange}
            />
            
            <TextField
              margin="dense"
              fullWidth
              label="ایمیل"
              name="email"
              type="email"
              value={userInput.email}
              onChange={handleTextFieldChange}
            />
            
            <TextField
              margin="dense"
              fullWidth
              label="شماره تماس"
              name="phone"
              value={userInput.phone}
              onChange={handleTextFieldChange}
              helperText="اعداد فارسی به انگلیسی تبدیل می‌شوند"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>انصراف</Button>
            <Button type="submit" variant="contained" color="primary">
              {dialogState.mode === 'create' ? 'ایجاد' : 'ذخیره تغییرات'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default UsersPage;