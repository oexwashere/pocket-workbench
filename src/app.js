import { formatJSON, transformURL, compareLines } from './tools.js';
const $ = (selector) => document.querySelector(selector);
const settings = {
  json: { title: 'JSON studio', kicker: 'MAKE STRUCTURE VISIBLE', description: 'Untangle a response, validate a payload, or pack it down.', label: 'Your JSON', run: 'Format JSON', alternate: 'Minify', example: '{"project":"a little clarity","tools":["JSON","URLs","diffs"],"private":true}' },
  url: { title: 'URL lab', kicker: 'LOST IN TRANSLATION?', description: 'Encode a query value or bring an encoded string back to life.', label: 'Your text or encoded component', run: 'Encode', alternate: 'Decode', example: 'hello world & a little curiosity ☀' },
  diff: { title: 'Text compare', kicker: 'SPOT THE LITTLE DIFFERENCES', description: 'A line-by-line view of what stayed, what left, and what arrived.', label: 'Original text', run: 'Compare text', example: 'const mood = "curious";\nconst coffee = true;\nmakeSomething();' },
};
let current = 'json'; let result = '';
const drafts = { json: '', url: '', diff: '' };
function message(text, error = false) { $('#status').textContent = text; $('#status').classList.toggle('error', error); }
function resetOutput() { result = ''; $('#output').replaceChildren(); const span = document.createElement('span'); span.className = 'empty'; span.textContent = 'A little clarity will appear here.'; $('#output').append(span); message(''); }
for (const button of document.querySelectorAll('[data-tool]')) button.addEventListener('click', () => {
  drafts[current] = $('#input').value; current = button.dataset.tool; const config = settings[current];
  for (const tab of document.querySelectorAll('[data-tool]')) { tab.classList.toggle('active', tab === button); tab.setAttribute('aria-pressed', String(tab === button)); }
  $('#tool-title').textContent = config.title; $('#tool-kicker').textContent = config.kicker; $('#description').textContent = config.description;
  $('#input-label').firstChild.textContent = config.label; $('#run').textContent = config.run + ' →';
  $('#alternate').hidden = !config.alternate; $('#alternate').textContent = config.alternate || '';
  $('#second-label').hidden = current !== 'diff'; $('#input').value = drafts[current]; $('#input').placeholder = current === 'json' ? '{"hello":"world"}' : 'Paste your text here…'; resetOutput();
});
function run(alternate = false) {
  try {
    if (current === 'diff') {
      const lines = compareLines($('#input').value, $('#second').value); $('#output').replaceChildren();
      for (const line of lines) { const element = document.createElement('span'); element.className = 'diff-line ' + line.type; element.textContent = ({ same: '  ', added: '+ ', removed: '− ' }[line.type]) + line.text + '\n'; $('#output').append(element); }
      result = lines.map(line => ({ same: '  ', added: '+ ', removed: '− ' }[line.type]) + line.text).join('\n');
      message(`${lines.filter(l => l.type === 'added').length} added · ${lines.filter(l => l.type === 'removed').length} removed`);
    } else { result = current === 'json' ? formatJSON($('#input').value, alternate) : transformURL($('#input').value, alternate); $('#output').textContent = result; message(current === 'json' ? 'Valid JSON. Looking good.' : (alternate ? 'Decoded.' : 'Encoded.')); }
  } catch (error) { result = ''; $('#output').replaceChildren(); message(error.message, true); }
}
$('#run').addEventListener('click', () => run()); $('#alternate').addEventListener('click', () => run(true));
$('#clear').addEventListener('click', () => { $('#input').value = ''; $('#second').value = ''; resetOutput(); $('#input').focus(); });
$('#example').addEventListener('click', () => { $('#input').value = settings[current].example; if (current === 'diff') $('#second').value = 'const mood = "inspired";\nconst coffee = true;\nmakeSomethingWonderful();'; run(); });
$('#copy').addEventListener('click', async () => { try { if (!result) { message('Run a tool first to create a result.'); return; } await navigator.clipboard.writeText(result); message('Copied to clipboard.'); } catch { message('Clipboard access is unavailable. Select the result and copy it manually.', true); } });
document.addEventListener('keydown', (event) => { if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') { event.preventDefault(); run(); } });
