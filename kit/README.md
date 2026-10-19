# Kit — WebMCP no seu site (Formação WebMCP, curso 2 de 6)

Página de exemplo (agenda de oficinas fictícia) com ferramentas WebMCP, fallback e testes. API: `document.modelContext`, rascunho do W3C Web Machine Learning Community Group de **16/10/2026** — experimental, pode mudar. Versões fixadas em 19/10/2026.

```bash
cd ~/projetos/formacao-webmcp-site-v72/kit
npm ci && npx playwright install chromium
node scripts/ambiente.mjs        # a página nos três modos: sem, polyfill, nativo
node scripts/testar.mjs          # bateria completa (sem modelo, sem API paga)
```

| Pasta | O que tem |
|---|---|
| `pagina/` | `index.html` + `app.mjs` (tela), `oficinas.mjs` (regra), `ferramentas.mjs` (catálogo WebMCP), `extras.mjs` (as suas), `declarativa.html` (formulário como ferramenta: fora da spec) |
| `scripts/` | `ambiente`, `listar`, `executar`, `ciclo`, `erros`, `declarativa`, `validar-catalogo`, `testar`, `servir` |
| `lib/navegador.mjs` | servidor em 127.0.0.1 + Chromium do Playwright 1.64.0 nos modos `sem`, `polyfill` (`@mcp-b/webmcp-polyfill` 6.0.3, não oficial) e `nativo` (`--enable-features=WebMCPTesting`) |
| `blocos/`, `saidas/`, `capturar.sh` | os blocos "Terminal" do curso e as saídas capturadas |

Curso: https://inematds.github.io/formacao-webmcp-site-v72/ · conteúdo aberto e gratuito do INEMA.CLUB.
