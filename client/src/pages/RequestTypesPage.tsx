// client/src/pages/RequestTypesPage.tsx
// صفحه مدیریت انواع درخواست‌ها

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

} 
from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ListAltIcon from '@mui/icons-material/ListAlt';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import { RequestType, FieldConfig } from '../types/request.types';
import requestTypeService from '../services/requestTypeService';
import { useToast } from '../contexts/ToastContext';
import RequestTypeEditor from '../components/requests/RequestTypeEditor';
import { getAuthToken } from '../utils/auth';
import LoadingIndicator from '../components/common/LoadingIndicator';

const RequestTypesPage: React.FC = () => {
  // استیت‌های مربوط به لیست انواع درخواست‌ها
  const [requestTypes, setRequestTypes] = useState<RequestType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRequestTypes, setFilteredRequestTypes] = useState<RequestType[]>([]);
  const [error, setError] = useState<string | null>(null);

  // استیت‌های مربوط به دیالوگ‌ها
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedRequestType, setSelectedRequestType] = useState<RequestType | null>(null);
  const [dialogLoading, setDialogLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  // هوک‌های مورد نیاز
  const { showToast } = useToast();

  // بارگذاری لیست انواع درخواست‌ها
  useEffect(() => {
    fetchRequestTypes();
  }, []);

  // فیلتر کردن انواع درخواست‌ها بر اساس جستجو
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
        setError(response?.message || 'خطا در دریافت لیست انواع درخواست‌ها');
        showToast(response?.message || 'خطا در دریافت لیست انواع درخواست‌ها', 'error');
      }
    } catch (error: any) {
      console.error('Error fetching request types:', error);
      setError(error.message || 'خطا در ارتباط با سرور');
      showToast(error.message || 'خطا در دریافت لیست انواع درخواست‌ها', 'error');
    } finally {
      setLoading(false);
    }
  };

  // جستجو در لیست انواع درخواست‌ها
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  // باز کردن دیالوگ ایجاد نوع درخواست جدید
  const handleCreateRequestType = () => {
    setSelectedRequestType(null);
    setDialogMode('create');
    setOpenDialog(true);
  };
  
  // باز کردن دیالوگ ویرایش نوع درخواست
  const handleEditRequestType = (requestType: RequestType) => {
    setSelectedRequestType(requestType);
    setDialogMode('edit');
    setOpenDialog(true);
  };
  
  // باز کردن دیالوگ مشاهده نوع درخواست
  const handleViewRequestType = (requestType: RequestType) => {
    setSelectedRequestType(requestType);
    setDialogMode('view');
    setOpenDialog(true);
  };
  
  // بستن دیالوگ
  const handleCloseDialog = () => {
    setOpenDialog(false);
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
  
  // حذف نوع درخواست
  const handleDeleteRequestType = async () => {
    if (!confirmDelete) return;
    
    try {
      setDialogLoading(true);
      const response = await requestTypeService.deleteRequestType(confirmDelete);
      
      if (response && response.success) {
        showToast('نوع درخواست با موفقیت حذف شد', 'success');
        fetchRequestTypes();
      } else {
        showToast(response?.message || 'خطا در حذف نوع درخواست', 'error');
      }
    } catch (error: any) {
      showToast(error.message || 'خطا در حذف نوع درخواست', 'error');
    } finally {
      setDialogLoading(false);
      setConfirmDelete(null);
    }
  };
  
  // ذخیره نوع درخواست (ایجاد یا ویرایش)
  const handleSaveRequestType = async (data: Partial<RequestType>) => {
    try {
      setDialogLoading(true);
      
      let response;
      if (dialogMode === 'create') {
        response = await requestTypeService.createRequestType({
          name: data.name!,
          description: data.description,
          fieldConfig: data.fieldConfig as FieldConfig,
        });
      } else {
        response = await requestTypeService.updateRequestType(selectedRequestType!.id, {
          name: data.name,
          description: data.description,
          isActive: data.isActive,
          fieldConfig: data.fieldConfig as FieldConfig,
        });
      }
      
      if (response && response.success) {
        showToast(
          dialogMode === 'create'
            ? 'نوع درخواست با موفقیت ایجاد شد'
            : 'نوع درخواست با موفقیت بروزرسانی شد',
          'success'
        );
        fetchRequestTypes();
        handleCloseDialog();
      } else {
        showToast(response?.message || 'خطا در عملیات', 'error');
      }
    } catch (error: any) {
      showToast(error.message || 'خطا در ذخیره نوع درخواست', 'error');
    } finally {
      setDialogLoading(false);
    }
  };

  return (
    <Box>
      {/* هدر صفحه */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h1">
          <ListAltIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          مدیریت انواع درخواست‌ها
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreateRequestType}
        >
          ایجاد نوع درخواست جدید
        </Button>
      </Box>

      {/* کادر جستجو */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={9}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="جستجو در انواع درخواست‌ها..."
              value={searchTerm}
              onChange={handleSearch}
              InputProps={{
                startAdornment: <SearchIcon color="action" sx={{ ml: 1 }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchRequestTypes}
            >
              بروزرسانی
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* نمایش خطا */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* جدول انواع درخواست‌ها */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>شناسه</TableCell>
                <TableCell>نام</TableCell>
                <TableCell>توضیحات</TableCell>
                <TableCell>وضعیت</TableCell>
                <TableCell>ایجاد کننده</TableCell>
                <TableCell>عملیات</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <LoadingIndicator />
                  </TableCell>
                </TableRow>
              ) : filteredRequestTypes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1">
                      هیچ نوع درخواستی یافت نشد
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredRequestTypes.map((requestType) => (
                  <TableRow key={requestType.id}>
                    <TableCell>{requestType.id}</TableCell>
                    <TableCell>{requestType.name}</TableCell>
                    <TableCell>
                      {requestType.description || 'بدون توضیحات'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={requestType.isActive ? 'فعال' : 'غیرفعال'}
                        color={requestType.isActive ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {requestType.createdBy || 'نامشخص'}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => handleViewRequestType(requestType)}
                        size="small"
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        color="secondary"
                        onClick={() => handleEditRequestType(requestType)}
                        size="small"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteConfirm(requestType.id)}
                        size="small"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* دیالوگ ایجاد/ویرایش/مشاهده نوع درخواست */}
      <Dialog
        open={openDialog}
        onClose={dialogLoading ? undefined : handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {dialogMode === 'create'
            ? 'ایجاد نوع درخواست جدید'
            : dialogMode === 'edit'
            ? 'ویرایش نوع درخواست'
            : 'مشاهده نوع درخواست'}
        </DialogTitle>
        <DialogContent dividers>
          <RequestTypeEditor
            initialData={selectedRequestType}
            readOnly={dialogMode === 'view'}
            onSave={handleSaveRequestType}
            loading={dialogLoading}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialog}
            disabled={dialogLoading}
          >
            {dialogMode === 'view' ? 'بستن' : 'انصراف'}
          </Button>
          {dialogMode !== 'view' && (
            <Button
              variant="contained"
              color="primary"
              form="request-type-form"
              type="submit"
              disabled={dialogLoading}
            >
              {dialogLoading ? (
                <LoadingIndicator />
              ) : (
                dialogMode === 'create' ? 'ایجاد' : 'ذخیره تغییرات'
              )}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* دیالوگ تایید حذف */}
      <Dialog open={confirmDelete !== null} onClose={handleCloseDeleteConfirm}>
        <DialogTitle>تایید حذف</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            آیا از حذف این نوع درخواست اطمینان دارید؟
          </Alert>
          <Typography variant="body1">
            توجه: اگر درخواست‌هایی از این نوع در سیستم وجود داشته باشند، امکان حذف وجود ندارد.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirm} disabled={dialogLoading}>
            انصراف
          </Button>
          <Button
            onClick={handleDeleteRequestType}
            color="error"
            variant="contained"
            disabled={dialogLoading}
          >
            {dialogLoading ? <LoadingIndicator /> : 'حذف'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RequestTypesPage; 