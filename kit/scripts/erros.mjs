// erros.mjs — os três tropeços mais comuns com a API, medidos no navegador. Uso: node scripts/erros.mjs [polyfill|nativo]
import { abrir, modoDoArgumento } from '../lib/navegador.mjs';
const n = await abrir(modoDoArgumento(process.argv.slice(2), 'nativo'));
console.log(`== ${n.versao}`);
const r = await n.page.evaluate(async () => {
  const mc = document.modelContext, out = [];
  out.push(`navigator.modelContext (nome antigo): ${typeof navigator.modelContext}`);
  await mc.registerTool({ name: 'quebra', description: 'Lança erro de propósito.', async execute() { throw new Error('motivo que o agente não vai ver'); } });
  const [busca] = (await mc.getTools()).filter(t => t.name === 'buscar_oficinas');
  try { await mc.executeTool(busca, '{"tema":"html"}'); out.push('entrada em texto: aceita'); }
  catch (e) { out.push(`entrada em texto JSON em vez de objeto: ${e.name}`); }
  const quebra = (await mc.getTools()).find(t => t.name === 'quebra');
  try { await mc.executeTool(quebra, {}); } catch (e) { out.push(`execute que lança: ${e.name}: ${e.message}`); }
  return out;
});
for (const l of r) console.log(l);
await n.fechar();
