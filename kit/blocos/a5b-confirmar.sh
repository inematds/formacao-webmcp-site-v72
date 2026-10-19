cd ~/projetos/formacao-webmcp-site-v72/kit
node scripts/executar.mjs nativo reservar_vaga '{"id":"of-301","nome":"Rita"}' --recusar; echo "saída: $?"
node scripts/executar.mjs nativo reservar_vaga '{"id":"of-301","nome":"Rita"}' --confirmar; echo "saída: $?"
