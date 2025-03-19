// client/src/pages/ContactsPage.tsx
// صفحه مدیریت طرف‌حساب‌ها

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
  TablePagination,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  CircularProgress,
  Tooltip,
  Chip,
  Snackbar,
  Alert,
  InputAdornment,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';
import ContactsIcon from '@mui/icons-material/Contacts';
import RefreshIcon from '@mui/icons-material/Refresh';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { Contact, ContactFilter } from '../types/contact.types';
import contactService from '../services/contactService';
import { getRelativeTime } from '../utils/dateUtils';
import { useToast } from '../contexts/ToastContext';
import { convertPersianToEnglishNumbers } from '../utils/stringUtils';
import { isValidMobileNumber } from '../utils/validators';

const ContactsPage: React.FC = () => {
  // استیت‌های مربوط به لیست طرف‌حساب‌ها
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ContactFilter>({
    page: 1,
    limit: 10,
    search: '',
  });
  const [totalItems, setTotalItems] = useState(0);

  // استیت‌های مربوط به دیالوگ‌ها
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [contactInput, setContactInput] = useState<Partial<Contact>>({
    companyName: '',
    ceoName: '',
    fieldOfActivity: '',
    accountantName: '',
    accountantPhone: '',
    email: '',
    address: '',
    bankInfo: {
      bankName: '',
      accountNumber: '',
      cardNumber: '',
      iban: '',
      accountOwner: '',
    },
  });
  const [dialogLoading, setDialogLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [openTokenDialog, setOpenTokenDialog] = useState(false);
  const [regeneratingToken, setRegeneratingToken] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // هوک‌های مورد نیاز
  const { showToast } = useToast();

  // استیت‌های اعتبارسنجی فرم
  const [errors, setErrors] = useState<Record<string, string>>({});

  // بارگذاری لیست طرف‌حساب‌ها
  useEffect(() => {
    fetchContacts();
  }, [filter]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await contactService.getContacts(filter);
      
      if (response.success) {
        setContacts(response.data);
        setTotalItems(response.pagination.totalItems);
      } else {
        showToast(response.message || 'خطا در دریافت لیست طرف‌حساب‌ها', 'error');
      }
    } catch (error: any) {
      showToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // تغییر صفحه و تعداد آیتم‌ها در هر صفحه
  const handleChangePage = (_: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setFilter(prev => ({ ...prev, page: newPage + 1 }));
  };
  
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(prev => ({
      ...prev,
      limit: parseInt(event.target.value, 10),
      page: 1,
    }));
  };
  
  // جستجو در لیست طرف‌حساب‌ها
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    setFilter(prev => ({
      ...prev,
      search: searchValue,
      page: 1,
    }));
  };
  
  // تغییر مقادیر فرم
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    // تبدیل اعداد فارسی به انگلیسی برای فیلدهای عددی
    const shouldConvertDigits = name === 'accountantPhone' || 
                              name === 'bankInfo.accountNumber' || 
                              name === 'bankInfo.cardNumber' || 
                              name === 'bankInfo.iban';
    
    const convertedValue = shouldConvertDigits ? convertPersianToEnglishNumbers(value) : value;
    
    // اگر فیلد مربوط به اطلاعات بانکی است
    if (name.startsWith('bankInfo.')) {
      const bankInfoField = name.split('.')[1];
      setContactInput((prev) => ({
        ...prev,
        bankInfo: {
          ...prev.bankInfo,
          [bankInfoField]: convertedValue,
        },
      }));
    } else {
      // در غیر این صورت، فیلد مستقیم است
      setContactInput((prev) => ({
        ...prev,
        [name]: convertedValue,
      }));
    }
    
    // پاک کردن خطای مربوط به فیلد
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // اعتبارسنجی فرم - فقط برای نام شرکت و شماره موبایل
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // اعتبارسنجی نام شرکت (تنها فیلد اجباری)
    if (!contactInput.companyName || contactInput.companyName.trim() === '') {
      newErrors.companyName = 'نام شرکت الزامی است';
    }
    
    // اعتبارسنجی شماره تلفن (تنها اگر وارد شده باشد)
    if (contactInput.accountantPhone && !isValidMobileNumber(contactInput.accountantPhone)) {
      newErrors.accountantPhone = 'شماره موبایل معتبر نیست';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // باز کردن دیالوگ ایجاد طرف‌حساب جدید
  const handleOpenCreateDialog = () => {
    setContactInput({
      companyName: '',
      ceoName: '',
      fieldOfActivity: '',
      accountantName: '',
      accountantPhone: '',
      email: '',
      address: '',
      bankInfo: {
        bankName: '',
        accountNumber: '',
        cardNumber: '',
        iban: '',
        accountOwner: '',
      },
    });
    setErrors({});
    setDialogMode('create');
    setOpenDialog(true);
  };
  
  // باز کردن دیالوگ ویرایش طرف‌حساب
  const handleOpenEditDialog = (contact: Contact) => {
    setSelectedContact(contact);
    
    // آماده‌سازی داده‌ها برای فرم
    setContactInput({
      companyName: contact.companyName,
      ceoName: contact.ceoName || '',
      fieldOfActivity: contact.fieldOfActivity || '',
      accountantName: contact.accountantName || '',
      accountantPhone: contact.accountantPhone || '',
      email: contact.email || '',
      address: contact.address || '',
      bankInfo: contact.bankInfo || {
        bankName: '',
        accountNumber: '',
        cardNumber: '',
        iban: '',
        accountOwner: '',
      },
    });
    
    setErrors({});
    setDialogMode('edit');
    setOpenDialog(true);
  };
  
  // باز کردن دیالوگ مشاهده جزئیات طرف‌حساب
  const handleOpenViewDialog = async (contactId: number) => {
    try {
      setDialogLoading(true);
      const contactDetails = await contactService.getContactById(contactId);
      setSelectedContact(contactDetails);
      setDialogMode('view');
      setOpenDialog(true);
    } catch (error: any) {
      showToast(error.message, 'error');
    } finally {
      setDialogLoading(false);
    }
  };
  
  // بستن دیالوگ
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedContact(null);
  };
  
  // ثبت فرم
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // اعتبارسنجی فرم
    if (!validateForm()) {
      return;
    }
    
    try {
      setDialogLoading(true);
      
      // اطلاعات طرف‌حساب را ارسال می‌کنیم - نیازی به تبدیل عددها نیست چون قبلاً انجام شده
      if (dialogMode === 'create') {
        // ایجاد طرف‌حساب جدید
        await contactService.createContact(contactInput);
        showToast('طرف‌حساب با موفقیت ایجاد شد', 'success');
      } else if (dialogMode === 'edit' && selectedContact) {
        // به‌روزرسانی طرف‌حساب
        await contactService.updateContact(selectedContact.id, contactInput);
        showToast('طرف‌حساب با موفقیت به‌روزرسانی شد', 'success');
      }
      
      // بستن دیالوگ و به‌روزرسانی لیست
      handleCloseDialog();
      fetchContacts();
    } catch (error: any) {
      showToast(error.message, 'error');
    } finally {
      setDialogLoading(false);
    }
  };
  
  // تایید حذف طرف‌حساب
  const handleConfirmDelete = (contactId: number) => {
    setConfirmDelete(contactId);
  };
  
  // حذف طرف‌حساب
  const handleDeleteContact = async () => {
    if (confirmDelete) {
      try {
        await contactService.deleteContact(confirmDelete);
        showToast('طرف‌حساب با موفقیت حذف شد', 'success');
        fetchContacts();
      } catch (error: any) {
        showToast(error.message, 'error');
      } finally {
        setConfirmDelete(null);
      }
    }
  };
  
  // باز کردن دیالوگ نمایش و بازتولید توکن
  const handleOpenTokenDialog = (contact: Contact) => {
    setSelectedContact(contact);
    setOpenTokenDialog(true);
  };
  
  // تولید مجدد توکن دسترسی
  const handleRegenerateToken = async (id: number) => {
    try {
      setRegeneratingToken(true);
      
      const newToken = await contactService.generateContactToken(id);
      
      // به‌روزرسانی لیست طرف‌حساب‌ها برای نمایش توکن جدید
      fetchContacts();
      
      // کپی کردن توکن در کلیپ‌بورد
      navigator.clipboard.writeText(newToken);
      
      showToast('توکن جدید با موفقیت تولید و در کلیپ‌بورد کپی شد', 'success');
    } catch (err: any) {
      showToast(err.message || 'خطا در تولید توکن جدید', 'error');
    } finally {
      setRegeneratingToken(false);
    }
  };
  
  // کپی توکن دسترسی
  const handleCopyToken = () => {
    if (selectedContact?.accessToken) {
      navigator.clipboard.writeText(selectedContact.accessToken);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };
  
  return (
    <Box>
      {/* هدر صفحه */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          مدیریت طرف‌حساب‌ها
        </Typography>
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenCreateDialog}
        >
          ثبت طرف‌حساب جدید
        </Button>
      </Box>
      
      {/* بخش جستجو */}
      <Paper sx={{ p: { xs: 1.5, sm: 2 }, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={8} md={6}>
            <TextField
              fullWidth
              placeholder="جستجو بر اساس نام شرکت، نام مدیرعامل، نام حسابدار یا شماره تماس..."
              value={filter.search}
              onChange={handleSearch}
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
      </Paper>
      
      {/* جدول طرف‌حساب‌ها */}
      <Paper>
        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>نام شرکت</TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>مدیرعامل</TableCell>
                <TableCell>حسابدار</TableCell>
                <TableCell>شماره تماس</TableCell>
                <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>ایمیل</TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>تاریخ ثبت</TableCell>
                <TableCell>عملیات</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    <CircularProgress size={40} />
                  </TableCell>
                </TableRow>
              ) : contacts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                      <ContactsIcon fontSize="large" color="disabled" />
                      <Typography variant="body1" color="text.secondary">
                        {filter.search 
                          ? 'نتیجه‌ای با جستجوی شما یافت نشد' 
                          : 'هنوز هیچ طرف‌حسابی ثبت نشده است'}
                      </Typography>
                      {filter.search && (
                        <Button 
                          variant="text" 
                          color="primary"
                          onClick={() => setFilter(prev => ({ ...prev, search: '' }))}
                        >
                          پاک کردن جستجو
                        </Button>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                contacts.map((contact) => (
                  <TableRow key={contact.id} hover>
                    <TableCell>{contact.companyName}</TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{contact.ceoName || '—'}</TableCell>
                    <TableCell>{contact.accountantName || '—'}</TableCell>
                    <TableCell>{contact.accountantPhone || '—'}</TableCell>
                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>{contact.email || '—'}</TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{getRelativeTime(contact.createdAt)}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="مشاهده جزئیات">
                          <IconButton 
                            color="info" 
                            size="small" 
                            onClick={() => handleOpenViewDialog(contact.id)}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="ویرایش">
                          <IconButton 
                            color="primary" 
                            size="small"
                            onClick={() => handleOpenEditDialog(contact)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="حذف">
                          <IconButton 
                            color="error" 
                            size="small"
                            onClick={() => handleConfirmDelete(contact.id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        {/* پیجینیشن */}
        <TablePagination
          component="div"
          count={totalItems}
          page={(filter.page || 1) - 1}
          onPageChange={handleChangePage}
          rowsPerPage={filter.limit || 10}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="تعداد در صفحه:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}–${to} از ${count !== -1 ? count : `بیش از ${to}`}`
          }
          rowsPerPageOptions={[5, 10, 25, 50]}
          sx={{
            '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
              margin: { xs: 0 },
            },
          }}
        />
      </Paper>
      
      {/* دیالوگ ایجاد/ویرایش/مشاهده طرف‌حساب */}
      <Dialog
        open={openDialog}
        onClose={dialogLoading ? undefined : handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {dialogMode === 'create'
            ? 'ثبت طرف‌حساب جدید'
            : dialogMode === 'edit'
            ? 'ویرایش طرف‌حساب'
            : 'مشاهده اطلاعات طرف‌حساب'}
        </DialogTitle>
        
        <DialogContent dividers>
          {dialogLoading ? (
            <Box display="flex" justifyContent="center" my={3}>
              <CircularProgress />
            </Box>
          ) : dialogMode === 'view' && selectedContact ? (
            // نمایش اطلاعات
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      <BusinessIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize: '1.2rem' }} />
                      اطلاعات شرکت
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary" fontSize="0.8rem">
                          نام شرکت:
                        </Typography>
                        <Typography variant="body2">
                          {selectedContact.companyName}
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary" fontSize="0.8rem">
                          مدیرعامل:
                        </Typography>
                        <Typography variant="body2">
                          {selectedContact.ceoName || '—'}
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary" fontSize="0.8rem">
                          زمینه فعالیت:
                        </Typography>
                        <Typography variant="body2">
                          {selectedContact.fieldOfActivity || '—'}
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary" fontSize="0.8rem">
                          آدرس:
                        </Typography>
                        <Typography variant="body2">
                          {selectedContact.address || '—'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      <PersonIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize: '1.2rem' }} />
                      اطلاعات تماس
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary" fontSize="0.8rem">
                          نام حسابدار:
                        </Typography>
                        <Typography variant="body2">
                          {selectedContact.accountantName || '—'}
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary" fontSize="0.8rem">
                          شماره تماس:
                        </Typography>
                        <Typography variant="body2">
                          {selectedContact.accountantPhone || '—'}
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary" fontSize="0.8rem">
                          ایمیل:
                        </Typography>
                        <Typography variant="body2">
                          {selectedContact.email || '—'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              
              {selectedContact.bankInfo && Object.values(selectedContact.bankInfo).some(value => value) && (
                <Grid item xs={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        <AccountBalanceIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize: '1.2rem' }} />
                        اطلاعات بانکی
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      
                      <Grid container spacing={2}>
                        {selectedContact.bankInfo.bankName && (
                          <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle2" color="text.secondary" fontSize="0.8rem">
                              نام بانک:
                            </Typography>
                            <Typography variant="body2">
                              {selectedContact.bankInfo.bankName}
                            </Typography>
                          </Grid>
                        )}
                        
                        {selectedContact.bankInfo.accountNumber && (
                          <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle2" color="text.secondary" fontSize="0.8rem">
                              شماره حساب:
                            </Typography>
                            <Typography variant="body2">
                              {selectedContact.bankInfo.accountNumber}
                            </Typography>
                          </Grid>
                        )}
                        
                        {selectedContact.bankInfo.cardNumber && (
                          <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle2" color="text.secondary" fontSize="0.8rem">
                              شماره کارت:
                            </Typography>
                            <Typography variant="body2">
                              {selectedContact.bankInfo.cardNumber}
                            </Typography>
                          </Grid>
                        )}
                        
                        {selectedContact.bankInfo.iban && (
                          <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle2" color="text.secondary" fontSize="0.8rem">
                              شماره شبا:
                            </Typography>
                            <Typography variant="body2">
                              {selectedContact.bankInfo.iban}
                            </Typography>
                          </Grid>
                        )}
                        
                        {selectedContact.bankInfo.accountOwner && (
                          <Grid item xs={12}>
                            <Typography variant="subtitle2" color="text.secondary" fontSize="0.8rem">
                              صاحب حساب:
                            </Typography>
                            <Typography variant="body2">
                              {selectedContact.bankInfo.accountOwner}
                            </Typography>
                          </Grid>
                        )}
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              )}
              
              {selectedContact.paymentRequests && selectedContact.paymentRequests.length > 0 && (
                <Grid item xs={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        آخرین پرداخت‌ها
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      
                      <List sx={{ p: 0 }}>
                        {selectedContact.paymentRequests.map(payment => (
                          <ListItem key={payment.id} divider sx={{ px: 1 }}>
                            <ListItemText
                              primary={payment.title}
                              secondary={getRelativeTime(payment.createdAt)}
                              primaryTypographyProps={{ variant: 'body2' }}
                              secondaryTypographyProps={{ variant: 'caption' }}
                            />
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                              <Typography variant="body2" component="span" sx={{ mb: 0.5 }}>
                                {payment.amount.toLocaleString()} ریال
                              </Typography>
                              <Chip
                                size="small"
                                label={
                                  payment.status === 'PAID' ? 'پرداخت شده' :
                                  payment.status === 'PENDING' ? 'در انتظار پرداخت' :
                                  payment.status === 'APPROVED' ? 'تأیید شده' : 'رد شده'
                                }
                                color={
                                  payment.status === 'PAID' ? 'success' :
                                  payment.status === 'PENDING' ? 'warning' :
                                  payment.status === 'APPROVED' ? 'info' : 'error'
                                }
                              />
                            </Box>
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </Grid>
          ) : (
          // فرم ایجاد/ویرایش
          <Box component="form" noValidate onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                اطلاعات شرکت
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="نام شرکت"
                name="companyName"
                value={contactInput.companyName || ''}
                onChange={handleInputChange}
                error={!!errors.companyName}
                helperText={errors.companyName}
                size="small"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="نام مدیرعامل"
                name="ceoName"
                value={contactInput.ceoName || ''}
                onChange={handleInputChange}
                size="small"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="زمینه فعالیت"
                name="fieldOfActivity"
                value={contactInput.fieldOfActivity || ''}
                onChange={handleInputChange}
                size="small"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="آدرس"
                name="address"
                value={contactInput.address || ''}
                onChange={handleInputChange}
                multiline
                rows={2}
                size="small"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 1 }}>
                اطلاعات تماس
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="نام حسابدار"
                name="accountantName"
                value={contactInput.accountantName || ''}
                onChange={handleInputChange}
                size="small"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="شماره موبایل حسابدار"
                name="accountantPhone"
                value={contactInput.accountantPhone || ''}
                onChange={handleInputChange}
                error={!!errors.accountantPhone}
                helperText={errors.accountantPhone}
                placeholder="09123456789"
                size="small"
                InputProps={{
                  startAdornment: <InputAdornment position="start">
                    <PhoneIcon fontSize="small" />
                  </InputAdornment>,
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="آدرس ایمیل"
                name="email"
                type="email"
                value={contactInput.email || ''}
                onChange={handleInputChange}
                error={!!errors.email}
                helperText={errors.email}
                placeholder="example@example.com"
                size="small"
                InputProps={{
                  startAdornment: <InputAdornment position="start">
                    <EmailIcon fontSize="small" />
                  </InputAdornment>,
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 1 }}>
                اطلاعات بانکی
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="نام بانک"
                name="bankInfo.bankName"
                value={contactInput.bankInfo?.bankName || ''}
                onChange={handleInputChange}
                size="small"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="شماره حساب"
                name="bankInfo.accountNumber"
                value={contactInput.bankInfo?.accountNumber || ''}
                onChange={handleInputChange}
                size="small"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="شماره کارت"
                name="bankInfo.cardNumber"
                value={contactInput.bankInfo?.cardNumber || ''}
                onChange={handleInputChange}
                error={!!errors['bankInfo.cardNumber']}
                helperText={errors['bankInfo.cardNumber']}
                placeholder="6104XXXXXXXXXXXX"
                size="small"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="شماره شبا"
                name="bankInfo.iban"
                value={contactInput.bankInfo?.iban || ''}
                onChange={handleInputChange}
                error={!!errors['bankInfo.iban']}
                helperText={errors['bankInfo.iban']}
                placeholder="IR060120000000000000000"
                size="small"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="نام صاحب حساب"
                name="bankInfo.accountOwner"
                value={contactInput.bankInfo?.accountOwner || ''}
                onChange={handleInputChange}
                size="small"
              />
            </Grid>
          </Grid>
        </Box>
      )}
    </DialogContent>
    
    <DialogActions>
      {dialogMode === 'view' ? (
        <>
          <Button 
            variant="outlined" 
            color="primary" 
            onClick={() => {
              handleCloseDialog();
              if (selectedContact) {
                handleOpenTokenDialog(selectedContact);
              }
            }}
          >
            مشاهده توکن دسترسی
          </Button>
          <Button onClick={handleCloseDialog}>بستن</Button>
        </>
      ) : (
        <>
          <Button onClick={handleCloseDialog} disabled={dialogLoading}>
            انصراف
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            type="submit"
            onClick={handleSubmit}
            disabled={dialogLoading}
          >
            {dialogLoading ? <CircularProgress size={24} /> : dialogMode === 'create' ? 'ایجاد' : 'ذخیره تغییرات'}
          </Button>
        </>
      )}
    </DialogActions>
  </Dialog>
  
  {/* دیالوگ نمایش و بازتولید توکن */}
  <Dialog
    open={openTokenDialog}
    onClose={() => setOpenTokenDialog(false)}
    maxWidth="sm"
    fullWidth
  >
    <DialogTitle>توکن دسترسی طرف‌حساب</DialogTitle>
    <DialogContent>
      <Typography variant="body2" color="text.secondary" paragraph>
        از این توکن برای احراز هویت طرف‌حساب در پورتال استفاده می‌شود. این توکن را برای طرف‌حساب ارسال کنید.
      </Typography>
      
      <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1, mb: 2 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography
            variant="body2"
            sx={{
              fontFamily: 'monospace',
              wordBreak: 'break-all',
              mr: 1,
            }}
          >
            {selectedContact?.accessToken || ''}
          </Typography>
          <Tooltip title="کپی توکن">
            <IconButton onClick={handleCopyToken} color={copySuccess ? 'success' : 'default'}>
              <ContentCopyIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      
      <Typography variant="body2" color="warning.main" paragraph>
        هشدار: بازتولید توکن باعث غیرفعال شدن توکن قبلی می‌شود.
      </Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={() => setOpenTokenDialog(false)}>بستن</Button>
      <Button
        variant="outlined"
        color="warning"
        onClick={() => handleRegenerateToken(selectedContact?.id || 0)}
        disabled={regeneratingToken}
        startIcon={regeneratingToken ? <CircularProgress size={16} /> : <RefreshIcon />}
      >
        بازتولید توکن
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
    <DialogTitle>تایید حذف طرف‌حساب</DialogTitle>
    <DialogContent>
      <Typography variant="body1">
        آیا از حذف این طرف‌حساب اطمینان دارید؟
        این عملیات غیرقابل بازگشت است.
      </Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={() => setConfirmDelete(null)}>انصراف</Button>
      <Button onClick={handleDeleteContact} variant="contained" color="error">
        حذف
      </Button>
    </DialogActions>
  </Dialog>
  
  {/* نمایش پیام‌ها */}
  <Snackbar
    open={copySuccess}
    autoHideDuration={2000}
    onClose={() => setCopySuccess(false)}
  >
    <Alert severity="success" sx={{ width: '100%' }}>
      توکن با موفقیت کپی شد
    </Alert>
  </Snackbar>
</Box>
);
};

export default ContactsPage;