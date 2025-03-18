import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import {
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  CloudUpload as CloudUploadIcon,
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { usePayments } from '../hooks/usePayments';
import { formatDateTime } from '../utils/dateUtils';
import DeleteConfirmDialog from '../components/common/DeleteConfirmDialog';

const PaymentImagesPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { getPayment, getPaymentImages, uploadPaymentImage, deletePaymentImage } = usePayments();

  const [payment, setPayment] = useState<any>(null);
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    if (!id) return;

    try {
      const [paymentData, imagesData] = await Promise.all([
        getPayment(parseInt(id)),
        getPaymentImages(parseInt(id)),
      ]);

      setPayment(paymentData);
      setImages(imagesData);
    } catch (error) {
      enqueueSnackbar('خطا در دریافت اطلاعات', { variant: 'error' });
      navigate('/payments');
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) return;

    const file = event.target.files[0];
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      await uploadPaymentImage(parseInt(id!), formData);
      await loadData();
      enqueueSnackbar('تصویر با موفقیت آپلود شد', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('خطا در آپلود تصویر', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (imageId: number) => {
    setSelectedImageId(imageId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedImageId) return;

    try {
      await deletePaymentImage(parseInt(id!), selectedImageId);
      await loadData();
      enqueueSnackbar('تصویر با موفقیت حذف شد', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('خطا در حذف تصویر', { variant: 'error' });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedImageId(null);
    }
  };

  if (!payment) {
    return null;
  }

  return (
    <Box p={3}>
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" gap={1} mb={3}>
                <IconButton onClick={() => navigate('/payments')}>
                  <ArrowBackIcon />
                </IconButton>
                <Typography variant="h5" component="h1">
                  تصاویر پرداخت: {payment.title}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" gap={1} mb={3}>
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<CloudUploadIcon />}
                  disabled={loading}
                >
                  آپلود تصویر جدید
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleFileSelect}
                  />
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12}>
              {images.length > 0 ? (
                <ImageList cols={3} gap={16}>
                  {images.map((image) => (
                    <ImageListItem key={image.id}>
                      <img
                        src={`/uploads/${image.filePath}`}
                        alt={image.originalName}
                        loading="lazy"
                      />
                      <ImageListItemBar
                        title={image.originalName}
                        subtitle={formatDateTime(image.uploadedAt)}
                        actionIcon={
                          <Tooltip title="حذف تصویر">
                            <IconButton
                              sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                              onClick={() => handleDeleteClick(image.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        }
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              ) : (
                <Typography variant="body1" color="textSecondary" align="center">
                  هنوز تصویری آپلود نشده است
                </Typography>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="حذف تصویر"
        content="آیا از حذف این تصویر اطمینان دارید؟"
      />
    </Box>
  );
};

export default PaymentImagesPage; 