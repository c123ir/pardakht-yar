// client/src/index.tsx
// نقطه ورود برنامه فرانت‌اند

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/global.css';
import './styles/rtl.css';  // افزودن استایل RTL
import './utils/i18n';

// تنظیم جهت RTL برای کل صفحه
document.dir = 'rtl';
document.documentElement.setAttribute('dir', 'rtl');
document.body.setAttribute('dir', 'rtl');

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);