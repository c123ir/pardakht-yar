// client/src/components/requests/RequestTypeEditor.tsx
// کامپوننت ویرایشگر نوع درخواست

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Grid,
  Paper,
  Switch,
  FormControlLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
} from '@mui/icons-material';
import { FieldConfig, FieldSetting, RequestType } from '../../types/request.types';

// تنظیمات پیش‌فرض فیلدها
const DEFAULT_FIELD_CONFIG: FieldConfig = {
  title: {
    enabled: true,
    required: true,
    label: 'عنوان',
    order: 1,
  },
  description: {
    enabled: true,
    required: false,
    label: 'توضیحات',
    order: 2,
  },
  amount: {
    enabled: true,
    required: false,
    label: 'مبلغ',
    order: 3,
  },
  effectiveDate: {
    enabled: true,
    required: false,
    label: 'تاریخ',
    order: 4,
  },
  status: {
    enabled: true,
    required: true,
    label: 'وضعیت',
    order: 5,
    options: []
  },
  beneficiaryName: {
    enabled: true,
    required: false,
    label: 'نام ذینفع',
    order: 6,
  },
  beneficiaryPhone: {
    enabled: true,
    required: false,
    label: 'شماره تماس ذینفع',
    order: 7,
  },
  contactId: {
    enabled: true,
    required: false,
    label: 'مخاطب',
    order: 8,
  },
  groupId: {
    enabled: true,
    required: false,
    label: 'گروه',
    order: 9,
  },
  timeField: {
    enabled: true,
    required: false,
    label: 'زمان',
    order: 10,
  },
  trackingCode: {
    enabled: true,
    required: false,
    label: 'کد پیگیری',
    order: 11,
  },
  comment: {
    enabled: true,
    required: false,
    label: 'یادداشت',
    order: 12,
  },
  attachmentField: {
    enabled: true,
    required: false,
    label: 'پیوست',
    order: 13,
  },
  toggleField: {
    enabled: false,
    required: false,
    label: 'فیلد بله/خیر',
    order: 14,
  },
};

interface RequestTypeEditorProps {
  initialData: RequestType | null;
  onSave: (data: Partial<RequestType>) => void;
  onCancel: () => void;
}

