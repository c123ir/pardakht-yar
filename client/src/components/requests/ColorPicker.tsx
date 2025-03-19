import React from 'react';
import {
  Box,
  Grid,
  IconButton,
  Paper,
  Popover,
  Tooltip,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import CheckIcon from '@mui/icons-material/Check';
import ColorLensIcon from '@mui/icons-material/ColorLens';

// رنگ‌های پاستلی
const PASTEL_COLORS = [
  // آبی‌ها
  '#E3F2FD', '#BBDEFB', '#90CAF9', '#64B5F6', '#42A5F5',
  // سبزها
  '#E8F5E9', '#C8E6C9', '#A5D6A7', '#81C784', '#66BB6A',
  // قرمزها
  '#FFEBEE', '#FFCDD2', '#EF9A9A', '#E57373', '#EF5350',
  // نارنجی‌ها
  '#FFF3E0', '#FFE0B2', '#FFCC80', '#FFB74D', '#FFA726',
  // بنفش‌ها
  '#F3E5F5', '#E1BEE7', '#CE93D8', '#BA68C8', '#AB47BC',
  // خاکستری‌ها
  '#FAFAFA', '#F5F5F5', '#EEEEEE', '#E0E0E0', '#BDBDBD',
  // قهوه‌ای‌ها
  '#EFEBE9', '#D7CCC8', '#BCAAA4', '#A1887F', '#8D6E63',
  // فیروزه‌ای‌ها
  '#E0F7FA', '#B2EBF2', '#80DEEA', '#4DD0E1', '#26C6DA',
];

interface ColorPickerProps {
  value?: string;
  onChange: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ value, onChange }) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (color: string) => {
    onChange(color);
    handleClose();
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          p: 1,
          width: '100%',
          justifyContent: 'flex-start',
        }}
      >
        {value ? (
          <Box
            sx={{
              width: 24,
              height: 24,
              borderRadius: 1,
              backgroundColor: value,
              border: '1px solid',
              borderColor: 'divider',
            }}
          />
        ) : (
          <ColorLensIcon />
        )}
        <Typography sx={{ mr: 1, flexGrow: 1, textAlign: 'right' }}>
          {value ? 'رنگ انتخاب شده' : 'انتخاب رنگ'}
        </Typography>
      </IconButton>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Paper sx={{ p: 2, maxWidth: 280 }}>
          <Grid container spacing={1}>
            {PASTEL_COLORS.map((color) => (
              <Grid item key={color}>
                <Tooltip title={color}>
                  <IconButton
                    onClick={() => handleSelect(color)}
                    sx={{
                      width: 32,
                      height: 32,
                      backgroundColor: color,
                      border: '1px solid',
                      borderColor: value === color ? 'primary.main' : 'divider',
                      '&:hover': {
                        backgroundColor: alpha(color, 0.9),
                      },
                    }}
                  >
                    {value === color && <CheckIcon fontSize="small" />}
                  </IconButton>
                </Tooltip>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Popover>
    </>
  );
};

export default ColorPicker; 