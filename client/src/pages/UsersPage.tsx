// client/src/pages/UsersPage.tsx
// صفحه مدیریت کاربران

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
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
  Chip,
  Divider,
  Fade,
  Zoom,
  Tooltip,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  PersonAdd as PersonAddIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Person as PersonIcon,
  Lock as LockIcon,
  Badge as BadgeIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  Add as AddIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  Circle as CircleIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../contexts/NotificationContext';
import { User, CreateUserInput, UpdateUserInput, UserRole } from '../types/user';
import userService from '../services/userService';
import { convertPersianToEnglishNumbers } from '../utils/numbers';
import UserAvatar from '../components/common/UserAvatar';
import AvatarUploader from '../components/avatar/AvatarUploader';
import CSSAnimation from '../components/common/CSSAnimation';

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
  const theme = useTheme();
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
  const [searchTerm, setSearchTerm] = useState('');
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
      isActive: user.isActive !== undefined ? user.isActive : true,
      role: user.role as UserRole,
      avatar: user.avatar,
    });
    setDialogState({ isOpen: true, mode: 'edit' });
  };

  const handleCloseDialog = () => {
    setDialogState({ isOpen: false, mode: 'create' });
    setSelectedUser(null);
    setUserInput(initialUserInput);
    setShowPassword(false);
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

  const handleSelectChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (name) {
      setUserInput(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setUserInput(prev => ({
      ...prev,
      [name]: checked,
    }));
  };

  // تغییر آواتار کاربر
  const handleAvatarChange = (avatarPath: string) => {
    console.log('دریافت مسیر آواتار جدید در UsersPage:', avatarPath);

    // فقط state فرم را به‌روزرسانی کنید
    setUserInput(prev => ({
      ...prev,
      avatar: avatarPath,
    }));
  };

  // تابع حذف آواتار کاربر
  const handleRemoveAvatar = () => {
    setUserInput(prev => ({
      ...prev,
      avatar: undefined
    }));
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
        
        const updatedUser = await userService.updateUser(selectedUser.id.toString(), updateData);
        
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

  const handleOpenDeleteDialog = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setUserToDelete(null);
    setDeleteDialogOpen(false);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      await userService.deleteUser(userToDelete.id.toString());
      // به‌روزرسانی لیست کاربران
      setUsers(prev => prev.filter(user => user.id !== userToDelete.id));
      
      showNotification({
        message: 'کاربر با موفقیت حذف شد',
        type: 'success',
      });
      
      handleCloseDeleteDialog();
    } catch (error) {
      showNotification({
        message: (error as Error).message || 'خطا در حذف کاربر',
        type: 'error',
      });
    }
  };

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.phone && user.phone.includes(searchTerm))
  );

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <Card 
        sx={{
          borderRadius: 2,
          boxShadow: 2,
          overflow: 'hidden'
        }}
      >
        {/* هدر با عنوان و دکمه افزودن کاربر */}
        <Box 
          display="flex" 
          justifyContent="space-between" 
          alignItems="center" 
          sx={{ 
            px: { xs: 2, sm: 3 }, 
            py: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
            bgcolor: theme => alpha(theme.palette.primary.main, 0.04)
          }}
        >
          <Typography variant="h6" component="h1" fontWeight="bold">
              مدیریت کاربران
            </Typography>
          
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenCreateDialog}
            startIcon={<PersonAddIcon />}
            size="small"
            sx={{ 
              borderRadius: 1,
              fontWeight: 'medium'
            }}
            >
              کاربر جدید
            </Button>
          </Box>

        {/* نوار جستجو */}
        <Box 
          sx={{ 
            px: { xs: 2, sm: 3 }, 
            py: 1.5, 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid',
            borderColor: 'divider',
            flexWrap: 'wrap',
            gap: 1
          }}
        >
          <TextField
            placeholder="جستجو در کاربران..."
            variant="outlined"
            size="small"
            sx={{ 
              maxWidth: { xs: '100%', sm: 300 },
              flexGrow: { xs: 1, sm: 0 }
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" color="action" />
                </InputAdornment>
              )
            }}
          />
          
          <Box display="flex" alignItems="center" gap={1}>
            <Chip 
              label={`${filteredUsers.length} کاربر`} 
              size="small" 
              color="primary"
              variant="outlined"
            />
            <Tooltip title="فیلتر کردن">
              <IconButton size="small" color="primary">
                <FilterListIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* جدول کاربران */}
        <TableContainer sx={{ maxHeight: { xs: 'calc(100vh - 220px)', sm: 'calc(100vh - 200px)' } }}>
          <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                <TableCell align="center" width={60}>آواتار</TableCell>
                  <TableCell>نام کاربری</TableCell>
                  <TableCell>نام و نام خانوادگی</TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>ایمیل</TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>شماره تماس</TableCell>
                <TableCell width={100} align="center">وضعیت</TableCell>
                <TableCell width={120} align="center">نقش</TableCell>
                <TableCell width={100} align="center">عملیات</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 5 }}>
                    <CircularProgress size={40} />
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                    <Typography color="error">{error}</Typography>
                    </TableCell>
                  </TableRow>
              ) : filteredUsers.length === 0 ? (
                  <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                    <Typography color="textSecondary">کاربری یافت نشد</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                filteredUsers.map((user) => (
                  <TableRow 
                    key={user.id}
                    hover
                    sx={{ 
                      '&:hover': { bgcolor: theme => alpha(theme.palette.primary.main, 0.04) },
                    }}
                  >
                    <TableCell align="center">
                      <UserAvatar
                        avatar={user.avatar}
                        name={user.fullName}
                        size={36}
                        key={`${user.id}-${user._avatarUpdated || ''}-${forceAvatarRefresh}`}
                        forceRefresh={true}
                      />
                      </TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.fullName}</TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                      {user.email || '-'}
                    </TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }} dir="ltr">
                      {user.phone || '-'}
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        size="small"
                        label={user.isActive ? 'فعال' : 'غیرفعال'}
                        color={user.isActive ? 'success' : 'default'}
                        variant={user.isActive ? 'filled' : 'outlined'}
                        sx={{ minWidth: 70 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        size="small"
                        label={user.role === 'ADMIN' ? 'مدیر' : 'کاربر عادی'}
                        color={user.role === 'ADMIN' ? 'primary' : 'default'}
                        variant={user.role === 'ADMIN' ? 'filled' : 'outlined'}
                        sx={{ minWidth: 80 }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box display="flex" justifyContent="center" gap={1}>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleOpenEditDialog(user)}
                          disabled={currentUser?.id === user.id}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleOpenDeleteDialog(user)}
                          disabled={currentUser?.id === user.id}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
      </Card>

      {/* دیالوگ ایجاد/ویرایش کاربر */}
      <Dialog
        open={dialogState.isOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }
        }}
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle 
            sx={{ 
              bgcolor: theme => alpha(theme.palette.primary.main, 0.04),
              borderBottom: '1px solid',
              borderColor: 'divider',
              py: 1.5,
              textAlign: 'center',
              position: 'relative'
            }}
          >
            <Typography variant="h6" fontWeight="medium">
              {dialogState.mode === 'create' ? 'افزودن کاربر جدید' : 'ویرایش اطلاعات کاربر'}
            </Typography>
            <IconButton 
              aria-label="close"
              onClick={handleCloseDialog}
              sx={{
                position: 'absolute',
                left: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
              size="small"
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </DialogTitle>
          
          <Box sx={{ position: 'relative', mt: 3, mb: 2, display: 'flex', justifyContent: 'center' }}>
            <Box
              sx={{
                position: 'relative',
                width: 110,
                height: 110,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 12px 24px rgba(0, 0, 0, 0.12), 0 0 0 4px rgba(255, 255, 255, 0.8), 0 0 0 8px rgba(0, 0, 0, 0.05)',
                overflow: 'visible',
                "&::before": {
                  content: '""',
                  position: 'absolute',
                  width: '140%',
                  height: '140%',
                  top: '-20%',
                  left: '-20%',
                  background: 'radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)',
                  zIndex: -1,
                }
              }}
            >
              <AvatarUploader
                currentAvatar={userInput.avatar}
                onAvatarChange={handleAvatarChange}
                size={100}
                userId={selectedUser?.id.toString()}
                user={{ fullName: userInput.fullName }}
              />
              
              <IconButton
                color="primary"
                size="small"
                onClick={handleRemoveAvatar}
                sx={{
                  position: 'absolute',
                  bottom: -4,
                  right: 90,
                  backgroundColor: (theme) => theme.palette.background.paper,
                  boxShadow: 1,
                  '&:hover': {
                    backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1),
                  }
                }}
              >
                <CancelIcon fontSize="small" />
              </IconButton>
            </Box>
            </Box>
            
          <DialogContent sx={{ p: 3, pt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="username"
                  label="نام کاربری"
                  fullWidth
                  size="small"
                  value={userInput.username}
                  onChange={handleTextFieldChange}
                  disabled={dialogState.mode === 'edit'}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon 
                          fontSize="small" 
                          sx={{ 
                            color: theme => theme.palette.mode === 'dark' ? alpha(theme.palette.primary.main, 0.8) : theme.palette.primary.main 
                          }} 
                        />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      transition: 'all 0.2s',
                      '&:hover': {
                        boxShadow: '0 0 0 2px rgba(0, 0, 0, 0.05)'
                      },
                      '&.Mui-focused': {
                        boxShadow: theme => `0 0 0 2px ${alpha(theme.palette.primary.main, 0.25)}`
                      }
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  name="password"
                  label={dialogState.mode === 'create' ? 'رمز عبور' : 'رمز عبور جدید (اختیاری)'}
                  fullWidth
                  size="small"
                  value={userInput.password}
                  onChange={handleTextFieldChange}
                  required={dialogState.mode === 'create'}
                  type={showPassword ? 'text' : 'password'}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon 
                          fontSize="small" 
                          sx={{ 
                            color: theme => theme.palette.mode === 'dark' ? alpha(theme.palette.primary.main, 0.8) : theme.palette.primary.main 
                          }} 
                        />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton 
                          onClick={togglePasswordVisibility}
                          edge="end"
                          size="small"
                        >
                          {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      transition: 'all 0.2s',
                      '&:hover': {
                        boxShadow: '0 0 0 2px rgba(0, 0, 0, 0.05)'
                      },
                      '&.Mui-focused': {
                        boxShadow: theme => `0 0 0 2px ${alpha(theme.palette.primary.main, 0.25)}`
                      }
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  name="fullName"
                  label="نام و نام خانوادگی"
                  fullWidth
                  size="small"
                  value={userInput.fullName}
                  onChange={handleTextFieldChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BadgeIcon 
                          fontSize="small" 
                          sx={{ 
                            color: theme => theme.palette.mode === 'dark' ? alpha(theme.palette.primary.main, 0.8) : theme.palette.primary.main 
                          }} 
                        />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      transition: 'all 0.2s',
                      '&:hover': {
                        boxShadow: '0 0 0 2px rgba(0, 0, 0, 0.05)'
                      },
                      '&.Mui-focused': {
                        boxShadow: theme => `0 0 0 2px ${alpha(theme.palette.primary.main, 0.25)}`
                      }
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  name="email"
                  label="ایمیل"
                  fullWidth
                  size="small"
                  value={userInput.email}
                  onChange={handleTextFieldChange}
                  type="email"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon 
                          fontSize="small" 
                          sx={{ 
                            color: theme => theme.palette.mode === 'dark' ? alpha(theme.palette.primary.main, 0.8) : theme.palette.primary.main 
                          }} 
                        />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      transition: 'all 0.2s',
                      '&:hover': {
                        boxShadow: '0 0 0 2px rgba(0, 0, 0, 0.05)'
                      },
                      '&.Mui-focused': {
                        boxShadow: theme => `0 0 0 2px ${alpha(theme.palette.primary.main, 0.25)}`
                      }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="phone"
                  label="شماره تماس"
                  fullWidth
                  size="small"
                  value={userInput.phone}
                  onChange={handleTextFieldChange}
                  dir="ltr"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon 
                          fontSize="small" 
                          sx={{ 
                            color: theme => theme.palette.mode === 'dark' ? alpha(theme.palette.primary.main, 0.8) : theme.palette.primary.main 
                          }} 
                        />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      transition: 'all 0.2s',
                      '&:hover': {
                        boxShadow: '0 0 0 2px rgba(0, 0, 0, 0.05)'
                      },
                      '&.Mui-focused': {
                        boxShadow: theme => `0 0 0 2px ${alpha(theme.palette.primary.main, 0.25)}`
                      }
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl 
                  fullWidth 
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      transition: 'all 0.2s',
                      '&:hover': {
                        boxShadow: '0 0 0 2px rgba(0, 0, 0, 0.05)'
                      },
                      '&.Mui-focused': {
                        boxShadow: theme => `0 0 0 2px ${alpha(theme.palette.primary.main, 0.25)}`
                      }
                    }
                  }}
                >
                  <InputLabel>نقش کاربر</InputLabel>
                  <Select
                    name="role"
                    value={userInput.role}
                    onChange={(e) => handleSelectChange(e as any)}
                    label="نقش کاربر"
                    required
                    startAdornment={
                      <InputAdornment position="start" sx={{ mr: 1, ml: -0.5 }}>
                        <AdminPanelSettingsIcon 
                          fontSize="small" 
                          sx={{ 
                            color: theme => theme.palette.mode === 'dark' ? alpha(theme.palette.primary.main, 0.8) : theme.palette.primary.main 
                          }}
                        />
                      </InputAdornment>
                    }
                  >
                    <MenuItem value="USER">کاربر عادی</MenuItem>
                    <MenuItem value="ADMIN">مدیر سیستم</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 1, 
                    height: '100%', 
                    display: 'flex', 
                    alignItems: 'center',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    transition: 'all 0.2s',
                    '&:hover': {
                      boxShadow: '0 0 0 2px rgba(0, 0, 0, 0.05)'
                    }
                  }}
                >
                  <CircleIcon 
                    fontSize="small" 
                    sx={{ 
                      color: theme => theme.palette.mode === 'dark' ? alpha(theme.palette.success.main, 0.8) : theme.palette.success.main,
                      mr: 1 
                    }}
                  />
                  <FormControlLabel 
                    control={
                      <Switch 
                        name="isActive" 
                        checked={userInput.isActive} 
                        onChange={handleSwitchChange}
                        color="success"
                        sx={{ mx: 1 }}
                      />
                    } 
                    label="کاربر فعال است" 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      alignItems: 'center',
                      m: 0
                    }}
                  />
                </Paper>
              </Grid>
            </Grid>
          </DialogContent>
          
          <DialogActions 
            sx={{ 
              px: 3, 
              py: 2, 
              borderTop: '1px solid', 
              borderColor: 'divider',
              bgcolor: theme => alpha(theme.palette.background.default, 0.5)
            }}
          >
            <Button 
              variant="outlined" 
              onClick={handleCloseDialog}
              startIcon={<CloseIcon />}
              color="inherit"
              sx={{ 
                borderRadius: 2,
                px: 2
              }}
            >
              انصراف
            </Button>
            <Button 
              variant="contained" 
              color="primary"
              startIcon={dialogState.mode === 'create' ? <AddIcon /> : <SaveIcon />}
              type="submit"
              sx={{ 
                borderRadius: 2,
                px: 3,
                boxShadow: 2,
                '&:hover': {
                  boxShadow: 4
                }
              }}
            >
              {dialogState.mode === 'create' ? 'ایجاد کاربر' : 'ذخیره تغییرات'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* دیالوگ حذف کاربر */}
      <Dialog 
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            color: 'error.main',
            borderBottom: '1px solid',
            borderColor: 'divider',
            bgcolor: theme => alpha(theme.palette.error.main, 0.04),
            py: 1.5,
            textAlign: 'center',
            position: 'relative'
          }}
        >
          <Typography variant="h6" fontWeight="medium">حذف کاربر</Typography>
          <IconButton 
            aria-label="close"
            onClick={handleCloseDeleteDialog}
            sx={{
              position: 'absolute',
              left: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
            size="small"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ p: 3 }}>
          {userToDelete && (
            <>
              <Box 
                display="flex" 
                flexDirection="column" 
                alignItems="center" 
                mb={3}
                sx={{
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    width: '150%',
                    height: '150%',
                    top: '-25%',
                    left: '-25%',
                    background: 'radial-gradient(circle at center, rgba(255,0,0,0.05) 0%, rgba(255,255,255,0) 70%)',
                    zIndex: -1,
                    borderRadius: '50%'
                  }
                }}
              >
                <UserAvatar
                  avatar={userToDelete.avatar}
                  name={userToDelete.fullName}
                  size={60}
                  forceRefresh={true}
                  sx={{ 
                    mb: 1.5,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15), 0 0 0 3px rgba(255,255,255,0.8)'
                  }}
                />
                <Typography variant="h6" fontWeight="bold" textAlign="center">
                  {userToDelete.fullName}
                </Typography>
                <Typography variant="body2" color="textSecondary" textAlign="center">
                  {userToDelete.username}
                </Typography>
              </Box>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 2, 
                  bgcolor: theme => alpha(theme.palette.error.main, 0.05),
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: theme => alpha(theme.palette.error.main, 0.2)
                }}
              >
                <Typography color="error.main" variant="body2" fontWeight="medium" mb={1}>
                  آیا از حذف این کاربر اطمینان دارید؟
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  این عملیات غیرقابل بازگشت است و تمام اطلاعات کاربر حذف خواهد شد.
                </Typography>
              </Paper>
            </>
          )}
        </DialogContent>
        
        <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid', borderColor: 'divider', bgcolor: theme => alpha(theme.palette.background.default, 0.5) }}>
          <Button 
            onClick={handleCloseDeleteDialog} 
            color="inherit"
            variant="outlined"
            startIcon={<CloseIcon />}
            sx={{ borderRadius: 2 }}
          >
            انصراف
          </Button>
          <Button 
            onClick={handleDeleteUser} 
            color="error"
            variant="contained"
            startIcon={<DeleteIcon />}
            sx={{ 
              borderRadius: 2,
              boxShadow: 2,
              '&:hover': {
                boxShadow: 4
              }
            }}
          >
            حذف کاربر
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsersPage;