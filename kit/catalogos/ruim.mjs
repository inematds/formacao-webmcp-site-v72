// catalogos/ruim.mjs — catálogo com os erros mais comuns (para ver o validador reprovar). Não use em página.
export function catalogo() {
  return [
    { name: 'fazer tudo', description: 'Faz coisas.', execute: async () => ({}) },
    { name: 'buscar', description: 'Busca.', inputSchema: { type: 'object', properties: { q: { type: 'string' } } }, annotations: { readOnlyHint: 'sim' }, execute: async () => ({}) },
    { name: 'cancelar_reserva', description: 'Cancela a reserva indicada pelo id e libera a vaga para outra pessoa.', inputSchema: { type: 'object', properties: { id: { type: 'string', description: 'Id da reserva.' } }, additionalProperties: false }, annotations: { readOnlyHint: true }, execute: async () => ({}) },
    { name: 'ver_agenda', description: '', annotations: { readOnly: true }, execute: async () => ({}) }
  ];
}
