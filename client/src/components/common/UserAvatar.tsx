import React, { useState, useEffect, useMemo } from 'react';
import { Avatar, SxProps, Theme, Box, CircularProgress } from '@mui/material';
import { useImages } from '../../contexts/ImageContext';
import FallbackAvatar from './FallbackAvatar';

interface UserAvatarProps {
  avatar?: string | null;
  name?: string;
  size?: number;
  sx?: SxProps<Theme>;
  showFallback?: boolean;
  forceRefresh?: boolean;
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  avatar,
  name = '',
  size = 40,
  sx = {},
  showFallback = true,
  forceRefresh = false
}) => {
  const { getImageUrl } = useImages();
  const [hasError, setHasError] = useState(false);
  const [imgKey, setImgKey] = useState(Date.now()); // برای تجدید لود تصویر
  const [isLoading, setIsLoading] = useState(true);

  // تنظیم مجدد خطا هرگاه آواتار تغییر می‌کند
  useEffect(() => {
    setHasError(false);
    setImgKey(Date.now());
    setIsLoading(true);
  }, [avatar]);

  // هر بار که کامپوننت نمایش داده می‌شود، اگر forceRefresh فعال باشد کلید تصویر را تغییر می‌دهیم
  useEffect(() => {
    if (forceRefresh) {
      setImgKey(Date.now());
      setIsLoading(true);
    }
  }, [forceRefresh]);

  // زمانی که کامپوننت مانت می‌شود، imgKey را تنظیم می‌کنیم
  useEffect(() => {
    setImgKey(Date.now());
  }, []);

  // مدیریت خطای بارگذاری
  const handleError = () => {
    console.log('خطا در بارگذاری آواتار:', avatar);
    setHasError(true);
    setIsLoading(false);
  };

  // بارگذاری موفق تصویر
  const handleLoad = () => {
    setIsLoading(false);
  };

  // بارگذاری مجدد تصویر
  const reloadImage = () => {
    setHasError(false);
    setImgKey(Date.now());
    setIsLoading(true);
  };

  // تبدیل مسیر نسبی به URL کامل با اضافه کردن پارامترهای قوی‌تر برای جلوگیری از کش
  // استفاده از useMemo برای جلوگیری از بازسازی مجدد URL در هر رندر
  const imageUrl = useMemo(() => {
    if (!avatar) return '';
    
    // ایجاد پارامترهای قوی برای جلوگیری از کش در مرورگر
    const cacheParams = `t=${imgKey}&r=${Math.random()}&nocache=true&v=1.2`;
    return getImageUrl(avatar) + `?${cacheParams}`;
  }, [avatar, getImageUrl, imgKey]);

  // مشخص کردن رفتار در صورت خطا - استفاده از آدرس نسبی (بدون URL کامل)
  const fallbackPath = '/avatar.jpg';

  // اگر خطا داریم و showFallback فعال است، آواتار پیش‌فرض را نمایش دهیم
  if ((hasError || !avatar) && showFallback) {
    return <FallbackAvatar name={name} size={size} sx={sx} />;
  }

  return (
    <Box 
      sx={{ 
        position: 'relative',
        width: size,
        height: size,
        display: 'inline-block',
      }}
    >
      {isLoading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
          }}
        >
          <CircularProgress size={size * 0.6} />
        </Box>
      )}
      
      <Avatar
        key={imgKey}
        src={hasError ? fallbackPath : imageUrl}
        alt={name || 'کاربر'}
        sx={{
          width: size,
          height: size,
          opacity: isLoading ? 0.3 : 1,
          transition: 'opacity 0.3s ease',
          ...sx
        }}
        onError={handleError}
        onLoad={handleLoad}
        onClick={hasError ? reloadImage : undefined}
      />
    </Box>
  );
};

export default UserAvatar; 