cd ~/projetos/formacao-webmcp-site-v72/kit
node --test 2>&1 | grep -E "^ℹ (pass|fail)"
node scripts/testar.mjs; echo "saída: $?"
