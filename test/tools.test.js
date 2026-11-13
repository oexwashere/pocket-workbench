import test from 'node:test';
import assert from 'node:assert/strict';
import { formatJSON, transformURL, compareLines } from '../src/tools.js';
test('JSON formatting preserves structure and supports minification', () => {
  const input = '{"x":[1,null,"☀"],"ok":false}';
  assert.deepEqual(JSON.parse(formatJSON(input)), JSON.parse(input));
  assert.equal(formatJSON(input, true), input);
  assert.equal(formatJSON('null'), 'null');
  assert.throws(() => formatJSON(''), /Paste/);
  assert.throws(() => formatJSON('{bad}'), SyntaxError);
});
test('URL components round trip Unicode, reserved characters and spaces', () => {
  const input = '☀ /?x=hello world&y=1+2';
  assert.equal(transformURL(transformURL(input), true), input);
  assert.equal(transformURL('+', true), '+');
  assert.throws(() => transformURL('%Q0', true), /invalid/);
});
test('diff handles insertions, removals and repeated lines', () => {
  assert.deepEqual(compareLines('a\nb\nc', 'a\nx\nc'), [{type:'same',text:'a'},{type:'removed',text:'b'},{type:'added',text:'x'},{type:'same',text:'c'}]);
  assert.deepEqual(compareLines('', ''), []);
  assert.deepEqual(compareLines('', 'a'), [{type:'added',text:'a'}]);
  assert.deepEqual(compareLines('a', ''), [{type:'removed',text:'a'}]);
  const before = 'a\nb\na\n'; const after = 'b\na\nz';
  const diff = compareLines(before, after);
  assert.equal(diff.filter(l => l.type !== 'added').map(l=>l.text).join('\n'), before);
  assert.equal(diff.filter(l => l.type !== 'removed').map(l=>l.text).join('\n'), after);
});
test('diff refuses inputs that exceed its memory budget', () => assert.throws(() => compareLines('a\n'.repeat(1100), 'b\n'.repeat(1100)), /smaller/));
