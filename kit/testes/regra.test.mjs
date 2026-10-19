// Testes da regra e do catálogo, sem navegador: node --test testes/
import test from 'node:test';
import assert from 'node:assert/strict';
import { criarAgenda } from '../pagina/oficinas.mjs';
import { catalogo, registrar } from '../pagina/ferramentas.mjs';

test('busca por tema e só com vaga', () => {
  const a = criarAgenda();
  assert.deepEqual(a.buscar({ tema: 'html', apenasComVaga: true }).map(o => o.id), ['of-101']);
  assert.throws(() => a.buscar({ tema: 'cobol' }), /tema inválido/);
});

test('reserva gasta uma vaga e não repete', () => {
  const a = criarAgenda();
  a.reservar({ id: 'of-302', nome: 'Rita' });
  assert.equal(a.oficina('of-302').vagas, 0);
  assert.equal(a.reservar({ id: 'of-302', nome: 'Rita' }).repetida, true);
  assert.throws(() => a.reservar({ id: 'of-302', nome: 'Beto' }), /sem vaga/);
});

test('ferramenta com erro de regra devolve { erro } em vez de lançar', async () => {
  const defs = catalogo(criarAgenda(), { mostrarResultados() {} });
  const r = await defs.find(d => d.name === 'buscar_oficinas').execute({ tema: 'cobol' }, {});
  assert.deepEqual(r, { erro: 'tema inválido: cobol' });
});

test('registro tudo-ou-nada: se a 2ª falha, a 1ª sai', async () => {
  const sinais = [];
  const mc = { async registerTool(_, { signal }) { sinais.push(signal); if (sinais.length === 2) throw new DOMException('x', 'InvalidStateError'); } };
  await assert.rejects(registrar(mc, catalogo(criarAgenda(), {})), { name: 'InvalidStateError' });
  assert.ok(sinais.every(s => s.aborted));
});
