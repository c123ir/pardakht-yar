// client/src/pages/SmsSettingsPage.tsx
// صفحه مدیریت پیامک با طراحی حرفه‌ای و پیشرفته

import React, { useState, useEffect, useRef } from 'react';
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
  Tabs,
  Tab,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Badge,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  useTheme,
  alpha,
  Collapse,
  LinearProgress,
  Avatar,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Skeleton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Container,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Save as SaveIcon,
  Send as SendIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Settings as SettingsIcon,
  History as HistoryIcon,
  Schedule as ScheduleIcon,
  Group as GroupIcon,
  Dashboard as DashboardIcon,
  Template as TemplateIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
  Phone as PhoneIcon,
  Sms as SmsIcon,
  Message as MessageIcon,
  CreditCard as CreditCardIcon,
  Email as EmailIcon,
  MoreVert as MoreVertIcon,
  Report as ReportIcon,
  DeleteOutline as DeleteOutlineIcon,
  ContentCopy as ContentCopyIcon,
  Edit as EditIcon,
  Autorenew as AutorenewIcon,
  Phone as MobileIcon,
  Person as PersonIcon,
  Lock as LockIcon,
  Search as SearchIcon,
  CalendarToday as CalendarTodayIcon,
  ErrorOutline as ErrorOutlineIcon,
  MonetizationOn as MonetizationOnIcon,
  NotesRounded as NotesRoundedIcon,
  Done as DoneIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import smsService from '../services/smsService';
import { convertPersianToEnglishNumbers } from '../utils/stringUtils';
import { useToast } from '../hooks/useToast';
import { motion } from 'framer-motion';
import { ApiResponse } from '../types/api';

// تعریف انواع سرویس‌های پیامکی
enum SmsProvider {
  SMS0098 = '0098sms',
  KAVENEGAR = 'kavenegar',
  MELLIPAYAMAK = 'mellipayamak',
  GHASEDAK = 'ghasedak',
  FARAPAYAMAK = 'farapayamak',
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
  provider: string;
  username: string;
  password: string;
  from: string;
  isActive: boolean;
  apiKey?: string;
  lines?: string[];
  defaultLine?: string;
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
  
