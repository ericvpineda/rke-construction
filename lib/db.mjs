import { PrismaClient } from '@prisma/client'

let prisma;

if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient()
} else if (!global.cachedPrisma) {
    global.cachedPrisma = new PrismaClient()
} else {
    prisma = global.cachedPrisma
}

export const db = prisma; 
