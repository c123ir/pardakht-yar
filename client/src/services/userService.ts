// client/src/services/userService.ts
// سرویس ارتباط با API کاربران

import axios from '../utils/axios';
import { User, CreateUserInput, UpdateUserInput } from '../types/user';
import api from '../utils/api';

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
const updateUser = async (id: string | number, userData: UpdateUserInput): Promise<User> => {
  try {
    const response = await axios.put(`/users/${id.toString()}`, userData);
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'خطا در به‌روزرسانی کاربر'
    );
  }
};

// حذف کاربر
const deleteUser = async (id: string | number): Promise<void> => {
  try {
    await axios.delete(`/users/${id.toString()}`);
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'خطا در حذف کاربر'
    );
  }
};

// آپلود آواتار کاربر
const uploadAvatar = async (formData: FormData, userId?: string): Promise<any> => {
  try {
    // اگر userId داریم، آن را هم اضافه می‌کنیم
    if (userId) {
      formData.append('userId', userId.toString());
      console.log('Added userId to FormData:', userId);
    }
    
    // برای اطمینان، محتوای FormData را بررسی می‌کنیم
    for (const pair of formData.entries()) {
      console.log('FormData entry:', pair[0], pair[1]);
    }
    
    // ارسال درخواست
    const response = await api.post('/users/upload-avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log('Avatar upload response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error uploading avatar:', error);
    throw error;
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