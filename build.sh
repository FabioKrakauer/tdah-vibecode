#!/usr/bin/env bash
# Junta os arquivos de src/ em um único HTML autocontido.
#   index.html     -> abrir direto no navegador (funciona offline, permite imprimir/PDF)
#   dist/artifact.html -> versão sem <html>/<head>/<body>, usada para publicar online
set -e
cd "$(dirname "$0")"
mkdir -p dist
HEAD='<title>Seu mundo, seu ritmo</title>
<meta name="claude:viewport-fit-sides" content="cover">
<meta name="description" content="Site interativo de psicoeducação sobre TDAH para adolescentes.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=Nunito+Sans:ital,opsz,wght@0,6..12,400;0,6..12,600;0,6..12,700;0,6..12,800;1,6..12,400&family=Caveat:wght@500;600&display=swap">'
body() {
  echo '<style>'; cat src/style.css; echo '</style>'
  echo '<div id="root"></div>'
  echo '<script>'; cat src/content.js src/app.js src/games.js src/tools.js; echo 'boot();'; echo '</script>'
}
{ echo '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">'; echo "$HEAD"; echo '</head><body>'; body; echo '</body></html>'; } > index.html
{ echo "$HEAD"; body; } > dist/artifact.html
echo "ok: $(wc -c < index.html) bytes"