  // استیت‌های تنظیمات پیامک
  const [settings, setSettings] = useState<SmsSettings>({
    provider: SmsProvider.SMS0098,
    username: '',
    password: '',
    from: '',
    isActive: false,
    lines: [],
    defaultLine: '',
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
  const [credit, setCredit] = useState<number | null>(null);
  const [loadingCredit, setLoadingCredit] = useState(false);
  
  // استیت‌های تاریخچه پیامک
  const [smsLogs, setSmsLogs] = useState<SmsLogItem[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [logsFilter, setLogsFilter] = useState({ status: 'all', search: '', days: 7 });
  
  // استیت‌های قالب‌های پیامک
  const [templates, setTemplates] = useState<SmsTemplate[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<SmsTemplate | null>(null);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  
  // استیت‌های گروه‌های مخاطبین
  const [contactGroups, setContactGroups] = useState<ContactGroup[]>([]);
  const [groupsLoading, setGroupsLoading] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<ContactGroup | null>(null);
  const [groupDialogOpen, setGroupDialogOpen] = useState(false);
  
  // استیت‌های زمانبندی پیامک
  const [schedules, setSchedules] = useState<SmsSchedule[]>([]);
  const [schedulesLoading, setSchedulesLoading] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<SmsSchedule | null>(null);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  
  // استیت‌های داشبورد و آمار
  const [stats, setStats] = useState<SmsStats>({
    totalSent: 0,
    delivered: 0,
    failed: 0,
    pending: 0,
    credit: 0,
    monthlySent: [],
    costByCategory: {},
    currentCredit: 0,
    deliveredCount: 0,
    failedCount: 0,
    totalCost: 0,
    topTemplates: [],
    topGroups: [],
    commonErrors: [],
  });
  const [statsLoading, setStatsLoading] = useState(false);
  
  // ref برای المنت نمودار
  const chartRef = useRef<HTMLDivElement>(null);

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
  
  // دریافت اعتبار پیامک
  const fetchCredit = async () => {
    setLoadingCredit(true);
    try {
      // فعلاً فقط از مقدار تست استفاده می‌کنیم چون getCredit در سرویس تعریف نشده
      // const response = await smsService.getCredit();
      // if (response.success && response.data) {
      //   setCredit(response.data.credit);
      // }
      
      // استفاده از مقدار تست
      setTimeout(() => {
        setCredit(152000);
        setLoadingCredit(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching credit:', error);
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
  const handleChange = (field: keyof SmsSettings) => (
    event: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { value, checked, type } = event.target as HTMLInputElement;
    
    // تبدیل اعداد فارسی به انگلیسی
    let newValue = typeof value === 'string' ? value : value;
    if (field === 'from' && typeof newValue === 'string') {
      newValue = convertPersianToEnglishNumbers(newValue);
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
        fetchCredit();
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
      // تغییر آرایه به آرایه‌ای از آبجکت‌ها با ساختار مناسب
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

  return (
    <Container>
      {/* هدر صفحه */}
      <Box 
        sx={{ 
          mb: 3,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2
        }}
      >
        <Typography variant="h5" fontWeight="medium">
          مدیریت پیامک
        </Typography>
        
        {settings.isActive && credit !== null && (
          <Chip
            color="primary"
            variant="outlined"
            icon={<CreditCardIcon />}
            label={
              loadingCredit 
                ? <CircularProgress size={16} />
                : `اعتبار باقیمانده: ${new Intl.NumberFormat('fa-IR').format(credit)} ریال`
            }
            sx={{ fontWeight: 'medium' }}
          />
        )}
      </Box>
      
      {/* نمایش خطا */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 2 }}
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}
      
      {/* تب‌ها */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          textColor="primary"
          indicatorColor="primary"
        >
          <StyledTab 
            icon={<SettingsIcon fontSize="small" />} 
            iconPosition="start" 
            label="تنظیمات" 
            value={SmsSettingsTabs.SETTINGS} 
          />
          <StyledTab 
            icon={<HistoryIcon fontSize="small" />} 
            iconPosition="start" 
            label="تاریخچه" 
            value={SmsSettingsTabs.LOGS} 
          />
          <StyledTab 
            icon={<TemplateIcon fontSize="small" />} 
            iconPosition="start" 
            label="قالب‌ها" 
            value={SmsSettingsTabs.TEMPLATES} 
          />
          <StyledTab 
            icon={<GroupIcon fontSize="small" />} 
            iconPosition="start" 
            label="گروه‌ها" 
            value={SmsSettingsTabs.GROUPS} 
          />
          <StyledTab 
            icon={<ScheduleIcon fontSize="small" />} 
            iconPosition="start" 
            label="زمانبندی" 
            value={SmsSettingsTabs.SCHEDULE} 
          />
          <StyledTab 
            icon={<DashboardIcon fontSize="small" />} 
            iconPosition="start" 
            label="آمار و گزارش" 
            value={SmsSettingsTabs.DASHBOARD} 
          />
        </Tabs>
      </Box>
      
      {/* محتوای فعال */}
      <Box sx={{ mt: 2 }}>
        {/* تب تنظیمات */}
        {activeTab === SmsSettingsTabs.SETTINGS && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Grid container spacing={3}>
              {/* تنظیمات سرویس پیامک */}
              <Grid item xs={12} md={8}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 3, 
                    borderRadius: 2,
                    boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
                  }}
                >
                  <Typography variant="h6" mb={2}>
                    پیکربندی سرویس پیامک
                  </Typography>
                  
                  <Box 
                    sx={{ 
                      p: 2, 
                      mb: 3, 
                      borderRadius: 1.5, 
                      bgcolor: theme => alpha(theme.palette.primary.main, 0.04),
                      border: '1px dashed',
                      borderColor: theme => alpha(theme.palette.primary.main, 0.2),
                    }}
                  >
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
                      label={
                        <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="body1" sx={{ fontWeight: 500, mx: 1 }}>
                            {settings.isActive ? 'سرویس پیامک فعال است' : 'سرویس پیامک غیرفعال است'}
                          </Typography>
                          <Chip 
                            size="small" 
                            label={settings.isActive ? 'فعال' : 'غیرفعال'} 
                            color={settings.isActive ? 'success' : 'default'}
                            variant={settings.isActive ? 'filled' : 'outlined'}
                            sx={{ ml: 1 }}
                          />
                        </Box>
                      }
                    />
                  </Box>
                  
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel id="provider-select-label">سرویس دهنده پیامک</InputLabel>
                    <Select
                      labelId="provider-select-label"
                      value={settings.provider}
                      onChange={e => handleChange('provider')(e as any)}
                      label="سرویس دهنده پیامک"
                      disabled={saving}
                    >
                      <MenuItem value={SmsProvider.SMS0098}>
                        <ListItemIcon>
                          <SmsIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="0098SMS" secondary="سرویس پیامک ۰۰۹۸" />
                      </MenuItem>
                      <MenuItem value={SmsProvider.KAVENEGAR}>
                        <ListItemIcon>
                          <MessageIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Kavenegar" secondary="کاوه نگار" />
                      </MenuItem>
                      <MenuItem value={SmsProvider.MELLIPAYAMAK}>
                        <ListItemIcon>
                          <SmsIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="MelliPayamak" secondary="ملی پیامک" />
                      </MenuItem>
                      <MenuItem value={SmsProvider.GHASEDAK}>
                        <ListItemIcon>
                          <EmailIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Ghasedak" secondary="قاصدک" />
                      </MenuItem>
                      <MenuItem value={SmsProvider.FARAPAYAMAK}>
                        <ListItemIcon>
                          <MessageIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="FaraPayamak" secondary="فراپیامک" />
                      </MenuItem>
                    </Select>
                  </FormControl>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="نام کاربری"
                        value={settings.username}
                        onChange={handleChange('username')}
                        disabled={saving}
                        placeholder={`نام کاربری سرویس ${settings.provider}`}
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
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
                        placeholder={`رمز عبور سرویس ${settings.provider}`}
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockIcon color="action" />
                            </InputAdornment>
                          ),
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
                        helperText={`شماره اختصاصی خود در سامانه ${settings.provider} را وارد کنید`}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <MobileIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>

                  <Box display="flex" justifyContent="space-between" mt={4}>
                    <Button
                      variant="outlined"
                      color="primary"
                      startIcon={<RefreshIcon />}
                      onClick={fetchCredit}
                      disabled={loadingCredit || saving || !settings.isActive}
                    >
                      بررسی اعتبار
                    </Button>
                    
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
                <Card 
                  elevation={0} 
                  sx={{ 
                    borderRadius: 2,
                    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                    height: '100%'
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                      <SendIcon fontSize="small" sx={{ mr: 1 }} />
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
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <MobileIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
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
                        fullWidth
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
                            startIcon={checkingStatus ? <CircularProgress size={16} /> : <RefreshIcon />}
                            onClick={checkDeliveryStatus}
                            disabled={checkingStatus}
                          >
                            بررسی وضعیت تحویل
                          </Button>
                          
                          {deliveryStatus && (
                            <Chip 
                              label={deliveryStatus.message}
                              color={
                                deliveryStatus.status === '1' || deliveryStatus.status === '2' ? 'success' : 
                                deliveryStatus.status === '0' || deliveryStatus.status === '8' ? 'warning' : 'error'
                              }
                              size="small"
                              sx={{ ml: 1 }}
                              icon={
                                deliveryStatus.status === '1' || deliveryStatus.status === '2' ? <CheckCircleIcon /> :
                                deliveryStatus.status === '0' || deliveryStatus.status === '8' ? <WarningIcon /> : <CancelIcon />
                              }
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
          </motion.div>
        )}
        
        {/* تب تاریخچه پیامک‌ها */}
        {activeTab === SmsSettingsTabs.LOGS && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                borderRadius: 2,
                boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
              }}
            >
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  mb: 3,
                  flexDirection: { xs: 'column', md: 'row' },
                  gap: 2
                }}
              >
                <Typography variant="h6">
                  تاریخچه پیامک‌های ارسال شده
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>وضعیت</InputLabel>
                    <Select
                      value={logsFilter.status}
                      onChange={(e) => setLogsFilter({...logsFilter, status: e.target.value})}
                      label="وضعیت"
                    >
                      <MenuItem value="all">همه</MenuItem>
                      <MenuItem value={SmsStatus.DELIVERED}>تحویل شده</MenuItem>
                      <MenuItem value={SmsStatus.FAILED}>ناموفق</MenuItem>
                      <MenuItem value={SmsStatus.PENDING}>در انتظار</MenuItem>
                      <MenuItem value={SmsStatus.EXPIRED}>منقضی</MenuItem>
                      <MenuItem value={SmsStatus.BLOCKED}>مسدود</MenuItem>
                    </Select>
                  </FormControl>
                  
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>بازه زمانی</InputLabel>
                    <Select
                      value={logsFilter.days}
                      onChange={(e) => setLogsFilter({...logsFilter, days: Number(e.target.value)})}
                      label="بازه زمانی"
                    >
                      <MenuItem value={1}>امروز</MenuItem>
                      <MenuItem value={7}>هفته گذشته</MenuItem>
                      <MenuItem value={30}>ماه گذشته</MenuItem>
                      <MenuItem value={90}>سه ماه گذشته</MenuItem>
                      <MenuItem value={365}>سال گذشته</MenuItem>
                      <MenuItem value={0}>همه زمان‌ها</MenuItem>
                    </Select>
                  </FormControl>
                  
                  <TextField
                    size="small"
                    placeholder="جستجو..."
                    value={logsFilter.search}
                    onChange={(e) => setLogsFilter({...logsFilter, search: e.target.value})}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
              </Box>
              
              {logsLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <TableContainer sx={{ maxHeight: 450 }}>
                  <Table stickyHeader size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>شماره گیرنده</TableCell>
                        <TableCell>متن پیامک</TableCell>
                        <TableCell align="center">وضعیت</TableCell>
                        <TableCell>تاریخ ارسال</TableCell>
                        <TableCell align="center">هزینه (ریال)</TableCell>
                        <TableCell>مربوط به</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {smsLogs
                        .filter(log => {
                          // فیلتر بر اساس وضعیت
                          if (logsFilter.status !== 'all' && log.status !== logsFilter.status) {
                            return false;
                          }
                          
                          // فیلتر بر اساس جستجو
                          if (logsFilter.search && !log.receiver.includes(logsFilter.search) && !log.message.includes(logsFilter.search)) {
                            return false;
                          }
                          
                          // فیلتر بر اساس بازه زمانی
                          if (logsFilter.days > 0) {
                            const logDate = new Date(log.sentAt);
                            const now = new Date();
                            const diffDays = Math.floor((now.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24));
                            if (diffDays > logsFilter.days) {
                              return false;
                            }
                          }
                          
                          return true;
                        })
                        .slice(0, 100)
                        .map((log) => {
                          // تبدیل تاریخ به فرمت دلخواه
                          const date = new Date(log.sentAt);
                          const formattedDate = new Intl.DateTimeFormat('fa-IR', {
                            year: 'numeric',
                            month: 'numeric',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          }).format(date);
                          
                          return (
                            <TableRow 
                              key={log.id}
                              hover
                              sx={{ 
                                '&:hover': { 
                                  bgcolor: theme => alpha(theme.palette.primary.main, 0.05),
                                },
                              }}
                            >
                              <TableCell dir="ltr">{log.receiver}</TableCell>
                              <TableCell>
                                <Tooltip title={log.message}>
                                  <Typography noWrap sx={{ maxWidth: 200 }}>
                                    {log.message}
                                  </Typography>
                                </Tooltip>
                              </TableCell>
                              <TableCell align="center">
                                <Chip
                                  size="small"
                                  label={
                                    log.status === SmsStatus.DELIVERED ? 'تحویل شده' :
                                    log.status === SmsStatus.SENT ? 'ارسال شده' :
                                    log.status === SmsStatus.FAILED ? 'ناموفق' :
                                    log.status === SmsStatus.PENDING ? 'در انتظار' :
                                    log.status === SmsStatus.EXPIRED ? 'منقضی شده' :
                                    log.status === SmsStatus.BLOCKED ? 'مسدود شده' :
                                    'نامشخص'
                                  }
                                  color={
                                    log.status === SmsStatus.DELIVERED ? 'success' :
                                    log.status === SmsStatus.SENT ? 'primary' :
                                    log.status === SmsStatus.FAILED ? 'error' :
                                    log.status === SmsStatus.PENDING ? 'info' :
                                    log.status === SmsStatus.EXPIRED ? 'warning' :
                                    log.status === SmsStatus.BLOCKED ? 'error' :
                                    'default'
                                  }
                                  variant={log.status === SmsStatus.DELIVERED ? 'filled' : 'outlined'}
                                />
                              </TableCell>
                              <TableCell>{formattedDate}</TableCell>
                              <TableCell align="center">
                                {log.cost ? new Intl.NumberFormat('fa-IR').format(log.cost) : '-'}
                              </TableCell>
                              <TableCell>
                                {log.relatedTo ? (
                                  <Chip
                                    size="small"
                                    label={`${log.relatedTo === 'Payment' ? 'پرداخت' : 'درخواست'} #${log.relatedId}`}
                                    variant="outlined"
                                    color={log.relatedTo === 'Payment' ? 'primary' : 'secondary'}
                                  />
                                ) : '-'}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
              
              {!logsLoading && smsLogs.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography color="text.secondary">
                    هیچ پیامکی یافت نشد
                  </Typography>
                </Box>
              )}
            </Paper>
          </motion.div>
        )}
        
        {/* تب قالب‌های پیامک */}
        {activeTab === SmsSettingsTabs.TEMPLATES && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                borderRadius: 2,
                boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
              }}
            >
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  mb: 3,
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 2
                }}
              >
                <Typography variant="h6">
                  قالب‌های پیامک
                </Typography>
                
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => {
                    setSelectedTemplate(null);
                    setTemplateDialogOpen(true);
                  }}
                >
                  قالب جدید
                </Button>
              </Box>
              
              {templatesLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {templates.map(template => (
                    <Grid item xs={12} sm={6} md={4} key={template.id}>
                      <Card 
                        elevation={0} 
                        sx={{ 
                          borderRadius: 2,
                          border: '1px solid',
                          borderColor: 'divider',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          transition: 'all 0.2s',
                          '&:hover': {
                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                            borderColor: 'transparent',
                          },
                        }}
                      >
                        <Box 
                          sx={{ 
                            position: 'absolute', 
                            top: 12, 
                            right: 12,
                            zIndex: 2,
                          }}
                        >
                          <Chip
                            size="small"
                            label={template.category}
                            color="primary"
                            variant="outlined"
                          />
                        </Box>
                        
                        <CardContent sx={{ pt: 5, flexGrow: 1 }}>
                          <Typography variant="h6" gutterBottom>
                            {template.title}
                          </Typography>
                          
                          <Divider sx={{ my: 1 }} />
                          
                          <Box 
                            sx={{ 
                              p: 1.5, 
                              borderRadius: 1.5, 
                              bgcolor: theme => alpha(theme.palette.primary.main, 0.05),
                              mb: 2,
                              minHeight: 100,
                            }}
                          >
                            <Typography variant="body2">
                              {template.content}
                            </Typography>
                          </Box>
                          
                          {template.variables.length > 0 && (
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                                متغیرها:
                              </Typography>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {template.variables.map(variable => (
                                  <Chip
                                    key={variable}
                                    size="small"
                                    label={variable}
                                    color="default"
                                    variant="outlined"
                                  />
                                ))}
                              </Box>
                            </Box>
                          )}
                          
                          {template.description && (
                            <Typography variant="caption" color="text.secondary" display="block">
                              {template.description}
                            </Typography>
                          )}
                        </CardContent>
                        
                        <Divider />
                        
                        <Box 
                          sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            p: 1,
                          }}
                        >
                          <Box sx={{ display: 'flex' }}>
                            <Tooltip title="استفاده">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => {
                                  setTestMessage(template.content);
                                  setActiveTab(SmsSettingsTabs.SETTINGS);
                                }}
                              >
                                <SendIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            
                            <Tooltip title="کپی">
                              <IconButton
                                size="small"
                                onClick={() => {
                                  navigator.clipboard.writeText(template.content);
                                  showToast('متن قالب کپی شد', 'success');
                                }}
                              >
                                <ContentCopyIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                          
                          <Box sx={{ display: 'flex' }}>
                            <Tooltip title="ویرایش">
                              <IconButton
                                size="small"
                                color="info"
                                onClick={() => {
                                  setSelectedTemplate(template);
                                  setTemplateDialogOpen(true);
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            
                            <Tooltip title="حذف">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => {
                                  // در یک پروژه واقعی، اینجا تابع حذف فراخوانی می‌شود
                                  showToast('این قابلیت در نسخه فعلی قابل دسترس نیست', 'info');
                                }}
                              >
                                <DeleteOutlineIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
              
              {!templatesLoading && templates.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography color="text.secondary">
                    هیچ قالبی یافت نشد
                  </Typography>
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => {
                      setSelectedTemplate(null);
                      setTemplateDialogOpen(true);
                    }}
                    sx={{ mt: 2 }}
                  >
                    ایجاد اولین قالب
                  </Button>
                </Box>
              )}
              
              {/* دیالوگ ایجاد/ویرایش قالب */}
              <Dialog 
                open={templateDialogOpen} 
                onClose={() => setTemplateDialogOpen(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{
                  elevation: 0,
                  sx: {
                    borderRadius: 2,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                  }
                }}
              >
                <DialogTitle>
                  {selectedTemplate ? 'ویرایش قالب پیامک' : 'ایجاد قالب پیامک جدید'}
                </DialogTitle>
                <DialogContent dividers>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="عنوان قالب"
                        fullWidth
                        value={selectedTemplate?.title || ''}
                        // این تغییرات در پروژه واقعی شما پیاده‌سازی می‌شود
                        // onChange={(e) => setSelectedTemplate({...selectedTemplate!, title: e.target.value})}
                        required
                        variant="outlined"
                        margin="normal"
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="دسته‌بندی"
                        fullWidth
                        value={selectedTemplate?.category || ''}
                        // onChange={(e) => setSelectedTemplate({...selectedTemplate!, category: e.target.value})}
                        select
                        variant="outlined"
                        margin="normal"
                        SelectProps={{
                          native: true,
                        }}
                      >
                        <option value="پرداخت">پرداخت</option>
                        <option value="درخواست">درخواست</option>
                        <option value="یادآوری">یادآوری</option>
                        <option value="عمومی">عمومی</option>
                        <option value="تبریک">تبریک</option>
                      </TextField>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        label="متن قالب"
                        fullWidth
                        multiline
                        rows={6}
                        value={selectedTemplate?.content || ''}
                        // onChange={(e) => setSelectedTemplate({...selectedTemplate!, content: e.target.value})}
                        required
                        variant="outlined"
                        margin="normal"
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        label="توضیحات"
                        fullWidth
                        value={selectedTemplate?.description || ''}
                        // onChange={(e) => setSelectedTemplate({...selectedTemplate!, description: e.target.value})}
                        variant="outlined"
                        margin="normal"
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={selectedTemplate?.isActive || false}
                            // onChange={(e) => setSelectedTemplate({...selectedTemplate!, isActive: e.target.checked})}
                          />
                        }
                        label="قالب فعال است"
                      />
                    </Grid>
                  </Grid>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setTemplateDialogOpen(false)}>
                    انصراف
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      // در پروژه واقعی، اینجا تابع ذخیره قالب فراخوانی می‌شود
                      showToast('این قابلیت در نسخه فعلی قابل دسترس نیست', 'info');
                      setTemplateDialogOpen(false);
                    }}
                  >
                    {selectedTemplate ? 'به‌روزرسانی قالب' : 'ایجاد قالب'}
                  </Button>
                </DialogActions>
              </Dialog>
            </Paper>
          </motion.div>
        )}
        
        {/* تب گروه‌های مخاطبین */}
        {activeTab === SmsSettingsTabs.GROUPS && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                borderRadius: 2,
                boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
              }}
            >
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  mb: 3,
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 2
                }}
              >
                <Typography variant="h6">
                  گروه‌های مخاطبین
                </Typography>
                
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => {
                    setSelectedGroup(null);
                    setGroupDialogOpen(true);
                  }}
                >
                  گروه جدید
                </Button>
              </Box>
              
              {groupsLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {contactGroups.map(group => (
                    <Grid item xs={12} sm={6} md={4} key={group.id}>
                      <Card 
                        elevation={0} 
                        sx={{ 
                          borderRadius: 2,
                          border: '1px solid',
                          borderColor: 'divider',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          transition: 'all 0.2s',
                          '&:hover': {
                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                            borderColor: 'transparent',
                          },
                        }}
                      >
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Box 
                            sx={{ 
                              display: 'flex', 
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              mb: 2
                            }}
                          >
                            <Typography variant="h6">
                              {group.name}
                            </Typography>
                            
                            <Avatar 
                              sx={{ 
                                bgcolor: theme => alpha(theme.palette.primary.main, 0.1),
                                color: 'primary.main',
                                width: 40,
                                height: 40,
                              }}
                            >
                              <Typography fontWeight="bold">{group.memberCount}</Typography>
                            </Avatar>
                          </Box>
                          
                          <Divider sx={{ mb: 2 }} />
                          
                          {group.description && (
                            <Typography variant="body2" color="text.secondary" paragraph>
                              {group.description}
                            </Typography>
                          )}
                          
                          <Box 
                            sx={{ 
                              display: 'flex', 
                              gap: 1, 
                              alignItems: 'center',
                              mb: 1
                            }}
                          >
                            <GroupIcon fontSize="small" color="action" />
                            <Typography variant="body2">
                              {group.memberCount} عضو
                            </Typography>
                          </Box>
                          
                          <Box 
                            sx={{ 
                              display: 'flex', 
                              gap: 1, 
                              alignItems: 'center' 
                            }}
                          >
                            <CalendarTodayIcon fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                              ایجاد شده در: {new Date(group.createdAt).toLocaleDateString('fa-IR')}
                            </Typography>
                          </Box>
                        </CardContent>
                        
                        <Divider />
                        
                        <Box 
                          sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            p: 1,
                          }}
                        >
                          <Button
                            size="small"
                            startIcon={<SendIcon />}
                            onClick={() => {
                              // در یک پروژه واقعی، اینجا به صفحه ارسال پیامک گروهی هدایت می‌شود
                              showToast('این قابلیت در نسخه فعلی قابل دسترس نیست', 'info');
                            }}
                          >
                            ارسال پیامک
                          </Button>
                          
                          <Box>
                            <Tooltip title="ویرایش">
                              <IconButton
                                size="small"
                                color="info"
                                onClick={() => {
                                  setSelectedGroup(group);
                                  setGroupDialogOpen(true);
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            
                            <Tooltip title="حذف">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => {
                                  // در یک پروژه واقعی، اینجا تابع حذف فراخوانی می‌شود
                                  showToast('این قابلیت در نسخه فعلی قابل دسترس نیست', 'info');
                                }}
                              >
                                <DeleteOutlineIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
              
              {!groupsLoading && contactGroups.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography color="text.secondary">
                    هیچ گروه مخاطبی یافت نشد
                  </Typography>
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => {
                      setSelectedGroup(null);
                      setGroupDialogOpen(true);
                    }}
                    sx={{ mt: 2 }}
                  >
                    ایجاد اولین گروه
                  </Button>
                </Box>
              )}
              
              {/* دیالوگ ایجاد/ویرایش گروه */}
              <Dialog 
                open={groupDialogOpen} 
                onClose={() => setGroupDialogOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                  elevation: 0,
                  sx: {
                    borderRadius: 2,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                  }
                }}
              >
                <DialogTitle>
                  {selectedGroup ? 'ویرایش گروه مخاطبین' : 'ایجاد گروه مخاطبین جدید'}
                </DialogTitle>
                <DialogContent dividers>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        label="نام گروه"
                        fullWidth
                        value={selectedGroup?.name || ''}
                        // این تغییرات در پروژه واقعی شما پیاده‌سازی می‌شود
                        // onChange={(e) => setSelectedGroup({...selectedGroup!, name: e.target.value})}
                        required
                        variant="outlined"
                        margin="normal"
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        label="توضیحات"
                        fullWidth
                        value={selectedGroup?.description || ''}
                        // onChange={(e) => setSelectedGroup({...selectedGroup!, description: e.target.value})}
                        variant="outlined"
                        margin="normal"
                        multiline
                        rows={3}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Box 
                        sx={{ 
                          border: '1px dashed',
                          borderColor: 'divider',
                          borderRadius: 1,
                          p: 2,
                          bgcolor: theme => alpha(theme.palette.primary.main, 0.03)
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          مخاطبین گروه
                        </Typography>
                        
                        <Box sx={{ maxHeight: 200, overflow: 'auto', mt: 2 }}>
                          <Typography variant="body2" color="text.secondary" align="center">
                            این بخش در نسخه فعلی قابل دسترس نیست
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setGroupDialogOpen(false)}>
                    انصراف
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      // در پروژه واقعی، اینجا تابع ذخیره گروه فراخوانی می‌شود
                      showToast('این قابلیت در نسخه فعلی قابل دسترس نیست', 'info');
                      setGroupDialogOpen(false);
                    }}
                  >
                    {selectedGroup ? 'به‌روزرسانی گروه' : 'ایجاد گروه'}
                  </Button>
                </DialogActions>
              </Dialog>
            </Paper>
          </motion.div>
        )}
        
        {/* تب زمانبندی پیامک */}
        {activeTab === SmsSettingsTabs.SCHEDULE && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                borderRadius: 2,
                boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
              }}
            >
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  mb: 3,
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 2
                }}
              >
                <Typography variant="h6">
                  زمانبندی ارسال پیامک
                </Typography>
                
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => {
                    setSelectedSchedule(null);
                    setScheduleDialogOpen(true);
                  }}
                >
                  زمانبندی جدید
                </Button>
              </Box>
              
              {schedulesLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>عنوان</TableCell>
                        <TableCell>متن پیامک</TableCell>
                        <TableCell align="center">زمان ارسال</TableCell>
                        <TableCell align="center">تکرار</TableCell>
                        <TableCell align="center">وضعیت</TableCell>
                        <TableCell align="center">گیرندگان</TableCell>
                        <TableCell align="center">عملیات</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {schedules.map(schedule => {
                        // تبدیل تاریخ به فرمت دلخواه
                        const date = new Date(schedule.scheduleTime);
                        const formattedDate = new Intl.DateTimeFormat('fa-IR', {
                          year: 'numeric',
                          month: 'numeric',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        }).format(date);
                        
                        // تعیین وضعیت
                        const status = schedule.status === 'PENDING' ? 'در انتظار' : 
                                      schedule.status === 'COMPLETED' ? 'تکمیل شده' : 
                                      schedule.status === 'CANCELLED' ? 'لغو شده' : 
                                      schedule.status === 'RUNNING' ? 'در حال اجرا' : 'نامشخص';
                        
                        // تعیین رنگ وضعیت
                        const statusColor = schedule.status === 'RUNNING' || schedule.status === 'COMPLETED' ? 'success' : 
                                          schedule.status === 'CANCELLED' ? 'error' : 'default';
                                          
                        // تعیین نحوه نمایش گیرندگان
                        const recipients = schedule.recipients.map(rec => {
                          if (rec.startsWith('group:')) {
                            const groupId = rec.split(':')[1];
                            const group = contactGroups.find(g => g.id === parseInt(groupId));
                            return group ? `گروه ${group.name}` : `گروه ${groupId}`;
                          }
                          return rec;
                        }).join(', ');
                        
                        return (
                          <TableRow key={schedule.id} hover>
                            <TableCell>{schedule.title}</TableCell>
                            <TableCell>
                              <Tooltip title={schedule.message}>
                                <Typography noWrap sx={{ maxWidth: 200 }}>
                                  {schedule.message}
                                </Typography>
                              </Tooltip>
                            </TableCell>
                            <TableCell align="center">{formattedDate}</TableCell>
                            <TableCell align="center">
                              {schedule.isRecurring ? (
                                <Chip
                                  size="small"
                                  label="تکرار شونده"
                                  color="primary"
                                  variant="outlined"
                                  icon={<AutorenewIcon />}
                                />
                              ) : (
                                <Chip
                                  size="small"
                                  label="یکبار"
                                  variant="outlined"
                                />
                              )}
                            </TableCell>
                            <TableCell align="center">
                              <Chip
                                size="small"
                                label={status}
                                color={statusColor as any}
                                variant={schedule.status === 'RUNNING' || schedule.status === 'COMPLETED' ? 'filled' : 'outlined'}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Tooltip title={recipients}>
                                <Typography variant="body2" noWrap sx={{ maxWidth: 150 }}>
                                  {recipients}
                                </Typography>
                              </Tooltip>
                            </TableCell>
                            <TableCell align="center">
                              <Tooltip title="ویرایش">
                                <IconButton
                                  size="small"
                                  color="info"
                                  onClick={() => {
                                    setSelectedSchedule(schedule);
                                    setScheduleDialogOpen(true);
                                  }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              
                              {schedule.status === 'PENDING' && (
                                <Tooltip title="لغو">
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => {
                                      // در یک پروژه واقعی، اینجا تابع لغو زمانبندی فراخوانی می‌شود
                                      showToast('این قابلیت در نسخه فعلی قابل دسترس نیست', 'info');
                                    }}
                                  >
                                    <CancelIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
              
              {!schedulesLoading && schedules.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography color="text.secondary">
                    هیچ زمانبندی‌ای یافت نشد
                  </Typography>
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => {
                      setSelectedSchedule(null);
                      setScheduleDialogOpen(true);
                    }}
                    sx={{ mt: 2 }}
                  >
                    ایجاد اولین زمانبندی
                  </Button>
                </Box>
              )}
              
              {/* دیالوگ ایجاد/ویرایش زمانبندی */}
              <Dialog 
                open={scheduleDialogOpen} 
                onClose={() => setScheduleDialogOpen(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{
                  elevation: 0,
                  sx: {
                    borderRadius: 2,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                  }
                }}
              >
                <DialogTitle>
                  {selectedSchedule ? 'ویرایش زمانبندی پیامک' : 'ایجاد زمانبندی پیامک جدید'}
                </DialogTitle>
                <DialogContent dividers>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="عنوان"
                        fullWidth
                        value={selectedSchedule?.title || ''}
                        // این تغییرات در پروژه واقعی شما پیاده‌سازی می‌شود
                        // onChange={(e) => setSelectedSchedule({...selectedSchedule!, title: e.target.value})}
                        required
                        variant="outlined"
                        margin="normal"
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="زمان ارسال"
                        fullWidth
                        type="datetime-local"
                        value={selectedSchedule?.scheduleTime ? new Date(selectedSchedule.scheduleTime).toISOString().slice(0, 16) : ''}
                        // onChange={(e) => setSelectedSchedule({...selectedSchedule!, scheduleTime: e.target.value})}
                        required
                        variant="outlined"
                        margin="normal"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        label="متن پیامک"
                        fullWidth
                        multiline
                        rows={4}
                        value={selectedSchedule?.message || ''}
                        // onChange={(e) => setSelectedSchedule({...selectedSchedule!, message: e.target.value})}
                        required
                        variant="outlined"
                        margin="normal"
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="گیرندگان"
                        fullWidth
                        select
                        SelectProps={{
                          multiple: true,
                          native: false,
                          renderValue: (selected) => {
                            const selectedValues = selected as string[];
                            return (
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selectedValues.map((value) => (
                                  <Chip key={value} label={value} size="small" />
                                ))}
                              </Box>
                            );
                          },
                        }}
                        value={selectedSchedule?.recipients || []}
                        // onChange={(e) => setSelectedSchedule({...selectedSchedule!, recipients: e.target.value})}
                        required
                        variant="outlined"
                        margin="normal"
                      >
                        {contactGroups.map((group) => (
                          <MenuItem key={`group:${group.id}`} value={`group:${group.id}`}>
                            <ListItemText primary={`گروه: ${group.name}`} secondary={`${group.memberCount} عضو`} />
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={selectedSchedule?.isRecurring || false}
                            // onChange={(e) => setSelectedSchedule({...selectedSchedule!, isRecurring: e.target.checked})}
                          />
                        }
                        label="ارسال تکراری"
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Box 
                        sx={{ 
                          p: 2, 
                          border: '1px dashed', 
                          borderColor: 'divider',
                          borderRadius: 1,
                          bgcolor: theme => alpha(theme.palette.info.main, 0.03),
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          در نسخه حرفه‌ای، امکان تعیین الگوی تکرار (روزانه، هفتگی، ماهانه) و روزهای خاص وجود دارد.
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setScheduleDialogOpen(false)}>
                    انصراف
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      // در پروژه واقعی، اینجا تابع ذخیره زمانبندی فراخوانی می‌شود
                      showToast('این قابلیت در نسخه فعلی قابل دسترس نیست', 'info');
                      setScheduleDialogOpen(false);
                    }}
                  >
                    {selectedSchedule ? 'به‌روزرسانی زمانبندی' : 'ایجاد زمانبندی'}
                  </Button>
                </DialogActions>
              </Dialog>
            </Paper>
          </motion.div>
        )}
        
        {/* تب داشبورد و آمار */}
        {activeTab === SmsSettingsTabs.DASHBOARD && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Box sx={{ mb: 3 }}>
              <Grid container spacing={3}>
                {/* کارت اعتبار */}
                <Grid item xs={12} md={6} lg={3}>
                  <StatsCard>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <StatsIconWrapper
                        sx={{
                          bgcolor: theme => alpha(theme.palette.primary.main, 0.1),
                          color: 'primary.main',
                        }}
                      >
                        <CreditCardIcon />
                      </StatsIconWrapper>
                      <Box sx={{ mr: 2, width: '100%' }}>
                        <Typography variant="body2" color="text.secondary">
                          اعتبار فعلی
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                          <Typography variant="h5">{
                            statsLoading ? (
                              <Skeleton width={80} />
                            ) : (
                              formatNumber(stats.currentCredit)
                            )
                          }</Typography>
                          <Typography variant="caption" color="text.secondary">
                            ریال
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </StatsCard>
                </Grid>
                
                {/* کارت ارسال‌های موفق */}
                <Grid item xs={12} md={6} lg={3}>
                  <StatsCard>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <StatsIconWrapper
                        sx={{
                          bgcolor: theme => alpha(theme.palette.success.main, 0.1),
                          color: 'success.main',
                        }}
                      >
                        <CheckCircleIcon />
                      </StatsIconWrapper>
                      <Box sx={{ mr: 2, width: '100%' }}>
                        <Typography variant="body2" color="text.secondary">
                          ارسال‌های موفق
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                          <Typography variant="h5">{
                            statsLoading ? (
                              <Skeleton width={80} />
                            ) : (
                              formatNumber(stats.deliveredCount)
                            )
                          }</Typography>
                          <Typography variant="caption" color="text.secondary">
                            پیامک
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </StatsCard>
                </Grid>
                
                {/* کارت ارسال‌های ناموفق */}
                <Grid item xs={12} md={6} lg={3}>
                  <StatsCard>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <StatsIconWrapper
                        sx={{
                          bgcolor: theme => alpha(theme.palette.error.main, 0.1),
                          color: 'error.main',
                        }}
                      >
                        <ErrorOutlineIcon />
                      </StatsIconWrapper>
                      <Box sx={{ mr: 2, width: '100%' }}>
                        <Typography variant="body2" color="text.secondary">
                          ارسال‌های ناموفق
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                          <Typography variant="h5">{
                            statsLoading ? (
                              <Skeleton width={80} />
                            ) : (
                              formatNumber(stats.failedCount)
                            )
                          }</Typography>
                          <Typography variant="caption" color="text.secondary">
                            پیامک
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </StatsCard>
                </Grid>
                
                {/* کارت هزینه کل */}
                <Grid item xs={12} md={6} lg={3}>
                  <StatsCard>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <StatsIconWrapper
                        sx={{
                          bgcolor: theme => alpha(theme.palette.warning.main, 0.1),
                          color: 'warning.main',
                        }}
                      >
                        <MonetizationOnIcon />
                      </StatsIconWrapper>
                      <Box sx={{ mr: 2, width: '100%' }}>
                        <Typography variant="body2" color="text.secondary">
                          هزینه کل
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                          <Typography variant="h5">{
                            statsLoading ? (
                              <Skeleton width={80} />
                            ) : (
                              formatNumber(stats.totalCost)
                            )
                          }</Typography>
                          <Typography variant="caption" color="text.secondary">
                            ریال
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </StatsCard>
                </Grid>
              </Grid>
            </Box>
            
            <Grid container spacing={3}>
              {/* نمودار ارسال‌های ماهانه */}
              <Grid item xs={12} lg={8}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 3, 
                    borderRadius: 2,
                    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                    height: '100%',
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    آمار ارسال ماهانه
                  </Typography>
                  
                  {statsLoading ? (
                    <Box sx={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <Box>
                      <Box sx={{ height: 300, mt: 2 }}>
                        {/* در یک پروژه واقعی، اینجا از کتابخانه‌های نمودار مانند recharts یا apex-charts استفاده می‌شود */}
                        <Box
                          sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            نمودار آمار ارسال ماهانه
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            (در نسخه نهایی پروژه از کتابخانه نمودار استفاده خواهد شد)
                          </Typography>
                          
                          <Box
                            sx={{
                              mt: 2,
                              width: '100%',
                              height: 200,
                              bgcolor: theme => alpha(theme.palette.primary.main, 0.03),
                              borderRadius: 2,
                              p: 2,
                              display: 'flex',
                              alignItems: 'flex-end',
                            }}
                          >
                            {stats.monthlySent.map((item, index) => (
                              <Tooltip key={index} title={`${item.month}: ${item.count} پیامک`}>
                                <Box
                                  sx={{
                                    height: `${(item.count / Math.max(...stats.monthlySent.map(i => i.count))) * 100}%`,
                                    width: `calc(100% / ${stats.monthlySent.length})`,
                                    bgcolor: theme => (index % 2 === 0 ? 
                                      alpha(theme.palette.primary.main, 0.7) : 
                                      alpha(theme.palette.primary.main, 0.9)),
                                    mx: 0.5,
                                    borderRadius: '4px 4px 0 0',
                                    transition: 'all 0.3s',
                                    '&:hover': {
                                      bgcolor: 'primary.main',
                                      transform: 'scaleY(1.05)',
                                    },
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'flex-start',
                                    pt: 0.5,
                                  }}
                                >
                                  <Typography 
                                    variant="caption" 
                                    sx={{ 
                                      color: 'white',
                                      fontSize: '0.6rem',
                                      display: item.count > 0 ? 'block' : 'none',
                                    }}
                                  >
                                    {item.count}
                                  </Typography>
                                </Box>
                              </Tooltip>
                            ))}
                          </Box>
                          
                          <Box 
                            sx={{ 
                              width: '100%', 
                              display: 'flex', 
                              justifyContent: 'space-around', 
                              mt: 1 
                            }}
                          >
                            {stats.monthlySent.map((item, index) => (
                              <Typography 
                                key={index} 
                                variant="caption" 
                                color="text.secondary"
                                sx={{ width: `calc(100% / ${stats.monthlySent.length})`, textAlign: 'center' }}
                              >
                                {item.month}
                              </Typography>
                            ))}
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  )}
                </Paper>
              </Grid>
              
              {/* بخش آمار تحویل */}
              <Grid item xs={12} lg={4}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 3, 
                    borderRadius: 2,
                    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                    height: '100%',
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    وضعیت تحویل پیامک‌ها
                  </Typography>
                  
                  {statsLoading ? (
                    <Box sx={{ height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      {/* در یک پروژه واقعی، اینجا از کتابخانه‌های نمودار دایره‌ای استفاده می‌شود */}
                      <Box
                        sx={{
                          position: 'relative',
                          width: 200,
                          height: 200,
                          borderRadius: '50%',
                          mt: 2,
                          overflow: 'hidden',
                        }}
                      >
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            bottom: 0,
                            left: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <Typography variant="h4">
                            {`${Math.round((stats.deliveredCount / (stats.deliveredCount + stats.failedCount)) * 100)}%`}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            نرخ تحویل
                          </Typography>
                        </Box>
                        
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            width: '100%',
                            height: '100%',
                            background: `conic-gradient(
                              ${theme => theme.palette.success.main} 0% ${(stats.deliveredCount / (stats.deliveredCount + stats.failedCount)) * 100}%,
                              ${theme => theme.palette.error.main} ${(stats.deliveredCount / (stats.deliveredCount + stats.failedCount)) * 100}% 100%
                            )`,
                            opacity: 0.7,
                          }}
                        />
                        
                        <Box
                          sx={{
                            position: 'absolute',
                            top: '10%',
                            right: '10%',
                            bottom: '10%',
                            left: '10%',
                            borderRadius: '50%',
                            bgcolor: 'background.paper',
                          }}
                        />
                      </Box>
                      
                      <Box sx={{ mt: 3, width: '100%' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box
                              sx={{
                                width: 12,
                                height: 12,
                                borderRadius: 1,
                                bgcolor: 'success.main',
                                mr: 1,
                              }}
                            />
                            <Typography variant="body2">
                              تحویل داده شده
                            </Typography>
                          </Box>
                          <Typography variant="body2">
                            {formatNumber(stats.deliveredCount)} ({Math.round((stats.deliveredCount / (stats.deliveredCount + stats.failedCount)) * 100)}%)
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box
                              sx={{
                                width: 12,
                                height: 12,
                                borderRadius: 1,
                                bgcolor: 'error.main',
                                mr: 1,
                              }}
                            />
                            <Typography variant="body2">
                              عدم تحویل
                            </Typography>
                          </Box>
                          <Typography variant="body2">
                            {formatNumber(stats.failedCount)} ({Math.round((stats.failedCount / (stats.deliveredCount + stats.failedCount)) * 100)}%)
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  )}
                </Paper>
              </Grid>
              
              {/* اطلاعات بیشتر */}
              <Grid item xs={12}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 3, 
                    borderRadius: 2,
                    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    اطلاعات تکمیلی
                  </Typography>
                  
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12} md={4}>
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: theme => alpha(theme.palette.primary.main, 0.05),
                        }}
                      >
                        <Typography variant="subtitle2" gutterBottom>
                          پرکاربردترین قالب‌ها
                        </Typography>
                        
                        {statsLoading ? (
                          <Box sx={{ mt: 1 }}>
                            <Skeleton variant="text" />
                            <Skeleton variant="text" />
                            <Skeleton variant="text" />
                          </Box>
                        ) : (
                          <List dense>
                            {stats.topTemplates.map((template, index) => (
                              <ListItem key={index} disablePadding sx={{ mb: 1 }}>
                                <ListItemIcon sx={{ minWidth: 32 }}>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      width: 24,
                                      height: 24,
                                      borderRadius: '50%',
                                      bgcolor: index === 0 ? 'warning.main' : 
                                              index === 1 ? 'info.main' : 
                                              index === 2 ? 'success.main' : 'action.disabled',
                                      color: 'white',
                                      display: 'flex',
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                      fontWeight: 'bold',
                                    }}
                                  >
                                    {index + 1}
                                  </Typography>
                                </ListItemIcon>
                                <ListItemText
                                  primary={template.name}
                                  secondary={`${template.useCount} بار استفاده شده`}
                                  primaryTypographyProps={{ variant: 'body2' }}
                                  secondaryTypographyProps={{ variant: 'caption' }}
                                />
                              </ListItem>
                            ))}
                          </List>
                        )}
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: theme => alpha(theme.palette.secondary.main, 0.05),
                        }}
                      >
                        <Typography variant="subtitle2" gutterBottom>
                          پرکاربردترین گروه‌ها
                        </Typography>
                        
                        {statsLoading ? (
                          <Box sx={{ mt: 1 }}>
                            <Skeleton variant="text" />
                            <Skeleton variant="text" />
                            <Skeleton variant="text" />
                          </Box>
                        ) : (
                          <List dense>
                            {stats.topGroups.map((group, index) => (
                              <ListItem key={index} disablePadding sx={{ mb: 1 }}>
                                <ListItemIcon sx={{ minWidth: 32 }}>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      width: 24,
                                      height: 24,
                                      borderRadius: '50%',
                                      bgcolor: index === 0 ? 'warning.main' : 
                                              index === 1 ? 'info.main' : 
                                              index === 2 ? 'success.main' : 'action.disabled',
                                      color: 'white',
                                      display: 'flex',
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                      fontWeight: 'bold',
                                    }}
                                  >
                                    {index + 1}
                                  </Typography>
                                </ListItemIcon>
                                <ListItemText
                                  primary={group.name}
                                  secondary={`${group.messageCount} پیامک ارسال شده`}
                                  primaryTypographyProps={{ variant: 'body2' }}
                                  secondaryTypographyProps={{ variant: 'caption' }}
                                />
                              </ListItem>
                            ))}
                          </List>
                        )}
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: theme => alpha(theme.palette.warning.main, 0.05),
                          height: '100%',
                        }}
                      >
                        <Typography variant="subtitle2" gutterBottom>
                          خطاهای رایج
                        </Typography>
                        
                        {statsLoading ? (
                          <Box sx={{ mt: 1 }}>
                            <Skeleton variant="text" />
                            <Skeleton variant="text" />
                            <Skeleton variant="text" />
                          </Box>
                        ) : (
                          <List dense>
                            {stats.commonErrors.map((error, index) => (
                              <ListItem key={index} disablePadding sx={{ mb: 1 }}>
                                <ListItemIcon sx={{ minWidth: 32 }}>
                                  <ErrorOutlineIcon 
                                    fontSize="small" 
                                    color={index === 0 ? 'error' : 'action'} 
                                  />
                                </ListItemIcon>
                                <ListItemText
                                  primary={error.message}
                                  secondary={`${error.count} بار رخ داده`}
                                  primaryTypographyProps={{ variant: 'body2' }}
                                  secondaryTypographyProps={{ variant: 'caption' }}
                                />
                              </ListItem>
                            ))}
                          </List>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </motion.div>
        )}
      </Box>
      
      {/* اسنک‌بار برای نمایش پیام‌ها */}
      <Snackbar
        open={toast.open}
        autoHideDuration={5000}
        onClose={hideToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert 
          onClose={hideToast} 
          severity={toast.type as any} 
          sx={{ width: '100%' }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SmsSettingsPage;