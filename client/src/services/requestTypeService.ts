// client/src/services/requestTypeService.ts
// سرویس مدیریت انواع درخواست

import axios from '../utils/axios';
import { CreateRequestTypeDto, UpdateRequestTypeDto, ApiResponse, PaginatedResponse } from '../types/request.types';

const API_URL = '/api/request-types';

const requestTypeService = {
  // دریافت همه انواع درخواست
  getAllRequestTypes: async (activeOnly: boolean = false): Promise<ApiResponse<any[]>> => {
    try {
      let url = `${API_URL}`;
      if (activeOnly) {
        url += '/active';
      }
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('خطا در دریافت انواع درخواست:', error);
      throw error;
    }
  },

  // دریافت انواع درخواست با صفحه‌بندی
  getRequestTypes: async (page: number = 1, limit: number = 10, search: string = ''): Promise<PaginatedResponse<any[]>> => {
    try {
      let url = `${API_URL}?page=${page}&limit=${limit}`;
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('خطا در دریافت انواع درخواست:', error);
      throw error;
    }
  },

  // دریافت یک نوع درخواست با شناسه
  getRequestTypeById: async (id: number): Promise<ApiResponse<any>> => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`خطا در دریافت نوع درخواست با شناسه ${id}:`, error);
      throw error;
    }
  },

  // ایجاد نوع درخواست جدید
  createRequestType: async (data: CreateRequestTypeDto): Promise<ApiResponse<any>> => {
    try {
      const response = await axios.post(API_URL, data);
      return response.data;
    } catch (error) {
      console.error('خطا در ایجاد نوع درخواست:', error);
      throw error;
    }
  },

  // بروزرسانی نوع درخواست
  updateRequestType: async (id: number, data: UpdateRequestTypeDto): Promise<ApiResponse<any>> => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`خطا در بروزرسانی نوع درخواست با شناسه ${id}:`, error);
      throw error;
    }
  },

  // حذف نوع درخواست
  deleteRequestType: async (id: number): Promise<ApiResponse<null>> => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`خطا در حذف نوع درخواست با شناسه ${id}:`, error);
      throw error;
    }
  },

  // تغییر وضعیت فعال/غیرفعال نوع درخواست
  toggleRequestTypeStatus: async (id: number, isActive: boolean): Promise<ApiResponse<any>> => {
    try {
      const response = await axios.patch(`${API_URL}/${id}/status`, { isActive });
      return response.data;
    } catch (error) {
      console.error(`خطا در تغییر وضعیت نوع درخواست با شناسه ${id}:`, error);
      throw error;
    }
  }
};

export default requestTypeService; 