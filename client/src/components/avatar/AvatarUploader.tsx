// client/src/components/avatar/AvatarUploader.tsx
// کامپوننت آپلودر آواتار حرفه‌ای با قابلیت کراپ تصویر

import React, { useState, useCallback } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Slider,
  Avatar,
  IconButton,
  CircularProgress,
  LinearProgress,
} from '@mui/material';
import Cropper from 'react-easy-crop';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import CropRotateIcon from '@mui/icons-material/CropRotate';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useImages } from '../../contexts/ImageContext';

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
}

const AvatarUploader: React.FC<AvatarUploaderProps> = ({
  currentAvatar,
  onAvatarChange,
  size = 100,
}) => {
  const { isUploading, uploadProgress, uploadAvatar, getImageUrl } = useImages();
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [openCropDialog, setOpenCropDialog] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  
  // انتخاب تصویر
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // بررسی سایز فایل (حداکثر 5 مگابایت)
      if (file.size > 5 * 1024 * 1024) {
        alert('حجم فایل نباید بیشتر از 5 مگابایت باشد');
        return;
      }
      
      // بررسی نوع فایل
      if (!file.type.startsWith('image/')) {
        alert('فقط فایل‌های تصویری مجاز هستند');
        return;
      }
      
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        if (typeof reader.result === 'string') {
          setImageSrc(reader.result);
          setOpenCropDialog(true);
        }
      });
      reader.readAsDataURL(file);
    }
  };
  
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
    setRotation(0);
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
      const uploadedPath = await uploadAvatar(croppedImageFile);
      
      // فراخوانی تابع callback
      onAvatarChange(uploadedPath);
      
      // رفرش تصویر برای نمایش آواتار جدید
      setRefreshKey(prev => prev + 1);
      
      // استفاده از setTimeout برای اطمینان از اعمال تغییرات قبل از بستن دیالوگ
      setTimeout(() => {
        handleCloseDialog();
      }, 500);
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
  
  // تبدیل مسیر نسبی به URL کامل با اضافه کردن پارامتر refresh برای جلوگیری از cache
  const avatarUrl = currentAvatar 
    ? `${getImageUrl(currentAvatar)}?refresh=${refreshKey}&t=${new Date().getTime()}`
    : '';
  
  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Box position="relative" width={size} height={size} mb={1}>
        <Avatar
          src={avatarUrl}
          alt="تصویر پروفایل"
          sx={{ 
            width: size, 
            height: size,
            bgcolor: 'primary.light',
            border: '1px solid',
            borderColor: 'divider'
          }}
        />
        <label htmlFor="avatar-upload">
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <IconButton
            aria-label="آپلود تصویر"
            component="span"
            size="small"
            color="primary"
            sx={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              bgcolor: 'background.paper',
              boxShadow: 1,
              '&:hover': {
                bgcolor: 'background.paper',
                opacity: 0.9,
              },
            }}
            disabled={isUploading}
          >
            {isUploading ? (
              <CircularProgress size={16} />
            ) : (
              <PhotoCameraIcon />
            )}
          </IconButton>
        </label>
        
        {/* اضافه کردن دکمه رفرش */}
        {currentAvatar && (
          <IconButton
            aria-label="رفرش تصویر"
            size="small"
            color="primary"
            onClick={handleRefreshImage}
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              bgcolor: 'background.paper',
              boxShadow: 1,
              '&:hover': {
                bgcolor: 'background.paper',
                opacity: 0.9,
              },
            }}
          >
            <RefreshIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
      
      <Typography variant="caption" color="text.secondary" align="center">
        برای آپلود یا تغییر تصویر کلیک کنید
      </Typography>
      
      {/* نمایش پیشرفت آپلود */}
      {isUploading && (
        <Box sx={{ width: '100%', mt: 1 }}>
          <LinearProgress variant="determinate" value={uploadProgress} />
          <Typography variant="caption" color="text.secondary" align="center" sx={{ display: 'block' }}>
            در حال آپلود... {uploadProgress}%
          </Typography>
        </Box>
      )}
      
      {/* دیالوگ کراپ تصویر */}
      <Dialog
        open={openCropDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            height: {
              xs: '90vh',
              md: 'auto'
            }
          }
        }}
      >
        <DialogTitle>برش تصویر پروفایل</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ position: 'relative', height: 400, mb: 2 }}>
            {imageSrc && (
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={onCropChange}
                onZoomChange={onZoomChange}
                onRotationChange={onRotationChange}
                onCropComplete={onCropComplete}
              />
            )}
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Typography id="zoom-slider" gutterBottom>
              بزرگنمایی
            </Typography>
            <Slider
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="zoom-slider"
              onChange={(_, value) => setZoom(value as number)}
            />
          </Box>
          
          <Box>
            <Typography id="rotation-slider" gutterBottom>
              چرخش
            </Typography>
            <Box display="flex" alignItems="center">
              <CropRotateIcon sx={{ mr: 1 }} />
              <Slider
                value={rotation}
                min={0}
                max={360}
                step={1}
                aria-labelledby="rotation-slider"
                onChange={(_, value) => setRotation(value as number)}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>انصراف</Button>
          <Button 
            onClick={handleSaveCroppedImage} 
            variant="contained" 
            color="primary"
            disabled={processing || isUploading}
            startIcon={
              (processing || isUploading) ? <CircularProgress size={20} /> : null
            }
          >
            تایید
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AvatarUploader; 