import assert from 'node:assert/strict';
import { getDashboardStats } from '../src/controllers/dashboard.controller.js';
import { prisma } from '../src/lib/prisma.js';
try {
 await getDashboardStats({} as any, {json: (result:any) => {
  const d=result.data;
  assert.equal(d.activity.length,30);
  assert.equal(d.overview.totalServices,d.services.byCategory.reduce((n:number,c:any)=>n+c.count,0));
  assert(d.activity.every((day:any)=>day.services>=0&&day.articles>=0));
  console.log('PASS: 30 daily graph points, nonnegative counts, category distribution reconciles with database total.');
 }} as any, error=>{throw error});
} finally { await prisma.$disconnect(); }
