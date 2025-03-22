import React, { useState, useEffect } from 'react';
import { Avatar, SxProps, Theme } from '@mui/material';
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

  // تنظیم مجدد خطا هرگاه آواتار تغییر می‌کند
  useEffect(() => {
    setHasError(false);
    setImgKey(Date.now());
  }, [avatar]);

  // هر بار که کامپوننت نمایش داده می‌شود، اگر forceRefresh فعال باشد کلید تصویر را تغییر می‌دهیم
  useEffect(() => {
    if (forceRefresh) {
      setImgKey(Date.now());
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
  };

  // بارگذاری مجدد تصویر
  const reloadImage = () => {
    setHasError(false);
    setImgKey(Date.now());
  };

  // اگر خطا داریم و showFallback فعال است، آواتار پیش‌فرض را نمایش دهیم
  if ((hasError || !avatar) && showFallback) {
    return <FallbackAvatar name={name} size={size} sx={sx} />;
  }

  // تبدیل مسیر نسبی به URL کامل با اضافه کردن پارامترهای قوی‌تر برای جلوگیری از کش
  const imageUrl = avatar 
    ? getImageUrl(avatar) + `?t=${imgKey}&r=${Math.random()}&nocache=true` 
    : '';

  // مشخص کردن رفتار در صورت خطا - استفاده از آدرس نسبی (بدون URL کامل)
  const fallbackPath = '/avatar.jpg';

  return (
    <Avatar
      key={imgKey}
      src={hasError ? fallbackPath : imageUrl}
      alt={name || 'کاربر'}
      sx={{
        width: size,
        height: size,
        ...sx
      }}
      onError={handleError}
      onClick={hasError ? reloadImage : undefined}
    />
  );
};

export default UserAvatar; 