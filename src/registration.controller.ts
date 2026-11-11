import type { RequestHandler } from 'express';
import { parseRegistrationInput } from './parse-registration';
import { createRegistration } from './registration.repository';
import { toRegistrationError } from './registration-error';
export const register: RequestHandler = async (req, res, next) => {
  try {
    const { eventId, userId } = parseRegistrationInput(req.params.eventId, req.body);
    const row = await createRegistration(eventId, userId);
    res.status(201).json(row);
  } catch (e) {
    next(toRegistrationError(e));
  }
};
