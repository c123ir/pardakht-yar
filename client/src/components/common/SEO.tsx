// client/src/components/common/SEO.tsx
// کامپوننت SEO برای مدیریت عنوان و متاتگ‌های صفحات

import React from 'react';

/**
 * رابط برای پراپس‌های کامپوننت SEO
 */
interface SEOProps {
  /**
   * عنوان صفحه
   */
  title?: string;
  
  /**
   * توضیحات متا صفحه
   */
  description?: string;
  
  /**
   * کلیدواژه‌های متا صفحه
   */
  keywords?: string;
}

/**
 * کامپوننت مدیریت متاتگ‌های صفحه
 */
const SEO: React.FC<SEOProps> = ({ title, description, keywords }) => {
  const fullTitle = title ? `${title} | پرداخت‌یار` : 'پرداخت‌یار';
  
  return (
    <div className="seo-wrapper" style={{ display: 'none' }}>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
    </div>
  );
};

export default SEO; 