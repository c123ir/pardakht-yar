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
  Grid,
  IconButton,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { ContactGroup } from '../types';
import { convertPersianToEnglishNumbers } from '../utils';

/**
 * کامپوننت مدیریت گروه‌های مخاطبان
 */
const SmsContactGroups: React.FC = () => {
  // وضعیت‌های کامپوننت
  const [groups, setGroups] = useState<ContactGroup[]>([
    {
      id: '1',
      name: 'مشتریان ویژه',
      memberCount: 124,
      description: 'مشتریانی که بیش از 5 سفارش در ماه داشته‌اند',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'کاربران جدید',
      memberCount: 78,
      description: 'کاربرانی که در یک ماه اخیر ثبت‌نام کرده‌اند',
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      name: 'مشتریان غیرفعال',
      memberCount: 203,
      description: 'مشتریانی که بیش از 3 ماه سفارش نداشته‌اند',
      createdAt: new Date().toISOString(),
    },
  ]);
  const [loading, setLoading] = useState<boolean>(false);
  
  // وضعیت دیالوگ گروه
  const [openGroupDialog, setOpenGroupDialog] = useState<boolean>(false);
  const [editingGroup, setEditingGroup] = useState<ContactGroup | null>(null);
  const [groupFormErrors, setGroupFormErrors] = useState<{
    name?: string;
  }>({});
  
  // وضعیت دیالوگ افزودن مخاطب
  const [openContactDialog, setOpenContactDialog] = useState<boolean>(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [newContact, setNewContact] = useState<{
    number: string;
    name?: string;
  }>({ number: '', name: '' });
  const [contactFormErrors, setContactFormErrors] = useState<{
    number?: string;
  }>({});
  
  // مدیریت باز و بسته کردن دیالوگ گروه
  const handleOpenGroupDialog = (group?: ContactGroup) => {
    if (group) {
      setEditingGroup(group);
    } else {
      setEditingGroup({
        id: '',
        name: '',
        memberCount: 0,
        description: '',
        createdAt: new Date().toISOString(),
      });
    }
    setOpenGroupDialog(true);
    setGroupFormErrors({});
  };
  
  const handleCloseGroupDialog = () => {
    setOpenGroupDialog(false);
    setEditingGroup(null);
  };
  
  // مدیریت باز و بسته کردن دیالوگ افزودن مخاطب
  const handleOpenContactDialog = (groupId: string) => {
    setSelectedGroupId(groupId);
    setNewContact({ number: '', name: '' });
    setOpenContactDialog(true);
    setContactFormErrors({});
  };
  
  const handleCloseContactDialog = () => {
    setOpenContactDialog(false);
    setSelectedGroupId(null);
  };
  
  // ذخیره گروه جدید یا ویرایش‌شده
  const handleSaveGroup = () => {
    if (!editingGroup) return;
    
    // اعتبارسنجی فرم
    const errors: {
      name?: string;
    } = {};
    
    if (!editingGroup.name.trim()) {
      errors.name = 'نام گروه الزامی است';
    }
    
    if (Object.keys(errors).length > 0) {
      setGroupFormErrors(errors);
      return;
    }
    
    setLoading(true);
    
    // در حالت واقعی، اینجا API call خواهد بود
    setTimeout(() => {
      if (editingGroup.id) {
        // ویرایش گروه موجود
        setGroups(groups.map(g => 
          g.id === editingGroup.id ? { ...editingGroup } : g
        ));
      } else {
        // ایجاد گروه جدید
        const newGroup = {
          ...editingGroup,
          id: Math.random().toString(36).substring(2, 9),
        };
        setGroups([...groups, newGroup]);
      }
      
      setLoading(false);
      handleCloseGroupDialog();
    }, 500);
  };
  
  // حذف گروه
  const handleDeleteGroup = (id: string) => {
    if (window.confirm('آیا از حذف این گروه اطمینان دارید؟')) {
      setLoading(true);
      
      // در حالت واقعی، اینجا API call خواهد بود
      setTimeout(() => {
        setGroups(groups.filter(g => g.id !== id));
        setLoading(false);
      }, 500);
    }
  };
  
  // افزودن مخاطب جدید به گروه
  const handleAddContact = () => {
    if (!selectedGroupId) return;
    
    // تبدیل اعداد فارسی به انگلیسی
    const normalizedNumber = convertPersianToEnglishNumbers(newContact.number);
    
    // اعتبارسنجی فرم
    const errors: {
      number?: string;
    } = {};
    
    if (!normalizedNumber.trim()) {
      errors.number = 'شماره موبایل الزامی است';
    } else if (!/^09\d{9}$/.test(normalizedNumber)) {
      errors.number = 'شماره موبایل نامعتبر است';
    }
    
    if (Object.keys(errors).length > 0) {
      setContactFormErrors(errors);
      return;
    }
    
    setLoading(true);
    
    // در حالت واقعی، اینجا API call خواهد بود
    setTimeout(() => {
      // افزایش تعداد اعضای گروه
      setGroups(groups.map(g => 
        g.id === selectedGroupId 
          ? { ...g, memberCount: g.memberCount + 1 } 
          : g
      ));
      
      setLoading(false);
      handleCloseContactDialog();
      
      // نمایش پیام موفقیت
      alert(`مخاطب ${newContact.name || normalizedNumber} به گروه اضافه شد`);
    }, 500);
  };
  
  // تغییر مقدار فیلدهای فرم گروه
  const handleGroupInputChange = (field: keyof ContactGroup, value: string) => {
    if (!editingGroup) return;
    
    setEditingGroup({ ...editingGroup, [field]: value });
    
    // پاک کردن خطای مرتبط در صورت وجود
    if (groupFormErrors[field as keyof typeof groupFormErrors]) {
      setGroupFormErrors({ ...groupFormErrors, [field]: undefined });
    }
  };
  
  // تغییر مقدار فیلدهای فرم مخاطب
  const handleContactInputChange = (field: 'number' | 'name', value: string) => {
    setNewContact({ ...newContact, [field]: value });
    
    // پاک کردن خطای مرتبط در صورت وجود
    if (field === 'number' && contactFormErrors.number) {
      setContactFormErrors({ ...contactFormErrors, number: undefined });
    }
  };
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" component="h2">
          گروه‌های مخاطبان
        </Typography>
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenGroupDialog()}
        >
          گروه جدید
        </Button>
      </Box>
      
      {loading && groups.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2}>
          {groups.length === 0 ? (
            <Grid item xs={12}>
              <Paper variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
                <Typography color="textSecondary">
                  هیچ گروه مخاطبی وجود ندارد. با کلیک روی دکمه «گروه جدید» یک گروه ایجاد کنید.
                </Typography>
              </Paper>
            </Grid>
          ) : (
            groups.map(group => (
              <Grid item xs={12} sm={6} lg={4} key={group.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PeopleAltIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="subtitle1" component="h3">
                          {group.name}
                        </Typography>
                      </Box>
                      <Box>
                        <Tooltip title="افزودن مخاطب">
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => handleOpenContactDialog(group.id)}
                          >
                            <PersonAddIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="ویرایش گروه">
                          <IconButton 
                            size="small" 
                            onClick={() => handleOpenGroupDialog(group)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="حذف گروه">
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleDeleteGroup(group.id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                    
                    <Divider sx={{ my: 1 }} />
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Chip 
                        label={`${group.memberCount} مخاطب`} 
                        size="small" 
                        variant="outlined" 
                        sx={{ mr: 1 }}
                      />
                    </Box>
                    
                    {group.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {group.description}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      )}
      
      {/* دیالوگ افزودن/ویرایش گروه */}
      <Dialog 
        open={openGroupDialog} 
        onClose={handleCloseGroupDialog} 
        fullWidth 
        maxWidth="sm"
      >
        <DialogTitle>
          {editingGroup?.id ? 'ویرایش گروه' : 'گروه جدید'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ my: 2 }}>
            <TextField
              label="نام گروه"
              fullWidth
              value={editingGroup?.name || ''}
              onChange={(e) => handleGroupInputChange('name', e.target.value)}
              error={!!groupFormErrors.name}
              helperText={groupFormErrors.name}
              sx={{ mb: 3 }}
            />
            
            <TextField
              label="توضیحات (اختیاری)"
              fullWidth
              multiline
              rows={3}
              value={editingGroup?.description || ''}
              onChange={(e) => handleGroupInputChange('description', e.target.value)}
              sx={{ mb: 3 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseGroupDialog} color="inherit">
            انصراف
          </Button>
          <Button 
            onClick={handleSaveGroup}
            color="primary"
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'ذخیره'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* دیالوگ افزودن مخاطب به گروه */}
      <Dialog 
        open={openContactDialog} 
        onClose={handleCloseContactDialog} 
        fullWidth 
        maxWidth="sm"
      >
        <DialogTitle>
          افزودن مخاطب به گروه
        </DialogTitle>
        <DialogContent>
          <Box sx={{ my: 2 }}>
            <TextField
              label="شماره موبایل"
              fullWidth
              value={newContact.number}
              onChange={(e) => handleContactInputChange('number', e.target.value)}
              error={!!contactFormErrors.number}
              helperText={contactFormErrors.number}
              sx={{ mb: 3 }}
              placeholder="مثال: ۰۹۱۲۳۴۵۶۷۸۹"
            />
            
            <TextField
              label="نام (اختیاری)"
              fullWidth
              value={newContact.name}
              onChange={(e) => handleContactInputChange('name', e.target.value)}
              sx={{ mb: 3 }}
              placeholder="نام و نام خانوادگی مخاطب"
            />
            
            <Typography variant="body2" color="text.secondary">
              یا با آپلود فایل اکسل، چندین مخاطب را یکجا اضافه کنید.
            </Typography>
            <Button
              variant="outlined"
              sx={{ mt: 1 }}
              size="small"
            >
              آپلود فایل اکسل
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseContactDialog} color="inherit">
            انصراف
          </Button>
          <Button 
            onClick={handleAddContact}
            color="primary"
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'افزودن'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SmsContactGroups; 