const RequestTypeEditor: React.FC<RequestTypeEditorProps> = ({
  initialData,
  onSave,
  onCancel,
}) => {
  // استیت‌های فرم
  const [formData, setFormData] = useState<Partial<RequestType>>({
    name: '',
    description: '',
    isActive: true,
    iconName: '',
    color: '',
    fieldConfig: DEFAULT_FIELD_CONFIG,
  });
  
  // استیت‌های دیالوگ ویرایش فیلد
  // حذف: const [currentField, setCurrentField] = useState<{ key: string; setting: FieldSetting } | null>(null);
  const [customFields, setCustomFields] = useState<{ [key: string]: FieldSetting }>({});
  
  // استیت‌های اعتبارسنجی
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // تنظیم مقادیر اولیه فرم
  useEffect(() => {
    if (initialData) {
      // جداکردن فیلدهای استاندارد و سفارشی
      const { fieldConfig, ...rest } = initialData;
      const standardKeys = Object.keys(DEFAULT_FIELD_CONFIG);
      const standard: FieldConfig = { ...DEFAULT_FIELD_CONFIG };
      const custom: { [key: string]: FieldSetting } = {};
      
      if (fieldConfig) {
        // تنظیم فیلدهای استاندارد
        Object.keys(fieldConfig).forEach((key) => {
          if (standardKeys.includes(key)) {
            standard[key as keyof typeof DEFAULT_FIELD_CONFIG] = fieldConfig[key];
          } else {
            custom[key] = fieldConfig[key];
          }
        });
      }
      
      setFormData({
        ...rest,
        fieldConfig: standard,
      });
      
      setCustomFields(custom);
    } else {
      // تنظیم مقادیر پیش‌فرض برای ایجاد جدید
      setFormData({
        name: '',
        description: '',
        isActive: true,
        fieldConfig: { ...DEFAULT_FIELD_CONFIG },
      });
      setCustomFields({});
    }
  }, [initialData]);

  // مدیریت تغییر در فیلدهای فرم
  const handleChange = (field: keyof RequestType, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // پاک کردن خطاهای مربوطه
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // مدیریت تغییر در تنظیمات فیلد
  const handleFieldConfigChange = (field: keyof FieldConfig, setting: Partial<FieldSetting>) => {
    setFormData((prev) => {
      const currentConfig = prev.fieldConfig as FieldConfig;
      return {
        ...prev,
        fieldConfig: {
          ...currentConfig,
          [field]: {
            ...currentConfig[field],
            ...setting,
          } as FieldSetting,
        } as FieldConfig,
      };
    });
  };

  // حذف فیلد سفارشی
  const handleDeleteCustomField = (key: string) => {
    setCustomFields((prev) => {
      const newFields = { ...prev };
      delete newFields[key];
      return newFields;
    });
  };

  // ارسال فرم
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // اعتبارسنجی
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.name) {
      newErrors.name = 'نام نوع درخواست الزامی است';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // ترکیب فیلدهای استاندارد و سفارشی
    const combinedFieldConfig = {
      ...(formData.fieldConfig as FieldConfig),
      ...customFields,
    };
    
    onSave({
      ...formData,
      fieldConfig: combinedFieldConfig,
    });
  };

  const handleMoveField = (field: keyof FieldConfig, direction: 'up' | 'down') => {
    setFormData((prev) => {
      const currentConfig = prev.fieldConfig as FieldConfig;
      const currentOrder = currentConfig[field]?.order || 0;
      const newOrder = direction === 'up' ? currentOrder - 1 : currentOrder + 1;
      
      // یافتن فیلدی که باید جابجا شود
      const fieldToSwap = Object.keys(currentConfig).find(
        (key) => currentConfig[key as keyof FieldConfig].order === newOrder
      ) as keyof FieldConfig;
      
      if (!fieldToSwap) return prev;
      
      const newConfig = {
        ...currentConfig,
        [field]: {
          ...currentConfig[field],
          order: newOrder,
        },
        [fieldToSwap]: {
          ...currentConfig[fieldToSwap],
          order: currentOrder,
        },
      };
      
      return {
        ...prev,
        fieldConfig: newConfig,
      };
    });
  };

  const sortedFields = Object.entries(formData.fieldConfig || {})
    .map(([key, value]) => ({ key, ...value }))
    .sort((a, b) => ((a.order as number) || 0) - ((b.order as number) || 0));

  return (
    <Dialog open={true} onClose={onCancel} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {initialData ? 'ویرایش نوع درخواست' : 'ایجاد نوع درخواست جدید'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="نام"
                value={formData.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="توضیحات"
                value={formData.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                تنظیمات فیلدها
              </Typography>
              {sortedFields.map(({ key, enabled, required, label, order }) => (
                <Paper key={key} sx={{ p: 2, mb: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="نام فیلد"
                        value={label}
                        onChange={(e) => handleFieldConfigChange(key as keyof FieldConfig, {
                          label: e.target.value,
                        })}
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={enabled}
                            onChange={(e) => handleFieldConfigChange(key as keyof FieldConfig, {
                              enabled: e.target.checked,
                            })}
                          />
                        }
                        label="فعال"
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={required}
                            onChange={(e) => handleFieldConfigChange(key as keyof FieldConfig, {
                              required: e.target.checked,
                            })}
                          />
                        }
                        label="اجباری"
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Box display="flex" gap={1}>
                        <IconButton
                          onClick={() => handleMoveField(key as keyof FieldConfig, 'up')}
                          disabled={order === 1}
                        >
                          <ArrowUpwardIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleMoveField(key as keyof FieldConfig, 'down')}
                          disabled={order === sortedFields.length}
                        >
                          <ArrowDownwardIcon />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleDeleteCustomField(key)}>
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel}>انصراف</Button>
          <Button type="submit" variant="contained" color="primary">
            ذخیره
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default RequestTypeEditor; 