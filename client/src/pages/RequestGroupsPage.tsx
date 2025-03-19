// client/src/pages/RequestGroupsPage.tsx
// صفحه مدیریت گروه‌های درخواست

import React, { useState, useEffect } from 'react';
import { Paper, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Chip, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem, Select, InputLabel, FormControl, Grid, Alert, SelectChangeEvent } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import requestGroupService from '../services/requestGroupService';
import requestTypeService from '../services/requestTypeService';
import { RequestGroup, RequestType } from '../types/request.types';
import LoadingIndicator from '../components/common/LoadingIndicator';

const RequestGroupsPage: React.FC = () => {
  const [groups, setGroups] = useState<RequestGroup[]>([]);
  const [requestTypes, setRequestTypes] = useState<RequestType[]>([]);
  const [selectedRequestType, setSelectedRequestType] = useState<number | ''>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [formState, setFormState] = useState({
    name: '',
    description: '',
    requestTypeId: '',
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  // دریافت انواع درخواست در بارگذاری اولیه
  useEffect(() => {
    const loadRequestTypes = async () => {
      try {
        const response = await requestTypeService.getAllRequestTypes(true);
        if (response.success) {
          setRequestTypes(response.data);
          
          // اگر نوع درخواستی موجود باشد، اولین مورد را انتخاب کن
          if (response.data.length > 0) {
            setSelectedRequestType(response.data[0].id);
          }
        }
      } catch (err) {
        console.error('خطا در دریافت انواع درخواست‌ها:', err);
        setError('خطا در دریافت انواع درخواست‌ها');
      }
    };
    
    loadRequestTypes();
  }, []);

  // دریافت گروه‌های درخواست بر اساس نوع درخواست انتخاب شده
  useEffect(() => {
    if (selectedRequestType) {
      loadGroups();
    } else {
      setGroups([]);
      setLoading(false);
    }
  }, [selectedRequestType, page, rowsPerPage]);

  const loadGroups = async () => {
    if (!selectedRequestType) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await requestGroupService.getGroups(
        page + 1,
        rowsPerPage,
        Number(selectedRequestType)
      );
      
      if (response.success) {
        setGroups(response.data);
        setTotalItems(response.pagination.totalItems);
      } else {
        setError('خطا در دریافت گروه‌های درخواست');
      }
    } catch (err) {
      console.error('خطا در دریافت گروه‌های درخواست:', err);
      setError('خطا در دریافت گروه‌های درخواست');
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

  const handleOpenDialog = (group?: RequestGroup) => {
    if (group) {
      setFormState({
        name: group.name,
        description: group.description || '',
        requestTypeId: group.requestTypeId.toString(),
      });
      setEditingId(group.id);
    } else {
      setFormState({
        name: '',
        description: '',
        requestTypeId: selectedRequestType ? selectedRequestType.toString() : '',
      });
      setEditingId(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormState({ name: '', description: '', requestTypeId: '' });
    setEditingId(null);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name as string]: value }));
  };

  const handleSubmit = async () => {
    if (!formState.name || !formState.requestTypeId) {
      enqueueSnackbar('لطفاً نام گروه و نوع درخواست را وارد کنید', { variant: 'error' });
      return;
    }

    try {
      if (editingId) {
        // ویرایش گروه موجود
        const response = await requestGroupService.updateGroup(editingId, {
          name: formState.name,
          description: formState.description,
        });
        
        if (response.success) {
          enqueueSnackbar('گروه درخواست با موفقیت بروزرسانی شد', { variant: 'success' });
          loadGroups();
        }
      } else {
        // ایجاد گروه جدید
        const response = await requestGroupService.createGroup({
          name: formState.name,
          description: formState.description,
          requestTypeId: Number(formState.requestTypeId),
        });
        
        if (response.success) {
          enqueueSnackbar('گروه درخواست با موفقیت ایجاد شد', { variant: 'success' });
          loadGroups();
        }
      }
      
      handleCloseDialog();
    } catch (err) {
      console.error('خطا در ذخیره گروه درخواست:', err);
      enqueueSnackbar('خطا در ذخیره گروه درخواست', { variant: 'error' });
    }
  };

  const handleDeleteGroup = async (id: number) => {
    if (window.confirm('آیا از حذف این گروه درخواست اطمینان دارید؟')) {
      try {
        const response = await requestGroupService.deleteGroup(id);
        
        if (response.success) {
          enqueueSnackbar(response.message, { variant: 'success' });
          loadGroups();
        }
      } catch (err) {
        console.error('خطا در حذف گروه درخواست:', err);
        enqueueSnackbar('خطا در حذف گروه درخواست', { variant: 'error' });
      }
    }
  };

  const getRequestTypeName = (id: number) => {
    const type = requestTypes.find(t => t.id === id);
    return type ? type.name : 'نامشخص';
  };

  const handleViewSubGroups = (groupId: number) => {
    navigate(`/request-groups/${groupId}/subgroups`);
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        مدیریت گروه‌های درخواست
      </Typography>
      
      <Grid container spacing={2} sx={{ mb: 2, mt: 1 }}>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel id="request-type-select-label">نوع درخواست</InputLabel>
            <Select
              labelId="request-type-select-label"
              id="request-type-select"
              value={selectedRequestType}
              label="نوع درخواست"
              onChange={(e) => setSelectedRequestType(e.target.value as number)}
            >
              {requestTypes.map((type) => (
                <MenuItem key={type.id} value={type.id}>
                  {type.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={8} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            disabled={!selectedRequestType}
          >
            گروه جدید
          </Button>
        </Grid>
      </Grid>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {loading ? (
        <LoadingIndicator />
      ) : groups.length === 0 ? (
        <Alert severity="info">
          هیچ گروه درخواستی برای نوع درخواست انتخاب شده یافت نشد.
        </Alert>
      ) : (
        <>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>نام گروه</TableCell>
                  <TableCell>توضیحات</TableCell>
                  <TableCell>نوع درخواست</TableCell>
                  <TableCell>زیرگروه‌ها</TableCell>
                  <TableCell>درخواست‌ها</TableCell>
                  <TableCell>وضعیت</TableCell>
                  <TableCell>عملیات</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {groups.map((group) => (
                  <TableRow key={group.id}>
                    <TableCell>{group.name}</TableCell>
                    <TableCell>{group.description || '-'}</TableCell>
                    <TableCell>{getRequestTypeName(group.requestTypeId)}</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleViewSubGroups(group.id)}
                      >
                        {group._count?.subGroups || 0} زیرگروه
                      </Button>
                    </TableCell>
                    <TableCell>{group._count?.requests || 0}</TableCell>
                    <TableCell>
                      <Chip
                        label={group.isActive ? 'فعال' : 'غیرفعال'}
                        color={group.isActive ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton 
                        color="primary" 
                        size="small"
                        onClick={() => handleOpenDialog(group)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        size="small"
                        onClick={() => handleDeleteGroup(group.id)}
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
      
      {/* دیالوگ افزودن/ویرایش گروه */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingId ? 'ویرایش گروه درخواست' : 'افزودن گروه درخواست جدید'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            name="name"
            label="نام گروه"
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
          {!editingId && (
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="request-type-form-label">نوع درخواست</InputLabel>
              <Select
                labelId="request-type-form-label"
                id="requestTypeId"
                name="requestTypeId"
                value={formState.requestTypeId}
                label="نوع درخواست"
                onChange={handleFormChange}
              >
                {requestTypes.map((type) => (
                  <MenuItem key={type.id} value={type.id.toString()}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
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

export default RequestGroupsPage; 