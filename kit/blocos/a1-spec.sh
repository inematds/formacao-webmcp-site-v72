curl -s https://webmachinelearning.github.io/webmcp/ | sed 's/<[^>]*>//g' > /tmp/webmcp-spec.txt
tr -s ' \n' ' ' < /tmp/webmcp-spec.txt | grep -o "Draft Community Group Report, [0-9]* [A-Z][a-z]* [0-9]*" | head -1
echo "document.modelContext: $(grep -c 'document.modelContext' /tmp/webmcp-spec.txt) linhas"
echo "navigator.modelContext: $(grep -c 'navigator.modelContext' /tmp/webmcp-spec.txt) linhas"
echo "unregisterTool: $(grep -c 'unregisterTool' /tmp/webmcp-spec.txt) linhas"
