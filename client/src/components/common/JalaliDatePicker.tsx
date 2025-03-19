// client/src/components/common/JalaliDatePicker.tsx
// کامپوننت انتخاب‌گر تاریخ شمسی

import React, { useState, useEffect } from 'react';
import { TextField, IconButton, Popover, Box, Typography, Grid, Paper, Divider } from '@mui/material';
import { CalendarMonth as CalendarIcon, NavigateBefore, NavigateNext } from '@mui/icons-material';
import { addMonths, format, isValid, parse, setDate } from 'date-fns-jalali';
import { convertPersianToEnglishNumbers } from '../../utils/stringUtils';

interface JalaliDatePickerProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  required?: boolean;
  disabled?: boolean;
}

const JalaliDatePicker: React.FC<JalaliDatePickerProps> = ({
  value,
  onChange,
  label,
  placeholder,
  error,
  helperText,
  fullWidth = true,
  required = false,
  disabled = false,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [inputValue, setInputValue] = useState<string>(value);

  // به‌روزرسانی مقدار ورودی هنگام تغییر value
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // نمایش تقویم
  const handleOpenCalendar = (event: React.MouseEvent<HTMLElement>) => {
    if (!disabled) {
      setAnchorEl(event.currentTarget);
      
      // اگر یک تاریخ معتبر داریم، ماه جاری را به آن تنظیم کنیم
      if (value) {
        try {
          const date = parse(value, 'yyyy-MM-dd', new Date());
          if (isValid(date)) {
            setCurrentMonth(date);
          }
        } catch (e) {
          // در صورت بروز خطا، از تاریخ جاری استفاده می‌کنیم
          setCurrentMonth(new Date());
        }
      }
    }
  };

  // بستن تقویم
  const handleCloseCalendar = () => {
    setAnchorEl(null);
  };

  // تغییر ماه در تقویم
  const handleMonthChange = (delta: number) => {
    setCurrentMonth((prevMonth) => addMonths(prevMonth, delta));
  };

  // انتخاب تاریخ
  const handleDateSelect = (date: Date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    onChange(formattedDate);
    setInputValue(formattedDate);
    handleCloseCalendar();
  };

  // تغییر مقدار در ورودی متنی
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = convertPersianToEnglishNumbers(e.target.value);
    setInputValue(newValue);
    
    // اعتبارسنجی فرمت تاریخ وارد شده
    if (/^\d{4}-\d{2}-\d{2}$/.test(newValue)) {
      try {
        const date = parse(newValue, 'yyyy-MM-dd', new Date());
        if (isValid(date)) {
          onChange(newValue);
        }
      } catch (e) {
        // اگر تاریخ نامعتبر باشد، فقط مقدار ورودی را تغییر می‌دهیم بدون اجرای onChange
      }
    } else if (newValue === '') {
      onChange('');
    }
  };

  // رندر هدر تقویم (نام ماه و سال)
  const renderCalendarHeader = () => {
    return (
      <Box display="flex" justifyContent="space-between" alignItems="center" p={1}>
        <IconButton onClick={() => handleMonthChange(-1)} size="small">
          <NavigateNext />
        </IconButton>
        <Typography variant="subtitle1">
          {format(currentMonth, 'MMMM yyyy')}
        </Typography>
        <IconButton onClick={() => handleMonthChange(1)} size="small">
          <NavigateBefore />
        </IconButton>
      </Box>
    );
  };

  // رندر نام روزهای هفته
  const renderWeekDays = () => {
    const weekDays = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];
    return (
      <Grid container>
        {weekDays.map((day, index) => (
          <Grid item xs={1.7} key={index}>
            <Typography align="center" variant="caption">
              {day}
            </Typography>
          </Grid>
        ))}
      </Grid>
    );
  };

  // رندر روزهای ماه
  const renderDays = () => {
    const year = parseInt(format(currentMonth, 'yyyy'));
    const month = parseInt(format(currentMonth, 'MM'));
    
    // تعداد روزهای ماه
    const daysInMonth = month <= 6 ? 31 : month === 12 && !isLeapYear(year) ? 29 : 30;
    
    // شماره روز هفته برای اولین روز ماه (0 = شنبه، 6 = جمعه)
    const firstDayOfMonth = parseInt(format(setDate(currentMonth, 1), 'i')) - 1;
    
    const days = [];
    let dayCounter = 0;

    // ساخت آرایه برای روزهای ماه
    for (let i = 0; i < 6; i++) { // حداکثر 6 هفته
      const week = [];
      for (let j = 0; j < 7; j++) { // 7 روز هفته
        const dayNumber = i * 7 + j + 1 - firstDayOfMonth;
        
        if (dayNumber > 0 && dayNumber <= daysInMonth) {
          const date = parse(`${year}-${month.toString().padStart(2, '0')}-${dayNumber.toString().padStart(2, '0')}`, 'yyyy-MM-dd', new Date());
          const isCurrentDate = value === format(date, 'yyyy-MM-dd');
          
          week.push({
            date,
            day: dayNumber,
            isCurrentDate,
          });
        } else {
          week.push(null); // روز خالی
        }
        
        dayCounter++;
      }
      days.push(week);
      
      // اگر همه روزهای ماه را نمایش دادیم، از حلقه خارج شویم
      if (dayCounter >= firstDayOfMonth + daysInMonth) {
        break;
      }
    }

    return (
      <Box>
        {days.map((week, weekIndex) => (
          <Grid container key={weekIndex}>
            {week.map((day, dayIndex) => (
              <Grid item xs={1.7} key={dayIndex}>
                {day ? (
                  <Box
                    sx={{
                      p: 1,
                      m: 0.2,
                      borderRadius: 1,
                      cursor: 'pointer',
                      textAlign: 'center',
                      bgcolor: day.isCurrentDate ? 'primary.main' : 'transparent',
                      color: day.isCurrentDate ? 'primary.contrastText' : 'text.primary',
                      '&:hover': {
                        bgcolor: day.isCurrentDate ? 'primary.dark' : 'action.hover',
                      },
                    }}
                    onClick={() => handleDateSelect(day.date)}
                  >
                    {day.day}
                  </Box>
                ) : (
                  <Box sx={{ p: 1, m: 0.2 }} />
                )}
              </Grid>
            ))}
          </Grid>
        ))}
      </Box>
    );
  };

  // بررسی سال کبیسه برای محاسبه تعداد روزهای اسفند
  const isLeapYear = (year: number): boolean => {
    const remainders = [1, 5, 9, 13, 17, 22, 26, 30];
    const jY = year % 33;
    return remainders.includes(jY);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <TextField
        fullWidth={fullWidth}
        label={label}
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder || 'مثال: 1400-01-01'}
        error={error}
        helperText={helperText}
        required={required}
        disabled={disabled}
        InputProps={{
          endAdornment: (
            <IconButton onClick={handleOpenCalendar} edge="end">
              <CalendarIcon color={error ? 'error' : 'action'} />
            </IconButton>
          ),
        }}
      />
      
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleCloseCalendar}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Paper sx={{ p: 2, width: 280 }}>
          {renderCalendarHeader()}
          <Divider sx={{ my: 1 }} />
          {renderWeekDays()}
          {renderDays()}
        </Paper>
      </Popover>
    </>
  );
};

export default JalaliDatePicker; 