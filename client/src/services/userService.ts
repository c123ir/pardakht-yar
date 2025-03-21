// client/src/services/userService.ts
// سرویس ارتباط با API کاربران

import axios from '../utils/axios';
import { User } from '../types/user.types';

// دریافت لیست کاربران
const getUsers = async () => {
  try {
    const response = await axios.get('/users');
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
    const response = await axios.get(`/users/${id}`);
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
    const response = await axios.post('/users', userData);
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
    const response = await axios.put(`/users/${id}`, userData);
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
    const response = await axios.delete(`/users/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'خطا در حذف کاربر'
    );
  }
};

// آپلود آواتار کاربر
const uploadAvatar = async (formData: FormData) => {
  try {
    const response = await axios.post('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    if (response.data.status !== 'success') {
      throw new Error(response.data.message || 'خطا در آپلود تصویر پروفایل');
    }
    
    return response.data.data;
  } catch (error: any) {
    console.error('Avatar upload error:', error);
    throw new Error(
      error.response?.data?.message || 'خطا در آپلود تصویر پروفایل'
    );
  }
};

export default {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  uploadAvatar,
};