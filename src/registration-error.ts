import { Prisma } from '@prisma/client';
import { ApiError } from './api-error';
// Scoped to this insert and the supplied schema: its sole non-PK unique
// constraint is the eventId/userId pair. No client-supplied primary key.
export function toRegistrationError(e: unknown): unknown {
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    if (e.code === 'P2002') return new ApiError(409, 'ALREADY_REGISTERED');
    if (e.code === 'P2003') return new ApiError(404, 'RELATED_RESOURCE_NOT_FOUND');
  }
  return e;
}
