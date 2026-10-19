// testar.mjs — bateria automática da página: sem WebMCP, com polyfill e com o WebMCP nativo do Chromium.
// Uso: node scripts/testar.mjs [sem|polyfill|nativo ...]   (sem argumento: os três modos)
// Cada linha é uma verificação; a última diz quantas passaram. Saída 0 só se todas passarem.
import { abrir, MODOS } from '../lib/navegador.mjs';

const modos = process.argv.slice(2).filter(a => MODOS.includes(a));
let ok = 0, total = 0;
const confere = (modo, nome, cond, detalhe = '') => {
  total++; if (cond) ok++;
  console.log(`${cond ? 'ok   ' : 'FALHA'} [${modo}] ${nome}${detalhe ? ' · ' + detalhe : ''}`);
};

// Caminho da pessoa: busca e reserva pelo formulário, sem agente.
async function buscaManual(page) {
  await page.selectOption('#tema', 'webmcp');
  await page.check('#comvaga');
  await page.click('#busca button[type=submit]');
  return page.$$eval('#resultados li', lis => lis.map(li => li.dataset.id));
}

// Chama uma ferramenta pela API (como um agente) e devolve o objeto (a API devolve texto JSON).
const chamar = (page, nome, input) => page.evaluate(async ([nome, input]) => {
  const t = (await document.modelContext.getTools()).find(x => x.name === nome);
  return JSON.parse(await document.modelContext.executeTool(t, input));
}, [nome, input]);

for (const modo of modos.length ? modos : MODOS) {
  console.log(`== ${modo}`);
  // 1. A página no celular, sem erro, e o caminho manual (vale para todo modo).
  let n = await abrir(modo, { largura: 390 });
  if (!globalThis.versaoImpressa) { console.log(`   ${n.versao.replace(/ · modo: .*/, '')}`); globalThis.versaoImpressa = true; }
  confere(modo, 'página sem erro de JavaScript', n.erros.length === 0, n.erros.join(' | '));
  confere(modo, 'sem rolagem horizontal em 390 px', await n.page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  const estado = await n.page.evaluate(() => document.documentElement.dataset.webmcp);
  confere(modo, `estado WebMCP esperado (${modo === 'sem' ? 'sem' : 'com'})`, estado === (modo === 'sem' ? 'sem' : 'com'), estado);
  const manual = await buscaManual(n.page);
  confere(modo, 'busca pelo formulário funciona', manual.join() === 'of-301', manual.join());
  await n.page.fill('#nome', 'Rita');
  await n.page.click('[data-reservar="of-301"]');
  await n.page.click('#conf-sim');
  confere(modo, 'reserva pelo formulário funciona', (await n.page.textContent('#reservas')).includes('Rita'));
  await n.fechar();
  if (modo === 'sem') continue;

  // 2. O caminho do agente: catálogo, equivalência, confirmação, entrada inválida, remoção.
  n = await abrir(modo);
  const nomes = await n.page.evaluate(async () => (await document.modelContext.getTools()).map(t => t.name).sort());
  const DO_KIT = ['buscar_oficinas', 'listar_comentarios', 'minhas_reservas', 'reservar_vaga'];
  confere(modo, 'as 4 ferramentas do kit registradas', DO_KIT.every(x => nomes.includes(x)), nomes.join(', '));
  const r = await chamar(n.page, 'buscar_oficinas', { tema: 'webmcp', apenasComVaga: true });
  confere(modo, 'ferramenta devolve o mesmo que o formulário', r.oficinas.map(o => o.id).join() === manual.join(), r.oficinas.map(o => o.id).join());
  const tela = await n.page.$$eval('#resultados li', lis => lis.map(li => li.dataset.id).join());
  confere(modo, 'a tela mostra o que o agente recebeu', tela === manual.join(), tela);

  let p = chamar(n.page, 'reservar_vaga', { id: 'of-301', nome: 'Rita' });
  await n.page.locator('#confirmar:not([hidden])').waitFor({ timeout: 3000 }).catch(() => {});
  if (await n.page.isVisible('#conf-nao')) await n.page.click('#conf-nao');
  confere(modo, 'reserva recusada na tela não reserva', (await p).reservado === false && (await n.page.textContent('#reservas')).includes('Nenhuma'));
  p = chamar(n.page, 'reservar_vaga', { id: 'of-301', nome: 'Rita' });
  await n.page.locator('#confirmar:not([hidden])').waitFor({ timeout: 3000 }).catch(() => {});
  if (await n.page.isVisible('#conf-sim')) await n.page.click('#conf-sim');
  confere(modo, 'reserva confirmada aparece na tela', (await p).reservado === true && (await n.page.textContent('#reservas')).includes('Rita'));

  const antes = (await chamar(n.page, 'buscar_oficinas', { tema: 'webmcp' })).oficinas[0].vagas;
  const inval = await chamar(n.page, 'buscar_oficinas', { tema: 'cobol' });
  const depois = (await chamar(n.page, 'buscar_oficinas', { tema: 'webmcp' })).oficinas[0].vagas;
  confere(modo, 'entrada inválida volta erro legível, sem mudar nada', inval.erro === 'tema inválido: cobol' && antes === depois, inval.erro);

  const saida = await n.page.evaluate(async () => {
    let mudou = 0;
    document.modelContext.addEventListener('toolchange', () => mudou++);
    dispatchEvent(new PageTransitionEvent('pagehide'));
    await new Promise(ok => setTimeout(ok, 50));
    try { return { restam: (await document.modelContext.getTools()).length, mudou }; }
    catch (e) { return { restam: 0, mudou, erro: e.name }; }   // o polyfill desliga a API inteira depois do pagehide
  });
  confere(modo, 'ao sair da página as ferramentas saem (AbortSignal)', saida.restam === 0 && saida.mudou > 0,
    `${saida.restam} restantes, toolchange ${saida.mudou}x${saida.erro ? ', getTools depois: ' + saida.erro : ''}`);
  confere(modo, 'nenhum erro de JavaScript na sessão do agente', n.erros.length === 0, n.erros.join(' | '));
  await n.fechar();
}
console.log(`BATERIA: ${ok}/${total} ok`);
process.exit(ok === total ? 0 : 1);
