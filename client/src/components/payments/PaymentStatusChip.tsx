// client/src/components/payments/PaymentStatusChip.tsx
// کامپوننت نمایش‌دهنده وضعیت پرداخت

import React from 'react';
import { Chip, ChipProps } from '@mui/material';
import { PaymentStatus } from '../../types/payment.types';

interface PaymentStatusChipProps {
  status: PaymentStatus;
  size?: ChipProps['size'];
  onClick?: () => void;
}

/**
 * کامپوننت نمایش وضعیت پرداخت با رنگ‌های متناسب
 */
const PaymentStatusChip: React.FC<PaymentStatusChipProps> = ({
  status,
  size = 'small',
  onClick,
}) => {
  // تعیین تنظیمات هر وضعیت
  const getStatusConfig = (status: PaymentStatus) => {
    switch (status) {
      case 'PENDING':
        return {
          label: 'در انتظار',
          color: 'warning' as const,
        };
      case 'APPROVED':
        return {
          label: 'تأیید شده',
          color: 'info' as const,
        };
      case 'PAID':
        return {
          label: 'پرداخت شده',
          color: 'success' as const,
        };
      case 'REJECTED':
        return {
          label: 'رد شده',
          color: 'error' as const,
        };
      default:
        return {
          label: 'نامشخص',
          color: 'default' as const,
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Chip
      label={config.label}
      color={config.color}
      size={size}
      onClick={onClick}
      clickable={!!onClick}
      sx={{
        fontWeight: 'medium',
        '& .MuiChip-label': {
          px: 1,
        },
      }}
    />
  );
};

export default PaymentStatusChip;