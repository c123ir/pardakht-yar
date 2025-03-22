// client/src/pages/SmsSettingsPage.tsx
// صفحه مدیریت پیامک با طراحی حرفه‌ای و پیشرفته

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Switch,
  Grid,
  FormControlLabel,
  CircularProgress,
  Tabs,
  Tab,
  Chip,
  Divider,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Tooltip,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  RadioGroup,
  Radio,
  Badge,
  Collapse,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Card,
  CardContent,
  CardActions,
  Slide,
  Fade,
  Zoom,
  Stepper,
  Step,
  StepLabel,
  AlertTitle,
  Alert,
  Checkbox,
  FormGroup,
  Autocomplete,
  ButtonGroup,
  Container,
  useTheme,
  alpha,
  Skeleton,
  Snackbar,
  Theme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useSnackbar } from 'notistack';
import { motion } from 'framer-motion';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFnsJalali } from '@mui/x-date-pickers/AdapterDateFnsJalali';
import {
  Add as AddIcon,
  Autorenew as AutorenewIcon,
  Save as SaveIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Person as PersonIcon,
  Lock as LockIcon,
  PhoneAndroid as MobileIcon,
  Phone as PhoneIcon,
  Sms as SmsIcon,
  Message as MessageIcon,
  Email as EmailIcon,
  Warning as WarningIcon,
  ContentCopy as ContentCopyIcon,
  Send as SendIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Schedule as ScheduleIcon,
  Dashboard as DashboardIcon,
  Group as GroupIcon,
  Settings as SettingsIcon,
  History as HistoryIcon,
  Description as DescriptionIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Label as LabelIcon,
  VpnKey as VpnKeyIcon,
  Link as LinkIcon,
  MonetizationOn as MonetizationOnIcon,
  Cancel as CancelIcon,
  ErrorOutline as ErrorOutlineIcon,
  CreditCard as CreditCardIcon,
} from '@mui/icons-material';
import smsService from '../services/smsService';
import { isValidMobile } from '../utils/validationUtils';
import { convertPersianToEnglishNumbers } from '../utils/stringUtils';
import { useToast } from '../hooks/useToast';

// اینترفیس‌های مربوط به سرویس پیامک
interface SmsProviderField {
  id: string;
  name: string;
  type: 'text' | 'password' | 'number';
  label: string;
  placeholder: string;
  required: boolean;
  icon: React.ReactNode;
}

interface SmsProvider {
  id: string;
  name: string;
  logo?: string;
  fields: SmsProviderField[];
  isActive: boolean;
}

// تعریف وضعیت‌های پیامک
enum SmsStatus {
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
  PENDING = 'PENDING',
  EXPIRED = 'EXPIRED',
  BLOCKED = 'BLOCKED',
  UNDELIVERED = 'UNDELIVERED',
}

// اینترفیس تنظیمات پیامک
interface SmsSettings {
  active: boolean;
  provider: string;
  providerSettings: Record<string, Record<string, string>>;
  senderNumber: string;
}

// اینترفیس تاریخچه پیامک
interface SmsLogItem {
  id: number;
  receiver: string;
  message: string;
  messageId?: string;
  status: SmsStatus;
  statusDetails?: string;
  provider: string;
  senderNumber: string;
  sentAt: string;
  relatedTo?: string;
  relatedId?: number;
  cost?: number;
}

// اینترفیس قالب پیامک
interface SmsTemplate {
  id: number;
  title: string;
  content: string;
  variables: string[];
  description?: string;
  category: string;
  isActive: boolean;
  createdAt: string;
}

// اینترفیس گروه مخاطبین
interface ContactGroup {
  id: number;
  name: string;
  description?: string;
  memberCount: number;
  createdAt: string;
}

// اینترفیس برنامه زمانبندی پیامک
interface SmsSchedule {
  id: number;
  title: string;
  message: string;
  recipients: string[];
  scheduleTime: string;
  isRecurring: boolean;
  status: string;
  createdAt: string;
}

// اینترفیس آمار پیامک
interface SmsStats {
  totalSent: number;
  delivered: number;
  failed: number;
  pending: number;
  credit: number;
  monthlySent: { month: string; count: number }[];
  costByCategory: { [key: string]: number };
  currentCredit: number;
  deliveredCount: number;
  failedCount: number;
  totalCost: number;
  topTemplates: { name: string, useCount: number }[];
  topGroups: { name: string, messageCount: number }[];
  commonErrors: { message: string, count: number }[];
}

