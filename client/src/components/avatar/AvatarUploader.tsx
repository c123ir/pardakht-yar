// client/src/components/avatar/AvatarUploader.tsx
// کامپوننت آپلودر آواتار حرفه‌ای با قابلیت کراپ تصویر

import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Slider,
  IconButton,
  CircularProgress,
  LinearProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import Cropper from 'react-easy-crop';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useImages } from '../../contexts/ImageContext';
import FallbackAvatar from '../common/FallbackAvatar';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';

// تعریف مستقیم تایپ‌ها به جای import از ماژول react-easy-crop/types
interface Point {
  x: number;
  y: number;
}

interface Area {
  x: number;
  y: number;
  width: number;
  height: number;
}

// تابع کمکی برای تبدیل تصویر کراپ شده به فایل
const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: Area,
  rotation = 0
): Promise<Blob> => {
  const image = new Image();
  image.src = imageSrc;
  
  // چک کردن اینکه تصویر لود شده باشد
  const loadImage = (img: HTMLImageElement): Promise<HTMLImageElement> => {
    return new Promise((resolve) => {
      if (img.complete) {
        resolve(img);
      } else {
        img.onload = () => resolve(img);
      }
    });
  };
  
  const loadedImage = await loadImage(image);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Cannot get 2d context from canvas');
  }
  
  // تنظیم اندازه کنواس براساس ناحیه کراپ شده
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  
  // اعمال چرخش اگر نیاز باشد
  if (rotation > 0) {
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);
  }
  
  // رسم تصویر کراپ شده روی کنواس
  ctx.drawImage(
    loadedImage,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );
  
  // تبدیل کنواس به Blob
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        throw new Error('Canvas is empty');
      }
      resolve(blob);
    }, 'image/jpeg', 0.95);
  });
};

interface AvatarUploaderProps {
  currentAvatar?: string;
  onAvatarChange: (avatarPath: string) => void;
  size?: number;
  userId?: string;
  user?: {
    fullName?: string;
  };
}

