# Site de psicoeducação sobre TDAH

Ferramenta de apoio à psicoterapia: 8 missões interativas, uma por encontro,
além do Guia para a família, do Guia da sessão e das Referências.

## Como usar na sessão
Abra `index.html` no navegador (Chrome, Edge ou Firefox). Funciona offline
(sem internet, só as fontes mudam para as do sistema) e permite imprimir/salvar em PDF.
Também pode ser servido pelo Docker: `docker compose up -d --build` (porta 4373).

## As missões
1. Bastidores do cérebro: mapa do cérebro, credenciais das funções executivas e "o dia do show".
2. No grupo da turma: chat com mitos sobre TDAH, dossiê científico e mesa de som da atenção.
3. Isso tem a ver comigo?: baralho para separar em pilhas, mapa pessoal e aprofundamento.
4. Laboratório de foco: 5 jogos com diário do experimento.
5. Semana em jogo: montar uma agenda, enfrentar um imprevisto e ver a semana acontecer.
6. Volume das emoções: situações com termômetro, caminhos possíveis e regra de bolso.
7. Estratégias sob medida: desafio real, mochila de ferramentas, experimento e recursos.
8. Meu rider: síntese das missões em um pôster imprimível.

## Privacidade
Nada é enviado para servidores. O progresso fica só na aba do navegador
(sessionStorage) e é apagado ao fechar a aba ou em "Reiniciar".

## Trocar o título
- Na hora: menu > "Guia da sessão" > Título do projeto.
- Permanente: edite `TITULO_PADRAO` em `src/content.js` e rode `bash build.sh`.

## Editar conteúdo
Todos os textos estão em `src/content.js`. Depois de editar, rode `bash build.sh`
para gerar de novo o `index.html` (e `dist/artifact.html`, a versão publicada online).

## Arquivos
- `src/style.css`: visual
- `src/content.js`: textos das missões, família, guia da sessão e referências
- `src/app.js`: navegação, início, estrutura das missões, família, guia
- `src/missoes1.js`: missões 1 a 4 (incluindo os jogos)
- `src/missoes2.js`: missões 5 a 8 (incluindo os recursos interativos e o pôster)