// تب‌های صفحه تنظیمات پیامک
enum SmsSettingsTabs {
  SETTINGS = 0,
  LOGS = 1,
  TEMPLATES = 2,
  GROUPS = 3,
  SCHEDULE = 4,
  DASHBOARD = 5,
}

// استایل برای کارت‌های اطلاعات
const StatsCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2.5),
  borderRadius: 12,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
  },
}));

// استایل برای آیکون کارت‌ها
const StatsIconWrapper = styled(Box)(({ theme }) => ({
  borderRadius: '50%',
  padding: theme.spacing(1.5),
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: theme.spacing(1),
}));

// استایل برای تب‌ها
const StyledTab = styled(Tab)(({ theme }) => ({
  fontWeight: 500,
  fontSize: '0.95rem',
  minHeight: 48,
  padding: theme.spacing(1, 2),
  transition: 'all 0.2s',
  '&.Mui-selected': {
    fontWeight: 600,
  },
}));

const SmsSettingsPage: React.FC = () => {
  const theme = useTheme();
  const { showToast, toast, hideToast } = useToast();
  const [activeTab, setActiveTab] = useState<SmsSettingsTabs>(SmsSettingsTabs.SETTINGS);
  
  // استیت‌های خطا و لودینگ
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // استیت‌های تنظیمات پیامک
  const [settings, setSettings] = useState<SmsSettings>({
    active: false,
    provider: '',
    providerSettings: {},
    senderNumber: '',
  });
  const [providers, setProviders] = useState<SmsProvider[]>([]);
  const [loadingSettings, setLoadingSettings] = useState(true);
  
  // استیت‌های ارسال پیامک آزمایشی
  const [testNumber, setTestNumber] = useState('');
  const [testMessage, setTestMessage] = useState('پیامک آزمایشی پرداخت‌یار');
  const [sendingTest, setSendingTest] = useState(false);
  const [loadingCredit, setLoadingCredit] = useState(false);
  const [credit, setCredit] = useState<number | null>(null);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [lastMessageId, setLastMessageId] = useState<string | null>(null);
  const [deliveryStatus, setDeliveryStatus] = useState<{status: string, message: string} | null>(null);
  
  const [lastTestSms, setLastTestSms] = useState<{id: string, status: string}>({id: '', status: ''});

  // بارگذاری تنظیمات
  useEffect(() => {
    fetchSettings();
    fetchCredit();
    
    // بارگذاری داده‌های تب فعال
    loadActiveTabData();
  }, [activeTab]);
  
  // بارگذاری داده‌های تب فعال
  const loadActiveTabData = () => {
    switch (activeTab) {
      case SmsSettingsTabs.LOGS:
        fetchSmsLogs();
        break;
      case SmsSettingsTabs.TEMPLATES:
        fetchTemplates();
        break;
      case SmsSettingsTabs.GROUPS:
        fetchContactGroups();
        break;
      case SmsSettingsTabs.SCHEDULE:
        fetchSchedules();
        break;
      case SmsSettingsTabs.DASHBOARD:
        fetchStats();
        break;
    }
  };

  // دریافت تنظیمات پیامک
  const fetchSettings = async () => {
    setLoadingSettings(true);
    setError(null);
    try {
      // در محیط واقعی این اطلاعات از API دریافت می‌شود
      // فعلاً داده‌های تستی برای نمایش امکانات
      
      // تعریف فیلدهای مورد نیاز برای هر سرویس پیامکی
      const providers: SmsProvider[] = [
        {
          id: 'kavenegar',
          name: 'کاوه‌نگار',
          logo: '/providers/kavenegar.png',
          fields: [
            {
              id: 'apiKey',
              name: 'apiKey',
              type: 'password',
              label: 'کلید API',
              placeholder: 'کلید API کاوه‌نگار خود را وارد کنید',
              required: true,
              icon: <VpnKeyIcon />
            },
            {
              id: 'senderNumber',
              name: 'senderNumber',
              type: 'text',
              label: 'شماره فرستنده',
              placeholder: 'شماره فرستنده را وارد کنید',
              required: true,
              icon: <PhoneIcon />
            }
          ],
          isActive: true
        },
        {
          id: 'melliPayamak',
          name: 'ملی پیامک',
          logo: '/providers/melliPayamak.png',
          fields: [
            {
              id: 'username',
              name: 'username',
              type: 'text',
              label: 'نام کاربری',
              placeholder: 'نام کاربری ملی پیامک',
              required: true,
              icon: <PersonIcon />
            },
            {
              id: 'password',
              name: 'password',
              type: 'password',
              label: 'رمز عبور',
              placeholder: 'رمز عبور ملی پیامک',
              required: true,
              icon: <LockIcon />
            },
            {
              id: 'senderNumber',
              name: 'senderNumber',
              type: 'text',
              label: 'شماره فرستنده',
              placeholder: 'شماره فرستنده را وارد کنید',
              required: true,
              icon: <PhoneIcon />
            }
          ],
          isActive: false
        },
        {
          id: '0098SMS',
          name: '۰۰۹۸ اس‌ام‌اس',
          logo: '/providers/0098sms.png',
          fields: [
            {
              id: 'username',
              name: 'username',
              type: 'text',
              label: 'نام کاربری',
              placeholder: 'نام کاربری سامانه ۰۰۹۸',
              required: true,
              icon: <PersonIcon />
            },
            {
              id: 'password',
              name: 'password',
              type: 'password',
              label: 'رمز عبور',
              placeholder: 'رمز عبور سامانه ۰۰۹۸',
              required: true,
              icon: <LockIcon />
            },
            {
              id: 'senderNumber',
              name: 'senderNumber',
              type: 'text',
              label: 'شماره فرستنده',
              placeholder: 'شماره فرستنده را وارد کنید',
              required: true,
              icon: <PhoneIcon />
            }
          ],
          isActive: false
        },
        {
          id: 'ghasedak',
          name: 'قاصدک',
          logo: '/providers/ghasedak.png',
          fields: [
            {
              id: 'apiKey',
              name: 'apiKey',
              type: 'password',
              label: 'کلید API',
              placeholder: 'کلید API قاصدک',
              required: true,
              icon: <VpnKeyIcon />
            },
            {
              id: 'senderNumber',
              name: 'senderNumber',
              type: 'text',
              label: 'شماره فرستنده',
              placeholder: 'شماره فرستنده را وارد کنید',
              required: true,
              icon: <PhoneIcon />
            }
          ],
          isActive: false
        },
        {
          id: 'faraPayamak',
          name: 'فراپیامک',
          logo: '/providers/faraPayamak.png',
          fields: [
            {
              id: 'username',
              name: 'username',
              type: 'text',
              label: 'نام کاربری',
              placeholder: 'نام کاربری فراپیامک',
              required: true,
              icon: <PersonIcon />
            },
            {
              id: 'password',
              name: 'password',
              type: 'password',
              label: 'رمز عبور',
              placeholder: 'رمز عبور فراپیامک',
              required: true,
              icon: <LockIcon />
            },
            {
              id: 'senderNumber',
              name: 'senderNumber',
              type: 'text',
              label: 'شماره فرستنده',
              placeholder: 'شماره فرستنده را وارد کنید',
              required: true,
              icon: <PhoneIcon />
            }
          ],
          isActive: false
        }
      ];

      setProviders(providers);
      
      // مقادیر ذخیره شده قبلی را از سرور دریافت می‌کنیم
      const mockedSettings: SmsSettings = {
        active: true,
        provider: 'kavenegar',
        providerSettings: {
          kavenegar: {
            apiKey: 'YOUR_KAVENEGAR_API_KEY',
            senderNumber: '10008663',
          },
          mellipayamak: {
            username: '',
            password: '',
            senderNumber: '',
          },
          ghasedak: {
            apiKey: '',
            senderNumber: '',
          },
          farapayamak: {
            username: '',
            password: '',
            senderNumber: '',
            apiUrl: '',
          },
          '0098sms': {
            username: '',
            password: '',
            senderNumber: '',
          },
          custom: {
            name: '',
            username: '',
            password: '',
            apiKey: '',
            senderNumber: '',
            apiUrl: '',
          },
        },
        senderNumber: '10008663',
      };

      setSettings(mockedSettings);
      
    } catch (error) {
      console.error('Error fetching settings:', error);
      setError(`خطا در بارگذاری تنظیمات: ${error instanceof Error ? error.message : 'خطای ناشناخته'}`);
      showToast('خطا در بارگذاری تنظیمات', 'error');
    } finally {
      setLoadingSettings(false);
    }
  };
  
  // دریافت اعتبار پیامک
  const fetchCredit = async () => {
    setLoadingCredit(true);
    try {
      // اینجا کد بررسی اعتبار سرویس پیامک قرار می‌گیرد
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCredit(150000);
    } catch (error) {
      console.error('Error fetching credit:', error);
    } finally {
      setLoadingCredit(false);
    }
  };
  
  // دریافت تاریخچه پیامک‌ها
  const fetchSmsLogs = async () => {
    setLogsLoading(true);
    try {
      // در یک پروژه واقعی، این تابع باید از API داده‌ها را دریافت کند
      // برای نمونه، داده‌های ساختگی را برمی‌گردانیم
      const mockLogs = generateMockSmsLogs();
      setSmsLogs(mockLogs);
    } catch (err) {
      console.error('خطا در دریافت تاریخچه پیامک:', err);
    } finally {
      setLogsLoading(false);
    }
  };
  
  // دریافت قالب‌های پیامک
  const fetchTemplates = async () => {
    setTemplatesLoading(true);
    try {
      // در یک پروژه واقعی، این تابع باید از API داده‌ها را دریافت کند
      // برای نمونه، داده‌های ساختگی را برمی‌گردانیم
      const mockTemplates = generateMockTemplates();
      setTemplates(mockTemplates);
    } catch (err) {
      console.error('خطا در دریافت قالب‌های پیامک:', err);
    } finally {
      setTemplatesLoading(false);
    }
  };
  
  // دریافت گروه‌های مخاطبین
  const fetchContactGroups = async () => {
    setGroupsLoading(true);
    try {
      // در یک پروژه واقعی، این تابع باید از API داده‌ها را دریافت کند
      // برای نمونه، داده‌های ساختگی را برمی‌گردانیم
      const mockGroups = generateMockContactGroups();
      setContactGroups(mockGroups);
    } catch (err) {
      console.error('خطا در دریافت گروه‌های مخاطبین:', err);
    } finally {
      setGroupsLoading(false);
    }
  };
  
  // دریافت زمانبندی‌های پیامک
  const fetchSchedules = async () => {
    setSchedulesLoading(true);
    try {
      // در یک پروژه واقعی، این تابع باید از API داده‌ها را دریافت کند
      // برای نمونه، داده‌های ساختگی را برمی‌گردانیم
      const mockSchedules = generateMockSchedules();
      setSchedules(mockSchedules);
    } catch (err) {
      console.error('خطا در دریافت زمانبندی‌های پیامک:', err);
    } finally {
      setSchedulesLoading(false);
    }
  };
  
  // دریافت آمار پیامک
  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      // در یک پروژه واقعی، این تابع باید از API داده‌ها را دریافت کند
      // برای نمونه، داده‌های ساختگی را برمی‌گردانیم
      const mockStats = generateMockStats();
      setStats(mockStats);
    } catch (err) {
      console.error('خطا در دریافت آمار پیامک:', err);
    } finally {
      setStatsLoading(false);
    }
  };

  // تغییر مقادیر تنظیمات
  const handleSettingsChange = (
    provider: string, 
    field: string, 
    value: string | boolean
  ) => {
    if (field === 'active') {
      setSettings(prev => ({
        ...prev,
        active: value as boolean
      }));
    } else if (field === 'provider') {
      setSettings(prev => ({
        ...prev,
        provider: value as string
      }));
    } else {
      setSettings(prev => ({
        ...prev,
        providerSettings: {
          ...prev.providerSettings,
          [provider]: {
            ...prev.providerSettings[provider],
            [field]: value as string
          }
        }
      }));
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // تبدیل اعداد فارسی به انگلیسی
    const convertedValue = convertPersianToEnglishNumbers(value);
    setTestNumber(convertedValue);
  };

  // ذخیره تنظیمات پیامک
  const saveSettings = async () => {
    setSaving(true);
    setError(null);
    try {
      // در اینجا تنظیمات را به سرور ارسال می‌کنیم
      // const response = await smsService.saveSettings(settings);
      
      // برای نمونه یک تاخیر ایجاد می‌کنیم تا نشان دهیم در حال ذخیره‌سازی هستیم
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      showToast('تنظیمات با موفقیت ذخیره شد', 'success');
      
      // بروزرسانی اعتبار پس از ذخیره تنظیمات اگر سرویس فعال است
      if (settings.active && settings.provider) {
        fetchCredit();
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setError(`خطا در ذخیره تنظیمات: ${error instanceof Error ? error.message : 'خطای ناشناخته'}`);
      showToast('خطا در ذخیره تنظیمات', 'error');
    } finally {
      setSaving(false);
    }
  };

  // تابع چک کردن وضعیت پیامک
  const checkSmsStatus = async () => {
    // اینجا کد چک کردن وضعیت پیامک قرار می‌گیرد
    setCheckingStatus(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setDeliveryStatus({
        status: 'DELIVERED',
        message: 'پیامک تحویل داده شده است'
      });
    } catch (error) {
      console.error('Error checking SMS status:', error);
    } finally {
      setCheckingStatus(false);
    }
  };

  // تابع ارسال پیامک آزمایشی
  const sendTestSms = async () => {
      setSendingTest(true);
    try {
      // اینجا کد ارسال پیامک آزمایشی قرار می‌گیرد
      await new Promise(resolve => setTimeout(resolve, 1500));
      setLastMessageId(`test-${Date.now()}`);
      setLastTestSms({
        id: `test-${Date.now()}`,
        status: 'PENDING'
      });
        showToast('پیامک آزمایشی با موفقیت ارسال شد', 'success');
    } catch (error) {
      console.error('Error sending test SMS:', error);
      showToast('خطا در ارسال پیامک آزمایشی', 'error');
    } finally {
      setSendingTest(false);
    }
  };

  // تغییر تب فعال
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  
  // ایجاد داده‌های ساختگی برای تاریخچه پیامک
  const generateMockSmsLogs = (): SmsLogItem[] => {
    const statuses = Object.values(SmsStatus);
    const logs: SmsLogItem[] = [];
    
    for (let i = 1; i <= 50; i++) {
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));
      
      logs.push({
        id: i,
        receiver: `0912${Math.floor(1000000 + Math.random() * 9000000)}`,
        message: i % 3 === 0 ? 'پیامک آزمایشی پرداخت‌یار' : i % 5 === 0 ? 'تراکنش شما با موفقیت انجام شد' : 'پرداخت شما با موفقیت ثبت شد',
        messageId: `msg-${i}-${Date.now()}`,
        status: statuses[Math.floor(Math.random() * statuses.length)] as SmsStatus,
        provider: SmsProvider.SMS0098,
        senderNumber: '30001645',
        sentAt: date.toISOString(),
        relatedTo: i % 4 === 0 ? 'Payment' : i % 3 === 0 ? 'Request' : undefined,
        relatedId: i % 4 === 0 || i % 3 === 0 ? Math.floor(100 + Math.random() * 900) : undefined,
        cost: Math.random() * 1000,
      });
    }
    
    return logs;
  };
  
  // ایجاد داده‌های ساختگی برای قالب‌های پیامک
  const generateMockTemplates = (): SmsTemplate[] => {
    const templates: SmsTemplate[] = [
      {
        id: 1,
        title: 'تایید پرداخت',
        content: 'پرداخت شما به مبلغ {amount} تومان در تاریخ {date} با موفقیت انجام شد. شناسه پرداخت: {transactionId}',
        variables: ['amount', 'date', 'transactionId'],
        category: 'پرداخت',
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        title: 'اطلاع رسانی درخواست جدید',
        content: 'کاربر گرامی {name}، درخواست جدیدی برای شما ثبت شده است. لطفا به پنل کاربری مراجعه نمایید.',
        variables: ['name'],
        category: 'درخواست',
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 3,
        title: 'یادآوری سررسید پرداخت',
        content: 'کاربر گرامی، پرداخت شما به مبلغ {amount} تومان در تاریخ {dueDate} سررسید می‌شود. لطفا نسبت به تسویه اقدام فرمایید.',
        variables: ['amount', 'dueDate'],
        category: 'یادآوری',
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 4,
        title: 'خوش آمدگویی',
        content: 'کاربر گرامی {name}، به سامانه پرداخت‌یار خوش آمدید. امیدواریم از خدمات ما راضی باشید.',
        variables: ['name'],
        category: 'عمومی',
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 5,
        title: 'تبریک تولد',
        content: 'کاربر گرامی {name}، تولد شما را تبریک می‌گوییم. به مناسبت این روز، کد تخفیف {discount} برای شما فعال شد.',
        variables: ['name', 'discount'],
        category: 'تبریک',
        isActive: true,
        createdAt: new Date().toISOString(),
      },
    ];
    
    return templates;
  };
  
  // ایجاد داده‌های ساختگی برای گروه‌های مخاطبین
  const generateMockContactGroups = (): ContactGroup[] => {
    const groups: ContactGroup[] = [
      {
        id: 1,
        name: 'مشتریان ویژه',
        description: 'لیست مشتریان ویژه با سابقه خرید بالا',
        memberCount: 42,
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        name: 'کارمندان',
        description: 'لیست شماره تماس کارمندان شرکت',
        memberCount: 15,
        createdAt: new Date().toISOString(),
      },
      {
        id: 3,
        name: 'تامین کنندگان',
        description: 'فهرست شماره تماس تامین کنندگان و فروشندگان همکار',
        memberCount: 23,
        createdAt: new Date().toISOString(),
      },
      {
        id: 4,
        name: 'مشتریان جدید',
        description: 'مشتریانی که در یک ماه اخیر ثبت نام کرده‌اند',
        memberCount: 78,
        createdAt: new Date().toISOString(),
      },
    ];
    
    return groups;
  };
  
  // ایجاد داده‌های ساختگی برای زمانبندی پیامک
  const generateMockSchedules = (): SmsSchedule[] => {
    const schedules: SmsSchedule[] = [
      {
        id: 1,
        title: 'تبریک سال نو',
        message: 'سال نو مبارک! امیدواریم سالی پر از موفقیت و شادی برای شما باشد.',
        recipients: ['group:1', 'group:2'],
        scheduleTime: new Date(new Date().getFullYear(), 2, 20, 0, 0, 0).toISOString(),
        isRecurring: true,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        title: 'یادآوری پرداخت',
        message: 'کاربر گرامی، فاکتور شماره 1234 سررسید شده است. لطفا نسبت به پرداخت آن اقدام نمایید.',
        recipients: ['09121234567'],
        scheduleTime: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString(),
        isRecurring: false,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
      },
      {
        id: 3,
        title: 'تبریک تولد',
        message: 'تولدتان مبارک! به مناسبت روز تولد شما، کد تخفیف 20 درصدی BIRTHDAY20 برای شما فعال شد.',
        recipients: ['group:4'],
        scheduleTime: new Date().toISOString(),
        isRecurring: true,
        status: 'RUNNING',
        createdAt: new Date().toISOString(),
      },
    ];
    
    return schedules;
  };
  
  // ایجاد داده‌های ساختگی برای آمار پیامک
  const generateMockStats = (): SmsStats => {
    return {
      totalSent: 3000,
      delivered: 2800,
      failed: 100,
      pending: 100,
      credit: credit || 152000,
      monthlySent: [
        { month: 'فروردین', count: 150 },
        { month: 'اردیبهشت', count: 220 },
        { month: 'خرداد', count: 180 },
        { month: 'تیر', count: 250 },
        { month: 'مرداد', count: 300 },
        { month: 'شهریور', count: 280 },
      ],
      costByCategory: {
        'پرداخت': 120000,
        'اطلاع رسانی': 80000,
        'یادآوری': 50000,
        'خوش آمدگویی': 20000,
        'تبریک': 30000,
      },
      currentCredit: credit || 152000,
      deliveredCount: 2800,
      failedCount: 100,
      totalCost: 120000 + 80000 + 50000 + 20000 + 30000,
      topTemplates: [
        { name: 'تایید پرداخت', useCount: 1200 },
        { name: 'اطلاع رسانی درخواست جدید', useCount: 800 },
        { name: 'یادآوری سررسید پرداخت', useCount: 500 },
        { name: 'خوش آمدگویی', useCount: 200 },
        { name: 'تبریک تولد', useCount: 300 },
      ],
      topGroups: [
        { name: 'مشتریان ویژه', messageCount: 42 },
        { name: 'کارمندان', messageCount: 15 },
        { name: 'تامین کنندگان', messageCount: 23 },
        { name: 'مشتریان جدید', messageCount: 78 },
      ],
      commonErrors: [
        { message: 'خطا در ارسال پیامک', count: 50 },
        { message: 'خطا در دریافت وضعیت پیامک', count: 30 },
        { message: 'خطا در دریافت اعتبار پیامک', count: 20 },
      ],
    };
  };

  // تابع فرمت کردن اعداد
  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('fa-IR').format(num);
  };

  // بخش مربوط به نمایش لوگوی سرویس‌دهنده
  const renderProviderLogo = (providerId: string, size: 'small' | 'large' = 'large') => {
    const provider = providers.find(p => p.id === providerId);
    
    if (!provider || !provider.logo) {
      return size === 'small' ? 
        <SmsIcon fontSize="small" /> : 
        <SmsIcon fontSize="large" />;
    }
    
    if (size === 'small') {
      return (
        <Avatar
          src={provider.logo}
          alt={provider.name}
          sx={{ 
            width: 24, 
            height: 24,
            bgcolor: 'primary.light'
          }}
          variant="rounded"
        >
          {provider.name.charAt(0)}
        </Avatar>
      );
    }
    
    return (
      <Box 
        component="img"
        src={provider.logo}
        alt={provider.name}
        sx={{
          width: 120,
          height: 120,
          objectFit: 'contain',
          p: 1,
          borderRadius: 2,
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          mb: 2
        }}
        onError={(e) => {
          // در صورت خطای بارگذاری تصویر، آیکون پیش‌فرض نمایش داده می‌شود
          const target = e.target as HTMLImageElement;
          target.onerror = null;
          target.style.display = 'none';
          
          // ایجاد یک آواتار با حرف اول نام سرویس به جای تصویر
          const parent = target.parentNode as HTMLElement;
          if (parent) {
            const avatar = document.createElement('div');
            avatar.style.width = '120px';
            avatar.style.height = '120px';
            avatar.style.display = 'flex';
            avatar.style.alignItems = 'center';
            avatar.style.justifyContent = 'center';
            avatar.style.backgroundColor = '#e3f2fd';
            avatar.style.borderRadius = '8px';
            avatar.style.marginBottom = '16px';
            avatar.style.fontSize = '48px';
            avatar.style.fontWeight = 'bold';
            avatar.style.color = '#1976d2';
            avatar.innerText = provider.name.charAt(0);
            parent.appendChild(avatar);
          }
        }}
      />
    );
  };

  return (
    <Container maxWidth="lg">
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: 2,
          bgcolor: theme => theme.palette.background.default 
        }}
      >
        <Typography variant="h5" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
          مدیریت پیامک
        </Typography>
        
        {/* نمایش اعتبار پنل در صورت فعال بودن تنظیمات */}
        {settings.active && credit !== null && (
          <Chip
            icon={<CreditCardIcon />}
            label={`اعتبار: ${formatNumber(credit)} ریال`}
            color="primary"
            sx={{ mb: 2 }}
          />
        )}
        
        {/* نمایش خطای احتمالی */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            <AlertTitle>خطا</AlertTitle>
            {error}
          </Alert>
        )}
        
        {/* تب‌های صفحه */}
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{ mb: 4, borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab 
            icon={<SettingsIcon />} 
            label="تنظیمات" 
            id="sms-tab-0"
            aria-controls="sms-tabpanel-0"
          />
          <Tab 
            icon={<HistoryIcon />} 
            label="تاریخچه" 
            id="sms-tab-1"
            aria-controls="sms-tabpanel-1"
          />
          <Tab 
            icon={<DescriptionIcon />} 
            label="قالب‌ها" 
            id="sms-tab-2"
            aria-controls="sms-tabpanel-2"
          />
          <Tab 
            icon={<GroupIcon />} 
            label="گروه‌ها" 
            id="sms-tab-3"
            aria-controls="sms-tabpanel-3"
          />
          <Tab 
            icon={<ScheduleIcon />} 
            label="زمانبندی" 
            id="sms-tab-4"
            aria-controls="sms-tabpanel-4"
          />
          <Tab 
            icon={<DashboardIcon />} 
            label="داشبورد" 
            id="sms-tab-5"
            aria-controls="sms-tabpanel-5"
          />
        </Tabs>
        
        {/* محتوای تب تنظیمات */}
        {activeTab === SmsSettingsTabs.SETTINGS && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Grid container spacing={3}>
              {/* تنظیمات سرویس پیامک */}
              <Grid item xs={12} md={6}>
                <Box
                  component={Paper}
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    height: '100%',
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    تنظیمات سرویس پیامک
                  </Typography>
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.active}
                        onChange={(e) => handleSettingsChange('', 'active', e.target.checked)}
                        color="primary"
                      />
                    }
                    label="فعال‌سازی سرویس پیامک"
                    sx={{ mb: 2, display: 'block' }}
                  />
                  
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="sms-provider-label">سرویس‌دهنده پیامک</InputLabel>
                    <Select
                      labelId="sms-provider-label"
                      value={settings.provider}
                      onChange={(e) => handleSettingsChange('', 'provider', e.target.value)}
                      label="سرویس‌دهنده پیامک"
                      renderValue={(selected) => {
                        const provider = providers.find(p => p.id === selected);
                        return (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {renderProviderLogo(selected, 'small')}
                            <Typography>{provider?.name}</Typography>
                          </Box>
                        );
                      }}
                    >
                      {providers.map((provider) => (
                        <MenuItem key={provider.id} value={provider.id}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {renderProviderLogo(provider.id, 'small')}
                            <Typography>{provider.name}</Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  {/* بخش نمایش لوگو و نام سرویس انتخاب شده */}
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      my: 3
                    }}
                  >
                    {renderProviderLogo(settings.provider, 'large')}
                    <Typography variant="h6" gutterBottom>
                      {providers.find(p => p.id === settings.provider)?.name || 'سرویس پیامک'}
                    </Typography>
                  </Box>
                  
                  {/* فیلدهای تنظیمات سرویس انتخاب شده */}
                  {providers
                    .find(p => p.id === settings.provider)
                    ?.fields.map(field => (
                      <FormControl
                        key={field.id}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                      >
                        <InputLabel htmlFor={`provider-${field.id}`}>{field.label}</InputLabel>
                        <TextField
                          id={`provider-${field.id}`}
                          type={field.type === 'password' && !showPassword ? 'password' : 'text'}
                          label={field.label}
                          placeholder={field.placeholder}
                          value={settings.providerSettings[settings.provider]?.[field.id] || ''}
                          onChange={(e) => handleSettingsChange(settings.provider, field.id, e.target.value)}
                          required={field.required}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                {field.icon}
                              </InputAdornment>
                            ),
                            endAdornment: field.type === 'password' ? (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => setShowPassword(!showPassword)}
                                  edge="end"
                                >
                                  {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                </IconButton>
                              </InputAdornment>
                            ) : null,
                          }}
                        />
                      </FormControl>
                    ))
                  }
                  
                  <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<SaveIcon />}
                      onClick={saveSettings}
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                          در حال ذخیره...
                        </>
                      ) : (
                        'ذخیره تنظیمات'
                      )}
                    </Button>
                    
                    <Button
                      variant="outlined"
                      startIcon={<CreditCardIcon />}
                      onClick={fetchCredit}
                      disabled={!settings.active || loadingCredit}
                    >
                      {loadingCredit ? (
                        <>
                          <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                          در حال بررسی...
                        </>
                      ) : (
                        'بررسی اعتبار'
                      )}
                    </Button>
                  </Box>
                </Box>
              </Grid>

              {/* سایر تب‌ها اینجا قرار می‌گیرند */}
              {activeTab === SmsSettingsTabs.LOGS && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Box>
                    {/* محتوای تب تاریخچه اینجا قرار می‌گیرد */}
                    <Typography>تاریخچه پیامک‌ها</Typography>
                  </Box>
                </motion.div>
              )}

              {/* اسنک‌بار برای نمایش پیام‌ها */}
              {toast && (
                <Snackbar
                  open={toast.open}
                  autoHideDuration={5000}
                  onClose={hideToast}
                >
                  <Alert 
                    onClose={hideToast} 
                    severity={toast.type} 
                    sx={{ width: '100%' }}
                  >
                    {toast.message}
                  </Alert>
                </Snackbar>
              )}
            </Grid>
          </motion.div>
        )}
      </Paper>
    </Container>
  );
};

export default SmsSettingsPage;