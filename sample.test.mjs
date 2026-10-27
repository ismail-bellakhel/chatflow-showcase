import test from 'node:test';
import assert from 'node:assert/strict';
import {routeMessage,extractEmail} from './sample.mjs';
const faqs=[{keywords:['install','embed'],answer:'Illustrative setup answer',category:'setup'}];
test('email recognition takes precedence over matching FAQ',()=>{
 assert.equal(extractEmail('Use preview@example.com'),'preview@example.com');
 const result=routeMessage('install preview@example.com',faqs);
 assert.equal(result.action,'email_captured');assert.ok(!JSON.stringify(result).includes('preview@example.com'));
});
test('human handoff takes precedence over FAQ',()=>assert.equal(routeMessage('I want an agent to install this',faqs).action,'capture_lead'));
test('matching FAQ is returned with its category',()=>{
 const result=routeMessage('How do I INSTALL it?',faqs);assert.equal(result.action,'answered');assert.equal(result.category,'setup');
});
test('unmatched messages fall back to handoff',()=>assert.equal(routeMessage('Something unrelated',faqs).action,'capture_lead'));
test('visitor text is not echoed into fallback messages',()=>assert.ok(!routeMessage('<img src=x onerror=alert(1)>',faqs).response.includes('<img')));
