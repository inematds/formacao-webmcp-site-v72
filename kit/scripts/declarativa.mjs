// declarativa.mjs — formulário como ferramenta (toolname/tooldescription/toolautosubmit).
// EXPERIMENTAL, FORA DA SPEC de 16/10/2026: existe no Chrome (origin trial/flag) e na camada temporária do polyfill.
// Uso: node scripts/declarativa.mjs [polyfill|nativo]
import { abrir, modoDoArgumento } from '../lib/navegador.mjs';
const modo = modoDoArgumento();
const n = await abrir(modo, { pagina: 'declarativa.html' });
console.log(`== ${n.versao}`);
const lista = await n.page.evaluate(async () => document.modelContext
  ? (await document.modelContext.getTools()).map(t => ({ name: t.name, campos: Object.keys(t.inputSchema ? (typeof t.inputSchema === 'string' ? JSON.parse(t.inputSchema) : t.inputSchema).properties || {} : {}) }))
  : null);
if (!lista) { console.log('sem document.modelContext: são só formulários comuns'); await n.fechar(); process.exit(0); }
for (const t of lista) console.log(`ferramenta do formulário: ${t.name} · campos: ${t.campos.join(', ')}`);
const exec = (nome, input) => n.page.evaluate(async ([nome, input]) => {
  const t = (await document.modelContext.getTools()).find(x => x.name === nome);
  try { return await document.modelContext.executeTool(t, input); } catch (e) { return `ERRO ${e.name}`; }
}, [nome, input]);
console.log(`buscar_oficinas_form (toolautosubmit): ${await exec('buscar_oficinas_form', { tema: 'webmcp' })}`);
const pendente = exec('reservar_vaga_form', { id: 'of-301', nome: 'Rita' });
await n.page.waitForFunction(() => document.querySelector('#d-nome').value === 'Rita', null, { timeout: 5000 }).catch(() => {});
console.log(`reservar_vaga_form preencheu: id=${await n.page.inputValue('#d-id')} nome=${await n.page.inputValue('#d-nome')} · enviado? ${(await n.page.textContent('#d-reserva')) ? 'sim' : 'não, esperando a pessoa'}`);
await n.page.click('#f-reserva button[type=submit]');
console.log(`pessoa clicou em Reservar → ${await pendente}`);
await n.fechar();
process.exit(n.erros.length ? 1 : 0);
