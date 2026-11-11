import { app } from './app';
import { prisma } from './db';
const port = Number(process.env.PORT ?? 3001);
const server = app.listen(port,'127.0.0.1',()=>console.log(`CampusHub: http://localhost:${port}`));
process.on('SIGINT',()=>server.close(()=>{void prisma.$disconnect().then(()=>process.exit(0));}));
