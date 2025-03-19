// server/src/types/group.types.ts
// تایپ‌های مربوط به گروه‌های پرداخت

import { User } from './user.types';

export interface PaymentGroup {
  id: number;
  title: string;
  description?: string;
  color?: string;
  creatorId: number;
  createdAt: string;
  updatedAt: string;
  createdBy?: User;
  members?: GroupMember[];
}

export interface GroupMember {
  id: number;
  groupId: number;
  userId: number;
  createdAt: string;
  user?: User;
}

export interface CreateGroupDto {
  title: string;
  description?: string;
  color?: string;
  members?: number[];
}

export interface UpdateGroupDto {
  title?: string;
  description?: string;
  color?: string;
}

export interface GroupFilter {
  creatorId?: number;
  search?: string;
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
} 