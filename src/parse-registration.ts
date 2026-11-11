import { ApiError } from './api-error';
export function parseRegistrationInput(eventParam: string, body: unknown) {
  const userId = body && typeof body === 'object' && !Array.isArray(body)
    ? (body as Record<string, unknown>).userId : undefined;
  const eventId = Number(eventParam);
  if (!/^[1-9]\d*$/.test(eventParam) || !Number.isSafeInteger(eventId) ||
      typeof userId !== 'number' || !Number.isSafeInteger(userId) || userId <= 0) {
    throw new ApiError(400, 'INVALID_INPUT');
  }
  return { eventId, userId };
}
