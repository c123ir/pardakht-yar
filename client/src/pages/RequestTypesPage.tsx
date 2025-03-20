// client/src/pages/RequestTypesPage.tsx
// صفحه مدیریت رویدادها

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Container,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment
} from '@mui/material';
import { Add as AddIcon, Search as SearchIcon } from '@mui/icons-material';
import EventIcon from '@mui/icons-material/Event';
import { RequestType, FieldConfig } from '../types/request.types';
import { useToast } from '../contexts/ToastContext';
import RequestTypeEditor from '../components/requests/RequestTypeEditor';
import { getAuthToken } from '../utils/auth';
import { RequestTypesTable } from '../components/requests/RequestTypesTable';
import { useSnackbar } from '../contexts/SnackbarContext';
import { useApi } from '../hooks/useApi';

const RequestTypesPage: React.FC = () => {
  const { api } = useApi();
  const [requestTypes, setRequestTypes] = useState<RequestType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRequestTypes, setFilteredRequestTypes] = useState<RequestType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedRequestType, setSelectedRequestType] = useState<RequestType | null>(null);
  const { showToast } = useToast();
  const { showSnackbar } = useSnackbar();

  // استیت‌های مربوط به دیالوگ‌ها
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view'>('create');
  const [dialogLoading, setDialogLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  // بارگذاری لیست انواع رویدادها
  useEffect(() => {
    fetchRequestTypes();
  }, []);

  // فیلتر کردن انواع رویدادها بر اساس جستجو
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredRequestTypes(requestTypes);
    } else {
      const filtered = requestTypes.filter((type) =>
        type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (type.description?.toLowerCase() || '').includes(searchTerm.toLowerCase())
      );
      setFilteredRequestTypes(filtered);
    }
  }, [searchTerm, requestTypes]);

  const fetchRequestTypes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // بررسی وجود توکن
      const token = getAuthToken();
      console.log('Auth token in RequestTypesPage:', token);
      
      if (!token) {
        setError('عدم دسترسی: لطفاً مجدداً وارد سیستم شوید');
        setLoading(false);
        return;
      }
      
      const response = await api.get('/request-types');
      console.log('API response:', response);
      
      // @ts-ignore
      if (response && response.success) {
        // @ts-ignore
        setRequestTypes(response.data || []);
        // @ts-ignore
        setFilteredRequestTypes(response.data || []);
      } else {
        // @ts-ignore
        setError(response?.message || 'خطا در دریافت لیست انواع رویداد');
        // @ts-ignore
        showToast(response?.message || 'خطا در دریافت لیست انواع رویداد', 'error');
      }
    } catch (error: any) {
      console.error('Error fetching request types:', error);
      setError(error.message || 'خطا در ارتباط با سرور');
      showToast(error.message || 'خطا در دریافت لیست انواع رویداد', 'error');
    } finally {
      setLoading(false);
    }
  };

  // باز کردن دیالوگ ایجاد نوع رویداد جدید
  const handleOpenEditor = () => {
    setSelectedRequestType(null);
    setDialogMode('create');
    setIsEditorOpen(true);
  };
  
  // باز کردن دیالوگ ویرایش نوع رویداد
  const handleEditRequestType = (requestType: RequestType) => {
    setSelectedRequestType(requestType);
    setDialogMode('edit');
    setIsEditorOpen(true);
  };
  
  // بستن دیالوگ
  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setSelectedRequestType(null);
  };
  
  // باز کردن دیالوگ تایید حذف
  const handleDeleteConfirm = (id: number) => {
    // تبدیل id به string برای تطابق با نوع مورد نیاز در RequestTypesTable
    const stringId = id.toString();
    
    try {
      // حذف نوع درخواست از سرور (مجازی)
      // در محیط واقعی، فراخوانی API باید انجام شود
      console.log(`حذف نوع درخواست با شناسه ${stringId}`);
      
      // بروزرسانی حالت برنامه
      setRequestTypes(prevTypes => prevTypes.filter(type => type.id !== id));
      setConfirmDelete(null);
      showSnackbar('نوع درخواست با موفقیت حذف شد', 'success');
    } catch (error) {
      console.error('Error deleting request type:', error);
      showSnackbar('خطا در حذف نوع درخواست', 'error');
    }
  };
  
  // ذخیره نوع رویداد (ایجاد یا ویرایش)
  const handleSaveRequestType = async (data: Partial<RequestType>) => {
    try {
      setDialogLoading(true);
      
      let response;
      if (dialogMode === 'create') {
        response = await api.post('/request-types', {
          name: data.name!,
          description: data.description,
          fieldConfig: data.fieldConfig as FieldConfig,
          iconName: data.iconName,
          color: data.color,
        });
      } else {
        response = await api.put(`/request-types/${selectedRequestType!.id}`, {
          name: data.name,
          description: data.description,
          isActive: data.isActive,
          fieldConfig: data.fieldConfig as FieldConfig,
          iconName: data.iconName,
          color: data.color,
        });
      }
      
      // @ts-ignore
      if (response && response.success) {
        showToast(
          dialogMode === 'create'
            ? 'رویداد با موفقیت ایجاد شد'
            : 'رویداد با موفقیت بروزرسانی شد',
          'success'
        );
        fetchRequestTypes();
        handleCloseEditor();
      } else {
        // @ts-ignore
        showToast(response?.message || 'خطا در عملیات', 'error');
      }
    } catch (error: any) {
      showToast(error.message || 'خطا در ذخیره رویداد', 'error');
    } finally {
      setDialogLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h4" component="h1" gutterBottom>
              <EventIcon sx={{ mr: 1, verticalAlign: 'text-bottom' }} />
              مدیریت رویدادها
            </Typography>
            <Typography variant="body2" color="text.secondary">
              در این بخش می‌توانید انواع رویدادهای سیستم را مدیریت کنید.
            </Typography>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleOpenEditor}
            >
              افزودن نوع درخواست
            </Button>
          </Grid>
        </Grid>
        
        {/* افزودن فیلد جستجو */}
        <Box sx={{ mt: 3, mb: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="جستجو در انواع درخواست‌ها..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            size="small"
          />
        </Box>
      </Box>

      {error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      ) : null}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Card sx={{ mb: 4, boxShadow: 1, borderRadius: 2 }}>
          <CardContent>
            <RequestTypesTable
              requestTypes={filteredRequestTypes}
              onEdit={handleEditRequestType}
              onDelete={id => handleDeleteConfirm(parseInt(id, 10))}
              loading={loading}
            />
          </CardContent>
        </Card>
      )}

      {/* دیالوگ ویرایش/ایجاد نوع رویداد */}
      <Dialog
        open={isEditorOpen}
        onClose={handleCloseEditor}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle>
          {dialogMode === 'create'
            ? 'ایجاد نوع درخواست جدید'
            : dialogMode === 'edit'
            ? 'ویرایش نوع درخواست'
            : 'مشاهده جزئیات نوع درخواست'}
        </DialogTitle>
        <DialogContent dividers>
          <RequestTypeEditor
            initialData={selectedRequestType}
            onSave={handleSaveRequestType}
            onCancel={handleCloseEditor}
          />
        </DialogContent>
      </Dialog>

      {/* دیالوگ تایید حذف */}
      <Dialog
        open={confirmDelete !== null}
        onClose={() => setConfirmDelete(null)}
        maxWidth="xs"
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle>تایید حذف</DialogTitle>
        <DialogContent>
          <Typography>
            آیا از حذف این نوع درخواست اطمینان دارید؟ این عمل قابل بازگشت نیست.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button 
            onClick={() => setConfirmDelete(null)}
            sx={{ borderRadius: 1.5 }}
          >
            انصراف
          </Button>
          <Button 
            variant="contained" 
            color="error"
            onClick={() => {
              if (confirmDelete !== null) {
                handleDeleteConfirm(confirmDelete);
              }
            }}
            disabled={dialogLoading}
            sx={{ borderRadius: 1.5 }}
          >
            حذف
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default RequestTypesPage; 