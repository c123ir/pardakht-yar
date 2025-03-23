import React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import HelpIcon from '@mui/icons-material/Help';
import { useSmsSettings } from '../hooks/useSmsSettings';
import { SmsProvider } from '../types';

/**
 * کامپوننت مدیریت تنظیمات پیامک
 */
const SmsSettings: React.FC = () => {
  const {
    settings,
    errors,
    loading,
    saveLoading,
    showPassword,
    showAPIKey,
    handleChange,
    handleToggleShowPassword,
    handleToggleShowAPIKey,
    handleSubmit,
    handleTestConnection,
    testConnectionLoading,
    testConnectionResult,
  } = useSmsSettings();

  return (
    <form onSubmit={handleSubmit}>
      <Card variant="outlined">
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" component="h2">
              تنظیمات سرویس پیامک
            </Typography>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined" required error={!!errors.provider}>
                  <InputLabel id="provider-label">سرویس‌دهنده پیامک</InputLabel>
                  <Select
                    labelId="provider-label"
                    value={settings.provider}
                    onChange={(e) => handleChange('provider', e.target.value as SmsProvider)}
                    label="سرویس‌دهنده پیامک"
                  >
                    <MenuItem value={SmsProvider.KAVENEGAR}>کاوه‌نگار</MenuItem>
                    <MenuItem value={SmsProvider.MELLIPAYAMAK}>ملی پیامک</MenuItem>
                    <MenuItem value={SmsProvider.FARAZSMS}>فراز اس‌ام‌اس</MenuItem>
                    <MenuItem value={SmsProvider.CUSTOM}>سرویس اختصاصی</MenuItem>
                  </Select>
                  {errors.provider && <FormHelperText>{errors.provider}</FormHelperText>}
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    اطلاعات حساب کاربری
                  </Typography>
                </Divider>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="نام کاربری"
                  fullWidth
                  value={settings.username}
                  onChange={(e) => handleChange('username', e.target.value)}
                  error={!!errors.username}
                  helperText={errors.username}
                  disabled={settings.provider === SmsProvider.CUSTOM}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl variant="outlined" fullWidth error={!!errors.password}>
                  <InputLabel htmlFor="password">رمز عبور</InputLabel>
                  <OutlinedInput
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={settings.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="تغییر نمایش رمز عبور"
                          onClick={handleToggleShowPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="رمز عبور"
                    disabled={settings.provider === SmsProvider.CUSTOM}
                  />
                  {errors.password && <FormHelperText>{errors.password}</FormHelperText>}
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl variant="outlined" fullWidth error={!!errors.apiKey}>
                  <InputLabel htmlFor="apiKey">کلید API</InputLabel>
                  <OutlinedInput
                    id="apiKey"
                    type={showAPIKey ? 'text' : 'password'}
                    value={settings.apiKey}
                    onChange={(e) => handleChange('apiKey', e.target.value)}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="تغییر نمایش کلید API"
                          onClick={handleToggleShowAPIKey}
                          edge="end"
                        >
                          {showAPIKey ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="کلید API"
                  />
                  {errors.apiKey && <FormHelperText>{errors.apiKey}</FormHelperText>}
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    تنظیمات ارسال
                  </Typography>
                </Divider>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="شماره خط ارسال"
                  fullWidth
                  value={settings.senderNumber}
                  onChange={(e) => handleChange('senderNumber', e.target.value)}
                  error={!!errors.senderNumber}
                  helperText={errors.senderNumber || 'شماره خط اختصاصی برای ارسال پیامک'}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="آدرس وب‌سرویس"
                  fullWidth
                  value={settings.apiUrl}
                  onChange={(e) => handleChange('apiUrl', e.target.value)}
                  error={!!errors.apiUrl}
                  helperText={errors.apiUrl}
                  disabled={settings.provider !== SmsProvider.CUSTOM}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.useLocalBlacklist}
                        onChange={(e) => handleChange('useLocalBlacklist', e.target.checked)}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography sx={{ mr: 1 }}>استفاده از لیست سیاه محلی</Typography>
                        <Tooltip title="شماره‌هایی که در لیست سیاه قرار دارند، پیامک دریافت نخواهند کرد">
                          <HelpIcon fontSize="small" color="action" />
                        </Tooltip>
                      </Box>
                    }
                  />
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.enableDeliveryReports}
                        onChange={(e) => handleChange('enableDeliveryReports', e.target.checked)}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography sx={{ mr: 1 }}>فعال‌سازی گزارش تحویل</Typography>
                        <Tooltip title="دریافت وضعیت تحویل پیامک‌ها و ذخیره آن در سیستم">
                          <HelpIcon fontSize="small" color="action" />
                        </Tooltip>
                      </Box>
                    }
                  />
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                {testConnectionResult && (
                  <Paper 
                    variant="outlined"
                    sx={{ 
                      p: 2, 
                      mb: 3, 
                      backgroundColor: testConnectionResult.success ? 'success.light' : 'error.light',
                      color: testConnectionResult.success ? 'success.dark' : 'error.dark'
                    }}
                  >
                    <Typography variant="body2">
                      {testConnectionResult.message}
                    </Typography>
                  </Paper>
                )}
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={handleTestConnection}
                    disabled={saveLoading || testConnectionLoading}
                  >
                    {testConnectionLoading ? <CircularProgress size={24} /> : 'تست اتصال'}
                  </Button>
                  
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    disabled={saveLoading || testConnectionLoading}
                  >
                    {saveLoading ? <CircularProgress size={24} /> : 'ذخیره تنظیمات'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          )}
        </CardContent>
      </Card>
    </form>
  );
};

export default SmsSettings; 