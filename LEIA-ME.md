# Site de psicoeducação sobre TDAH

## Como usar na sessão
Abra `index.html` com dois cliques (Chrome, Edge ou Firefox). Funciona offline
(sem internet, só as fontes caem para as do sistema) e permite imprimir / salvar em PDF.

## Privacidade
Nada é enviado para servidores. O progresso fica só na aba do navegador
(sessionStorage) e é apagado ao fechar a aba ou em "Reiniciar a jornada".

## Trocar o título
- Na hora: menu > "Guia da sessão" > Título do projeto.
- Permanente: edite `TITULO_PADRAO` em `src/content.js` e rode `bash build.sh`.

## Editar conteúdo
Todos os textos estão em `src/content.js`. Depois de editar, rode `bash build.sh`
para gerar de novo o `index.html` (e `dist/artifact.html`, a versão publicada online).

## Arquivos
- `src/style.css` – visual
- `src/content.js` – textos, quiz, cartas, ferramentas, guias e referências
- `src/app.js` – navegação, progresso, início, cérebro, TDAH, cartas
- `src/games.js` – os 5 desafios
- `src/tools.js` – ferramentas, recursos interativos, manual, família, guia da sessão
