// client/src/pages/PaymentsPage.tsx
// صفحه مدیریت پرداخت‌ها

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Typography,
  Chip,
  Tooltip,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
  Send as SendIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { formatDateTime, formatNumber } from '../utils/numberUtils';
import { PaymentStatus } from '../types/payment';
import { usePayments } from '../hooks/usePayments';
import PaymentStatusChip from '../components/payments/PaymentStatusChip';
import PaymentFilterDialog from '../components/payments/PaymentFilterDialog';
import DeleteConfirmDialog from '../components/common/DeleteConfirmDialog';

const PaymentsPage: React.FC = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState<number | null>(null);
  const [filters, setFilters] = useState({
    status: '',
    startDate: '',
    endDate: '',
    groupId: '',
    contactId: '',
  });

  const {
    payments,
    totalItems,
    loading,
    error,
    fetchPayments,
    deletePayment,
    sendNotification,
  } = usePayments();

  useEffect(() => {
    fetchPayments({
      page: page + 1,
      limit: rowsPerPage,
      search: searchTerm,
      ...filters,
    });
  }, [page, rowsPerPage, searchTerm, filters]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setPage(0);
    setFilterOpen(false);
  };

  const handleDeleteClick = (paymentId: number) => {
    setSelectedPaymentId(paymentId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedPaymentId) {
      try {
        await deletePayment(selectedPaymentId);
        enqueueSnackbar('درخواست پرداخت با موفقیت حذف شد', { variant: 'success' });
        fetchPayments({
          page: page + 1,
          limit: rowsPerPage,
          search: searchTerm,
          ...filters,
        });
      } catch (error) {
        enqueueSnackbar('خطا در حذف درخواست پرداخت', { variant: 'error' });
      }
    }
    setDeleteDialogOpen(false);
  };

  const handleSendNotification = async (paymentId: number) => {
    try {
      await sendNotification(paymentId);
      enqueueSnackbar('پیامک با موفقیت ارسال شد', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('خطا در ارسال پیامک', { variant: 'error' });
    }
  };

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">
          خطا در دریافت لیست پرداخت‌ها: {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Card>
        <CardContent>
          <Grid container spacing={2} alignItems="center" marginBottom={2}>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="h5" component="h1">
                مدیریت پرداخت‌ها
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={8}>
              <Box display="flex" gap={1} justifyContent="flex-end">
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/payments/new')}
                >
                  پرداخت جدید
                </Button>
              </Box>
            </Grid>
          </Grid>

          <Grid container spacing={2} alignItems="center" marginBottom={2}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="جستجو..."
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: <SearchIcon color="action" />,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={8}>
              <Box display="flex" gap={1} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  startIcon={<FilterIcon />}
                  onClick={() => setFilterOpen(true)}
                >
                  فیلتر
                </Button>
              </Box>
            </Grid>
          </Grid>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>عنوان</TableCell>
                  <TableCell>مبلغ (ریال)</TableCell>
                  <TableCell>ذینفع</TableCell>
                  <TableCell>تاریخ</TableCell>
                  <TableCell>وضعیت</TableCell>
                  <TableCell>عملیات</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{payment.title}</TableCell>
                    <TableCell>{formatNumber(payment.amount)}</TableCell>
                    <TableCell>
                      {payment.beneficiaryName || payment.contact?.companyName}
                    </TableCell>
                    <TableCell>{formatDateTime(payment.effectiveDate)}</TableCell>
                    <TableCell>
                      <PaymentStatusChip status={payment.status} />
                    </TableCell>
                    <TableCell>
                      <Box display="flex" gap={1}>
                        <Tooltip title="ویرایش">
                          <IconButton
                            size="small"
                            onClick={() => navigate(`/payments/${payment.id}/edit`)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        {payment.status === 'PAID' && (
                          <Tooltip title="ارسال پیامک">
                            <IconButton
                              size="small"
                              onClick={() => handleSendNotification(payment.id)}
                            >
                              <SendIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="تصاویر">
                          <IconButton
                            size="small"
                            onClick={() => navigate(`/payments/${payment.id}/images`)}
                          >
                            <ImageIcon />
                          </IconButton>
                        </Tooltip>
                        {payment.status === 'PENDING' && (
                          <Tooltip title="حذف">
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteClick(payment.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={totalItems}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="تعداد در صفحه"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} از ${count}`
            }
          />
        </CardContent>
      </Card>

      <PaymentFilterDialog
        open={filterOpen}
        filters={filters}
        onClose={() => setFilterOpen(false)}
        onApply={handleFilterChange}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="حذف درخواست پرداخت"
        content="آیا از حذف این درخواست پرداخت اطمینان دارید؟"
      />
    </Box>
  );
};

export default PaymentsPage;