import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  Typography,
  Paper,
  Button,
  ButtonGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import SendIcon from '@mui/icons-material/Send';
import SettingsIcon from '@mui/icons-material/Settings';
import { formatNumber } from '../utils';
import { useSmsStats } from '../hooks/useSmsStats';

/**
 * کامپوننت داشبورد پیامک
 */
const SmsDashboard: React.FC = () => {
  const { stats, loading, chartView, toggleChartView, refreshStats } = useSmsStats();

  // فرمت‌کننده تاریخ برای نمودار
  const formatChartDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (chartView === 'daily') {
        return `${date.getDate()}/${date.getMonth() + 1}`;
      } else {
        const monthNames = [
          'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
          'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
        ];
        return monthNames[date.getMonth()];
      }
    } catch (e) {
      return 'نامعتبر';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" component="h2">
          داشبورد پیامک
        </Typography>
        
        <Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={refreshStats}
            disabled={loading}
            sx={{ ml: 1 }}
          >
            بروزرسانی
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={1} sx={{ p: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  مجموع پیامک‌های ارسالی
                </Typography>
                <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                  {formatNumber(stats.totalSent)}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={1} sx={{ p: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  نرخ تحویل
                </Typography>
                <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                  {stats.deliveryRatePercent}%
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={1} sx={{ p: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  هزینه ماه جاری
                </Typography>
                <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                  {formatNumber(stats.costThisMonth)} ریال
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={1} sx={{ p: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  هزینه ماه قبل
                </Typography>
                <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                  {formatNumber(stats.costLastMonth)} ریال
                </Typography>
                <Typography variant="body2" color={stats.costThisMonth > stats.costLastMonth ? 'error.main' : 'success.main'}>
                  {stats.costThisMonth > stats.costLastMonth ? '↑' : '↓'} 
                  {Math.abs(((stats.costThisMonth - stats.costLastMonth) / stats.costLastMonth) * 100).toFixed(1)}%
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" component="h2">
                  آمار ارسال پیامک‌ها
                </Typography>
                
                <ButtonGroup size="small">
                  <Button 
                    variant={chartView === 'daily' ? 'contained' : 'outlined'} 
                    onClick={() => chartView !== 'daily' && toggleChartView()}
                  >
                    روزانه
                  </Button>
                  <Button 
                    variant={chartView === 'monthly' ? 'contained' : 'outlined'} 
                    onClick={() => chartView !== 'monthly' && toggleChartView()}
                  >
                    ماهانه
                  </Button>
                </ButtonGroup>
              </Box>

              <Box sx={{ height: 'auto', width: '100%' }}>
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>تاریخ</TableCell>
                        <TableCell>ارسال شده</TableCell>
                        <TableCell>تحویل شده</TableCell>
                        <TableCell>ناموفق</TableCell>
                        <TableCell>نرخ تحویل</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {stats.chartData[chartView].slice(0, 10).map((item, index) => {
                        const deliveryRate = item.sent > 0 ? (item.delivered / item.sent) * 100 : 0;
                        return (
                          <TableRow key={index}>
                            <TableCell>{formatChartDate(item.date)}</TableCell>
                            <TableCell>{formatNumber(item.sent)}</TableCell>
                            <TableCell>{formatNumber(item.delivered)}</TableCell>
                            <TableCell>{formatNumber(item.failed)}</TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box sx={{ width: '100%', mr: 1 }}>
                                  <LinearProgress 
                                    variant="determinate" 
                                    value={deliveryRate} 
                                    color={deliveryRate > 90 ? "success" : deliveryRate > 70 ? "info" : "warning"} 
                                    sx={{ height: 10, borderRadius: 5 }}
                                  />
                                </Box>
                                <Box sx={{ minWidth: 35 }}>
                                  <Typography variant="body2" color="text.secondary">
                                    {`${Math.round(deliveryRate)}%`}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                عملیات سریع
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<SendIcon />}
                    onClick={() => console.log('ارسال پیامک جدید')}
                  >
                    ارسال پیامک جدید
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<SettingsIcon />}
                    onClick={() => console.log('تنظیمات پیامک')}
                  >
                    تنظیمات پیامک
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SmsDashboard; 