cd ~/projetos/formacao-webmcp-site-v72/kit
E=${TMPDIR:-/tmp}/ensaio-webmcp-site/a3; rm -rf $E; mkdir -p $E; cp -r pagina/. $E/
cat > $E/extras.mjs <<'FIM'
export function extras(agenda) {
  return [{
    name: 'contar_vagas',
    description: 'Soma as vagas livres das oficinas de um tema. Só lê: não reserva nada.',
    inputSchema: {
      type: 'object',
      properties: { tema: { type: 'string', enum: ['html', 'javascript', 'webmcp', 'mcp'], description: 'Tema da oficina.' } },
      required: ['tema'],
      additionalProperties: false
    },
    annotations: { readOnlyHint: true },
    async execute({ tema }) {
      const lista = agenda.buscar({ tema });
      return { tema, vagas: lista.reduce((soma, o) => soma + o.vagas, 0) };
    }
  }];
}
FIM
PAGINA=$E node scripts/listar.mjs nativo | tail -1
PAGINA=$E node scripts/executar.mjs nativo contar_vagas '{"tema":"html"}'; echo "saída: $?"
