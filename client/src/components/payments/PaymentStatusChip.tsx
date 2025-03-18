import React from 'react';
import { Chip } from '@mui/material';
import { PaymentStatus } from '../../types/payment.types';

interface PaymentStatusChipProps {
  status: PaymentStatus;
}

const PaymentStatusChip: React.FC<PaymentStatusChipProps> = ({ status }) => {
  const getStatusConfig = (status: PaymentStatus) => {
    switch (status) {
      case 'PENDING':
        return {
          label: 'در انتظار',
          color: 'default' as const,
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
      size="small"
    />
  );
};

export default PaymentStatusChip; 