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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
  FormControlLabel,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { FieldConfig, FieldSetting, RequestType } from '../../types/request.types';

// تنظیمات پیش‌فرض فیلدها
const DEFAULT_FIELD_CONFIG: FieldConfig = {
  title: { enabled: true, required: true, label: 'عنوان' },
  description: { enabled: true, required: false, label: 'توضیحات' },
  amount: { enabled: true, required: false, label: 'مبلغ' },
  effectiveDate: { enabled: true, required: false, label: 'تاریخ مؤثر' },
  beneficiaryName: { enabled: true, required: false, label: 'نام ذینفع' },
  beneficiaryPhone: { enabled: true, required: false, label: 'شماره تماس ذینفع' },
  contactId: { enabled: true, required: false, label: 'طرف‌حساب' },
  groupId: { enabled: true, required: false, label: 'گروه' },
};

interface RequestTypeEditorProps {
  initialData: RequestType | null;
  readOnly?: boolean;
  loading?: boolean;
  onSave: (data: Partial<RequestType>) => void;
}

const RequestTypeEditor: React.FC<RequestTypeEditorProps> = ({
  initialData,
  readOnly = false,
  loading = false,
  onSave,
}) => {
  // استیت‌های فرم
  const [formData, setFormData] = useState<Partial<RequestType>>({
    name: '',
    description: '',
    isActive: true,
    fieldConfig: { ...DEFAULT_FIELD_CONFIG },
  });
  
  // استیت‌های دیالوگ ویرایش فیلد
  const [editFieldDialog, setEditFieldDialog] = useState(false);
  const [currentField, setCurrentField] = useState<{ key: string; setting: FieldSetting } | null>(null);
  const [customFields, setCustomFields] = useState<{ [key: string]: FieldSetting }>({});
  const [newFieldKey, setNewFieldKey] = useState('');
  const [addCustomFieldDialog, setAddCustomFieldDialog] = useState(false);
  
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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev: Partial<RequestType>) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    
    // پاک کردن خطاهای مربوطه
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // مدیریت تغییر در تنظیمات فیلد
  const handleFieldSettingChange = (
    key: string,
    settingKey: keyof FieldSetting,
    value: boolean | string
  ) => {
    setFormData((prev: Partial<RequestType>) => {
      const newConfig = { ...prev.fieldConfig } as FieldConfig;
      
      if (standardKeys.includes(key)) {
        newConfig[key as keyof typeof DEFAULT_FIELD_CONFIG] = {
          ...newConfig[key as keyof typeof DEFAULT_FIELD_CONFIG],
          [settingKey]: value,
        };
      }
      
      return {
        ...prev,
        fieldConfig: newConfig,
      };
    });
  };

  // مدیریت تغییر در فیلدهای سفارشی
  const handleCustomFieldSettingChange = (
    key: string,
    settingKey: keyof FieldSetting,
    value: boolean | string
  ) => {
    setCustomFields((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [settingKey]: value,
      },
    }));
  };

  // باز کردن دیالوگ ویرایش فیلد
  const handleOpenEditDialog = (key: string, isCustom: boolean = false) => {
    if (isCustom) {
      setCurrentField({ key, setting: customFields[key] });
    } else {
      setCurrentField({
        key,
        setting: (formData.fieldConfig as FieldConfig)[key as keyof typeof DEFAULT_FIELD_CONFIG],
      });
    }
    setEditFieldDialog(true);
  };

  // بستن دیالوگ ویرایش فیلد
  const handleCloseEditDialog = () => {
    setEditFieldDialog(false);
    setCurrentField(null);
  };

  // ذخیره تنظیمات فیلد
  const handleSaveFieldSettings = () => {
    if (!currentField) return;
    
    const { key, setting } = currentField;
    
    if (standardKeys.includes(key)) {
      handleFieldSettingChange(key, 'label', setting.label);
      handleFieldSettingChange(key, 'enabled', setting.enabled);
      handleFieldSettingChange(key, 'required', setting.required);
    } else {
      handleCustomFieldSettingChange(key, 'label', setting.label);
      handleCustomFieldSettingChange(key, 'enabled', setting.enabled);
      handleCustomFieldSettingChange(key, 'required', setting.required);
    }
    
    handleCloseEditDialog();
  };

  // حذف فیلد سفارشی
  const handleDeleteCustomField = (key: string) => {
    setCustomFields((prev) => {
      const newFields = { ...prev };
      delete newFields[key];
      return newFields;
    });
  };

  // باز کردن دیالوگ افزودن فیلد سفارشی
  const handleOpenAddCustomFieldDialog = () => {
    setAddCustomFieldDialog(true);
    setNewFieldKey('');
  };

  // بستن دیالوگ افزودن فیلد سفارشی
  const handleCloseAddCustomFieldDialog = () => {
    setAddCustomFieldDialog(false);
    setNewFieldKey('');
  };

  // افزودن فیلد سفارشی جدید
  const handleAddCustomField = () => {
    if (!newFieldKey.trim()) {
      return;
    }
    
    // بررسی تکراری نبودن کلید
    if (standardKeys.includes(newFieldKey) || customFields[newFieldKey]) {
      alert('این کلید قبلاً استفاده شده است. لطفاً کلید دیگری انتخاب کنید.');
      return;
    }
    
    // افزودن فیلد سفارشی جدید
    setCustomFields((prev) => ({
      ...prev,
      [newFieldKey]: {
        enabled: true,
        required: false,
        label: newFieldKey,
      },
    }));
    
    handleCloseAddCustomFieldDialog();
  };

  // ارسال فرم
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // اعتبارسنجی
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = 'نام نوع درخواست الزامی است';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // ترکیب فیلدهای استاندارد و سفارشی
    const completeFieldConfig = {
      ...(formData.fieldConfig as FieldConfig),
      ...customFields,
    };
    
    onSave({
      ...formData,
      fieldConfig: completeFieldConfig,
    });
  };

  // لیست کلیدهای استاندارد
  const standardKeys = Object.keys(DEFAULT_FIELD_CONFIG);

  return (
    <Box component="form" id="request-type-form" onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        {/* اطلاعات اصلی */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            اطلاعات اصلی
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={8}>
              <TextField
                name="name"
                label="نام نوع درخواست"
                value={formData.name || ''}
                onChange={handleChange}
                fullWidth
                required
                disabled={readOnly || loading}
                error={Boolean(errors.name)}
                helperText={errors.name}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControlLabel
                control={
                  <Switch
                    name="isActive"
                    checked={formData.isActive || false}
                    onChange={handleChange}
                    disabled={readOnly || loading}
                    color="primary"
                  />
                }
                label="فعال"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                label="توضیحات"
                value={formData.description || ''}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
                disabled={readOnly || loading}
              />
            </Grid>
          </Grid>
        </Grid>

        {/* تنظیمات فیلدها */}
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              تنظیمات فیلدها
            </Typography>
            {!readOnly && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<AddIcon />}
                onClick={handleOpenAddCustomFieldDialog}
                disabled={loading}
              >
                افزودن فیلد سفارشی
              </Button>
            )}
          </Box>
          
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>کلید</TableCell>
                  <TableCell>برچسب</TableCell>
                  <TableCell align="center">فعال</TableCell>
                  <TableCell align="center">الزامی</TableCell>
                  <TableCell align="center">عملیات</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* فیلدهای استاندارد */}
                {standardKeys.map((key) => {
                  const setting = (formData.fieldConfig as FieldConfig)[
                    key as keyof typeof DEFAULT_FIELD_CONFIG
                  ];
                  return (
                    <TableRow key={key}>
                      <TableCell>{key}</TableCell>
                      <TableCell>{setting.label}</TableCell>
                      <TableCell align="center">
                        <Checkbox
                          checked={setting.enabled}
                          disabled={readOnly || loading || (key === 'title')}
                          onChange={(e) =>
                            handleFieldSettingChange(key, 'enabled', e.target.checked)
                          }
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Checkbox
                          checked={setting.required}
                          disabled={
                            readOnly || loading || !setting.enabled || (key === 'title')
                          }
                          onChange={(e) =>
                            handleFieldSettingChange(key, 'required', e.target.checked)
                          }
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleOpenEditDialog(key)}
                          disabled={readOnly || loading}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
                
                {/* فیلدهای سفارشی */}
                {Object.keys(customFields).map((key) => {
                  const setting = customFields[key];
                  return (
                    <TableRow key={key}>
                      <TableCell>{key}</TableCell>
                      <TableCell>{setting.label}</TableCell>
                      <TableCell align="center">
                        <Checkbox
                          checked={setting.enabled}
                          disabled={readOnly || loading}
                          onChange={(e) =>
                            handleCustomFieldSettingChange(key, 'enabled', e.target.checked)
                          }
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Checkbox
                          checked={setting.required}
                          disabled={readOnly || loading || !setting.enabled}
                          onChange={(e) =>
                            handleCustomFieldSettingChange(key, 'required', e.target.checked)
                          }
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleOpenEditDialog(key, true)}
                          disabled={readOnly || loading}
                          sx={{ mr: 1 }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteCustomField(key)}
                          disabled={readOnly || loading}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
                
                {Object.keys(customFields).length === 0 && Object.keys(formData.fieldConfig || {}).length <= standardKeys.length && (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        هیچ فیلد سفارشی تعریف نشده است
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      {/* دیالوگ ویرایش تنظیمات فیلد */}
      <Dialog open={editFieldDialog} onClose={handleCloseEditDialog}>
        <DialogTitle>تنظیمات فیلد</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="برچسب فیلد"
                fullWidth
                value={currentField?.setting.label || ''}
                onChange={(e) =>
                  setCurrentField((prev) =>
                    prev
                      ? { ...prev, setting: { ...prev.setting, label: e.target.value } }
                      : null
                  )
                }
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={currentField?.setting.enabled || false}
                    onChange={(e) =>
                      setCurrentField((prev) =>
                        prev
                          ? {
                              ...prev,
                              setting: { ...prev.setting, enabled: e.target.checked },
                            }
                          : null
                      )
                    }
                    disabled={currentField?.key === 'title'}
                  />
                }
                label="فیلد فعال باشد"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={currentField?.setting.required || false}
                    onChange={(e) =>
                      setCurrentField((prev) =>
                        prev
                          ? {
                              ...prev,
                              setting: { ...prev.setting, required: e.target.checked },
                            }
                          : null
                      )
                    }
                    disabled={
                      !currentField?.setting.enabled || currentField?.key === 'title'
                    }
                  />
                }
                label="فیلد الزامی باشد"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>انصراف</Button>
          <Button onClick={handleSaveFieldSettings} variant="contained" color="primary">
            ذخیره
          </Button>
        </DialogActions>
      </Dialog>

      {/* دیالوگ افزودن فیلد سفارشی */}
      <Dialog open={addCustomFieldDialog} onClose={handleCloseAddCustomFieldDialog}>
        <DialogTitle>افزودن فیلد سفارشی</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="کلید فیلد (به انگلیسی)"
                fullWidth
                value={newFieldKey}
                onChange={(e) => setNewFieldKey(e.target.value)}
                helperText="کلید فیلد باید منحصر به فرد و به انگلیسی باشد"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddCustomFieldDialog}>انصراف</Button>
          <Button
            onClick={handleAddCustomField}
            variant="contained"
            color="primary"
            disabled={!newFieldKey.trim()}
          >
            افزودن
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RequestTypeEditor; 