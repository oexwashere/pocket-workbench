export function formatJSON(value, compact = false) {
  if (!value.trim()) throw new Error('Paste some JSON to get started.');
  return JSON.stringify(JSON.parse(value), null, compact ? 0 : 2);
}
export function transformURL(value, decode = false) {
  try { return decode ? decodeURIComponent(value) : encodeURIComponent(value); }
  catch { throw new Error('This text contains an invalid URL encoding or Unicode sequence.'); }
}
// Myers-style line comparison is unnecessary for small pasted snippets. LCS gives
// predictable edits; cap its matrix to keep large inputs from locking the tab.
export function compareLines(before, after) {
  const a = before === '' ? [] : before.split('\n');
  const b = after === '' ? [] : after.split('\n');
  if ((a.length + 1) * (b.length + 1) > 1_000_000) throw new Error('Please compare smaller snippets (about 1,000 lines per side).');
  const table = Array.from({ length: a.length + 1 }, () => new Uint32Array(b.length + 1));
  for (let i = a.length - 1; i >= 0; i--) for (let j = b.length - 1; j >= 0; j--) {
    table[i][j] = a[i] === b[j] ? 1 + table[i + 1][j + 1] : Math.max(table[i + 1][j], table[i][j + 1]);
  }
  const result = []; let i = 0; let j = 0;
  while (i < a.length || j < b.length) {
    if (i < a.length && j < b.length && a[i] === b[j]) { result.push({ type: 'same', text: a[i++] }); j++; }
    else if (i < a.length && (j === b.length || table[i + 1][j] >= table[i][j + 1])) result.push({ type: 'removed', text: a[i++] });
    else result.push({ type: 'added', text: b[j++] });
  }
  return result;
}
