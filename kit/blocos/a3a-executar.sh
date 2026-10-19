cd ~/projetos/formacao-webmcp-site-v72/kit
node scripts/listar.mjs nativo
node scripts/executar.mjs nativo buscar_oficinas '{"tema":"webmcp","apenasComVaga":true}'; echo "saída: $?"
