# Seu mundo, seu ritmo

Ferramenta de apoio à psicoterapia: uma jornada de psicoeducação em três
missões e um capítulo final, além do Guia para a família e da página
"Para a psicóloga". O TDAH é tratado como hipótese em investigação, nunca
como diagnóstico confirmado.

## Como usar na sessão
Abra `index.html` no navegador (Chrome, Edge ou Firefox). Funciona offline
(sem internet, só as fontes mudam para as do sistema).
Também pode ser servido pelo Docker: `docker compose up -d --build` (porta 4373).

## A jornada
Cada missão tem quatro etapas: Entenda → Experimente → Conecte → Conquista.
As paradas se desbloqueiam em ordem (dá para liberar todas em "Para a psicóloga").

1. Entendendo minha mente: atenção, impulsos, começar e terminar, interesse e
   motivação, dias diferentes. Jogo "Desvendando os mitos" (sem placar).
2. Da vontade à ação: a distância entre saber e fazer. Jogo "Organizando o caos"
   (cartões arrastáveis, priorização e imprevisto) e "Autonomia no cotidiano"
   (agenda, lembretes, listas, etapas, quadro visual, rotina, pedir ajuda).
3. Entre pensamentos e emoções: triângulo pensamento-emoção-comportamento,
   história interativa com vários caminhos, emoções e estratégias para momentos difíceis.
4. Capítulo final "Meu caminho daqui pra frente": diário em cinco momentos,
   terminando na carta para o eu do futuro.

## Cores
Três paletas (Lavanda e sálvia, Pastel quente, Noite estrelada) e tema claro/escuro,
trocados pelos botões do cabeçalho. A escolha fica salva no navegador.

## Privacidade
Nada é enviado para servidores. Progresso, respostas e a carta ficam no
`localStorage` deste navegador e continuam lá ao fechar a página. Em aparelhos
compartilhados, use "Reiniciar" ao final da sessão.

## Editar conteúdo
Todos os textos estão em `src/content.js`. Depois de editar, rode `bash build.sh`
para gerar de novo o `index.html` e o `dist/artifact.html` (a versão publicada online).

## Arquivos
- `src/style.css`: visual, paletas e temas
- `src/layout.html`: estrutura da página (cabeçalho, área principal, rodapé)
- `src/content.js`: textos das missões, do capítulo final, da família, guia e referências
- `src/app.js`: núcleo, cabeçalho, mapa da jornada, estrutura das missões, família, guia
- `src/missoes1.js`: missões 1 e 2 (mitos, Organizando o caos, ferramentas)
- `src/missoes2.js`: missão 3 e capítulo final
