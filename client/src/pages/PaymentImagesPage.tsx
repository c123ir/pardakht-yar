// client/src/pages/PaymentImagesPage.tsx
// صفحه مدیریت تصاویر پرداخت

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Tooltip,
  CircularProgress,
  Paper,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert,
  Stack,
  Chip,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  DownloadForOffline as DownloadIcon,
  Visibility as VisibilityIcon,
  Send as SendIcon,
  Payment as PaymentIcon,
  AttachFile as AttachFileIcon,
} from '@mui/icons-material';
import { usePayments } from '../hooks/usePayments';
import { useToast } from '../contexts/ToastContext';
import { formatDateTime, formatDate } from '../utils/dateUtils';
import { PaymentImage, PaymentRequest, PaymentStatus } from '../types/payment.types';

const PaymentImagesPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const {
    getPaymentById,
    getPaymentImages,
    uploadPaymentImage,
    deletePaymentImage,
    sendPaymentNotification,
    changePaymentStatus,
  } = usePayments();

  const [payment, setPayment] = useState<PaymentRequest | null>(null);
  const [images, setImages] = useState<PaymentImage[]>([]);
  
  const [loading, setLoading] = useState<boolean>(true);
  const [uploading, setUploading] = useState<boolean>(false);
  const [sending, setSending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [previewImage, setPreviewImage] = useState<PaymentImage | null>(null);
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<boolean>(false);
  const [deleteImageId, setDeleteImageId] = useState<number | null>(null);
  
  const [statusConfirmOpen, setStatusConfirmOpen] = useState<boolean>(false);
  
  // بارگذاری اطلاعات پرداخت و تصاویر
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      if (!id) {
        navigate('/payments');
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const paymentId = parseInt(id);
        const [paymentData, imagesData] = await Promise.all([
          getPaymentById(paymentId),
          getPaymentImages(paymentId)
        ]);
        
        setPayment(paymentData);
        setImages(imagesData);
      } catch (err: any) {
        setError(err.message || 'خطا در دریافت اطلاعات');
        showToast(err.message || 'خطا در دریافت اطلاعات', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, getPaymentById, getPaymentImages, navigate, showToast]);

  // بارگذاری مجدد تصاویر
  const reloadImages = async (): Promise<void> => {
    if (!id) return;
    
    try {
      const paymentId = parseInt(id);
      const imagesData = await getPaymentImages(paymentId);
      setImages(imagesData);
    } catch (err: any) {
      showToast(err.message || 'خطا در بارگذاری مجدد تصاویر', 'error');
    }
  };

  // انتخاب فایل برای آپلود
  const handleFileSelect = (): void => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // آپلود فایل انتخاب شده
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const files = event.target.files;
    if (!files || files.length === 0 || !id) return;

    const file = files[0];
    
    // بررسی نوع فایل
    if (!file.type.startsWith('image/')) {
      showToast('لطفاً یک فایل تصویر انتخاب کنید', 'error');
      return;
    }
    
    // بررسی حجم فایل (حداکثر 5 مگابایت)
    if (file.size > 5 * 1024 * 1024) {
      showToast('حجم فایل نباید بیشتر از 5 مگابایت باشد', 'error');
      return;
    }

    try {
      setUploading(true);
      await uploadPaymentImage(parseInt(id), file);
      showToast('تصویر با موفقیت آپلود شد', 'success');
      
      // به‌روزرسانی لیست تصاویر و اطلاعات پرداخت
      await Promise.all([
        reloadImages(),
        getPaymentById(parseInt(id)).then(setPayment)
      ]);
      
      // پاک کردن فایل انتخاب شده
      event.target.value = '';
    } catch (err: any) {
      showToast(err.message || 'خطا در آپلود تصویر', 'error');
    } finally {
      setUploading(false);
    }
  };

  // مشاهده تصویر با اندازه بزرگتر
  const handlePreviewImage = (image: PaymentImage): void => {
    setPreviewImage(image);
    setPreviewOpen(true);
  };

  // بستن پیش‌نمایش تصویر
  const handleClosePreview = (): void => {
    setPreviewOpen(false);
    setPreviewImage(null);
  };

  // باز کردن دیالوگ تأیید حذف تصویر
  const handleDeleteClick = (imageId: number): void => {
    setDeleteImageId(imageId);
    setDeleteConfirmOpen(true);
  };

  // حذف تصویر تأیید شده
  const handleConfirmDelete = async (): Promise<void> => {
    if (!deleteImageId || !id) return;
    
    try {
      await deletePaymentImage(parseInt(id), deleteImageId);
      showToast('تصویر با موفقیت حذف شد', 'success');
      
      // به‌روزرسانی لیست تصاویر
      await reloadImages();
    } catch (err: any) {
      showToast(err.message || 'خطا در حذف تصویر', 'error');
    } finally {
      setDeleteConfirmOpen(false);
      setDeleteImageId(null);
    }
  };

  // باز کردن دیالوگ تغییر وضعیت به پرداخت شده
  const handleStatusChange = (): void => {
    setStatusConfirmOpen(true);
  };

  // تغییر وضعیت پرداخت به "پرداخت شده"
  const handleConfirmStatusChange = async (): Promise<void> => {
    if (!id || !payment) return;
    
    try {
      await changePaymentStatus(parseInt(id), 'PAID');
      
      // به‌روزرسانی اطلاعات پرداخت
      const updatedPayment = await getPaymentById(parseInt(id));
      setPayment(updatedPayment);
      
      showToast('وضعیت پرداخت با موفقیت به "پرداخت شده" تغییر یافت', 'success');
    } catch (err: any) {
      showToast(err.message || 'خطا در تغییر وضعیت پرداخت', 'error');
    } finally {
      setStatusConfirmOpen(false);
    }
  };

  // ارسال پیامک اطلاع‌رسانی
  const handleSendNotification = async (): Promise<void> => {
    if (!id) return;
    
    try {
      setSending(true);
      const result = await sendPaymentNotification(parseInt(id));
      
      if (result.success) {
        showToast('پیامک اطلاع‌رسانی با موفقیت ارسال شد', 'success');
        
        // به‌روزرسانی اطلاعات پرداخت
        const updatedPayment = await getPaymentById(parseInt(id));
        setPayment(updatedPayment);
      } else {
        showToast(result.message || 'خطا در ارسال پیامک', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'خطا در ارسال پیامک اطلاع‌رسانی', 'error');
    } finally {
      setSending(false);
    }
  };

  // دانلود تصویر
  const handleDownloadImage = (image: PaymentImage): void => {
    try {
      const link = document.createElement('a');
      link.href = `${process.env.VITE_API_URL}/uploads/${image.filePath}`;
      link.download = image.originalName || image.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      showToast('خطا در دانلود تصویر', 'error');
    }
  };

  // نمایش وضعیت بارگذاری
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  // نمایش خطا
  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">
          {error}
        </Alert>
      </Box>
    );
  }

  // اگر پرداخت یافت نشد
  if (!payment) {
    return (
      <Box p={3}>
        <Alert severity="warning">
          پرداخت مورد نظر یافت نشد
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      {/* هدر صفحه */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton onClick={() => navigate('/payments')}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5">
            تصاویر پرداخت: {payment.title}
          </Typography>
        </Box>
      </Paper>

      {/* کارت اطلاعات پرداخت */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom display="flex" alignItems="center">
                <PaymentIcon sx={{ mr: 1 }} />
                اطلاعات پرداخت
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="subtitle2" color="text.secondary">وضعیت</Typography>
              <Chip 
                label={payment.status === 'PAID' ? 'پرداخت شده' : 
                      payment.status === 'APPROVED' ? 'تأیید شده' : 
                      payment.status === 'REJECTED' ? 'رد شده' : 'در انتظار'} 
                color={payment.status === 'PAID' ? 'success' : 
                      payment.status === 'APPROVED' ? 'info' : 
                      payment.status === 'REJECTED' ? 'error' : 'warning'}
                sx={{ mt: 1 }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="subtitle2" color="text.secondary">مبلغ</Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                {payment.amount.toLocaleString()} ریال
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="subtitle2" color="text.secondary">تاریخ</Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                {formatDate(payment.effectiveDate)}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="subtitle2" color="text.secondary">تاریخ ثبت</Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                {formatDate(payment.createdAt)}
              </Typography>
            </Grid>

            {payment.description && (
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">توضیحات</Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  {payment.description}
                </Typography>
              </Grid>
            )}

            {/* قسمت دکمه‌های عملیات */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                {/* دکمه آپلود تصویر */}
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={uploading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
                  onClick={handleFileSelect}
                  disabled={uploading}
                >
                  آپلود تصویر
                </Button>

                {/* دکمه تغییر وضعیت به پرداخت شده */}
                {payment.status !== 'PAID' && images.length > 0 && (
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleStatusChange}
                  >
                    تغییر وضعیت به پرداخت شده
                  </Button>
                )}

                {/* دکمه ارسال پیامک */}
                {payment.status === 'PAID' && (
                  <Button
                    variant="contained"
                    color="info"
                    startIcon={sending ? <CircularProgress size={20} /> : <SendIcon />}
                    onClick={handleSendNotification}
                    disabled={sending || !payment.beneficiaryPhone && !payment.contact?.accountantPhone}
                  >
                    ارسال پیامک به ذینفع
                  </Button>
                )}
              </Stack>

              {/* ورودی مخفی برای انتخاب فایل */}
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleFileChange}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* کارت تصاویر */}
      <Card>
        <CardContent>
          <Box display="flex" alignItems="center" gap={1} mb={3}>
            <AttachFileIcon />
            <Typography variant="h6">تصاویر پرداخت</Typography>
          </Box>

          {images.length === 0 ? (
            <Box textAlign="center" py={5}>
              <Typography variant="body1" color="text.secondary">
                هنوز تصویری برای این پرداخت آپلود نشده است
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<CloudUploadIcon />}
                onClick={handleFileSelect}
                sx={{ mt: 2 }}
              >
                آپلود تصویر جدید
              </Button>
            </Box>
          ) : (
            <ImageList cols={window.innerWidth < 600 ? 1 : window.innerWidth < 960 ? 2 : 3} gap={16}>
              {images.map((image) => (
                <ImageListItem key={image.id}>
                  <img
                    src={`${process.env.VITE_API_URL}/uploads/${image.filePath}`}
                    alt={image.originalName || 'تصویر پرداخت'}
                    loading="lazy"
                    style={{ objectFit: 'contain', maxHeight: 300 }}
                  />
                  <ImageListItemBar
                    title={image.originalName || 'تصویر پرداخت'}
                    subtitle={`آپلود: ${formatDateTime(image.uploadedAt)}`}
                    actionIcon={
                      <Box>
                        <Tooltip title="مشاهده">
                          <IconButton
                            color="primary"
                            onClick={() => handlePreviewImage(image)}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="دانلود">
                          <IconButton
                            color="secondary"
                            onClick={() => handleDownloadImage(image)}
                          >
                            <DownloadIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="حذف">
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteClick(image.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    }
                  />
                </ImageListItem>
              ))}
            </ImageList>
          )}
        </CardContent>
      </Card>

      {/* دیالوگ پیش‌نمایش تصویر */}
      <Dialog open={previewOpen} onClose={handleClosePreview} maxWidth="lg" fullWidth>
        <DialogTitle>
          {previewImage?.originalName || 'تصویر پرداخت'}
        </DialogTitle>
        <DialogContent>
          {previewImage && (
            <Box display="flex" justifyContent="center" alignItems="center">
              <img
                src={`${process.env.VITE_API_URL}/uploads/${previewImage.filePath}`}
                alt={previewImage.originalName || 'تصویر پرداخت'}
                style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain' }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {previewImage && (
            <Button
              color="secondary"
              onClick={() => handleDownloadImage(previewImage)}
              startIcon={<DownloadIcon />}
            >
              دانلود
            </Button>
          )}
          <Button onClick={handleClosePreview}>بستن</Button>
        </DialogActions>
      </Dialog>

      {/* دیالوگ تأیید حذف تصویر */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>حذف تصویر</DialogTitle>
        <DialogContent>
          <DialogContentText>
            آیا از حذف این تصویر اطمینان دارید؟ این عمل غیرقابل بازگشت است.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>انصراف</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            حذف
          </Button>
        </DialogActions>
      </Dialog>

      {/* دیالوگ تأیید تغییر وضعیت پرداخت */}
      <Dialog open={statusConfirmOpen} onClose={() => setStatusConfirmOpen(false)}>
        <DialogTitle>تغییر وضعیت پرداخت</DialogTitle>
        <DialogContent>
          <DialogContentText>
            آیا از تغییر وضعیت این پرداخت به "پرداخت شده" اطمینان دارید؟
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusConfirmOpen(false)}>انصراف</Button>
          <Button onClick={handleConfirmStatusChange} color="success" variant="contained">
            تأیید و تغییر وضعیت
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PaymentImagesPage;