# PLANO — WebMCP no seu site (Formação WebMCP, curso 2 de 6, PILOTO) · 19/10/2026

Fonte de verdade da API: **rascunho do W3C Web Machine Learning Community Group de 16/10/2026** (https://webmachinelearning.github.io/webmcp/, baixado e lido em 19/10/2026) + docs do Chrome (WebMCP, atualizada em 07/10/2026; API declarativa, atualizada em 25/09/2026) + `implementation-status.md` do repositório. Comportamento real medido no **Chromium 156.0.8078.4 do Playwright 1.64.0** (modo nativo = `--enable-features=WebMCPTesting`, equivalente à flag `chrome://flags/#enable-webmcp-testing`) e no **@mcp-b/webmcp-polyfill 6.0.3** (publicado em 14/10/2026). Quando a spec e o navegador divergem, o curso mostra os dois e diz qual vale para o código (o que roda).

Fora do escopo (dono em outro curso, só link): panorama agente × site e acessibilidade (curso 0 `formacao-webmcp-base-v72`); servidor MCP (curso 1 `formacao-webmcp-mcp-v72`); agente que consome WebMCP e Playwright/DevTools MCP (curso 3 `formacao-webmcp-navegador-v72`); prompt injection, `exposedTo` e iframes a fundo, confirmação como defesa (curso 4 `formacao-webmcp-seguranca-v72`); evals a fundo (`loop-r-eng-verificacao-v72`); GEO/nota de prontidão (Formação inemaSEO).

## Conferência das fontes (passo 0 do BRIEF)

Cada afirmação das fontes antigas que o curso usa, contra a PESQUISA de 19/10/2026 e contra o que rodou aqui. **confere** = entra; **velho** = substituído pelo atual (nunca copiado); **sem confirmação** = fica fora ou entra como "relatado por".

### webmcp-2-builder (`docs/snapshot-especificacao.md`, `curso/builder/modulo-1-{2,3,4}.html`, `scripts/probe-jornada-browser.mjs`, `FALHAS.md`) — commit 676c46e, 05/10/2026
| Afirmação antiga | Marca | O que o curso ensina |
|---|---|---|
| Spec de referência = draft de 17/09/2026 | **velho** | Draft CG de **16/10/2026** (data no topo da spec) |
| Superfície `document.modelContext`, contexto seguro | confere | idem; IDL `partial interface Document { [SecureContext, SameObject] readonly attribute ModelContext modelContext; }` |
| Não ensinar `navigator.modelContext`, nem `unregisterTool()` | confere | `navigator.modelContext` = nome antigo (troca no PR #177, aceito 19/05/2026); no Chromium 156.0.8078.4 `'modelContext' in navigator` → `false` (medido). `unregisterTool`, `provideContext`, `clearContext` não existem mais |
| `registerTool(tool, options)`, remoção pelo `signal` | confere | `registerTool` devolve `Promise<undefined>`; rejeita com `InvalidStateError` para nome repetido, nome fora da regra ou descrição vazia (medido no nativo e no polyfill); `NotAllowedError` se a permissions policy `tools` bloquear |
| Nome 1–128 caracteres ASCII, `_` `-` `.` | confere | idem (spec §3) |
| Anotações `readOnlyHint`, `untrustedContentHint`, `consequentialHint`, `debugging`, booleanas, padrão false | confere | idem, com selo "podem mudar" |
| `getTools(options)` / `executeTool(registeredTool, inputObject, options)` | confere em parte | `getTools({fromOrigins})` devolve `RegisteredTool` com `name, title, description, inputSchema, window, origin, annotations`; **`executeTool` devolve `Promise<DOMString>`: o resultado volta como TEXTO JSON** (spec §4.2 + medido) |
| `FALHAS.md` 24/09 e `probe-jornada-browser.mjs`: "serializar argumentos (`JSON.stringify(input)`) para a implementação experimental" | **velho** | Entra **objeto**; string dá `TypeError` no Chromium 156.0.8078.4 e no polyfill 6.0.3 (medido em 19/10/2026) |
| Probe antigo: flag `--enable-features=WebMCP` | **velho** | Flag documentada: `chrome://flags/#enable-webmcp-testing`; no Playwright: `--enable-features=WebMCPTesting` (medido) |
| Eventos `toolactivated`/`toolcanceled` só na API declarativa | **velho** | Spec §4.3: `toolchange`, `toolactivated`, `toolcancel` (não "canceled") no `ModelContext`, também no imperativo. Medido: o nativo dispara os três; o polyfill 6.0.3 só `toolchange`. Doc do Chrome: `window.ontoolactivated`/`ontoolcancel` sem suporte desde o 156 |
| `execute` recebe `{ signal }` para cancelar a chamada | confere | idem (`ToolExecuteCallbackOptions.signal`); `executeTool(…, {signal})` cancela → `AbortError` (medido nos dois) |
| Erros do `executeTool` | **sem confirmação** na antiga; agora medido | Spec: `NotFoundError`, `DataError`, `OperationError`, `AbortError`. **Chromium 156 devolve `UnknownError`** para execute que lança e para ferramenta inexistente (medido): o motivo do `throw` não chega ao agente → padrão do curso: erro de regra volta como dado `{ erro }` |
| API declarativa "o explainer propõe… experimental" | **velho** (rótulo) | **Fora da spec** ("Future Exploration… not part of the specification at this time", README); o Chrome documenta e implementa no trial (`toolname`, `tooldescription`, `toolautosubmit`, `toolparamdescription`, `SubmitEvent.agentInvoked`, `respondWith`, `:tool-form-active`). Medido funcionando no nativo e na camada temporária do polyfill |
| `toolparamdescription`, schema sintetizado dos controles | confere | idem, pela doc do Chrome (25/09/2026) |
| Módulo 1-2: `npm create vite@latest` (sem versão) | **sem confirmação** | Fora: o kit usa servidor Node embutido em 127.0.0.1 (contexto seguro) e versões fixadas |
| Polyfill não usado; "types e polyfills com limites" | **velho** (ausência) | Ensaio com `@mcp-b/webmcp-polyfill@6.0.3` (redistribuição temporária do polyfill do CG, "will eventually be removed"; MCP-B, não oficial) |
| Ensaio nativo exige Chrome experimental instalado | **velho** | O Chromium do Playwright 1.64.0 tem a implementação atrás da flag de teste; headless roda (doc do Chrome: a API é pensada para fluxo local com humano no circuito) |
| Chrome 146 dev trial, OT 149–156, Chrome Status "Proposed" | confere | idem (PESQUISA §1.5); sem data de estável |
| Edge OT no 150, Mozilla neutra (03/08/2026), WebKit contra (data [incerto]) | confere | idem, sem data para a posição do WebKit |
| Labs `jornada-estudos.html`, `validador-tools.html` | confere (ideia) | Viraram `kit/pagina/` (agenda de oficinas) e `kit/scripts/validar-catalogo.mjs` + `testar.mjs` |

### webmcp-3-integrator (`curso/integrator/modulo-2-{1,3,4}.html`) — 05/10/2026
| Afirmação | Marca | Uso |
|---|---|---|
| Uma responsabilidade por ferramenta; verbo preciso; entrada mínima com enum | confere | aula 7 |
| Inventário → prioridade por valor/risco → extrair lógica da interface → wrapper fino | confere | aula 7 (a mesma função atende clique e ferramenta) |
| React `useEffect` + cleanup com `AbortController`; serviço Angular; Next.js | confere (padrão) / frameworks **sem versão** | aula 7 só o padrão (registrar no efeito, abortar no cleanup), sem prometer versão de framework; "Angular tem suporte experimental" só como frase da doc do Chrome (07/10/2026) |

### webmcp-readiness (`lib/audit-rules.mjs`) e área `inemaeventos/webmcp`
| Afirmação | Marca | Uso |
|---|---|---|
| Procura `document.modelContext`, `getTools`, forms `toolname` | confere | citado na aula 8 como olhar de fora; nota/pesos = inemaSEO (link) |

### Itens [incerto]/[2ª] da PESQUISA que NÃO entram como fato
Versão exata em que o Chrome removeu o alias `navigator`; data da posição do WebKit; remoção de `provideContext` em mar/2026 (só "não existe na spec de 16/10"); qualquer data de Chrome estável.

### Chamadas de modelo
Nenhuma. A extensão "Model Context Tool Inspector" exige chave de API do Gemini e a "Example Agentic Chrome Extension" usa chave de API ou a Prompt API local: entram como opção do aluno, **nunca** como critério de "pronto quando".

## Desvios do CURRICULO (com motivo)
- Aula 2: o polyfill é o **`@mcp-b/webmcp-polyfill@6.0.3`**, não o `@mcp-b/global`. Motivo: o `global` acrescenta ponte MCP-B, prompts e resources (fora da spec); o `webmcp-polyfill` é a redistribuição do polyfill do próprio CG (`webmachinelearning/webmcp-polyfill`, ainda sem pacote npm) e só implementa a superfície da spec — certo para ensaiar o que o curso ensina. Os dois são da MCP-B e não oficiais.
- Aula 2: além do polyfill, um **modo nativo sem custo** (Chromium do Playwright com a flag de teste) — não existia em 19/10 na PESQUISA; medido aqui.

## As 8 aulas
Kit: `kit/` no repo. Clonar em `~/projetos/formacao-webmcp-site-v72`; blocos com `cd ~/projetos/formacao-webmcp-site-v72/kit`. Saídas capturadas em 19/10/2026 com `kit/capturar.sh`.

| # | slug | título | objetivo (≤160) | diagrama | prática → pronto quando |
|---|---|---|---|---|---|
| 1 | hoje | WebMCP hoje: rascunho de 16/10/2026, origin trial, flag e quem apoia | situar o WebMCP em 16/10/2026: rascunho de CG, origin trial 149–156, flag local, quem apoia e quem é contra, e conferir a data da spec. | fluxo: explainer → CG draft → origin trial/flag → (sem data) estável; lados: Chrome/Edge, Mozilla neutra, WebKit contra | `bash blocos/a1-spec.sh` → `Draft Community Group Report, 16 October 2026` + `navigator.modelContext: 0` (data diferente = spec mudou) |
| 2 | ambiente | Ambiente: flag, origin trial, polyfill e três modos de teste | montar o kit e ver a mesma página em três modos (sem API, polyfill, nativo) sem gastar cota nem instalar Chrome experimental. | sem → polyfill → nativo → (seu Chrome com flag/OT) | `node scripts/ambiente.mjs` → 3 blocos, `sem`/`com`/`com`, `saída: 0` |
| 3 | primeira | Primeira ferramenta: registerTool com inputSchema e execute | registrar uma ferramenta com nome, descrição, inputSchema e execute, e chamá-la como um agente chamaria. | definição → registerTool → getTools → executeTool → texto JSON + tela | `node scripts/executar.mjs nativo buscar_oficinas '{"tema":"webmcp","apenasComVaga":true}'` → `resultado (string): {"total":1,…}`; sua ferramenta nova → `5 ferramentas registradas` |
| 4 | ciclo | Ciclo de vida: getTools, toolchange, AbortSignal e cancelamento | registrar, listar, remover com AbortSignal e cancelar uma execução, sabendo quais eventos o navegador dispara. | ciclo: registrar → toolchange → executar (toolactivated) → cancelar (toolcancel) → abort() → toolchange | `node scripts/ciclo.mjs nativo` → `nome repetido: recusado (InvalidStateError)` … `depois do abort(): 4 ferramentas` |
| 5 | anotacoes | Anotações e confirmação: readOnly, consequential e untrustedContent | marcar cada ferramenta com a anotação certa e fazer a ação com consequência esperar a pessoa clicar em Confirmar. | 3 anotações → o que o agente/navegador pode fazer → confirmação na tela | `executar.mjs nativo reservar_vaga … --recusar` → `"reservado":false`; `--confirmar` → `"reservado":true` |
| 6 | formulario | Formulário como ferramenta: toolname e toolautosubmit (experimental, fora da spec) | transformar um formulário em ferramenta com toolname, sabendo que é experimental e fora da spec, e quando usar toolautosubmit. | form → schema sintetizado → agente preenche → autosubmit? (só leitura) / pessoa envia | `node scripts/declarativa.mjs nativo` → `esperando a pessoa` e `pessoa clicou em Reservar → {"reservado":true…}` |
| 7 | catalogo | Desenhar o catálogo e migrar um site existente sem quebrar ninguém | desenhar um catálogo pequeno (uma intenção por ferramenta), revisá-lo com o validador e integrá-lo a um site existente com detecção e fallback. | site existente → inventário → regra compartilhada → wrapper fino → detecção + fallback | `node scripts/validar-catalogo.mjs catalogos/ruim.mjs` → `5 erros` (saída 1); o seu → `0 erros` (saída 0) |
| 8 | testar | Testar sozinho: bateria nos três modos, checklist e plano | rodar a bateria automática nos três modos, ver uma quebra ser pega e sair com o checklist e o plano datado da sua página. | mapa 4 degraus + gerador | `node scripts/testar.mjs` → `BATERIA: 31/31 ok`, saída 0; com a confirmação removida → `FALHA` e saída 1 |

Última aula: links para `https://inematds.github.io/formacao-webmcp-navegador-v72/` (curso 3, ainda não publicado em 19/10/2026).
Vídeo: nenhum (o short WebMCP é do curso 0, aula 1).
Imagens: capa + inicio + 8 heroes pelo Codex, uma por vez (`scratchpad/formacao-webmcp-site-v72-img/`).

## Convenções para os cursos irmãos (piloto)
1. **Kit = `kit/` no repo**, clonado em `~/projetos/<repo>`; `package.json` com versões exatas e data na descrição; `npm ci` + (se usar navegador) `npx playwright install chromium` em bloco próprio, com saída própria.
2. **Três modos de ensaio** (`sem`, `polyfill`, `nativo`) num só helper (`kit/lib/navegador.mjs`): todo teste de página roda nos três; `sem` prova o fallback. O nativo é o Chromium do Playwright 1.64.0 com `--enable-features=WebMCPTesting` — sem custo, sem token, sem Canary.
3. **Versão na saída**: todo script imprime `== Chromium <versão> (Playwright) · modo: <modo>` na 1ª linha; a aba capturada leva a data. Curso de MCP: imprimir versão do SDK e do protocolo.
4. **API na prosa = spec de 16/10/2026**; comportamento = o que rodou (Chromium 156.0.8078.4). Divergência vira frase explícita ("a spec diz X; o Chromium 156 devolve Y").
5. **`executeTool`: objeto entra, texto JSON sai** (`JSON.parse` no resultado). Erro de regra volta como `{ erro }` — o `throw` vira `UnknownError` sem motivo no Chromium 156.
6. **`getTools()`**: imprimir só `name`/`annotations` (cada item traz `window`, que não vira JSON).
7. **Blocos** `kit/blocos/aN[x]-<nome>.sh` na ordem de execução; `kit/capturar.sh` roda de `/tmp` e grava `kit/saidas/<nome>.txt`; JSON com `@@bloco@@`/`@@saida@@` + `resolver-kit.py --conferir`.
8. **"Pronto quando"** = `comando` → trecho literal + `saída: N`; ninguém depende de modelo, chave de API nem extensão com chave.
9. Selo **"experimental em 19/10/2026"** em toda prosa sobre flag/origin trial/declarativa; `toolname` sempre ao lado de "fora da spec".
