// client/src/pages/SmsSettingsPage.tsx
// صفحه تنظیمات پیامکی

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  FormControlLabel,
  Switch,
  Divider,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  InputAdornment,
  IconButton,
  Chip,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import SendIcon from '@mui/icons-material/Send';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import smsService from '../services/smsService';
import { convertPersianToEnglishNumbers } from '../utils/stringUtils';
import { useToast } from '../hooks/useToast';

interface SmsSettings {
  provider: string;
  username: string;
  password: string;
  from: string;
  isActive: boolean;
}

const SmsSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<SmsSettings>({
    provider: '0098sms',
    username: '',
    password: '',
    from: '',
    isActive: false,
  });
  const [saving, setSaving] = useState(false);
  const [testNumber, setTestNumber] = useState('');
  const [testMessage, setTestMessage] = useState('پیامک آزمایشی پرداخت‌یار');
  const [sendingTest, setSendingTest] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [lastMessageId, setLastMessageId] = useState<string | null>(null);
  const [deliveryStatus, setDeliveryStatus] = useState<{status: string | null, message: string} | null>(null);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const { showToast } = useToast();

  // بارگذاری تنظیمات
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setError(null);
    try {
      const response = await smsService.getSettings();
      if (response.success && response.data) {
        setSettings(response.data);
      } else {
        setError(response.message || 'خطا در دریافت تنظیمات');
      }
    } catch (err) {
      setError((err as Error).message);
    }
  };

  // تغییر مقادیر تنظیمات
  const handleChange = (field: keyof SmsSettings) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value, checked, type } = event.target;
    
    // تبدیل اعداد فارسی به انگلیسی
    let newValue = value;
    if (field === 'from') {
      newValue = convertPersianToEnglishNumbers(value);
    }
    
    setSettings((prev) => ({
      ...prev,
      [field]: type === 'checkbox' ? checked : newValue,
    }));
  };

  // ذخیره تنظیمات
  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const response = await smsService.updateSettings(settings);
      if (response.success) {
        showToast('تنظیمات با موفقیت ذخیره شد', 'success');
        // بعد از ذخیره، اطلاعات اعتبار را به‌روزرسانی می‌کنیم
        fetchSettings();
      } else {
        setError(response.message || 'خطا در ذخیره تنظیمات');
        showToast(response.message || 'خطا در ذخیره تنظیمات', 'error');
      }
    } catch (err) {
      setError((err as Error).message);
      showToast((err as Error).message, 'error');
    } finally {
      setSaving(false);
    }
  };

  // تغییر شماره موبایل برای تست
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // تبدیل اعداد فارسی به انگلیسی
    const convertedValue = convertPersianToEnglishNumbers(value);
    setTestNumber(convertedValue);
  };

  // ارسال پیامک آزمایشی
  const handleSendTest = async () => {
    if (!testNumber || !testMessage) {
      showToast('لطفا شماره و متن پیام را وارد کنید', 'error');
      return;
    }

    if (!/^09[0-9]{9}$/.test(testNumber)) {
      showToast('شماره موبایل نامعتبر است', 'error');
      return;
    }

    try {
      setSendingTest(true);
      setDeliveryStatus(null); // پاک کردن وضعیت قبلی
      const response = await smsService.sendTestSms(testNumber, testMessage);
      if (response.success) {
        showToast('پیامک آزمایشی با موفقیت ارسال شد', 'success');
        // ذخیره شناسه پیامک برای پیگیری وضعیت
        if (response.data?.messageId) {
          setLastMessageId(response.data.messageId);
        }
      } else {
        showToast(response.message || 'خطا در ارسال پیامک آزمایشی', 'error');
      }
    } catch (err) {
      setError((err as Error).message);
      showToast((err as Error).message, 'error');
    } finally {
      setSendingTest(false);
    }
  };

  // بررسی وضعیت تحویل پیامک
  const checkDeliveryStatus = async () => {
    if (!lastMessageId) {
      showToast('شناسه پیامک نامعتبر است', 'error');
      return;
    }

    try {
      setCheckingStatus(true);
      const response = await smsService.getSmsDeliveryStatus(lastMessageId);
      if (response.success && response.data) {
        setDeliveryStatus({
          status: response.data.status,
          message: response.data.message
        });
        showToast(`وضعیت پیامک: ${response.data.message}`, 'info');
      } else {
        showToast(response.message || 'خطا در دریافت وضعیت پیامک', 'error');
      }
    } catch (err) {
      setError((err as Error).message);
      showToast((err as Error).message, 'error');
    } finally {
      setCheckingStatus(false);
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" gutterBottom>
          تنظیمات پیامکی
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* تنظیمات سرویس پیامک */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>
              پیکربندی سرویس پیامک
            </Typography>

            <FormControlLabel
              control={
                <Switch
                  checked={settings.isActive}
                  onChange={handleChange('isActive')}
                  name="isActive"
                  color="primary"
                  disabled={saving}
                />
              }
              label="فعال کردن سرویس پیامک"
            />

            <Grid container spacing={2} mt={1}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="نام کاربری"
                  value={settings.username}
                  onChange={handleChange('username')}
                  disabled={saving}
                  placeholder="نام کاربری سرویس 0098sms"
                  variant="outlined"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="رمز عبور"
                  type={showPassword ? "text" : "password"}
                  value={settings.password}
                  onChange={handleChange('password')}
                  disabled={saving}
                  placeholder="رمز عبور سرویس 0098sms"
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="تغییر نمایش رمز عبور"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="شماره فرستنده"
                  value={settings.from}
                  onChange={handleChange('from')}
                  disabled={saving}
                  placeholder="مثال: 3000164545"
                  variant="outlined"
                  helperText="شماره اختصاصی خود در سامانه 0098sms را وارد کنید"
                />
              </Grid>
            </Grid>

            <Box display="flex" justifyContent="flex-end" mt={3}>
              <Button
                variant="contained"
                color="primary"
                startIcon={saving ? <CircularProgress size={24} /> : <SaveIcon />}
                onClick={handleSave}
                disabled={saving}
              >
                ذخیره تنظیمات
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* ارسال پیامک آزمایشی */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                ارسال پیامک آزمایشی
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="body2" color="textSecondary" mb={2}>
                برای اطمینان از صحت تنظیمات، یک پیامک آزمایشی ارسال کنید.
              </Typography>

              <TextField
                fullWidth
                label="شماره موبایل"
                value={testNumber}
                onChange={handlePhoneChange}
                disabled={sendingTest}
                placeholder="مثال: 09123456789"
                margin="normal"
                error={!!testNumber && !/^09[0-9]{9}$/.test(testNumber)}
                helperText={testNumber && !/^09[0-9]{9}$/.test(testNumber) ? 'شماره موبایل نامعتبر است' : ''}
              />

              <TextField
                fullWidth
                label="متن پیامک"
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                disabled={sendingTest}
                placeholder="متن پیامک آزمایشی"
                margin="normal"
                multiline
                rows={3}
              />

              <Box display="flex" justifyContent="center" mt={3}>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={sendingTest ? <CircularProgress size={24} color="inherit" /> : <SendIcon />}
                  onClick={handleSendTest}
                  disabled={sendingTest || !settings.isActive || !testNumber || !testMessage || !/^09[0-9]{9}$/.test(testNumber)}
                >
                  ارسال پیامک آزمایشی
                </Button>
              </Box>
              
              {lastMessageId && (
                <Box mt={3}>
                  <Typography variant="body2" color="textSecondary" mb={1}>
                    شناسه پیامک: {lastMessageId}
                  </Typography>
                  
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      startIcon={checkingStatus ? <CircularProgress size={16} /> : null}
                      onClick={checkDeliveryStatus}
                      disabled={checkingStatus}
                    >
                      بررسی وضعیت تحویل
                    </Button>
                    
                    {deliveryStatus && (
                      <Chip 
                        label={deliveryStatus.message}
                        color={
                          deliveryStatus.status === '1' ? 'success' : 
                          deliveryStatus.status === '0' || deliveryStatus.status === '8' ? 'warning' : 'error'
                        }
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    )}
                  </Box>
                </Box>
              )}
              
              {!settings.isActive && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  برای ارسال پیامک آزمایشی، ابتدا باید سرویس پیامک را فعال کنید.
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SmsSettingsPage;