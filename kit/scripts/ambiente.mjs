// ambiente.mjs — o que a página enxerga em cada modo. Uso: node scripts/ambiente.mjs
import { abrir, MODOS } from '../lib/navegador.mjs';
let falhas = 0;
for (const modo of MODOS) {
  const n = await abrir(modo);
  const r = await n.page.evaluate(() => ({
    seguro: isSecureContext,
    documento: typeof document.modelContext === 'object' && document.modelContext !== null,
    antigo: 'modelContext' in navigator,
    estado: document.documentElement.dataset.webmcp,
    aviso: document.querySelector('#aviso').textContent
  }));
  console.log(`== ${n.versao}`);
  console.log(`contexto seguro: ${r.seguro ? 'sim' : 'não'} · document.modelContext: ${r.documento ? 'presente' : 'ausente'} · navigator.modelContext: ${r.antigo ? 'presente' : 'ausente'}`);
  console.log(`página: ${r.estado} · aviso: ${r.aviso}`);
  if (!r.seguro || n.erros.length) { falhas++; console.log('ERRO: ' + (n.erros.join(' | ') || 'contexto inseguro')); }
  await n.fechar();
}
process.exit(falhas ? 1 : 0);
