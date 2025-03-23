import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { AdapterDateFnsJalali } from '@mui/x-date-pickers/AdapterDateFnsJalali';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { useSmsLogs } from '../hooks/useSmsLogs';
import { SmsStatus } from '../types';
import { formatDate } from '../utils';
import { useSnackbar } from 'notistack';

/**
 * کامپوننت نمایش لاگ‌های پیامک
 */
const SmsLogs: React.FC = () => {
  const {
    logs,
    totalItems,
    page,
    rowsPerPage,
    loading,
    searchTerm,
    dateRange,
    statusFilter,
    handleChangePage,
    handleChangeRowsPerPage,
    handleSearch,
    handleStatusFilterChange,
    handleDateRangeChange,
    refreshLogs,
  } = useSmsLogs();

  const { enqueueSnackbar } = useSnackbar();
  const [searchInput, setSearchInput] = useState(searchTerm);

  // کپی کردن متن پیامک
  const handleCopyMessage = (message: string) => {
    navigator.clipboard.writeText(message).then(
      () => {
        enqueueSnackbar('متن پیامک کپی شد', { variant: 'success' });
      },
      (err) => {
        console.error('خطا در کپی کردن متن:', err);
        enqueueSnackbar('خطا در کپی کردن متن', { variant: 'error' });
      }
    );
  };

  // نمایش رنگ وضعیت پیامک
  const getStatusColor = (status: SmsStatus) => {
    switch (status) {
      case SmsStatus.DELIVERED:
        return 'success';
      case SmsStatus.FAILED:
        return 'error';
      case SmsStatus.PENDING:
        return 'warning';
      default:
        return 'default';
    }
  };

  // نمایش متن وضعیت پیامک
  const getStatusText = (status: SmsStatus) => {
    switch (status) {
      case SmsStatus.DELIVERED:
        return 'تحویل شده';
      case SmsStatus.FAILED:
        return 'ناموفق';
      case SmsStatus.PENDING:
        return 'در انتظار';
      default:
        return 'نامشخص';
    }
  };

  // ارسال فرم جستجو
  const handleSubmitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchInput);
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" component="h2">
            تاریخچه پیامک‌ها
          </Typography>
          
          <Tooltip title="بازخوانی لاگ‌ها">
            <IconButton onClick={refreshLogs} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            فیلترها و جستجو
          </Typography>
          <Box component="form" onSubmit={handleSubmitSearch} sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <TextField
                label="جستجو (شماره موبایل یا متن پیامک)"
                variant="outlined"
                size="small"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                sx={{ flexGrow: 1, minWidth: '200px' }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton 
                        type="submit"
                        edge="end"
                      >
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              
              <FormControl size="small" sx={{ minWidth: '140px' }}>
                <InputLabel id="status-filter-label">وضعیت پیامک</InputLabel>
                <Select
                  labelId="status-filter-label"
                  value={statusFilter}
                  label="وضعیت پیامک"
                  onChange={(e) => handleStatusFilterChange(e.target.value as SmsStatus | '')}
                >
                  <MenuItem value="">همه</MenuItem>
                  <MenuItem value={SmsStatus.DELIVERED}>تحویل شده</MenuItem>
                  <MenuItem value={SmsStatus.FAILED}>ناموفق</MenuItem>
                  <MenuItem value={SmsStatus.PENDING}>در انتظار</MenuItem>
                </Select>
              </FormControl>
              
              <LocalizationProvider dateAdapter={AdapterDateFnsJalali}>
                <DatePicker 
                  label="از تاریخ"
                  value={dateRange[0]}
                  onChange={(date) => handleDateRangeChange([date, dateRange[1]])}
                  slotProps={{ textField: { size: 'small' } }}
                />
              </LocalizationProvider>
              
              <LocalizationProvider dateAdapter={AdapterDateFnsJalali}>
                <DatePicker 
                  label="تا تاریخ"
                  value={dateRange[1]}
                  onChange={(date) => handleDateRangeChange([dateRange[0], date])}
                  slotProps={{ textField: { size: 'small' } }}
                />
              </LocalizationProvider>
            </Box>
          </Box>
        </Paper>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>شماره گیرنده</TableCell>
                    <TableCell>متن پیامک</TableCell>
                    <TableCell>وضعیت</TableCell>
                    <TableCell>تاریخ ارسال</TableCell>
                    <TableCell>خط ارسال</TableCell>
                    <TableCell>هزینه (ریال)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {logs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        هیچ رکوردی یافت نشد
                      </TableCell>
                    </TableRow>
                  ) : (
                    logs.map((log) => (
                      <TableRow key={log.id} hover>
                        <TableCell>{log.receiver}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', maxWidth: '300px' }}>
                            <Typography variant="body2" noWrap>
                              {log.message}
                            </Typography>
                            <Tooltip title="کپی متن پیامک">
                              <IconButton 
                                size="small" 
                                onClick={() => handleCopyMessage(log.message)}
                                sx={{ ml: 1 }}
                              >
                                <ContentCopyIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={getStatusText(log.status)} 
                            color={getStatusColor(log.status) as any}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{formatDate(log.sentAt)}</TableCell>
                        <TableCell>{log.senderNumber}</TableCell>
                        <TableCell>{log.cost}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            
            <Divider sx={{ my: 2 }} />

            <TablePagination
              component="div"
              count={totalItems}
              rowsPerPage={rowsPerPage}
              page={page-1}
              onPageChange={(_, newPage) => handleChangePage(newPage + 1)}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="تعداد در صفحه:"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} از ${count}`}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SmsLogs; 