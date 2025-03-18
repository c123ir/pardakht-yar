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
  Snackbar,
  Alert,
  Card,
  CardHeader,
  CardContent,
  InputAdornment,
  IconButton,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import SendIcon from '@mui/icons-material/Send';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import smsService from '../services/smsService';

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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testPhone, setTestPhone] = useState('');
  const [testMessage, setTestMessage] = useState('پیامک آزمایشی پرداخت‌یار');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState<{ open: boolean; message: string; type: 'success' | 'error' }>({
    open: false,
    message: '',
    type: 'success',
  });

  // بارگذاری تنظیمات
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await smsService.getSmsSettings();
      setSettings(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // تغییر مقادیر تنظیمات
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // ذخیره تنظیمات
  const handleSaveSettings = async () => {
    setSaving(true);
    setError(null);
    try {
      await smsService.updateSmsSettings(settings);
      setToast({
        open: true,
        message: 'تنظیمات با موفقیت ذخیره شد',
        type: 'success',
      });
    } catch (err) {
      setError((err as Error).message);
      setToast({
        open: true,
        message: (err as Error).message,
        type: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  // ارسال پیامک آزمایشی
  const handleSendTest = async () => {
    if (!testPhone) {
      setToast({
        open: true,
        message: 'شماره موبایل را وارد کنید',
        type: 'error',
      });
      return;
    }

    setSending(true);
    setError(null);
    try {
      await smsService.sendTestSms({ to: testPhone, text: testMessage });
      setToast({
        open: true,
        message: 'پیامک آزمایشی با موفقیت ارسال شد',
        type: 'success',
      });
    } catch (err) {
      setError((err as Error).message);
      setToast({
        open: true,
        message: (err as Error).message,
        type: 'error',
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        تنظیمات پیامکی
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {/* تنظیمات پیامک */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" mb={2}>
                پیکربندی سرویس پیامک
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.isActive}
                        onChange={handleChange}
                        name="isActive"
                        color="primary"
                      />
                    }
                    label="سرویس پیامک فعال است"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="سرویس‌دهنده"
                    name="provider"
                    value={settings.provider}
                    onChange={handleChange}
                    variant="outlined"
                    placeholder="نام سرویس‌دهنده پیامک"
                    margin="normal"
                    disabled
                    helperText="سرویس‌دهنده پیش‌فرض: 0098sms"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="شماره پنل"
                    name="from"
                    value={settings.from}
                    onChange={handleChange}
                    variant="outlined"
                    placeholder="مثال: 3000164545"
                    margin="normal"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="نام کاربری"
                    name="username"
                    value={settings.username}
                    onChange={handleChange}
                    variant="outlined"
                    placeholder="نام کاربری حساب 0098sms"
                    margin="normal"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="رمز عبور"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={settings.password}
                    onChange={handleChange}
                    variant="outlined"
                    margin="normal"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>

              <Box display="flex" justifyContent="flex-end" mt={3}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveSettings}
                  disabled={saving}
                >
                  {saving ? <CircularProgress size={24} /> : 'ذخیره تنظیمات'}
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* ارسال پیامک آزمایشی */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardHeader title="ارسال پیامک آزمایشی" />
              <Divider />
              <CardContent>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  برای اطمینان از صحت تنظیمات، یک پیامک آزمایشی ارسال کنید.
                </Typography>

                <TextField
                  fullWidth
                  label="شماره موبایل"
                  name="testPhone"
                  value={testPhone}
                  onChange={(e) => setTestPhone(e.target.value)}
                  variant="outlined"
                  placeholder="مثال: 09123456789"
                  margin="normal"
                />

                <TextField
                  fullWidth
                  label="متن پیامک"
                  name="testMessage"
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  variant="outlined"
                  multiline
                  rows={3}
                  margin="normal"
                />

                <Box display="flex" justifyContent="center" mt={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<SendIcon />}
                    onClick={handleSendTest}
                    disabled={sending || !settings.isActive}
                  >
                    {sending ? <CircularProgress size={24} /> : 'ارسال پیامک آزمایشی'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* نمایش پیام‌ها */}
      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={() => setToast({ ...toast, open: false })}
      >
        <Alert
          onClose={() => setToast({ ...toast, open: false })}
          severity={toast.type}
          sx={{ width: '100%' }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SmsSettingsPage;