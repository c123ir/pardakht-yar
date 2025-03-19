import localFont from 'next/font/local';

export const vazirmatn = localFont({
  src: [
    {
      path: './Vazirmatn-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './Vazirmatn-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: './Vazirmatn-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-vazirmatn',
  display: 'swap',
}); 