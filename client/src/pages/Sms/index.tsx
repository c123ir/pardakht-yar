import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Tab,
  Tabs,
} from '@mui/material';
import { SmsSettingsTabs } from './types';
import SEO from '../../components/common/SEO';
import SmsSettings from './components/SmsSettings';
import SmsLogs from './components/SmsLogs';
import SmsTemplates from './components/SmsTemplates';
import SmsContactGroups from './components/SmsContactGroups';
import SmsSchedules from './components/SmsSchedules';
import SmsDashboard from './components/SmsDashboard';

/**
 * صفحه اصلی مدیریت پیامک
 */
const SmsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SmsSettingsTabs>(SmsSettingsTabs.DASHBOARD);

  // تابع تغییر تب
  const handleTabChange = (_: React.SyntheticEvent, newValue: SmsSettingsTabs) => {
    setActiveTab(newValue);
  };

  return (
    <>
      <SEO title="تنظیمات پیامک" />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper sx={{ p: 0 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="تب‌های تنظیمات پیامک"
            >
              <Tab label="داشبورد" value={SmsSettingsTabs.DASHBOARD} />
              <Tab label="تنظیمات" value={SmsSettingsTabs.SETTINGS} />
              <Tab label="گزارش‌ها" value={SmsSettingsTabs.LOGS} />
              <Tab label="قالب‌ها" value={SmsSettingsTabs.TEMPLATES} />
              <Tab label="گروه‌های مخاطبین" value={SmsSettingsTabs.CONTACT_GROUPS} />
              <Tab label="زمان‌بندی‌ها" value={SmsSettingsTabs.SCHEDULES} />
            </Tabs>
          </Box>
          
          <Box sx={{ p: 3 }}>
            {activeTab === SmsSettingsTabs.DASHBOARD && <SmsDashboard />}
            {activeTab === SmsSettingsTabs.SETTINGS && <SmsSettings />}
            {activeTab === SmsSettingsTabs.LOGS && <SmsLogs />}
            {activeTab === SmsSettingsTabs.TEMPLATES && <SmsTemplates />}
            {activeTab === SmsSettingsTabs.CONTACT_GROUPS && <SmsContactGroups />}
            {activeTab === SmsSettingsTabs.SCHEDULES && <SmsSchedules />}
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default SmsPage; 