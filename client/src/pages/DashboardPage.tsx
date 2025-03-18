// client/src/pages/DashboardPage.tsx
// صفحه داشبورد

import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';

const DashboardPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        داشبورد
      </Typography>
      
      <Grid container spacing={3}>
        {/* کارت خلاصه پرداخت‌ها */}
        <Grid item xs={12} md={6} lg={3}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
            }}
          >
            <Typography color="text.secondary" variant="subtitle2">
              کل پرداخت‌ها
            </Typography>
            <Typography component="p" variant="h4" sx={{ my: 2 }}>
              ۱۲۳,۴۵۶,۷۸۹ ریال
            </Typography>
            <Typography color="text.secondary" variant="body2">
              از ابتدای ماه جاری
            </Typography>
          </Paper>
        </Grid>
        
        {/* کارت درخواست‌های در انتظار */}
        <Grid item xs={12} md={6} lg={3}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
            }}
          >
            <Typography color="text.secondary" variant="subtitle2">
              درخواست‌های در انتظار
            </Typography>
            <Typography component="p" variant="h4" sx={{ my: 2 }}>
              ۵ مورد
            </Typography>
            <Typography color="text.secondary" variant="body2">
              نیازمند تأیید
            </Typography>
          </Paper>
        </Grid>
        
        {/* کارت پرداخت‌های امروز */}
        <Grid item xs={12} md={6} lg={3}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
            }}
          >
            <Typography color="text.secondary" variant="subtitle2">
              پرداخت‌های امروز
            </Typography>
            <Typography component="p" variant="h4" sx={{ my: 2 }}>
              ۳ مورد
            </Typography>
            <Typography color="text.secondary" variant="body2">
              ۱۲,۴۵۶,۰۰۰ ریال
            </Typography>
          </Paper>
        </Grid>
        
        {/* کارت طرف‌حساب‌ها */}
        <Grid item xs={12} md={6} lg={3}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
            }}
          >
            <Typography color="text.secondary" variant="subtitle2">
              تعداد طرف‌حساب‌ها
            </Typography>
            <Typography component="p" variant="h4" sx={{ my: 2 }}>
              ۴۵ طرف‌حساب
            </Typography>
            <Typography color="text.secondary" variant="body2">
              ۱۲ مورد فعال در ماه جاری
            </Typography>
          </Paper>
        </Grid>
        
        {/* جدول آخرین پرداخت‌ها */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom component="div">
              آخرین پرداخت‌ها
            </Typography>
            <Typography variant="body1" color="text.secondary">
              اطلاعات پرداخت‌ها در اینجا نمایش داده می‌شود...
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;