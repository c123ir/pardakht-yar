// client/src/services/requestGroupService.ts
// سرویس مدیریت گروه‌های درخواست

import axios from '../utils/axios';
import { RequestGroup, ApiResponse, PaginatedResponse } from '../types/request.types';

const API_URL = '/request-groups';

const requestGroupService = {
  // دریافت لیست گروه‌های درخواست
  getGroups: async (page = 1, limit = 10, requestTypeId?: number): Promise<PaginatedResponse<RequestGroup[]>> => {
    try {
      let url = `${API_URL}?page=${page}&limit=${limit}`;
      if (requestTypeId) {
        url += `&requestTypeId=${requestTypeId}`;
      }
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('خطا در دریافت گروه‌های درخواست:', error);
      throw error;
    }
  },

  // دریافت گروه‌های یک نوع درخواست
  getGroupsByRequestType: async (requestTypeId: number, page = 1, limit = 10): Promise<PaginatedResponse<RequestGroup[]>> => {
    try {
      const response = await axios.get(`${API_URL}?requestTypeId=${requestTypeId}&page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error(`خطا در دریافت گروه‌های درخواست برای نوع درخواست ${requestTypeId}:`, error);
      throw error;
    }
  },

  // دریافت یک گروه درخواست با شناسه
  getGroupById: async (id: number): Promise<ApiResponse<RequestGroup>> => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`خطا در دریافت گروه درخواست با شناسه ${id}:`, error);
      throw error;
    }
  },

  // ایجاد گروه درخواست جدید
  createGroup: async (data: Partial<RequestGroup>): Promise<ApiResponse<RequestGroup>> => {
    try {
      const response = await axios.post(API_URL, data);
      return response.data;
    } catch (error) {
      console.error('خطا در ایجاد گروه درخواست:', error);
      throw error;
    }
  },

  // بروزرسانی گروه درخواست
  updateGroup: async (id: number, data: Partial<RequestGroup>): Promise<ApiResponse<RequestGroup>> => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`خطا در بروزرسانی گروه درخواست با شناسه ${id}:`, error);
      throw error;
    }
  },

  // حذف گروه درخواست
  deleteGroup: async (id: number): Promise<ApiResponse<null>> => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`خطا در حذف گروه درخواست با شناسه ${id}:`, error);
      throw error;
    }
  },

  // تغییر وضعیت فعال/غیرفعال گروه درخواست
  toggleGroupStatus: async (id: number, isActive: boolean): Promise<ApiResponse<RequestGroup>> => {
    try {
      const response = await axios.patch(`${API_URL}/${id}/status`, { isActive });
      return response.data;
    } catch (error) {
      console.error(`خطا در تغییر وضعیت گروه درخواست با شناسه ${id}:`, error);
      throw error;
    }
  },

  // دریافت تمام گروه‌های فعال
  getAllActiveGroups: async (): Promise<ApiResponse<RequestGroup[]>> => {
    try {
      const response = await axios.get(`${API_URL}/active`);
      return response.data;
    } catch (error) {
      console.error('خطا در دریافت گروه‌های فعال:', error);
      throw error;
    }
  }
};

export default requestGroupService; 