// ciclo.mjs — ciclo de vida de uma ferramenta: registrar, toolchange, remover com AbortSignal, cancelar execução.
// Uso: node scripts/ciclo.mjs [polyfill|nativo]
import { abrir, modoDoArgumento } from '../lib/navegador.mjs';
const modo = modoDoArgumento();
if (modo === 'sem') { console.log('ciclo precisa de polyfill ou nativo'); process.exit(2); }
const n = await abrir(modo);
console.log(`== ${n.versao}`);
const r = await n.page.evaluate(async () => {
  const mc = document.modelContext, log = [], eventos = [];
  const conta = async () => (await mc.getTools()).length;
  mc.addEventListener('toolchange', () => eventos.push('toolchange'));
  mc.addEventListener('toolactivated', e => eventos.push(`toolactivated:${e.toolName}`));
  mc.addEventListener('toolcancel', e => eventos.push(`toolcancel:${e.toolName}`));
  log.push(`antes: ${await conta()} ferramentas`);
  const registro = new AbortController();
  await mc.registerTool({
    name: 'tarefa_lenta', description: 'Leva 2 segundos. Existe só para ensinar cancelamento.',
    async execute(_, { signal }) {
      return new Promise((ok, falha) => {
        const t = setTimeout(() => ok({ terminou: true }), 2000);
        signal.addEventListener('abort', () => { clearTimeout(t); falha(new DOMException('cancelada', 'AbortError')); });
      });
    }
  }, { signal: registro.signal });
  log.push(`registrou tarefa_lenta: ${await conta()} ferramentas`);
  try { await mc.registerTool({ name: 'tarefa_lenta', description: 'de novo', execute() {} }); log.push('nome repetido: aceito (?)'); }
  catch (e) { log.push(`nome repetido: recusado (${e.name})`); }
  const t = (await mc.getTools()).find(x => x.name === 'tarefa_lenta');
  const chamada = new AbortController();
  setTimeout(() => chamada.abort(), 100);
  try { await mc.executeTool(t, {}, { signal: chamada.signal }); log.push('execução: terminou'); }
  catch (e) { log.push(`execução cancelada pelo chamador: ${e.name}`); }
  registro.abort();
  await new Promise(ok => setTimeout(ok, 50));
  log.push(`depois do abort(): ${await conta()} ferramentas`);
  await new Promise(ok => setTimeout(ok, 50));
  return { log, eventos };
});
for (const l of r.log) console.log(l);
console.log(`eventos: ${r.eventos.join(' ') || '(nenhum)'}`);
await n.fechar();
process.exit(n.erros.length ? 1 : 0);
