// client/src/services/requestSubGroupService.ts
// سرویس مدیریت زیرگروه‌های درخواست

import axios from '../utils/axios';
import { RequestSubGroup, ApiResponse, PaginatedResponse } from '../types/request.types';

const API_URL = '/api/request-subgroups';

const requestSubGroupService = {
  // دریافت زیرگروه‌های یک گروه درخواست
  getSubGroupsByGroup: async (groupId: number, page = 1, limit = 10): Promise<PaginatedResponse<RequestSubGroup[]>> => {
    try {
      const response = await axios.get(`${API_URL}?groupId=${groupId}&page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error(`خطا در دریافت زیرگروه‌های درخواست برای گروه ${groupId}:`, error);
      throw error;
    }
  },

  // دریافت یک زیرگروه درخواست با شناسه
  getSubGroupById: async (id: number): Promise<ApiResponse<RequestSubGroup>> => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`خطا در دریافت زیرگروه درخواست با شناسه ${id}:`, error);
      throw error;
    }
  },

  // ایجاد زیرگروه درخواست جدید
  createSubGroup: async (data: Partial<RequestSubGroup>): Promise<ApiResponse<RequestSubGroup>> => {
    try {
      const response = await axios.post(API_URL, data);
      return response.data;
    } catch (error) {
      console.error('خطا در ایجاد زیرگروه درخواست:', error);
      throw error;
    }
  },

  // بروزرسانی زیرگروه درخواست
  updateSubGroup: async (id: number, data: Partial<RequestSubGroup>): Promise<ApiResponse<RequestSubGroup>> => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`خطا در بروزرسانی زیرگروه درخواست با شناسه ${id}:`, error);
      throw error;
    }
  },

  // حذف زیرگروه درخواست
  deleteSubGroup: async (id: number): Promise<ApiResponse<null>> => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`خطا در حذف زیرگروه درخواست با شناسه ${id}:`, error);
      throw error;
    }
  },

  // تغییر وضعیت فعال/غیرفعال زیرگروه درخواست
  toggleSubGroupStatus: async (id: number, isActive: boolean): Promise<ApiResponse<RequestSubGroup>> => {
    try {
      const response = await axios.patch(`${API_URL}/${id}/status`, { isActive });
      return response.data;
    } catch (error) {
      console.error(`خطا در تغییر وضعیت زیرگروه درخواست با شناسه ${id}:`, error);
      throw error;
    }
  },

  // دریافت تمام زیرگروه‌های فعال
  getAllActiveSubGroups: async (): Promise<ApiResponse<RequestSubGroup[]>> => {
    try {
      const response = await axios.get(`${API_URL}/active`);
      return response.data;
    } catch (error) {
      console.error('خطا در دریافت زیرگروه‌های فعال:', error);
      throw error;
    }
  }
};

export default requestSubGroupService; 