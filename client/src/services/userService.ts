// client/src/services/userService.ts
// سرویس ارتباط با API کاربران

import axios from '../utils/axios';
import { User, CreateUserInput, UpdateUserInput } from '../types/user';

// دریافت لیست کاربران
const getUsers = async (): Promise<User[]> => {
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
const getUserById = async (id: string): Promise<User> => {
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
const createUser = async (userData: CreateUserInput): Promise<User> => {
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
const updateUser = async (id: string, userData: UpdateUserInput): Promise<User> => {
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
const deleteUser = async (id: string): Promise<void> => {
  try {
    await axios.delete(`/users/${id}`);
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'خطا در حذف کاربر'
    );
  }
};

// آپلود آواتار
const uploadAvatar = async (formData: FormData): Promise<{ path: string }> => {
  try {
    const response = await axios.post('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'خطا در آپلود تصویر'
    );
  }
};

const userService = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  uploadAvatar,
};

export default userService;