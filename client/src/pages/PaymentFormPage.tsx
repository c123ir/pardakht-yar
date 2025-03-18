// client/src/pages/PaymentFormPage.tsx
// صفحه ایجاد و ویرایش پرداخت

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  CircularProgress,
  Divider,
  Paper,
  Alert,
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  Group as GroupIcon,
  Business as BusinessIcon,
  PermContactCalendar as ContactIcon,
  AttachMoney as MoneyIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { usePayments } from '../hooks/usePayments';
import { useGroups } from '../hooks/useGroups';
import { useContacts } from '../hooks/useContacts';
import { useToast } from '../contexts/ToastContext';
import { convertPersianToEnglishNumbers } from '../utils/stringUtils';
import { formatDateToISO } from '../utils/dateUtils';
import { PaymentRequest } from '../types/payment.types';

const PaymentFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { getPaymentById, createPayment, updatePayment } = usePayments();
  const { groups, loading: groupsLoading } = useGroups();
  const { contacts, loading: contactsLoading } = useContacts();

  const [isEditMode] = useState<boolean>(!!id);
  const [paymentData, setPaymentData] = useState<PaymentRequest | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    effectiveDate: '',
    description: '',
    groupId: '',
    contactId: '',
    beneficiaryName: '',
    beneficiaryPhone: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // بارگذاری اطلاعات برای حالت ویرایش
  useEffect(() => {
    const loadPayment = async (): Promise<void> => {
      if (id) {
        try {
          setLoading(true);
          const paymentId = parseInt(id);
          const payment = await getPaymentById(paymentId);
          setPaymentData(payment);

          // تنظیم فرم با داده‌های پرداخت
          setFormData({
            title: payment.title,
            amount: payment.amount.toString(),
            effectiveDate: payment.effectiveDate.substring(0, 10), // فقط تاریخ، بدون زمان
            description: payment.description || '',
            groupId: payment.groupId?.toString() || '',
            contactId: payment.contactId?.toString() || '',
            beneficiaryName: payment.beneficiaryName || '',
            beneficiaryPhone: payment.beneficiaryPhone || '',
          });
        } catch (err: any) {
          setError(err.message || 'خطا در دریافت اطلاعات پرداخت');
          showToast(err.message || 'خطا در دریافت اطلاعات پرداخت', 'error');
        } finally {
          setLoading(false);
        }
      }
    };

    loadPayment();
  }, [id, getPaymentById, showToast]);

  // مدیریت تغییرات فرم
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;

    // اعتبارسنجی مقادیر
    validateField(name as string, value as string);

    if (name === 'amount' || name === 'beneficiaryPhone') {
      // تبدیل اعداد فارسی به انگلیسی
      const englishValue = convertPersianToEnglishNumbers(value as string);
      
      // فقط اعداد برای مبلغ
      if (name === 'amount') {
        const numericValue = englishValue.replace(/\D/g, '');
        setFormData(prev => ({ ...prev, [name]: numericValue }));
      } else {
        setFormData(prev => ({ ...prev, [name]: englishValue }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name as string]: value as string }));
    }
  };

  // اعتبارسنجی یک فیلد
  const validateField = (name: string, value: string | number): boolean => {
    const newErrors = { ...formErrors };

    // حذف خطای قبلی
    delete newErrors[name];

    // بررسی‌های اعتبارسنجی
    switch (name) {
      case 'title':
        if (!value) {
          newErrors[name] = 'عنوان الزامی است';
        } else if (value.toString().length < 3) {
          newErrors[name] = 'عنوان باید حداقل 3 کاراکتر باشد';
        }
        break;
      case 'amount':
        if (!value) {
          newErrors[name] = 'مبلغ الزامی است';
        } else if (parseInt(value.toString()) <= 0) {
          newErrors[name] = 'مبلغ باید بزرگتر از صفر باشد';
        }
        break;
      case 'effectiveDate':
        if (!value) {
          newErrors[name] = 'تاریخ الزامی است';
        }
        break;
      case 'beneficiaryPhone':
        if (value && !/^09\d{9}$/.test(convertPersianToEnglishNumbers(value.toString()))) {
          newErrors[name] = 'شماره موبایل نامعتبر است';
        }
        break;
      default:
        break;
    }

    // به‌روزرسانی خطاها
    setFormErrors(newErrors);
    return !newErrors[name]; // برگرداندن وضعیت اعتبارسنجی
  };

  // اعتبارسنجی کل فرم
  const validateForm = (): boolean => {
    // بررسی هر فیلد
    const titleIsValid = validateField('title', formData.title);
    const amountIsValid = validateField('amount', formData.amount);
    const dateIsValid = validateField('effectiveDate', formData.effectiveDate);
    const phoneIsValid = formData.beneficiaryPhone
      ? validateField('beneficiaryPhone', formData.beneficiaryPhone)
      : true;

    // فرم معتبر است اگر همه فیلدهای اجباری معتبر باشند
    return titleIsValid && amountIsValid && dateIsValid && phoneIsValid;
  };

  // ارسال فرم
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    // اعتبارسنجی فرم
    if (!validateForm()) {
      showToast('لطفاً اطلاعات فرم را بررسی کنید', 'error');
      return;
    }

    // آماده‌سازی داده‌ها
    const paymentFormData = {
      title: formData.title,
      amount: parseInt(formData.amount),
      effectiveDate: formatDateToISO(formData.effectiveDate),
      description: formData.description || undefined,
      groupId: formData.groupId ? parseInt(formData.groupId) : null,
      contactId: formData.contactId ? parseInt(formData.contactId) : null,
      beneficiaryName: formData.beneficiaryName || undefined,
      beneficiaryPhone: formData.beneficiaryPhone || undefined,
    };

    try {
      setSaving(true);
      if (isEditMode && id) {
        // ویرایش پرداخت موجود
        await updatePayment(parseInt(id), paymentFormData);
        showToast('درخواست پرداخت با موفقیت به‌روزرسانی شد', 'success');
      } else {
        // ایجاد پرداخت جدید
        await createPayment(paymentFormData);
        showToast('درخواست پرداخت با موفقیت ایجاد شد', 'success');
      }
      navigate('/payments');
    } catch (err: any) {
      setError(err.message || 'خطا در ثبت درخواست پرداخت');
      showToast(err.message || 'خطا در ثبت درخواست پرداخت', 'error');
    } finally {
      setSaving(false);
    }
  };

  // نمایش بارگذاری
  if (loading || groupsLoading || contactsLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton onClick={() => navigate('/payments')}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5">
            {isEditMode ? 'ویرایش درخواست پرداخت' : 'ثبت درخواست پرداخت جدید'}
          </Typography>
        </Box>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Card>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={3}>
              {/* بخش عنوان و مبلغ */}
              <Grid item xs={12}>
                <Divider textAlign="left" sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" color="primary">
                    اطلاعات اصلی
                  </Typography>
                </Divider>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  id="title"
                  name="title"
                  label="عنوان پرداخت"
                  value={formData.title}
                  onChange={handleInputChange}
                  error={!!formErrors.title}
                  helperText={formErrors.title}
                  placeholder="مثال: پرداخت حقوق مهرماه"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MoneyIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  id="amount"
                  name="amount"
                  label="مبلغ (ریال)"
                  value={formData.amount}
                  onChange={handleInputChange}
                  error={!!formErrors.amount}
                  helperText={formErrors.amount}
                  placeholder="مثال: 5000000"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MoneyIcon />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">ریال</InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  id="effectiveDate"
                  name="effectiveDate"
                  label="تاریخ پرداخت"
                  type="date"
                  value={formData.effectiveDate}
                  onChange={handleInputChange}
                  error={!!formErrors.effectiveDate}
                  helperText={formErrors.effectiveDate}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id="group-label">گروه پرداخت</InputLabel>
                  <Select
                    labelId="group-label"
                    id="groupId"
                    name="groupId"
                    value={formData.groupId}
                    onChange={handleInputChange}
                    label="گروه پرداخت"
                    startAdornment={
                      <InputAdornment position="start">
                        <GroupIcon />
                      </InputAdornment>
                    }
                  >
                    <MenuItem value="">
                      <em>انتخاب نشده</em>
                    </MenuItem>
                    {groups?.map((group) => (
                      <MenuItem key={group.id} value={group.id.toString()}>
                        {group.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* بخش طرف حساب و ذینفع */}
              <Grid item xs={12}>
                <Divider textAlign="left" sx={{ mt: 1, mb: 2 }}>
                  <Typography variant="subtitle1" color="primary">
                    اطلاعات ذینفع
                  </Typography>
                </Divider>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id="contact-label">طرف حساب</InputLabel>
                  <Select
                    labelId="contact-label"
                    id="contactId"
                    name="contactId"
                    value={formData.contactId}
                    onChange={handleInputChange}
                    label="طرف حساب"
                    startAdornment={
                      <InputAdornment position="start">
                        <BusinessIcon />
                      </InputAdornment>
                    }
                  >
                    <MenuItem value="">
                      <em>انتخاب نشده</em>
                    </MenuItem>
                    {contacts?.map((contact) => (
                      <MenuItem key={contact.id} value={contact.id.toString()}>
                        {contact.companyName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="beneficiaryName"
                  name="beneficiaryName"
                  label="نام ذینفع"
                  value={formData.beneficiaryName}
                  onChange={handleInputChange}
                  placeholder="مثال: آقای محمد حسینی"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ContactIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="beneficiaryPhone"
                  name="beneficiaryPhone"
                  label="شماره موبایل ذینفع"
                  value={formData.beneficiaryPhone}
                  onChange={handleInputChange}
                  error={!!formErrors.beneficiaryPhone}
                  helperText={formErrors.beneficiaryPhone || 'برای ارسال پیامک پرداخت استفاده می‌شود'}
                  placeholder="مثال: 09123456789"
                />
              </Grid>

              {/* بخش توضیحات */}
              <Grid item xs={12}>
                <Divider textAlign="left" sx={{ mt: 1, mb: 2 }}>
                  <Typography variant="subtitle1" color="primary">
                    توضیحات
                  </Typography>
                </Divider>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="description"
                  name="description"
                  label="توضیحات پرداخت"
                  value={formData.description}
                  onChange={handleInputChange}
                  multiline
                  rows={3}
                  placeholder="توضیحات تکمیلی درباره این پرداخت..."
                />
              </Grid>

              {/* دکمه‌های عملیات */}
              <Grid item xs={12}>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                  <Button
                    variant="outlined"
                    color="inherit"
                    onClick={() => navigate('/payments')}
                    startIcon={<ArrowBackIcon />}
                    disabled={saving}
                  >
                    انصراف
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                    disabled={saving}
                  >
                    {isEditMode ? 'به‌روزرسانی' : 'ثبت درخواست'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PaymentFormPage;