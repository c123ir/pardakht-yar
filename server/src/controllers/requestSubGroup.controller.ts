import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const requestSubGroupController = {
  // دریافت همه زیرگروه‌های درخواست
  getAllRequestSubGroups: async (req: Request, res: Response) => {
    try {
      const requestSubGroups = await prisma.requestSubGroup.findMany({
        include: {
          group: true,
          creator: {
            select: {
              id: true,
              username: true,
              fullName: true,
            },
          },
        },
      });

      res.json({
        status: 'success',
        data: requestSubGroups,
      });
    } catch (error) {
      console.error('Error fetching request sub-groups:', error);
      res.status(500).json({
        status: 'error',
        message: 'خطا در دریافت زیرگروه‌های درخواست',
      });
    }
  },

  // دریافت زیرگروه‌های یک گروه درخواست خاص
  getRequestSubGroupsByGroupId: async (req: Request, res: Response) => {
    try {
      const { groupId } = req.params;
      
      const requestSubGroups = await prisma.requestSubGroup.findMany({
        where: {
          groupId: parseInt(groupId),
          isActive: true,
        },
        include: {
          group: true,
        },
      });

      res.json({
        status: 'success',
        data: requestSubGroups,
      });
    } catch (error) {
      console.error('Error fetching request sub-groups by group ID:', error);
      res.status(500).json({
        status: 'error',
        message: 'خطا در دریافت زیرگروه‌های درخواست',
      });
    }
  },

  // دریافت یک زیرگروه درخواست با ID
  getRequestSubGroupById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      const requestSubGroup = await prisma.requestSubGroup.findUnique({
        where: {
          id: parseInt(id)
        },
        include: {
          group: true,
          creator: {
            select: {
              id: true,
              username: true,
              fullName: true,
            },
          },
        },
      });

      if (!requestSubGroup) {
        return res.status(404).json({
          status: 'error',
          message: 'زیرگروه درخواست مورد نظر یافت نشد',
        });
      }

      res.json({
        status: 'success',
        data: requestSubGroup,
      });
    } catch (error) {
      console.error('Error fetching request sub-group by ID:', error);
      res.status(500).json({
        status: 'error',
        message: 'خطا در دریافت زیرگروه درخواست',
      });
    }
  },

  // ایجاد زیرگروه درخواست جدید
  createRequestSubGroup: async (req: Request, res: Response) => {
    try {
      const { name, description, groupId, isActive = true } = req.body;
      const userId = (req as any).user?.id;

      if (!userId) {
        return res.status(401).json({
          status: 'error',
          message: 'احراز هویت انجام نشده است',
        });
      }

      const requestSubGroup = await prisma.requestSubGroup.create({
        data: {
          name,
          description,
          isActive,
          group: {
            connect: { id: parseInt(groupId) },
          },
          creator: {
            connect: { id: userId },
          },
        },
        include: {
          group: true,
        },
      });

      res.status(201).json({
        status: 'success',
        data: requestSubGroup,
      });
    } catch (error) {
      console.error('Error creating request sub-group:', error);
      res.status(500).json({
        status: 'error',
        message: 'خطا در ایجاد زیرگروه درخواست',
      });
    }
  },

  // به‌روزرسانی زیرگروه درخواست
  updateRequestSubGroup: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { name, description, groupId, isActive } = req.body;

      const requestSubGroup = await prisma.requestSubGroup.update({
        where: { id: parseInt(id) },
        data: {
          name,
          description,
          isActive,
          ...(groupId && {
            group: {
              connect: { id: parseInt(groupId) },
            },
          }),
        },
        include: {
          group: true,
        },
      });

      res.json({
        status: 'success',
        data: requestSubGroup,
      });
    } catch (error) {
      console.error('Error updating request sub-group:', error);
      res.status(500).json({
        status: 'error',
        message: 'خطا در به‌روزرسانی زیرگروه درخواست',
      });
    }
  },

  // حذف زیرگروه درخواست
  deleteRequestSubGroup: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      await prisma.requestSubGroup.delete({
        where: { id: parseInt(id) },
      });

      res.json({
        status: 'success',
        message: 'زیرگروه درخواست با موفقیت حذف شد',
      });
    } catch (error) {
      console.error('Error deleting request sub-group:', error);
      res.status(500).json({
        status: 'error',
        message: 'خطا در حذف زیرگروه درخواست',
      });
    }
  },
}; 