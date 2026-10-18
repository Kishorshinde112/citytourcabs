import test from 'node:test';
import assert from 'node:assert/strict';
import {validateBooking, BookingValidationError} from '../src/lib/bookingValidation.mjs';
import {allowRequest} from '../src/lib/rateLimit.mjs';
const now = new Date('2026-10-14T06:00:00.000Z');
const base = {name:'Test Customer',phone:'+91 9876543210',date:'2026-10-20',route:'Mumbai Darshan'};

test('Valid booking normalizes fields and enforces pending',()=>{
  const result=validateBooking({...base,status:'Confirmed',id:'IMPERSONATED'},now);
  assert.equal(result.status,'Pending');
  assert.equal(result.route,'Mumbai Darshan');
  assert.equal(result.id,undefined);
});
test('Reject invalid dates, phones, and oversized names',()=>{
  for(const input of [
    {...base,date:'2026-02-30'}, {...base,date:'2026-10-01'},
    {...base,phone:'abc'}, {...base,name:'x'.repeat(101)},
  ]) assert.throws(()=>validateBooking(input,now),BookingValidationError);
});
test('IP limiter caps submissions per window',()=>{
  assert.equal(allowRequest('test-ip',{limit:2,windowMs:1000,now:0}),true);
  assert.equal(allowRequest('test-ip',{limit:2,windowMs:1000,now:0}),true);
  assert.equal(allowRequest('test-ip',{limit:2,windowMs:1000,now:0}),false);
  assert.equal(allowRequest('test-ip',{limit:2,windowMs:1000,now:1001}),true);
});
