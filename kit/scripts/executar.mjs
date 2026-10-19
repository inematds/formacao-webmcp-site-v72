// executar.mjs — chama UMA ferramenta como um agente chamaria (executeTool) e mostra o que mudou na tela.
// Uso: node scripts/executar.mjs [polyfill|nativo] <ferramenta> '<json>' [--confirmar|--recusar]
import { abrir, modoDoArgumento } from '../lib/navegador.mjs';
const args = process.argv.slice(2);
const modo = modoDoArgumento(args);
const [nome, json = '{}'] = args.filter(a => a !== modo && !a.startsWith('--'));
const clicar = args.includes('--confirmar') ? '#conf-sim' : args.includes('--recusar') ? '#conf-nao' : null;
if (!nome) { console.log('uso: node scripts/executar.mjs [polyfill|nativo] <ferramenta> \'<json>\' [--confirmar|--recusar]'); process.exit(2); }
const n = await abrir(modo);
console.log(`== ${n.versao}`);
const chamada = n.page.evaluate(async ([nome, json]) => {
  const mc = document.modelContext;
  if (!mc) return { erro: 'document.modelContext ausente' };
  const t = (await mc.getTools()).find(x => x.name === nome);
  if (!t) return { erro: `ferramenta não registrada: ${nome}` };
  try {
    const texto = await mc.executeTool(t, JSON.parse(json));   // entra objeto, volta TEXTO JSON (spec 16/10/2026)
    return { tipo: typeof texto, texto };
  } catch (e) { return { erro: `${e.name}: ${e.message}` }; }
}, [nome, json]);
if (clicar) {
  await n.page.locator('#confirmar:not([hidden])').waitFor({ timeout: 5000 });
  console.log(`tela pediu: ${await n.page.locator('#conf-texto').textContent()}`);
  await n.page.click(clicar);
  console.log(`pessoa clicou: ${clicar === '#conf-sim' ? 'Confirmar' : 'Recusar'}`);
}
const r = await chamada;
if (r.erro) console.log(`erro: ${r.erro}`);
else console.log(`resultado (${r.tipo}): ${r.texto.length > 300 ? r.texto.slice(0, 300) + ' (…)' : r.texto}`);
console.log(`tela · resultados: ${await n.page.locator('#resultados li').count()} · reservas: ${(await n.page.locator('#reservas').innerText()).replace(/\n/g, ' | ')}`);
await n.fechar();
process.exit(r.erro || n.erros.length ? 1 : 0);
