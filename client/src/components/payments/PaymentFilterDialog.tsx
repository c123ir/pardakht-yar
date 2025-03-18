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
} from '@mui/material';
import { PaymentStatus } from '../../types/payment.types';
import { useGroups } from '../../hooks/useGroups';
import { useContacts } from '../../hooks/useContacts';

interface PaymentFilterDialogProps {
  open: boolean;
  filters: {
    status: string;
    startDate: string;
    endDate: string;
    groupId: string;
    contactId: string;
  };
  onClose: () => void;
  onApply: (filters: PaymentFilterDialogProps['filters']) => void;
}

const PaymentFilterDialog: React.FC<PaymentFilterDialogProps> = ({
  open,
  filters,
  onClose,
  onApply,
}) => {
  const { groups } = useGroups();
  const { contacts } = useContacts();
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setLocalFilters(prev => ({
      ...prev,
      [name as string]: value,
    }));
  };

  const handleApply = () => {
    onApply(localFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      status: '',
      startDate: '',
      endDate: '',
      groupId: '',
      contactId: '',
    };
    setLocalFilters(resetFilters);
    onApply(resetFilters);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>فیلتر پرداخت‌ها</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>وضعیت</InputLabel>
              <Select
                name="status"
                value={localFilters.status}
                onChange={handleChange}
              >
                <MenuItem value="">همه</MenuItem>
                <MenuItem value="PENDING">در انتظار</MenuItem>
                <MenuItem value="APPROVED">تأیید شده</MenuItem>
                <MenuItem value="PAID">پرداخت شده</MenuItem>
                <MenuItem value="REJECTED">رد شده</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>گروه</InputLabel>
              <Select
                name="groupId"
                value={localFilters.groupId}
                onChange={handleChange}
              >
                <MenuItem value="">همه</MenuItem>
                {groups.map(group => (
                  <MenuItem key={group.id} value={group.id}>
                    {group.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>طرف حساب</InputLabel>
              <Select
                name="contactId"
                value={localFilters.contactId}
                onChange={handleChange}
              >
                <MenuItem value="">همه</MenuItem>
                {contacts.map(contact => (
                  <MenuItem key={contact.id} value={contact.id}>
                    {contact.companyName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="date"
              label="از تاریخ"
              name="startDate"
              value={localFilters.startDate}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="date"
              label="تا تاریخ"
              name="endDate"
              value={localFilters.endDate}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleReset} color="inherit">
          حذف فیلترها
        </Button>
        <Button onClick={onClose}>انصراف</Button>
        <Button onClick={handleApply} variant="contained" color="primary">
          اعمال فیلتر
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentFilterDialog; 