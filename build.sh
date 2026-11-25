#!/usr/bin/env bash
# Junta os arquivos de src/ em um único HTML autocontido.
#   index.html     -> abrir direto no navegador (funciona offline)
#   dist/artifact.html -> versão sem <html>/<head>/<body>, usada para publicar online
set -e
cd "$(dirname "$0")"
mkdir -p dist
HEAD='<title>Seu mundo, seu ritmo</title>
<meta name="claude:viewport-fit-sides" content="cover">
<meta name="description" content="Jornada interativa de psicoeducação para adolescentes: atenção, organização e emoções.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500..800&family=Manrope:wght@400..800&family=Caveat:wght@500;700&display=swap">'
body() {
  echo '<style>'; cat src/style.css; echo '</style>'
  cat src/layout.html
  echo '<script>'; cat src/content.js src/app.js src/missoes1.js src/missoes2.js; echo 'boot();'; echo '</script>'
}
{ echo '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">'; echo "$HEAD"; echo '</head><body>'; body; echo '</body></html>'; } > index.html
{ echo "$HEAD"; body; } > dist/artifact.html
echo "ok: $(wc -c < index.html) bytes"
