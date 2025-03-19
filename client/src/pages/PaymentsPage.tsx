// client/src/pages/PaymentsPage.tsx
// صفحه اصلی مدیریت پرداخت‌ها

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Tooltip,
  CircularProgress,
  Alert,
  Stack,
  Badge,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
  Send as SendIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  AttachMoney as MoneyIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import { usePayments } from '../hooks/usePayments';
import { useToast } from '../contexts/ToastContext';
import PaymentStatusChip from '../components/payments/PaymentStatusChip';
import PaymentFilterDialog from '../components/payments/PaymentFilterDialog';
import DeleteConfirmDialog from '../components/common/DeleteConfirmDialog';
import { formatDate } from '../utils/dateUtils';
import { PaymentStatus, PaymentFilter } from '../types/payment.types';
/**
 * صفحه نمایش و مدیریت پرداخت‌ها با قابلیت فیلتر، جستجو و عملیات مدیریتی
 */
const PaymentsPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  // هوک مدیریت پرداخت‌ها
  const {
    payments,
    loading,
    error,
    totalItems,
    fetchPayments,
    deletePayment,
    sendPaymentNotification,
  } = usePayments();

  // استیت‌های مدیریت نمایش
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  
  // استیت‌های مدیریت فیلتر
  const [filterDialogOpen, setFilterDialogOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState<{
    status: string;
    startDate: string;
    endDate: string;
    groupId: string;
    contactId: string;
  }>({
    status: '',
    startDate: '',
    endDate: '',
    groupId: '',
    contactId: '',
  });
  
  // استیت‌های مدیریت دیالوگ‌ها
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);
  
  // استیت‌های مدیریت ارسال پیامک
  const [sendingSms, setSendingSms] = useState<boolean>(false);
  const [sendingSmsId, setSendingSmsId] = useState<number | null>(null);
  // بارگذاری اولیه داده‌ها
  useEffect(() => {
    loadPayments();
  }, [page, rowsPerPage, filters]);

  // بارگذاری مجدد با تأخیر برای جستجو
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    const timeoutId = setTimeout(() => {
      setPage(0); // بازگشت به صفحه اول هنگام جستجو
      loadPayments();
    }, 500);
    
    setSearchTimeout(timeoutId);
    
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTerm]);

  // تابع بارگذاری پرداخت‌ها
  const loadPayments = async () => {
    try {
      // ساخت پارامترهای فیلتر برای API
      const apiFilter: PaymentFilter = {
        page: page + 1, // API از شماره 1 شروع می‌کند
        limit: rowsPerPage,
        search: searchTerm,
        ...(filters.status && { status: filters.status as PaymentStatus }),
        ...(filters.groupId && { groupId: filters.groupId }),
        ...(filters.contactId && { contactId: filters.contactId }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
      };
      
      try {
        await fetchPayments(apiFilter);
      } catch (err: any) {
        // در صورت خطا، داده‌های خالی را نمایش می‌دهیم
        console.error("خطا در بارگیری پرداخت‌ها:", err);
        showToast('خطا در ارتباط با سرور. ممکن است سرور در دسترس نباشد.', 'error');
      }
    } catch (err: any) {
      console.error("خطا در آماده‌سازی فیلترها:", err);
      showToast('خطا در پردازش فیلترها', 'error');
    }
  };

  // بارگذاری مجدد دستی
  const handleRefresh = () => {
    loadPayments();
  };
  // تغییر صفحه جدول
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  // تغییر تعداد ردیف‌های هر صفحه
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // بازگشت به صفحه اول
  };

  // جستجو در پرداخت‌ها
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // باز کردن دیالوگ فیلتر
  const handleOpenFilterDialog = () => {
    setFilterDialogOpen(true);
  };

  // اعمال فیلترها
  const handleApplyFilters = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setFilterDialogOpen(false);
    setPage(0); // بازگشت به صفحه اول
  };

  // شمارش تعداد فیلترهای فعال
  const countActiveFilters = (): number => {
    return Object.values(filters).filter(Boolean).length;
  };

  // بررسی وجود فیلتر فعال
  const hasActiveFilters = (): boolean => {
    return countActiveFilters() > 0;
  };
  // باز کردن دیالوگ تأیید حذف
  const handleDeleteClick = (paymentId: number) => {
    setSelectedPaymentId(paymentId);
    setDeleteDialogOpen(true);
  };

  // حذف پرداخت
  const handleConfirmDelete = async () => {
    if (!selectedPaymentId) return;
    
    try {
      setDeleting(true);
      await deletePayment(selectedPaymentId);
      showToast('درخواست پرداخت با موفقیت حذف شد', 'success');
      loadPayments(); // بارگذاری مجدد لیست
    } catch (err: any) {
      showToast(err.message || 'خطا در حذف درخواست پرداخت', 'error');
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
      setSelectedPaymentId(null);
    }
  };

  // ارسال پیامک
  const handleSendSms = async (paymentId: number) => {
    try {
      setSendingSms(true);
      setSendingSmsId(paymentId);
      
      const result = await sendPaymentNotification(paymentId);
      
      if (result.success) {
        showToast('پیامک با موفقیت ارسال شد', 'success');
        loadPayments(); // به‌روزرسانی لیست برای نمایش وضعیت جدید ارسال پیامک
      } else {
        showToast(result.message || 'خطا در ارسال پیامک', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'خطا در ارسال پیامک', 'error');
    } finally {
      setSendingSms(false);
      setSendingSmsId(null);
    }
  };

  // رندر صفحه
  return (
    <Box p={3}>
      {/* هدر صفحه */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <Typography variant="h5" display="flex" alignItems="center" gap={1}>
              <MoneyIcon color="primary" />
              مدیریت درخواست‌های پرداخت
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box display="flex" justifyContent={{ xs: 'flex-start', sm: 'flex-end' }} gap={1}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => navigate('/payments/new')}
              >
                افزودن پرداخت جدید
              </Button>
              <Tooltip title="بارگذاری مجدد">
                <IconButton onClick={handleRefresh} disabled={loading}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* باکس جستجو و فیلتر */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="جستجو در پرداخت‌ها..."
              value={searchTerm}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box display="flex" justifyContent={{ xs: 'flex-start', sm: 'flex-end' }}>
              <Button
                variant="outlined"
                startIcon={
                  hasActiveFilters() ? (
                    <Badge badgeContent={countActiveFilters()} color="primary">
                      <FilterIcon />
                    </Badge>
                  ) : (
                    <FilterIcon />
                  )
                }
                onClick={handleOpenFilterDialog}
                color={hasActiveFilters() ? 'primary' : 'inherit'}
              >
                فیلتر
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* نمایش خطا */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      {/* جدول پرداخت‌ها */}
      <Card>
        <CardContent sx={{ p: { xs: 1, sm: 2 } }}>
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell>عنوان</TableCell>
                  <TableCell align="center">مبلغ (ریال)</TableCell>
                  <TableCell>ذینفع</TableCell>
                  <TableCell>تاریخ</TableCell>
                  <TableCell align="center">وضعیت</TableCell>
                  <TableCell align="center">عملیات</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading && Array.from(new Array(rowsPerPage)).map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    <TableCell colSpan={6} align="center">
                      <CircularProgress size={24} />
                    </TableCell>
                  </TableRow>
                ))}
                
                {!loading && payments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Box py={3}>
                        <AssignmentIcon color="disabled" sx={{ fontSize: 40, mb: 1 }} />
                        <Typography color="text.secondary">
                          {searchTerm || hasActiveFilters()
                            ? 'نتیجه‌ای برای جستجوی شما یافت نشد'
                            : 'هنوز درخواست پرداختی ثبت نشده است'}
                        </Typography>
                        
                        {(searchTerm || hasActiveFilters()) ? (
                          <Button 
                            variant="text" 
                            onClick={() => {
                              setSearchTerm('');
                              setFilters({
                                status: '',
                                startDate: '',
                                endDate: '',
                                groupId: '',
                                contactId: '',
                              });
                            }}
                            sx={{ mt: 1 }}
                          >
                            پاک کردن فیلترها
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => navigate('/payments/new')}
                            startIcon={<AddIcon />}
                            sx={{ mt: 1 }}
                          >
                            ایجاد اولین درخواست
                          </Button>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                )}

                {!loading && payments.map((payment) => (
                  <TableRow
                    key={payment.id}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                    }}
                  >
                    <TableCell component="th" scope="row">
                      {payment.title}
                    </TableCell>
                    <TableCell align="center">
                      {payment.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {payment.beneficiaryName || 
                       payment.contact?.companyName || 
                       '-'}
                    </TableCell>
                    <TableCell>
                      {formatDate(payment.effectiveDate)}
                    </TableCell>
                    <TableCell align="center">
                      <PaymentStatusChip status={payment.status} />
                      {payment.isSMSSent && (
                        <Chip
                          size="small"
                          label="پیامک ارسال شده"
                          color="info"
                          variant="outlined"
                          sx={{ ml: 0.5, fontSize: '0.7rem' }}
                        />
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Tooltip title="ویرایش">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => navigate(`/payments/${payment.id}/edit`)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="مدیریت تصاویر">
                          <IconButton
                            size="small"
                            color="secondary"
                            onClick={() => navigate(`/payments/${payment.id}/images`)}
                          >
                            <ImageIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        {payment.status === 'PAID' && 
                         (payment.beneficiaryPhone || payment.contact?.accountantPhone) && (
                          <Tooltip title="ارسال پیامک">
                            <IconButton
                              size="small"
                              color="info"
                              onClick={() => handleSendSms(payment.id)}
                              disabled={sendingSms && sendingSmsId === payment.id}
                            >
                              {sendingSms && sendingSmsId === payment.id ? (
                                <CircularProgress size={20} />
                              ) : (
                                <SendIcon fontSize="small" />
                              )}
                            </IconButton>
                          </Tooltip>
                        )}

                        {payment.status === 'PENDING' && (
                          <Tooltip title="حذف">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteClick(payment.id)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          {/* پیجینیشن */}
          <TablePagination
            component="div"
            count={totalItems}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="تعداد در هر صفحه:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} از ${count !== -1 ? count : `بیش از ${to}`}`
            }
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </CardContent>
      </Card>
      {/* دیالوگ فیلتر */}
      <PaymentFilterDialog
        open={filterDialogOpen}
        initialValues={filters}
        onClose={() => setFilterDialogOpen(false)}
        onApply={handleApplyFilters}
      />

      {/* دیالوگ تأیید حذف */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="حذف درخواست پرداخت"
        content="آیا از حذف این درخواست پرداخت اطمینان دارید؟ این عمل غیرقابل بازگشت است."
        loading={deleting}
      />
    </Box>
  );
};

export default PaymentsPage;