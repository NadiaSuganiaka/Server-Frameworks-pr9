import express, { ErrorRequestHandler } from 'express';
import { prisma } from './db';
import { register } from './registration.controller';
import { ApiError } from './api-error';
export const app = express();
app.use(express.json());
app.get('/health', (_req,res) => { res.json({status:'ok'}); });
app.get('/users', async (_req,res,next) => {
  try { res.json(await prisma.user.findMany({orderBy:{id:'asc'}})); } catch(e) {next(e);}
});
app.get('/events', async (_req,res,next) => {
  try { res.json(await prisma.event.findMany({orderBy:{id:'asc'}})); } catch(e) {next(e);}
});
app.post('/events/:eventId/registrations', register);
app.use((_req,_res,next) => next(new ApiError(404,'ROUTE_NOT_FOUND')));
const errorHandler: ErrorRequestHandler = (err,_req,res,next) => {
  if(res.headersSent) { next(err); return; }
  if(err instanceof ApiError) { res.status(err.status).json({code:err.code}); return; }
  if(err instanceof SyntaxError && 'status' in err && err.status === 400) {
    res.status(400).json({code:'INVALID_JSON'}); return;
  }
  // Навчальний журнал без req.body, токенів, URL підключення або stack trace.
  console.error('Unexpected registration failure');
  res.status(500).json({code:'INTERNAL_ERROR'});
};
app.use(errorHandler);
