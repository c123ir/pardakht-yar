import React from 'react';
import {
  Grid,
  IconButton,
  Paper,
  Popover,
  TextField,
  Typography,
  InputAdornment,
  Tooltip,
} from '@mui/material';
import * as Icons from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';

// لیست آیکون‌های پرکاربرد
const COMMON_ICONS = [
  // عمومی
  'Event', 'EventNote', 'EventAvailable', 'EventBusy', 'Today',
  'Schedule', 'AccessTime', 'Timer', 'TimerOff', 'Update',
  'Notifications', 'NotificationsActive', 'NotificationsOff', 'Alarm', 'AlarmOn',
  'CalendarToday', 'CalendarMonth', 'DateRange', 'Task', 'TaskAlt',
  // مالی
  'Payment', 'Money', 'CreditCard', 'AccountBalance', 'AccountBalanceWallet',
  'Receipt', 'ReceiptLong', 'LocalAtm', 'Payments', 'PriceChange',
  'CurrencyExchange', 'Savings', 'RequestQuote', 'Paid', 'MoneyOff',
  // کاربران و گروه‌ها
  'Person', 'People', 'Group', 'GroupAdd', 'Contacts',
  'ContactPhone', 'ContactMail', 'Business', 'BusinessCenter', 'Work',
  'SupervisorAccount', 'ManageAccounts', 'AccountCircle', 'PersonAdd', 'Groups',
  // ارتباطات
  'Phone', 'Email', 'Message', 'Chat', 'Forum',
  'Call', 'CallEnd', 'VoiceChat', 'VideoCall', 'Mail',
  'Send', 'Share', 'Connect', 'Link', 'LinkOff',
  // اسناد و فایل‌ها
  'Description', 'Article', 'Assignment', 'AssignmentTurnedIn', 'Grading',
  'FileCopy', 'FilePresent', 'FileUpload', 'FileDownload', 'Folder',
  'Note', 'NoteAdd', 'Edit', 'EditNote', 'List',
  // وضعیت و اقدامات
  'CheckCircle', 'Check', 'Done', 'DoneAll', 'Close',
  'Cancel', 'Error', 'Warning', 'Info', 'Help',
  'Settings', 'Build', 'Tune', 'Category', 'Flag',
  // حمل و نقل
  'LocalShipping', 'DeliveryDining', 'FlightTakeoff', 'FlightLand', 'DirectionsCar',
  'DirectionsBus', 'Train', 'Motorcycle', 'ElectricCar', 'LocalTaxi',
];

interface IconPickerProps {
  value?: string;
  onChange: (iconName: string) => void;
  color?: string;
}

const IconPicker: React.FC<IconPickerProps> = ({ value, onChange, color }) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (iconName: string) => {
    onChange(iconName);
    handleClose();
  };

  const filteredIcons = COMMON_ICONS.filter(iconName =>
    iconName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getIcon = (iconName: string) => {
    const Icon = (Icons as any)[iconName];
    return Icon ? <Icon /> : null;
  };

  const selectedIcon = value ? getIcon(value) : null;

  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          p: 1,
          width: '100%',
          justifyContent: 'flex-start',
          color: color || 'inherit',
        }}
      >
        {selectedIcon || <Icons.Apps />}
        <Typography sx={{ mr: 1, flexGrow: 1, textAlign: 'right' }}>
          {value || 'انتخاب آیکون'}
        </Typography>
      </IconButton>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Paper sx={{ p: 2, maxWidth: 400, maxHeight: 400, overflow: 'auto' }}>
          <TextField
            fullWidth
            size="small"
            placeholder="جستجوی آیکون..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
          <Grid container spacing={1}>
            {filteredIcons.map((iconName) => (
              <Grid item key={iconName}>
                <Tooltip title={iconName}>
                  <IconButton
                    onClick={() => handleSelect(iconName)}
                    sx={{
                      color: value === iconName ? 'primary.main' : 'inherit',
                      backgroundColor: value === iconName ? 'primary.lighter' : 'transparent',
                    }}
                  >
                    {getIcon(iconName)}
                  </IconButton>
                </Tooltip>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Popover>
    </>
  );
};

export default IconPicker; 