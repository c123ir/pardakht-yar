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
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { usePayments } from '../hooks/usePayments';
import { useGroups } from '../hooks/useGroups';
import { useContacts } from '../hooks/useContacts';
import { convertPersianToEnglishNumbers } from '../utils/stringUtils';

const PaymentFormPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { getPayment, createPayment, updatePayment } = usePayments();
  const { groups } = useGroups();
  const { contacts } = useContacts();

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

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadPayment = async () => {
      if (id) {
        try {
          const payment = await getPayment(parseInt(id));
          setFormData({
            title: payment.title,
            amount: payment.amount.toString(),
            effectiveDate: payment.effectiveDate.split('T')[0],
            description: payment.description || '',
            groupId: payment.groupId?.toString() || '',
            contactId: payment.contactId?.toString() || '',
            beneficiaryName: payment.beneficiaryName || '',
            beneficiaryPhone: payment.beneficiaryPhone || '',
          });
        } catch (error) {
          enqueueSnackbar('خطا در دریافت اطلاعات پرداخت', { variant: 'error' });
          navigate('/payments');
        }
      }
    };

    loadPayment();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    
    if (name === 'amount' || name === 'beneficiaryPhone') {
      const numericValue = convertPersianToEnglishNumbers(value as string);
      setFormData(prev => ({
        ...prev,
        [name]: numericValue.replace(/\D/g, ''),
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name as string]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const paymentData = {
        ...formData,
        amount: parseInt(formData.amount),
        groupId: formData.groupId ? parseInt(formData.groupId) : null,
        contactId: formData.contactId ? parseInt(formData.contactId) : null,
      };

      if (id) {
        await updatePayment(parseInt(id), paymentData);
        enqueueSnackbar('درخواست پرداخت با موفقیت به‌روزرسانی شد', { variant: 'success' });
      } else {
        await createPayment(paymentData);
        enqueueSnackbar('درخواست پرداخت با موفقیت ایجاد شد', { variant: 'success' });
      }

      navigate('/payments');
    } catch (error) {
      enqueueSnackbar('خطا در ثبت درخواست پرداخت', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={3}>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h1" gutterBottom>
            {id ? 'ویرایش درخواست پرداخت' : 'ایجاد درخواست پرداخت جدید'}
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="عنوان"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="مبلغ"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">ریال</InputAdornment>,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  type="date"
                  label="تاریخ"
                  name="effectiveDate"
                  value={formData.effectiveDate}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>گروه</InputLabel>
                  <Select
                    name="groupId"
                    value={formData.groupId}
                    onChange={handleChange}
                  >
                    <MenuItem value="">بدون گروه</MenuItem>
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
                    value={formData.contactId}
                    onChange={handleChange}
                  >
                    <MenuItem value="">انتخاب نشده</MenuItem>
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
                  label="نام ذینفع"
                  name="beneficiaryName"
                  value={formData.beneficiaryName}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="شماره تماس ذینفع"
                  name="beneficiaryPhone"
                  value={formData.beneficiaryPhone}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="توضیحات"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <Box display="flex" gap={1} justifyContent="flex-end">
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/payments')}
                  >
                    انصراف
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading}
                  >
                    {id ? 'به‌روزرسانی' : 'ثبت'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PaymentFormPage; 