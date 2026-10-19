cd ~/projetos/formacao-webmcp-site-v72/kit
PLAYWRIGHT_BROWSERS_PATH=/tmp/sem-navegador node scripts/ambiente.mjs 2>&1 | grep -m1 "Executable doesn't exist"; echo "saída: ${PIPESTATUS[0]}"
