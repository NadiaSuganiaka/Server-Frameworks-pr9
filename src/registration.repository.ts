import type { Registration } from '@prisma/client';
import { prisma } from './db';
export async function createRegistration(eventId: number, userId: number): Promise<Registration> {
  return prisma.registration.create({
    data: { eventId, userId },
    select: { id: true, eventId: true, userId: true },
  });
}