const AvatarUploader: React.FC<AvatarUploaderProps> = ({
  currentAvatar,
  onAvatarChange,
  size = 100,
  userId,
  user,
}) => {
  const { isUploading, uploadProgress, uploadAvatar, getImageUrl } = useImages();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [openCropDialog, setOpenCropDialog] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentAvatar || null);
  const [hasImageError, setHasImageError] = useState(false);
  const { t } = useTranslation();
  const { user: authUser, updateUserDetails } = useAuth();
  
  // انتخاب تصویر
  const onSelectFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // بررسی سایز فایل (حداکثر 5 مگابایت)
      if (file.size > 5 * 1024 * 1024) {
        setError('حجم فایل نباید بیشتر از 5 مگابایت باشد');
        return;
      }
      
      // بررسی نوع فایل
      if (!file.type.includes('image')) {
        setError('فقط فایل‌های تصویری مجاز هستند');
        return;
      }
      
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        const dataUrl = reader.result?.toString() || '';
        setPreviewUrl(dataUrl);
        setOpenCropDialog(true);
      });
      reader.readAsDataURL(file);
    }
  }, []);
  
  // تغییر محل کراپ
  const onCropChange = useCallback((newCrop: Point) => {
    setCrop(newCrop);
  }, []);
  
  // تغییر میزان بزرگنمایی
  const onZoomChange = useCallback((newZoom: number) => {
    setZoom(newZoom);
  }, []);
  
  // تغییر میزان چرخش
  const onRotationChange = useCallback((newRotation: number) => {
    setRotation(newRotation);
  }, []);
  
  // تکمیل کراپ
  const onCropComplete = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );
  
  // بستن دیالوگ کراپ
  const handleCloseDialog = () => {
    setOpenCropDialog(false);
    setImageSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };
  
  // ذخیره تصویر کراپ شده
  const handleSaveCroppedImage = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    
    try {
      setProcessing(true);
      
      // استخراج تصویر کراپ شده
      const croppedImageBlob = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation
      );
      
      // تبدیل Blob به File
      const croppedImageFile = new File(
        [croppedImageBlob], 
        'avatar.jpg', 
        { type: 'image/jpeg' }
      );
      
      // آپلود تصویر با استفاده از کانتکست
      const result = await uploadAvatar(croppedImageFile, userId);
      console.log('آپلود موفق آمیز آواتار:', result);
      
      // اگر کاربر فعلی در حال ویرایش آواتار خودش است، هدر را هم به‌روزرسانی کنیم
      if (authUser && userId && authUser.id && authUser.id.toString() === userId) {
        updateUserDetails({
          ...authUser,
          avatar: result.path,
          _avatarUpdated: Date.now()
        });
      }
      
      // فراخوانی تابع callback
      onAvatarChange(result.path);
      
      // رفرش تصویر برای نمایش آواتار جدید
      setRefreshKey(prev => prev + 1);
      
      // بستن دیالوگ
      handleCloseDialog();
    } catch (error) {
      console.error('خطا در کراپ/آپلود تصویر:', error);
      alert('خطا در پردازش تصویر. لطفاً دوباره تلاش کنید.');
    } finally {
      setProcessing(false);
    }
  };
  
  // تابع رفرش تصویر
  const handleRefreshImage = () => {
    setRefreshKey(prev => prev + 1);
  };

  // مدیریت خطای بارگذاری تصویر
  const handleImageError = () => {
    console.log('Avatar loading error in AvatarUploader');
    setHasImageError(true);
    
    // آواتار پیش‌فرض محلی را بارگذاری می‌کنیم
    const img = new Image();
    img.onload = () => {
      setPreviewUrl('/avatar.jpg');
    };
    img.onerror = () => {
      // اگر آواتار پیش‌فرض هم خطا داشت، از FallbackAvatar استفاده می‌کنیم
      setPreviewUrl(null);
    };
    img.src = '/avatar.jpg';
  };
  
  // پیش‌نمایش آواتار
  const renderPreview = () => {
    // استایل‌های مشترک برای باکس نگهدارنده آواتار
    const boxStyle = {
      width: size,
      height: size,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      borderRadius: '50%',
      border: '2px solid rgba(0, 0, 0, 0.1)', // اضافه کردن حاشیه برای وضوح بیشتر
      margin: '0 auto', // مرکز قرار دادن آواتار
    };

    if (previewUrl) {
      return (
        <Box
          sx={boxStyle}
          className={clsx('avatar-preview', { 'has-error': hasImageError })}
        >
          <img
            src={`${previewUrl}?t=${refreshKey}`}
            alt={t('avatar')}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            onError={handleImageError}
          />
        </Box>
      );
    }

    if (currentAvatar && !hasImageError) {
      const imageSrc = `${getImageUrl(currentAvatar)}?t=${refreshKey}`;
      
      return (
        <Box
          sx={boxStyle}
          className={clsx('avatar-preview', { 'has-error': hasImageError })}
        >
          <img
            src={imageSrc}
            alt={t('avatar')}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            onError={handleImageError}
          />
        </Box>
      );
    }

    // استفاده از FallbackAvatar با اندازه مناسب
    return (
      <FallbackAvatar
        name={user?.fullName || ''}
        size={size}
        sx={{ 
          width: size, 
          height: size, 
          margin: '0 auto' 
        }}
      />
    );
  };
  
  useEffect(() => {
    // هر وقت currentAvatar تغییر کند، refreshKey را افزایش دهید
    if (currentAvatar) {
      setRefreshKey(prev => prev + 1);
      setPreviewUrl(getImageUrl(currentAvatar));
    } else {
      setPreviewUrl(null);
    }
  }, [currentAvatar, getImageUrl]);
  
  return (
    <Box sx={{ textAlign: 'center', position: 'relative' }}>
      {/* نمایش آواتار و دکمه آپلود */}
      <Box sx={{ position: 'relative', display: 'inline-block' }}>
        {renderPreview()}
        
        {/* دکمه رفرش برای بارگیری مجدد تصویر */}
        {currentAvatar && (
          <IconButton
            size="small"
            onClick={handleRefreshImage}
            sx={{
              position: 'absolute',
              top: -8,
              right: -8,
              backgroundColor: 'primary.light',
              color: 'white',
              '&:hover': {
                backgroundColor: 'primary.main',
              },
              width: 30,
              height: 30,
            }}
          >
            <RefreshIcon fontSize="small" />
          </IconButton>
        )}
        
        {/* آیکون آپلود */}
        <label htmlFor="avatar-upload">
          <input
            type="file"
            id="avatar-upload"
            accept="image/*"
            onChange={onSelectFile}
            ref={fileInputRef}
            style={{ display: 'none' }}
          />
          <IconButton
            component="span"
            sx={{
              position: 'absolute',
              bottom: -8,
              right: -8,
              backgroundColor: 'secondary.main',
              color: 'white',
              '&:hover': {
                backgroundColor: 'secondary.dark',
              },
              width: 24,
              height: 24,
              borderRadius: '50%',
            }}
          >
            <PhotoCameraIcon fontSize="small" />
          </IconButton>
        </label>
      </Box>

      {/* دیالوگ کراپ تصویر */}
      <Dialog
        open={openCropDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        PaperProps={{
          sx: {
            width: '90vw',
            maxWidth: 600,
            height: '80vh',
            maxHeight: 600,
          },
        }}
      >
        <DialogTitle>برش تصویر پروفایل</DialogTitle>
        <DialogContent
          dividers
          sx={{
            position: 'relative',
            height: 400,
            width: '100%',
            background: '#333',
          }}
        >
          {imageSrc && (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              onCropChange={onCropChange}
              onCropComplete={onCropComplete}
              onZoomChange={onZoomChange}
              onRotationChange={onRotationChange}
            />
          )}
        </DialogContent>
        
        <Box sx={{ px: 3, py: 2 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>بزرگنمایی</Typography>
          <Slider
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            aria-labelledby="zoom"
            onChange={(_e, value) => setZoom(value as number)}
          />
        </Box>
        
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            انصراف
          </Button>
          <Button
            onClick={handleSaveCroppedImage}
            variant="contained"
            color="primary"
            disabled={processing || isUploading}
            startIcon={
              (processing || isUploading) ? (
                <CircularProgress size={20} color="inherit" />
              ) : null
            }
          >
            {(processing || isUploading) ? 'در حال پردازش...' : 'ذخیره'}
          </Button>
        </DialogActions>
        
        {isUploading && (
          <Box sx={{ px: 3, pb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              در حال آپلود: {uploadProgress}%
            </Typography>
            <LinearProgress
              variant="determinate"
              value={uploadProgress}
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>
        )}
      </Dialog>

      {/* نمایش خطا */}
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AvatarUploader; 