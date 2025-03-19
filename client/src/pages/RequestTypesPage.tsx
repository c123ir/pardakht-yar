// client/src/pages/RequestTypesPage.tsx
// صفحه مدیریت رویدادها

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
  IconButton,
  TextField,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Alert,
  useTheme,
  alpha,
  Tooltip,
  Container,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EventIcon from '@mui/icons-material/Event';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import { RequestType, FieldConfig } from '../types/request.types';
import requestTypeService from '../services/requestTypeService';
import { useToast } from '../contexts/ToastContext';
import RequestTypeEditor from '../components/requests/RequestTypeEditor';
import { getAuthToken } from '../utils/auth';
import LoadingIndicator from '../components/common/LoadingIndicator';
import * as Icons from '@mui/icons-material';
import { RequestTypesTable } from '../components/requests/RequestTypesTable';
import { useSnackbar } from '../contexts/SnackbarContext';

const RequestTypesPage: React.FC = () => {
  const theme = useTheme();
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
      
      const response = await requestTypeService.getAllRequestTypes();
      console.log('API response:', response);
      
      if (response && response.success) {
        setRequestTypes(response.data || []);
        setFilteredRequestTypes(response.data || []);
      } else {
        setError(response?.message || 'خطا در دریافت لیست انواع رویداد');
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

  // جستجو در لیست انواع رویدادها
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
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
  
  // باز کردن دیالوگ مشاهده نوع رویداد
  const handleViewRequestType = (requestType: RequestType) => {
    setSelectedRequestType(requestType);
    setDialogMode('view');
    setIsEditorOpen(true);
  };
  
  // بستن دیالوگ
  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setSelectedRequestType(null);
  };
  
  // باز کردن دیالوگ تایید حذف
  const handleDeleteConfirm = (id: number) => {
    setConfirmDelete(id);
  };
  
  // بستن دیالوگ تایید حذف
  const handleCloseDeleteConfirm = () => {
    setConfirmDelete(null);
  };
  
  // حذف نوع رویداد
  const handleDeleteRequestType = async () => {
    if (!confirmDelete) return;
    
    try {
      setDialogLoading(true);
      const response = await requestTypeService.deleteRequestType(confirmDelete);
      
      if (response && response.success) {
        showToast('رویداد با موفقیت حذف شد', 'success');
        fetchRequestTypes();
      } else {
        showToast(response?.message || 'خطا در حذف رویداد', 'error');
      }
    } catch (error: any) {
      showToast(error.message || 'خطا در حذف رویداد', 'error');
    } finally {
      setDialogLoading(false);
      setConfirmDelete(null);
    }
  };
  
  // ذخیره نوع رویداد (ایجاد یا ویرایش)
  const handleSaveRequestType = async (data: Partial<RequestType>) => {
    try {
      setDialogLoading(true);
      
      let response;
      if (dialogMode === 'create') {
        response = await requestTypeService.createRequestType({
          name: data.name!,
          description: data.description,
          fieldConfig: data.fieldConfig as FieldConfig,
          iconName: data.iconName,
          color: data.color,
        });
      } else {
        response = await requestTypeService.updateRequestType(selectedRequestType!.id, {
          name: data.name,
          description: data.description,
          isActive: data.isActive,
          fieldConfig: data.fieldConfig as FieldConfig,
          iconName: data.iconName,
          color: data.color,
        });
      }
      
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
        showToast(response?.message || 'خطا در عملیات', 'error');
      }
    } catch (error: any) {
      showToast(error.message || 'خطا در ذخیره رویداد', 'error');
    } finally {
      setDialogLoading(false);
    }
  };
  
  const getIcon = (iconName: string) => {
    const Icon = (Icons as any)[iconName];
    return Icon ? <Icon sx={{ fontSize: '1.2rem' }} /> : null;
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
      </Box>

      {error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <RequestTypesTable
          requestTypes={filteredRequestTypes}
          onEdit={handleEditRequestType}
          onDelete={handleDeleteConfirm}
          loading={loading}
        />
      )}

      <Dialog
        open={isEditorOpen}
        onClose={handleCloseEditor}
        maxWidth="md"
        fullWidth
      >
        <RequestTypeEditor
          initialData={selectedRequestType}
          onSave={handleSaveRequestType}
          onCancel={handleCloseEditor}
        />
      </Dialog>

      {/* دیالوگ تایید حذف */}
      <Dialog
        open={confirmDelete !== null}
        onClose={handleCloseDeleteConfirm}
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: 2
          }
        }}
      >
        <DialogTitle>تایید حذف</DialogTitle>
        <DialogContent>
          <Typography>
            آیا از حذف این رویداد اطمینان دارید؟
          </Typography>
          <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
            توجه: این عملیات غیرقابل بازگشت است.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button 
            onClick={handleCloseDeleteConfirm}
            sx={{ borderRadius: 1.5 }}
          >
            انصراف
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteRequestType}
            disabled={dialogLoading}
            sx={{ borderRadius: 1.5 }}
          >
            {dialogLoading ? <LoadingIndicator /> : 'حذف'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default RequestTypesPage; 