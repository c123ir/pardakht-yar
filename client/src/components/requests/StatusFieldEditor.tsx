import React from 'react';
import {
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { StatusOption } from '../../types/request.types';
import ColorPicker from './ColorPicker';

interface StatusFieldEditorProps {
  value: StatusOption[];
  onChange: (options: StatusOption[]) => void;
}

const StatusFieldEditor: React.FC<StatusFieldEditorProps> = ({ value = [], onChange }) => {
  const handleAdd = () => {
    onChange([
      ...value,
      { value: '', label: '', color: '#E3F2FD' },
    ]);
  };

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, field: keyof StatusOption, newValue: string) => {
    const newOptions = [...value];
    newOptions[index] = { ...newOptions[index], [field]: newValue };
    onChange(newOptions);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === value.length - 1)
    ) {
      return;
    }

    const newOptions = [...value];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newOptions[index], newOptions[newIndex]] = [newOptions[newIndex], newOptions[index]];
    onChange(newOptions);
  };

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="subtitle1">وضعیت‌های مجاز</Typography>
        <Button
          startIcon={<AddIcon />}
          onClick={handleAdd}
          size="small"
          variant="outlined"
        >
          افزودن وضعیت
        </Button>
      </Box>

      {value.map((option, index) => (
        <Grid container key={index} spacing={1} sx={{ mb: 1 }}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              label="مقدار"
              value={option.value}
              onChange={(e) => handleChange(index, 'value', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              label="عنوان"
              value={option.label}
              onChange={(e) => handleChange(index, 'label', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <ColorPicker
              value={option.color}
              onChange={(color) => handleChange(index, 'color', color)}
            />
          </Grid>
          <Grid item xs={12} sm={1}>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <Tooltip title="حذف">
                <IconButton
                  size="small"
                  onClick={() => handleRemove(index)}
                  color="error"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Tooltip title="انتقال به بالا">
                  <span>
                    <IconButton
                      size="small"
                      onClick={() => handleMove(index, 'up')}
                      disabled={index === 0}
                    >
                      <ArrowUpwardIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title="انتقال به پایین">
                  <span>
                    <IconButton
                      size="small"
                      onClick={() => handleMove(index, 'down')}
                      disabled={index === value.length - 1}
                    >
                      <ArrowDownwardIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
              </Box>
            </Box>
          </Grid>
        </Grid>
      ))}

      {value.length === 0 && (
        <Typography color="text.secondary" align="center">
          هیچ وضعیتی تعریف نشده است
        </Typography>
      )}
    </Paper>
  );
};

export default StatusFieldEditor; 