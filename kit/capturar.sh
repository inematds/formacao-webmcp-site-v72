#!/usr/bin/env bash
# capturar.sh — roda cada bloco "Terminal" do curso (kit/blocos/*.sh) e grava a saída em kit/saidas/.
# É daqui que saem as abas "Saída capturada" das aulas. Nenhum bloco chama modelo nem API paga.
# Uso: bash capturar.sh            # todos menos a2a-clonar (precisa do repo publicado)
#      bash capturar.sh a4-ciclo   # um bloco
set -uo pipefail
K=$(cd "$(dirname "$0")" && pwd)
mkdir -p "$K/saidas"
alvos=("$@"); [ ${#alvos[@]} -eq 0 ] && alvos=($(cd "$K/blocos" && ls *.sh | grep -v 'a2a-clonar' | sed 's/\.sh$//'))
for b in "${alvos[@]}"; do
  ( cd /tmp && timeout 300 bash "$K/blocos/$b.sh" ) > "$K/saidas/$b.txt" 2>&1
  echo "$b: $(wc -l < "$K/saidas/$b.txt") linhas"
done
