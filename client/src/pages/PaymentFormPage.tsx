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
  InputAdornment,
  CircularProgress,
  Divider,
  Paper,
  Alert,
  IconButton,
  useTheme,
  useMediaQuery,
  Stack,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  AttachMoney as MoneyIcon,
  Phone as PhoneIcon,
  Person as PersonIcon,
  KeyboardReturn as ReturnIcon,
} from '@mui/icons-material';
import { usePayments } from '../hooks/usePayments';
import { useContacts } from '../hooks/useContacts';
import { useToast } from '../contexts/ToastContext';
import { convertPersianToEnglishNumbers, formatAmountWithCommas } from '../utils/stringUtils';
import { formatDateToISO } from '../utils/dateUtils';
import { SelectChangeEvent } from '@mui/material/Select';
import JalaliDatePicker from '../components/common/JalaliDatePicker';
import ContactSearchDropdown from '../components/common/ContactSearchDropdown';
import { Contact } from '../types/contact.types';

const PaymentFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { getPaymentById, createPayment, updatePayment } = usePayments();
  const { loading: contactsLoading } = useContacts();
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [isEditMode] = useState<boolean>(!!id);
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    effectiveDate: '',
    description: '',
    contactId: '',
    beneficiaryName: '',
    beneficiaryPhone: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [useContact, setUseContact] = useState<boolean>(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [manualBeneficiary, setManualBeneficiary] = useState<boolean>(false);

  // بارگذاری اطلاعات برای حالت ویرایش
  useEffect(() => {
    const loadPayment = async (): Promise<void> => {
      if (id) {
        try {
          setLoading(true);
          const paymentId = parseInt(id);
          const payment = await getPaymentById(paymentId);

          // تنظیم فرم با داده‌های پرداخت
          setFormData({
            title: payment.title,
            amount: payment.amount.toString(),
            effectiveDate: payment.effectiveDate.substring(0, 10), // فقط تاریخ، بدون زمان
            description: payment.description || '',
            contactId: payment.contactId?.toString() || '',
            beneficiaryName: payment.beneficiaryName || '',
            beneficiaryPhone: payment.beneficiaryPhone || '',
          });

          // اگر طرف‌حساب داشت
          if (payment.contactId) {
            setUseContact(true);
            setSelectedContact(payment.contact || null);
          }

          // اگر اطلاعات ذینفع دستی وارد شده بود
          if (payment.beneficiaryName || payment.beneficiaryPhone) {
            setManualBeneficiary(true);
          }
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
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    
    if (name) {
      // پاکسازی خطاهای مربوط به فیلد
      setFormErrors(prev => ({ ...prev, [name]: '' }));
      
      // اعمال مقدار جدید
      if (name === 'amount' && typeof value === 'string') {
        // تبدیل اعداد فارسی به انگلیسی و فرمت کردن با کاما
        const processedValue = formatAmountWithCommas(convertPersianToEnglishNumbers(value));
        setFormData(prev => ({ ...prev, [name]: processedValue }));
      } else if (name === 'beneficiaryPhone' && typeof value === 'string') {
        // تبدیل اعداد فارسی به انگلیسی برای شماره موبایل
        const processedValue = convertPersianToEnglishNumbers(value);
        setFormData(prev => ({ ...prev, [name]: processedValue }));
      } else {
        setFormData(prev => ({ ...prev, [name]: value as string }));
      }
    }
  };

  // مدیریت تغییر تاریخ
  const handleDateChange = (date: string) => {
    setFormData(prev => ({ ...prev, effectiveDate: date }));
    setFormErrors(prev => ({ ...prev, effectiveDate: '' }));
  };

  // مدیریت انتخاب طرف‌حساب
  const handleContactChange = (contact: Contact | null) => {
    setSelectedContact(contact);
    
    // محافظت در برابر خطای داده‌های ناقص
    if (contact && typeof contact === 'object' && 'id' in contact) {
      setFormData(prev => ({ 
        ...prev, 
        contactId: contact.id.toString(),
        beneficiaryName: !manualBeneficiary ? (contact.contactPerson || '') : prev.beneficiaryName,
        beneficiaryPhone: !manualBeneficiary ? (contact.phone || '') : prev.beneficiaryPhone,
      }));
      // وقتی مخاطب انتخاب می‌شود، لاگ ثبت می‌کنیم
      console.log("مخاطب انتخاب شد:", contact);
    } else {
      setFormData(prev => ({ 
        ...prev, 
        contactId: '',
        // اگر اطلاعات دستی نیست، پاک کن
        beneficiaryName: !manualBeneficiary ? '' : prev.beneficiaryName,
        beneficiaryPhone: !manualBeneficiary ? '' : prev.beneficiaryPhone,
      }));
      
      if (contact) {
        // لاگ برای اشکال‌زدایی
        console.warn("داده‌های مخاطب معتبر نیست:", contact);
      }
    }
  };

  // وضعیت استفاده از طرف‌حساب
  const handleUseContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setUseContact(checked);
    
    if (!checked) {
      // اگر طرف‌حساب غیرفعال شد، مقدار آن را پاک کن
      setSelectedContact(null);
      setFormData(prev => ({ ...prev, contactId: '' }));
    }
  };

  // وضعیت ورود دستی اطلاعات ذینفع
  const handleManualBeneficiaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setManualBeneficiary(e.target.checked);
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
        const cleanAmount = value.toString().replace(/,/g, '');
        if (!cleanAmount) {
          newErrors[name] = 'مبلغ الزامی است';
        } else if (parseInt(cleanAmount) <= 0) {
          newErrors[name] = 'مبلغ باید بزرگتر از صفر باشد';
        }
        break;
      case 'effectiveDate':
        if (!value) {
          newErrors[name] = 'تاریخ الزامی است';
        }
        break;
      case 'beneficiaryPhone':
        // تبدیل اعداد فارسی به انگلیسی
        const englishPhone = convertPersianToEnglishNumbers(value.toString());
        // اگر شماره وارد شده اما فرمت آن صحیح نیست
        if (englishPhone && !/^(0|\+98)?9\d{9}$/.test(englishPhone)) {
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

    try {
      setSaving(true);
      
      // آماده‌سازی داده‌ها
      const paymentFormData = {
        title: formData.title,
        amount: parseInt(formData.amount.replace(/,/g, '')),
        effectiveDate: formatDateToISO(formData.effectiveDate),
        description: formData.description || undefined,
        contactId: useContact && formData.contactId ? parseInt(formData.contactId) : null,
        beneficiaryName: formData.beneficiaryName || undefined,
        beneficiaryPhone: formData.beneficiaryPhone || undefined,
      };

      try {
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
        console.error("خطا در ذخیره پرداخت:", err);
        setError(err.message || 'خطا در ثبت درخواست پرداخت');
        showToast(err.message || 'خطا در ثبت درخواست پرداخت. لطفاً از اتصال به سرور اطمینان حاصل کنید.', 'error');
      }
    } catch (err: any) {
      console.error("خطا در آماده‌سازی داده‌ها:", err);
      setError('خطا در پردازش اطلاعات فرم');
      showToast('خطا در پردازش اطلاعات فرم', 'error');
    } finally {
      setSaving(false);
    }
  };

  // نمایش بارگذاری
  if (loading || contactsLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={isMobile ? 1 : 3}>
      <Paper sx={{ p: isMobile ? 1 : 2, mb: 3 }}>
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton onClick={() => navigate('/payments')}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant={isMobile ? 'h6' : 'h5'}>
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
        <CardContent sx={{ p: isMobile ? 1 : 2 }}>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={isMobile ? 2 : 3}>
              {/* بخش عنوان و مبلغ */}
              <Grid item xs={12}>
                <Divider textAlign="right" sx={{ mb: 2 }}>
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
                        <MoneyIcon color="action" />
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
                  placeholder="مثال: 5,000,000"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MoneyIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">ریال</InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <JalaliDatePicker
                  value={formData.effectiveDate}
                  onChange={handleDateChange}
                  label="تاریخ پرداخت"
                  error={!!formErrors.effectiveDate}
                  helperText={formErrors.effectiveDate}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  id="description"
                  name="description"
                  label="توضیحات"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="توضیحات تکمیلی پرداخت..."
                  multiline
                  rows={2}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                        <ReturnIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* بخش اطلاعات ذینفع */}
              <Grid item xs={12}>
                <Divider textAlign="right" sx={{ mt: 1, mb: 2 }}>
                  <Typography variant="subtitle1" color="primary">
                    اطلاعات ذینفع
                  </Typography>
                </Divider>
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={useContact} 
                      onChange={handleUseContactChange}
                      color="primary"
                    />
                  }
                  label="ذینفع از طرف‌حساب‌ها انتخاب شود"
                />
              </Grid>

              {useContact && (
                <Grid item xs={12}>
                  <ContactSearchDropdown
                    value={selectedContact}
                    onChange={handleContactChange}
                    fullWidth
                    label="انتخاب طرف‌حساب"
                    placeholder="جستجوی نام شرکت یا طرف‌حساب..."
                  />
                </Grid>
              )}

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={manualBeneficiary} 
                      onChange={handleManualBeneficiaryChange}
                      color="primary"
                    />
                  }
                  label="اطلاعات ذینفع را به صورت دستی وارد می‌کنم"
                />
              </Grid>

              {manualBeneficiary && (
                <>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      id="beneficiaryName"
                      name="beneficiaryName"
                      label="نام و نام‌خانوادگی ذینفع"
                      value={formData.beneficiaryName}
                      onChange={handleInputChange}
                      placeholder="مثال: علی محمدی"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon color="action" />
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
                      helperText={formErrors.beneficiaryPhone}
                      placeholder="مثال: 09123456789"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </>
              )}

              {/* بخش دکمه‌ها */}
              <Grid item xs={12}>
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <Stack direction={isMobile ? 'column' : 'row'} spacing={2} width={isMobile ? '100%' : 'auto'}>
                    <Button
                      variant="outlined"
                      onClick={() => navigate('/payments')}
                      startIcon={<ArrowBackIcon />}
                      fullWidth={isMobile}
                    >
                      انصراف
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                      disabled={saving}
                      fullWidth={isMobile}
                    >
                      {isEditMode ? 'به‌روزرسانی' : 'ذخیره'}
                    </Button>
                  </Stack>
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