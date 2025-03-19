// client/src/pages/RequestSubGroupsPage.tsx
// صفحه مدیریت زیرگروه‌های درخواست

import React, { useState, useEffect } from 'react';
import { Paper, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Chip, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Grid, Alert, Breadcrumbs, SelectChangeEvent } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import requestGroupService from '../services/requestGroupService';
import requestSubGroupService from '../services/requestSubGroupService';
import { RequestGroup, RequestSubGroup } from '../types/request.types';
import LoadingIndicator from '../components/common/LoadingIndicator';

const RequestSubGroupsPage: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const [subGroups, setSubGroups] = useState<RequestSubGroup[]>([]);
  const [parentGroup, setParentGroup] = useState<RequestGroup | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [formState, setFormState] = useState({
    name: '',
    description: '',
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  // دریافت اطلاعات گروه والد و زیرگروه‌ها
  useEffect(() => {
    if (!groupId) {
      navigate('/request-groups');
      return;
    }
    
    const loadParentGroup = async () => {
      try {
        const response = await requestGroupService.getGroupById(Number(groupId));
        if (response.success) {
          setParentGroup(response.data);
        } else {
          setError('خطا در دریافت اطلاعات گروه درخواست');
          navigate('/request-groups');
        }
      } catch (err) {
        console.error('خطا در دریافت اطلاعات گروه درخواست:', err);
        setError('خطا در دریافت اطلاعات گروه درخواست');
        navigate('/request-groups');
      }
    };
    
    loadParentGroup();
    loadSubGroups();
  }, [groupId]);

  // دریافت زیرگروه‌ها با تغییر صفحه یا تعداد در صفحه
  useEffect(() => {
    if (groupId) {
      loadSubGroups();
    }
  }, [page, rowsPerPage]);

  const loadSubGroups = async () => {
    if (!groupId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await requestSubGroupService.getSubGroupsByGroup(
        Number(groupId),
        page + 1,
        rowsPerPage
      );
      
      if (response.success) {
        setSubGroups(response.data);
        setTotalItems(response.pagination.totalItems);
      } else {
        setError('خطا در دریافت زیرگروه‌های درخواست');
      }
    } catch (err) {
      console.error('خطا در دریافت زیرگروه‌های درخواست:', err);
      setError('خطا در دریافت زیرگروه‌های درخواست');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (subGroup?: RequestSubGroup) => {
    if (subGroup) {
      setFormState({
        name: subGroup.name,
        description: subGroup.description || '',
      });
      setEditingId(subGroup.id);
    } else {
      setFormState({
        name: '',
        description: '',
      });
      setEditingId(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormState({ name: '', description: '' });
    setEditingId(null);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name as string]: value }));
  };

  const handleSubmit = async () => {
    if (!formState.name) {
      enqueueSnackbar('لطفاً نام زیرگروه را وارد کنید', { variant: 'error' });
      return;
    }

    try {
      if (editingId) {
        // ویرایش زیرگروه موجود
        const response = await requestSubGroupService.updateSubGroup(editingId, {
          name: formState.name,
          description: formState.description,
        });
        
        if (response.success) {
          enqueueSnackbar('زیرگروه درخواست با موفقیت بروزرسانی شد', { variant: 'success' });
          loadSubGroups();
        }
      } else {
        // ایجاد زیرگروه جدید
        const response = await requestSubGroupService.createSubGroup({
          name: formState.name,
          description: formState.description,
          groupId: Number(groupId),
        });
        
        if (response.success) {
          enqueueSnackbar('زیرگروه درخواست با موفقیت ایجاد شد', { variant: 'success' });
          loadSubGroups();
        }
      }
      
      handleCloseDialog();
    } catch (err) {
      console.error('خطا در ذخیره زیرگروه درخواست:', err);
      enqueueSnackbar('خطا در ذخیره زیرگروه درخواست', { variant: 'error' });
    }
  };

  const handleDeleteSubGroup = async (id: number) => {
    if (window.confirm('آیا از حذف این زیرگروه درخواست اطمینان دارید؟')) {
      try {
        const response = await requestSubGroupService.deleteSubGroup(id);
        
        if (response.success) {
          enqueueSnackbar(response.message, { variant: 'success' });
          loadSubGroups();
        }
      } catch (err) {
        console.error('خطا در حذف زیرگروه درخواست:', err);
        enqueueSnackbar('خطا در حذف زیرگروه درخواست', { variant: 'error' });
      }
    }
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link to="/request-groups" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <ArrowBackIcon fontSize="small" sx={{ mr: 0.5 }} />
          بازگشت به گروه‌های درخواست
        </Link>
        <Typography color="text.primary">زیرگروه‌های {parentGroup?.name || ''}</Typography>
      </Breadcrumbs>
      
      <Typography variant="h5" gutterBottom>
        مدیریت زیرگروه‌های درخواست برای گروه: {parentGroup?.name || '...'}
      </Typography>
      
      {parentGroup && (
        <Typography variant="body2" color="text.secondary" paragraph>
          نوع درخواست: {parentGroup.requestType?.name || ''}
        </Typography>
      )}
      
      <Grid container justifyContent="flex-end" sx={{ mt: 2, mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          زیرگروه جدید
        </Button>
      </Grid>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {loading ? (
        <LoadingIndicator />
      ) : subGroups.length === 0 ? (
        <Alert severity="info">
          هیچ زیرگروهی برای این گروه درخواست یافت نشد.
        </Alert>
      ) : (
        <>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>نام زیرگروه</TableCell>
                  <TableCell>توضیحات</TableCell>
                  <TableCell>درخواست‌ها</TableCell>
                  <TableCell>وضعیت</TableCell>
                  <TableCell>عملیات</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {subGroups.map((subGroup) => (
                  <TableRow key={subGroup.id}>
                    <TableCell>{subGroup.name}</TableCell>
                    <TableCell>{subGroup.description || '-'}</TableCell>
                    <TableCell>{subGroup._count?.requests || 0}</TableCell>
                    <TableCell>
                      <Chip
                        label={subGroup.isActive ? 'فعال' : 'غیرفعال'}
                        color={subGroup.isActive ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton 
                        color="primary" 
                        size="small"
                        onClick={() => handleOpenDialog(subGroup)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        size="small"
                        onClick={() => handleDeleteSubGroup(subGroup.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalItems}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="تعداد در صفحه:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} از ${count !== -1 ? count : `بیش از ${to}`}`}
          />
        </>
      )}
      
      {/* دیالوگ افزودن/ویرایش زیرگروه */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingId ? 'ویرایش زیرگروه درخواست' : 'افزودن زیرگروه درخواست جدید'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            name="name"
            label="نام زیرگروه"
            type="text"
            fullWidth
            variant="outlined"
            value={formState.name}
            onChange={handleFormChange}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            margin="dense"
            id="description"
            name="description"
            label="توضیحات (اختیاری)"
            type="text"
            fullWidth
            variant="outlined"
            value={formState.description}
            onChange={handleFormChange}
            multiline
            rows={3}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>انصراف</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            ذخیره
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default RequestSubGroupsPage; 