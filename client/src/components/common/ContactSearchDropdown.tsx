// client/src/components/common/ContactSearchDropdown.tsx
// کامپوننت جستجو و انتخاب طرف‌حساب

import React, { useEffect, useState } from 'react';
import {
  Autocomplete,
  TextField,
  Box,
  CircularProgress,
  Typography,
  Avatar,
  InputAdornment,
  Paper,
} from '@mui/material';
import { Search as SearchIcon, Business as BusinessIcon } from '@mui/icons-material';
import { useContacts } from '../../hooks/useContacts';
import { Contact } from '../../types/contact.types';

interface ContactSearchDropdownProps {
  value: Contact | null;
  onChange: (contact: Contact | null) => void;
  onInputChange?: (inputValue: string) => void;
  label?: string;
  placeholder?: string;
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  required?: boolean;
  disabled?: boolean;
}

const ContactSearchDropdown: React.FC<ContactSearchDropdownProps> = ({
  value,
  onChange,
  onInputChange,
  label = 'طرف‌حساب',
  placeholder = 'جستجو...',
  error,
  helperText,
  fullWidth = true,
  required = false,
  disabled = false,
}) => {
  const { contacts, loading, loadContacts } = useContacts();
  const [inputValue, setInputValue] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);

  // بارگیری لیست طرف‌حساب‌ها در هنگام باز شدن دراپ‌داون
  useEffect(() => {
    if (open) {
      loadContacts({ page: 1, limit: 30, search: inputValue });
    }
  }, [open, inputValue, loadContacts]);

  // مدیریت تغییر متن جستجو
  const handleInputChange = (_: React.SyntheticEvent, newInputValue: string) => {
    setInputValue(newInputValue);
    if (onInputChange) {
      onInputChange(newInputValue);
    }
    loadContacts({ page: 1, limit: 30, search: newInputValue });
  };

  // مدیریت انتخاب طرف‌حساب
  const handleChange = (_: React.SyntheticEvent, newValue: Contact | null) => {
    console.log("مخاطب انتخاب شد:", newValue);
    onChange(newValue);
  };

  // نمایش آیتم در لیست
  const renderOption = (props: React.HTMLAttributes<HTMLLIElement>, option: Contact) => {
    // بجای استخراج key، از otherProps استفاده می‌کنیم
    return (
      <li key={option.id} {...props} onClick={() => {
        // استفاده از React.MouseEvent به جای MouseEvent عادی
        if (props.onClick) {
          const syntheticEvent = props.onClick as React.MouseEventHandler<HTMLLIElement>;
          syntheticEvent({} as React.MouseEvent<HTMLLIElement>);
        }
        // وقتی روی یک گزینه کلیک می‌شود، مستقیماً آن را به عنوان انتخاب شده تنظیم می‌کنیم
        handleChange({} as React.SyntheticEvent, option);
      }}>
        <Box display="flex" alignItems="center" width="100%">
          <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: 'primary.main' }}>
            <BusinessIcon fontSize="small" />
          </Avatar>
          <Box>
            <Typography variant="body1">{option.companyName}</Typography>
            {option.contactPerson && (
              <Typography variant="caption" color="text.secondary">
                {option.contactPerson} - {option.phone || 'بدون شماره تماس'}
              </Typography>
            )}
          </Box>
        </Box>
      </li>
    );
  };

  // ارزش نمایش داده شده در فیلد پس از انتخاب
  const getOptionLabel = (option: Contact | string) => {
    if (typeof option === 'string') {
      return option;
    }
    // بررسی می‌کنیم که آیا شیء خالی است (به دلیل مشکل در انتخاب مخاطب)
    if (!option || typeof option !== 'object') {
      return '';
    }
    return option.companyName || '';
  };

  // بررسی برابری گزینه‌ها برای کمک به Autocomplete
  const isOptionEqualToValue = (option: Contact, value: Contact) => {
    return option.id === value.id;
  };

  return (
    <Autocomplete
      value={value}
      onChange={handleChange}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      options={contacts || []}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={isOptionEqualToValue}
      filterOptions={(x) => x} // غیرفعال کردن فیلتر پیش‌فرض (چون خودمان در سرور فیلتر می‌کنیم)
      renderOption={renderOption}
      loading={loading}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      disabled={disabled}
      fullWidth={fullWidth}
      PaperComponent={(props) => <Paper elevation={4} {...props} />}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          error={error}
          helperText={helperText}
          required={required}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};

export default ContactSearchDropdown; 