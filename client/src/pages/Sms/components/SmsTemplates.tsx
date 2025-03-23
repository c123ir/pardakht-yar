import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Paper,
  TextField,
  Tooltip,
  Typography,
  Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { SmsTemplate } from '../types';

/**
 * کامپوننت مدیریت قالب‌های پیامک
 */
const SmsTemplates: React.FC = () => {
  // وضعیت‌های کامپوننت
  const [templates, setTemplates] = useState<SmsTemplate[]>([
    {
      id: '1',
      title: 'اطلاع‌رسانی تخفیف',
      content: 'مشتری گرامی، کد تخفیف {discountCode} به مبلغ {amount} ریال برای خرید بعدی شما فعال شد.',
      variables: ['discountCode', 'amount'],
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'کد تایید',
      content: 'کد تایید شما: {code}\nاین کد تا {expireTime} دقیقه معتبر است.',
      variables: ['code', 'expireTime'],
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      title: 'یادآوری پرداخت',
      content: 'مشتری گرامی {name}، فاکتور شماره {invoiceId} به مبلغ {amount} ریال سررسید شده است. لطفا نسبت به پرداخت آن اقدام فرمایید.',
      variables: ['name', 'invoiceId', 'amount'],
      createdAt: new Date().toISOString(),
    },
  ]);
  const [loading, setLoading] = useState<boolean>(false);
  
  // وضعیت دیالوگ
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [editingTemplate, setEditingTemplate] = useState<SmsTemplate | null>(null);
  const [formErrors, setFormErrors] = useState<{
    title?: string;
    content?: string;
  }>({});
  
  // مدیریت باز و بسته کردن دیالوگ
  const handleOpenDialog = (template?: SmsTemplate) => {
    if (template) {
      setEditingTemplate(template);
    } else {
      setEditingTemplate(null);
    }
    setOpenDialog(true);
    setFormErrors({});
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTemplate(null);
  };
  
  // ذخیره قالب جدید یا ویرایش‌شده
  const handleSaveTemplate = () => {
    if (!editingTemplate) return;
    
    // اعتبارسنجی فرم
    const errors: {
      title?: string;
      content?: string;
    } = {};
    
    if (!editingTemplate.title.trim()) {
      errors.title = 'عنوان قالب الزامی است';
    }
    
    if (!editingTemplate.content.trim()) {
      errors.content = 'متن قالب الزامی است';
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setLoading(true);
    
    // در حالت واقعی، اینجا API call خواهد بود
    setTimeout(() => {
      if (editingTemplate.id) {
        // ویرایش قالب موجود
        setTemplates(templates.map(t => 
          t.id === editingTemplate.id ? { ...editingTemplate } : t
        ));
      } else {
        // ایجاد قالب جدید
        const newTemplate = {
          ...editingTemplate,
          id: Math.random().toString(36).substring(2, 9),
          createdAt: new Date().toISOString(),
        };
        setTemplates([...templates, newTemplate]);
      }
      
      setLoading(false);
      handleCloseDialog();
    }, 500);
  };
  
  // حذف قالب
  const handleDeleteTemplate = (id: string) => {
    if (window.confirm('آیا از حذف این قالب اطمینان دارید؟')) {
      setLoading(true);
      
      // در حالت واقعی، اینجا API call خواهد بود
      setTimeout(() => {
        setTemplates(templates.filter(t => t.id !== id));
        setLoading(false);
      }, 500);
    }
  };
  
  // تشخیص متغیرها از متن قالب
  const extractVariables = (content: string): string[] => {
    const regex = /{([^{}]+)}/g;
    const variables: string[] = [];
    let match;
    
    while ((match = regex.exec(content)) !== null) {
      if (!variables.includes(match[1])) {
        variables.push(match[1]);
      }
    }
    
    return variables;
  };
  
  // تغییر مقدار فیلدهای فرم
  const handleInputChange = (field: keyof SmsTemplate, value: string) => {
    if (!editingTemplate) return;
    
    const updatedTemplate = { ...editingTemplate, [field]: value };
    
    if (field === 'content') {
      updatedTemplate.variables = extractVariables(value);
    }
    
    setEditingTemplate(updatedTemplate);
    
    // پاک کردن خطای مرتبط در صورت وجود
    if (formErrors[field as keyof typeof formErrors]) {
      setFormErrors({ ...formErrors, [field]: undefined });
    }
  };
  
  // کپی کردن متن قالب
  const handleCopyTemplate = (content: string) => {
    navigator.clipboard.writeText(content).then(
      () => {
        alert('متن قالب کپی شد');
      },
      (err) => {
        console.error('خطا در کپی کردن متن:', err);
        alert('خطا در کپی کردن متن');
      }
    );
  };
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" component="h2">
          قالب‌های پیامک
        </Typography>
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          قالب جدید
        </Button>
      </Box>
      
      {loading && templates.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2}>
          {templates.length === 0 ? (
            <Grid item xs={12}>
              <Paper variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
                <Typography color="textSecondary">
                  هیچ قالبی وجود ندارد. با کلیک روی دکمه «قالب جدید» یک قالب ایجاد کنید.
                </Typography>
              </Paper>
            </Grid>
          ) : (
            templates.map(template => (
              <Grid item xs={12} sm={6} md={4} key={template.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle1" component="h3" noWrap sx={{ maxWidth: '70%' }}>
                        {template.title}
                      </Typography>
                      <Box>
                        <Tooltip title="کپی متن">
                          <IconButton 
                            size="small" 
                            onClick={() => handleCopyTemplate(template.content)}
                          >
                            <ContentCopyIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="ویرایش">
                          <IconButton 
                            size="small" 
                            onClick={() => handleOpenDialog(template)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="حذف">
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleDeleteTemplate(template.id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                    
                    <Divider sx={{ my: 1 }} />
                    
                    <Typography variant="body2" sx={{ 
                      whiteSpace: 'pre-line', 
                      color: 'text.secondary',
                      mb: 2,
                      maxHeight: '100px',
                      overflow: 'auto'
                    }}>
                      {template.content}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {template.variables.map(variable => (
                        <Chip 
                          key={variable} 
                          label={variable} 
                          size="small" 
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      )}
      
      {/* دیالوگ افزودن/ویرایش قالب */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        fullWidth 
        maxWidth="sm"
      >
        <DialogTitle>
          {editingTemplate?.id ? 'ویرایش قالب' : 'قالب جدید'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ my: 2 }}>
            <TextField
              label="عنوان قالب"
              fullWidth
              value={editingTemplate?.title || ''}
              onChange={(e) => handleInputChange('title', e.target.value)}
              error={!!formErrors.title}
              helperText={formErrors.title}
              sx={{ mb: 3 }}
            />
            
            <TextField
              label="متن قالب"
              fullWidth
              multiline
              rows={6}
              value={editingTemplate?.content || ''}
              onChange={(e) => handleInputChange('content', e.target.value)}
              error={!!formErrors.content}
              helperText={formErrors.content || 'از {نام‌متغیر} برای تعریف متغیرها استفاده کنید'}
              sx={{ mb: 3 }}
            />
            
            <Typography variant="subtitle2" gutterBottom>
              متغیرهای تشخیص داده شده:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {editingTemplate?.variables && editingTemplate.variables.length > 0 ? (
                editingTemplate.variables.map(variable => (
                  <Chip 
                    key={variable} 
                    label={variable} 
                    size="small" 
                    variant="outlined"
                  />
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  هیچ متغیری تشخیص داده نشد
                </Typography>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            انصراف
          </Button>
          <Button 
            onClick={handleSaveTemplate}
            color="primary"
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'ذخیره'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SmsTemplates; 