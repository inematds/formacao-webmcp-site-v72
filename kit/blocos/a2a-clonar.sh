git clone -q https://github.com/inematds/formacao-webmcp-site-v72 ~/projetos/formacao-webmcp-site-v72
cd ~/projetos/formacao-webmcp-site-v72/kit
npm ci
npx playwright install chromium
echo "saída: $?"
