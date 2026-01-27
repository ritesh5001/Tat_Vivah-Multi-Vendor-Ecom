import { prisma } from '../config/db.js';
import { Notification, NotificationEvent, NotificationStatus } from '@prisma/client';
import { CreateNotificationInput } from './types.js';

export class NotificationRepository {
    async create(data: CreateNotificationInput): Promise<Notification> {
        return prisma.notification.create({
            data: {
                userId: data.userId,
                role: data.role,
                type: data.type,
                channel: data.channel,
                status: NotificationStatus.PENDING,
                subject: data.subject,
                content: data.content,
                metadata: data.metadata || {}
            }
        });
    }

    async findById(id: string): Promise<Notification | null> {
        return prisma.notification.findUnique({ where: { id } });
    }

    async updateStatus(id: string, status: NotificationStatus, sentAt?: Date): Promise<Notification> {
        return prisma.notification.update({
            where: { id },
            data: { status, sentAt }
        });
    }

    async createEvent(notificationId: string, provider: string, status: NotificationStatus, providerMessageId?: string, error?: string): Promise<NotificationEvent> {
        return prisma.notificationEvent.create({
            data: {
                notificationId,
                provider,
                status,
                providerMessageId,
                error
            }
        });
    }

    async findAll(page: number = 1, limit: number = 20): Promise<{ notifications: Notification[], total: number }> {
        const [notifications, total] = await Promise.all([
            prisma.notification.findMany({
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit
            }),
            prisma.notification.count()
        ]);
        return { notifications, total };
    }
}

export const notificationRepository = new NotificationRepository();
