cd ~/projetos/formacao-webmcp-site-v72/kit
E=${TMPDIR:-/tmp}/ensaio-webmcp-site/a8; rm -rf $E; mkdir -p $E; cp -r pagina/. $E/
# a "otimização" perigosa: reservar sem esperar a pessoa
sed -i 's/const ok = await ui.pedirConfirmacao({ oficina, nome }, signal);/const ok = true;/' $E/ferramentas.mjs
PAGINA=$E node scripts/testar.mjs nativo | grep -E "FALHA|BATERIA"; echo "saída: ${PIPESTATUS[0]}"
