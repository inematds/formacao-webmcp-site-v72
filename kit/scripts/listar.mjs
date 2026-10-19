// listar.mjs — o catálogo que um agente veria (getTools). Uso: node scripts/listar.mjs [sem|polyfill|nativo] [pagina.html]
import { abrir, modoDoArgumento } from '../lib/navegador.mjs';
const n = await abrir(modoDoArgumento(), { pagina: process.argv.slice(2).find(a => a.endsWith('.html')) || '' });
console.log(`== ${n.versao}`);
const lista = await n.page.evaluate(async () => {
  const mc = document.modelContext;
  if (!mc) return null;
  // cada item traz window e origin: imprima só o que interessa (window não vira JSON)
  return (await mc.getTools()).map(t => ({ name: t.name, annotations: t.annotations || {} }));
});
if (lista === null) {
  console.log('document.modelContext ausente: nenhuma ferramenta (o site segue pelo formulário)');
} else {
  for (const t of lista) {
    const marcas = Object.entries(t.annotations).filter(([, v]) => v === true).map(([k]) => k).join(', ') || '-';
    console.log(`${t.name.padEnd(20)} ${marcas}`);
  }
  console.log(`${lista.length} ferramentas registradas`);
}
await n.fechar();
process.exit(n.erros.length ? 1 : 0);
