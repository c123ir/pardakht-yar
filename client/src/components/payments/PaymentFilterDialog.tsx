// client/src/components/payments/PaymentFilterDialog.tsx
// کامپوننت دیالوگ فیلتر پرداخت‌ها

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Box,
  IconButton,
  Tooltip,
  CircularProgress,
  Typography,
  Divider,
} from '@mui/material';
import {
  FilterList as FilterIcon,
  Clear as ClearIcon,
  FilterAltOff as FilterOffIcon,
  FilterAlt as FilterOnIcon,
  CalendarMonth as CalendarIcon,
} from '@mui/icons-material';
import { useGroups } from '../../hooks/useGroups';
import { useContacts } from '../../hooks/useContacts';
import { SelectChangeEvent } from '@mui/material/Select';

interface PaymentFilterValues {
  status: string;
  startDate: string;
  endDate: string;
  groupId: string;
  contactId: string;
}

interface PaymentFilterDialogProps {
  open: boolean;
  initialValues: PaymentFilterValues;
  onClose: () => void;
  onApply: (filters: PaymentFilterValues) => void;
}

/**
 * کامپوننت دیالوگ فیلتر پرداخت‌ها
 */
const PaymentFilterDialog: React.FC<PaymentFilterDialogProps> = ({
  open,
  initialValues,
  onClose,
  onApply,
}) => {
  const { groups, loading: groupsLoading } = useGroups();
  const { contacts, loading: contactsLoading } = useContacts();
  
  // حالت فیلترها
  const [filterValues, setFilterValues] = useState<PaymentFilterValues>(initialValues);
  
  // تنظیم مقادیر اولیه فیلترها هنگام باز شدن دیالوگ
  useEffect(() => {
    if (open) {
      setFilterValues(initialValues);
    }
  }, [open, initialValues]);

  // تغییر مقادیر فیلترها
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    if (name) {
      setFilterValues(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // اعمال فیلترها
  const handleApply = () => {
    onApply(filterValues);
  };

  // پاک کردن همه فیلترها
  const handleReset = () => {
    const emptyFilters: PaymentFilterValues = {
      status: '',
      startDate: '',
      endDate: '',
      groupId: '',
      contactId: '',
    };
    setFilterValues(emptyFilters);
  };
  
  // بررسی وجود فیلتر فعال
  const hasActiveFilters = (): boolean => {
    return Object.values(filterValues).some(value => value !== '');
  };

  // شمارش تعداد فیلترهای فعال
  const countActiveFilters = (): number => {
    return Object.values(filterValues).filter(value => value !== '').length;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            <FilterIcon color="primary" />
            <Typography variant="h6">فیلتر پرداخت‌ها</Typography>
            {countActiveFilters() > 0 && (
              <Box 
                sx={{ 
                  bgcolor: 'primary.main', 
                  color: 'primary.contrastText',
                  borderRadius: '50%',
                  width: 24,
                  height: 24,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  ml: 1
                }}
              >
                {countActiveFilters()}
              </Box>
            )}
          </Box>
          <Tooltip title="پاک کردن فیلترها">
            <IconButton
              onClick={handleReset}
              disabled={!hasActiveFilters()}
              color={hasActiveFilters() ? 'error' : 'default'}
            >
              <FilterOffIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </DialogTitle>
      
      <Divider />
      
      <DialogContent>
        <Grid container spacing={2} sx={{ pt: 1 }}>
          {/* فیلتر بر اساس وضعیت */}
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel id="status-filter-label">وضعیت</InputLabel>
              <Select
                labelId="status-filter-label"
                id="status"
                name="status"
                value={filterValues.status}
                onChange={handleChange}
                label="وضعیت"
              >
                <MenuItem value="">
                  <em>همه وضعیت‌ها</em>
                </MenuItem>
                <MenuItem value="PENDING">در انتظار</MenuItem>
                <MenuItem value="APPROVED">تأیید شده</MenuItem>
                <MenuItem value="PAID">پرداخت شده</MenuItem>
                <MenuItem value="REJECTED">رد شده</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* فیلتر بر اساس گروه */}
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel id="group-filter-label">گروه</InputLabel>
              <Select
                labelId="group-filter-label"
                id="groupId"
                name="groupId"
                value={filterValues.groupId}
                onChange={handleChange}
                label="گروه"
                disabled={groupsLoading}
                startAdornment={groupsLoading ? <CircularProgress size={20} sx={{ mr: 1 }} /> : null}
              >
                <MenuItem value="">
                  <em>همه گروه‌ها</em>
                </MenuItem>
                {groups?.map(group => (
                  <MenuItem key={group.id} value={group.id.toString()}>
                    {group.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* فیلتر بر اساس طرف حساب */}
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel id="contact-filter-label">طرف حساب</InputLabel>
              <Select
                labelId="contact-filter-label"
                id="contactId"
                name="contactId"
                value={filterValues.contactId}
                onChange={handleChange}
                label="طرف حساب"
                disabled={contactsLoading}
                startAdornment={contactsLoading ? <CircularProgress size={20} sx={{ mr: 1 }} /> : null}
              >
                <MenuItem value="">
                  <em>همه طرف‌حساب‌ها</em>
                </MenuItem>
                {contacts?.map(contact => (
                  <MenuItem key={contact.id} value={contact.id.toString()}>
                    {contact.companyName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* فیلتر تاریخ شروع */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="از تاریخ"
              type="date"
              name="startDate"
              value={filterValues.startDate}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                startAdornment: <CalendarIcon color="action" sx={{ mr: 1 }} />
              }}
            />
          </Grid>

          {/* فیلتر تاریخ پایان */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="تا تاریخ"
              type="date"
              name="endDate"
              value={filterValues.endDate}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                startAdornment: <CalendarIcon color="action" sx={{ mr: 1 }} />
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions>
        <Button
          onClick={handleReset}
          color="inherit"
          disabled={!hasActiveFilters()}
          startIcon={<ClearIcon />}
        >
          پاک کردن فیلترها
        </Button>
        <Button
          onClick={onClose}
          color="inherit"
        >
          انصراف
        </Button>
        <Button
          onClick={handleApply}
          variant="contained"
          color="primary"
          startIcon={<FilterOnIcon />}
        >
          اعمال فیلتر
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentFilterDialog;