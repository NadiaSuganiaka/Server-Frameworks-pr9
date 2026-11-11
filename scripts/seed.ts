import { prisma } from '../src/db';
async function main() {
  await prisma.user.upsert({where:{id:2},create:{id:2,name:'Student Demo'},update:{}});
  await prisma.user.upsert({where:{id:3},create:{id:3,name:'Another Student'},update:{}});
  await prisma.event.upsert({where:{id:1},create:{id:1,title:'Web API workshop'},update:{}});
  await prisma.event.upsert({where:{id:2},create:{id:2,title:'TypeScript workshop'},update:{}});
  await prisma.$queryRaw`SELECT setval(pg_get_serial_sequence('"User"','id'), COALESCE((SELECT MAX(id) FROM "User"),1))`;
  await prisma.$queryRaw`SELECT setval(pg_get_serial_sequence('"Event"','id'), COALESCE((SELECT MAX(id) FROM "Event"),1))`;
  // Не видаляє студентські роботи або наявні реєстрації.
  console.log('Fixtures ready: users 2,3; events 1,2. Existing registrations preserved.');
}
main().catch(e=>{console.error(e);process.exitCode=1;}).finally(()=>prisma.$disconnect());
