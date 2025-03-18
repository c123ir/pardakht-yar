// client/src/services/userService.ts
// سرویس ارتباط با API کاربران

import api from './api';
import { User } from '../types/user.types';

// دریافت لیست کاربران
const getUsers = async () => {
  try {
    const response = await api.get('/users');
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'خطا در دریافت لیست کاربران'
    );
  }
};

// دریافت اطلاعات یک کاربر
const getUserById = async (id: number) => {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'خطا در دریافت اطلاعات کاربر'
    );
  }
};

// ایجاد کاربر جدید
const createUser = async (userData: Partial<User>) => {
  try {
    const response = await api.post('/users', userData);
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'خطا در ایجاد کاربر جدید'
    );
  }
};

// به‌روزرسانی کاربر
const updateUser = async (id: number, userData: Partial<User>) => {
  try {
    const response = await api.put(`/users/${id}`, userData);
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'خطا در به‌روزرسانی کاربر'
    );
  }
};

// حذف کاربر
const deleteUser = async (id: number) => {
  try {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'خطا در حذف کاربر'
    );
  }
};

export default {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};