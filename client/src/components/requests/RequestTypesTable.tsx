import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  CircularProgress,
  Box,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { RequestType } from '../../types/request.types';

interface RequestTypesTableProps {
  requestTypes: RequestType[];
  onEdit: (requestType: RequestType) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

export const RequestTypesTable: React.FC<RequestTypesTableProps> = ({
  requestTypes,
  onEdit,
  onDelete,
  loading = false,
}) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>نام</TableCell>
            <TableCell>توضیحات</TableCell>
            <TableCell>وضعیت</TableCell>
            <TableCell align="right">عملیات</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {requestTypes.map((requestType) => (
            <TableRow
              key={requestType.id}
              sx={{
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <TableCell>{requestType.name}</TableCell>
              <TableCell>{requestType.description}</TableCell>
              <TableCell>
                {requestType.isActive ? (
                  <CheckCircleIcon color="success" />
                ) : (
                  <CancelIcon color="error" />
                )}
              </TableCell>
              <TableCell align="right">
                <Tooltip title="ویرایش">
                  <IconButton
                    size="small"
                    onClick={() => onEdit(requestType)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="حذف">
                  <IconButton
                    size="small"
                    onClick={() => onDelete(requestType.id.toString())}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}; 