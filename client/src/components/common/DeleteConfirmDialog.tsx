// client/src/components/common/DeleteConfirmDialog.tsx
// کامپوننت دیالوگ تأیید حذف

import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface DeleteConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  content?: string;
  loading?: boolean;
}

/**
 * کامپوننت دیالوگ تأیید حذف قابل استفاده در سراسر برنامه
 */
const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title = 'تأیید حذف',
  content = 'آیا از حذف این مورد اطمینان دارید؟ این عمل غیرقابل بازگشت است.',
  loading = false,
}) => {
  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading} color="inherit">
          انصراف
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <DeleteIcon />}
        >
          حذف
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmDialog;