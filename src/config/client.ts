import { PrismaClient } from '@prisma/client'
import 'dotenv/config';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
    globalForPrisma.prisma || new PrismaClient({
        log:
            process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],//{log: ['query', 'info', 'warn', 'error']} cho phép ta có thể xem được cách thư viện Prisma chạy code SQL như thế nào ở dưới phần terminal
    })//{log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],} cho phép khi product chỉ hiển thị phần error chứ không hiển thị tất cả như trong develop

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
