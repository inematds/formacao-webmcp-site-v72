// validar-catalogo.mjs — revisão estática do catálogo (sem navegador, sem executar nada).
// Uso: node scripts/validar-catalogo.mjs [módulo que exporta catalogo(agenda, ui)]   (padrão: pagina/ferramentas.mjs)
// Regras da spec (16/10/2026): nome 1–128 caracteres ASCII, _ - . ; descrição não vazia; nomes únicos.
// Regras do curso: schema "object" fechado e descrito; anotações conhecidas e coerentes; ação com efeito marcada.
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
const arq = resolve(process.argv[2] || new URL('../pagina/ferramentas.mjs', import.meta.url).pathname);
const { catalogo } = await import(pathToFileURL(arq).href);
const defs = catalogo({}, {});
const ANOT = ['readOnlyHint', 'untrustedContentHint', 'consequentialHint', 'debugging'];
const EFEITO = /^(reservar|enviar|apagar|deletar|excluir|comprar|pagar|cancelar|publicar|alterar|criar)/;
let erros = 0, avisos = 0;
const vistos = new Set();
for (const d of defs) {
  const e = [], a = [];
  if (!/^[A-Za-z0-9_.-]{1,128}$/.test(d.name || '')) e.push('nome fora da regra (1–128: letras, números, _ - .)');
  if (vistos.has(d.name)) e.push('nome repetido'); vistos.add(d.name);
  if (!d.description || !d.description.trim()) e.push('descrição vazia');
  else if (d.description.trim().length < 30) a.push('descrição curta: diga o que faz, o que NÃO faz e quando usar');
  if (typeof d.execute !== 'function') e.push('sem execute');
  const s = d.inputSchema;
  if (!s) a.push('sem inputSchema');
  else {
    if (s.type !== 'object') e.push('inputSchema.type tem de ser "object"');
    if (s.additionalProperties !== false) a.push('inputSchema aceita campo extra (use additionalProperties: false)');
    for (const [k, p] of Object.entries(s.properties || {})) if (!p.description) a.push(`campo "${k}" sem description`);
  }
  const an = d.annotations || {};
  for (const [k, v] of Object.entries(an)) {
    if (!ANOT.includes(k)) e.push(`anotação desconhecida: ${k}`);
    else if (typeof v !== 'boolean') e.push(`anotação ${k} não é true/false`);
  }
  if (an.readOnlyHint && an.consequentialHint) e.push('readOnlyHint e consequentialHint juntos (contradição)');
  if (EFEITO.test(d.name || '') && !an.consequentialHint) e.push('nome de ação com efeito sem consequentialHint');
  if (!an.readOnlyHint && !an.consequentialHint) a.push('diga se só lê (readOnlyHint) ou se tem consequência (consequentialHint)');
  erros += e.length; avisos += a.length;
  console.log(`${e.length ? 'ERRO ' : a.length ? 'AVISO' : 'OK   '} ${d.name}`);
  for (const x of e) console.log(`      erro: ${x}`);
  for (const x of a) console.log(`      aviso: ${x}`);
}
console.log(`CATÁLOGO: ${defs.length} ferramentas · ${erros} erros · ${avisos} avisos`);
process.exit(erros ? 1 : 0);
