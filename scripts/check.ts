import assert from 'node:assert/strict';
import { app } from '../src/app';
import { prisma } from '../src/db';
import { once } from 'node:events';
async function main() {
  // Own temporary fixtures; never clears the whole table or seed pair.
  const user = await prisma.user.create({data:{name:'PR09 check '+Date.now()}});
  const event = await prisma.event.create({data:{title:'PR09 check '+Date.now()}});
  const server = app.listen(0,'127.0.0.1');
  await once(server,'listening');
  const address = server.address(); if(!address || typeof address === 'string') throw new Error('No port');
  const base = `http://127.0.0.1:${address.port}`;
  async function post(e:number,u:unknown,status:number,code?:string) {
    const r=await fetch(`${base}/events/${e}/registrations`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({userId:u})});
    const body=await r.json(); console.log(r.status,JSON.stringify(body));
    assert.equal(r.status,status); if(code) assert.equal(body.code,code);
    return body;
  }
  try {
    const row=await post(event.id,user.id,201); assert.equal(row.eventId,event.id);assert.equal(row.userId,user.id);
    await post(event.id,user.id,409,'ALREADY_REGISTERED');
    await post(2147483647,user.id,404,'RELATED_RESOURCE_NOT_FOUND');
    await post(event.id,2147483647,404,'RELATED_RESOURCE_NOT_FOUND');
    await post(event.id,String(user.id),400,'INVALID_INPUT');
    assert.equal(await prisma.registration.count({where:{eventId:event.id,userId:user.id}}),1);
    console.log('PASS: 201 / 409 / 404 / 404 / 400; one persisted row');
  } finally {
    await new Promise<void>((resolve,reject)=>server.close(e=>e?reject(e):resolve()));
    await prisma.registration.deleteMany({where:{eventId:event.id}});
    await prisma.event.delete({where:{id:event.id}});await prisma.user.delete({where:{id:user.id}});
  }
}
main().catch(e=>{console.error(e);process.exitCode=1;}).finally(()=>prisma.$disconnect());
