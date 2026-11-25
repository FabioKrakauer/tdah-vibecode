/* =========================================================
   CONTEÚDO
   ========================================================= */
const MISSIONS = [
  { id: "mente", n: 1, titulo: "Entendendo minha mente", sub: "Atenção, impulsos, interesse e os dias que mudam", art: "star", selo: "Exploradora da mente",
    hook: "Como a sua mente presta atenção, espera, começa, termina e se motiva? E por que isso muda tanto de um dia para o outro? Aqui o objetivo é se conhecer, sem etiquetas." },
  { id: "acao", n: 2, titulo: "Da vontade à ação", sub: "Começar, lembrar, planejar e pedir apoio", art: "skate", selo: "Construtora de pontes",
    hook: "Saber o que precisa ser feito e conseguir fazer são coisas diferentes. Nesta missão você entende essa distância e experimenta ferramentas que ajudam a atravessá-la." },
  { id: "emocoes", n: 3, titulo: "Entre pensamentos e emoções", sub: "O que penso, o que sinto e o que faço", art: "mic", selo: "Tradutora de emoções",
    hook: "Um mesmo acontecimento pode levar a caminhos bem diferentes, dependendo do que a gente pensa. Explore histórias, reconheça emoções e monte estratégias para os momentos difíceis." },
];
const FINAL = { id: "caminho", titulo: "Meu caminho daqui pra frente", sub: "Um diário para olhar o que ficou", art: "book" };
const STEPS = [["Entenda", "o que acontece e por quê"], ["Experimente", "na prática, com um jogo"], ["Conecte", "com o seu dia a dia"], ["Conquista", "o que fica com você"]];

/* ---------- MISSÃO 1 ---------- */
const M1 = {
  intro: "A mente de cada pessoa tem um jeito próprio de prestar atenção, esperar, começar coisas e se animar com elas. Conhecer o seu jeito ajuda a entender por que algumas coisas são fáceis e outras pesam tanto.",
  investigacao: "Você está num processo de investigação. Isso quer dizer que ainda não existe uma resposta, e não precisa existir agora. Muita coisa que aparece aqui acontece com qualquer pessoa, e uma mesma dificuldade pode ter várias explicações ao mesmo tempo. Então leia pensando em você, não em um diagnóstico.",
  blocos: [
    { t: "O que é o TDAH, afinal?", art: "info", resumo: "Uma forma de o cérebro se desenvolver e funcionar, que começa na infância.",
      kPratica: "Em poucas palavras",
      pratica: ["Não tem nada a ver com preguiça, falta de disciplina ou inteligência.", "Aparece de jeitos diferentes: tem gente mais desatenta, gente mais agitada ou impulsiva, gente com as duas coisas.", "Em meninas, a agitação costuma ser mais por dentro (a cabeça que não para) e passa despercebida mais vezes.", "O diagnóstico é feito por profissionais, com calma, ouvindo a pessoa, a família e, às vezes, a escola. Nenhum teste rápido decide isso."],
      kPorque: "Por que investigar com calma",
      porque: "Sono ruim, ansiedade, tristeza, uma fase difícil ou uma dificuldade específica de aprendizagem podem dar sinais parecidos. Investigar com cuidado serve para entender você, e não para encaixar você numa caixa." },
    { t: "Atenção: um holofote que precisa ser dirigido", art: "spot", resumo: "Atenção não é algo que a gente tem ou não tem. É um holofote que precisa ser apontado, mantido e trocado de lugar.",
      pratica: ["Você lê uma página inteira e percebe que não lembra de nada.", "Na aula, um barulho no corredor e pronto: o holofote foi embora.", "Num vídeo de patinação ou numa música nova, uma hora passa sem você perceber."],
      porque: "O cérebro faz três trabalhos com a atenção: escolher para onde olhar, segurar o foco e soltar quando é hora de mudar. Algumas pessoas têm mais trabalho em um desses passos do que nos outros.",
      ajuda: "Diminuir o que compete pelo holofote (celular em outro cômodo, uma aba aberta só) funciona melhor do que tentar se esforçar mais, porque tira a disputa em vez de exigir força de vontade o tempo todo." },
    { t: "Esperar ou agir rápido", art: "pause", resumo: "Entre sentir a vontade e fazer, existe um pequeno freio. Em algumas pessoas, ele entra um pouco depois.",
      pratica: ["Responder antes de a pessoa terminar a pergunta.", "Mandar a mensagem e, dois segundos depois, pensar: não devia ter mandado.", "Aceitar um convite, clicar ou comprar no impulso."],
      porque: "Agir rápido tem lado bom: coragem, espontaneidade, decisões rápidas. O desafio é ter o freio disponível quando a situação pede calma.",
      ajuda: "Criar um espaço entre o impulso e a ação: respirar uma vez, contar até três, escrever a mensagem e esperar um minuto antes de enviar. Esse espaço dá tempo para a parte do cérebro que planeja entrar na conversa." },
    { t: "Começar e terminar", art: "play", resumo: "Saber o que precisa ser feito não é o mesmo que conseguir dar o primeiro passo. E o meio da tarefa, quando a novidade acaba, também pesa.",
      pratica: ["Ficar quarenta minutos quase começando o trabalho.", "Ter cinco projetos começados e nenhum terminado.", "Fazer tudo na última hora, quando a pressão finalmente liga o motor."],
      porque: "Tarefas grandes, vagas ou com prazo distante dão pouco sinal para o cérebro de que é hora de agir. A urgência da última hora funciona como combustível, só que cansa e gera estresse.",
      ajuda: "Transformar a tarefa grande em passos pequenos, com um primeiro passo de dois minutos. Um passo concreto diz ao cérebro exatamente o que fazer agora, e começar costuma puxar o resto." },
    { t: "Interesse e motivação", art: "spark", resumo: "Tarefas interessantes quase se fazem sozinhas. Tarefas tediosas pedem muito mais energia para o mesmo resultado.",
      pratica: ["Decorar uma coreografia inteira numa tarde, mas não conseguir ler três páginas de História.", "Estudar fica mais fácil com uma amiga ou quando vira desafio.", "Perder o interesse num hobby assim que ele vira obrigação."],
      porque: "O cérebro usa mensageiros químicos, como a dopamina, para sinalizar o que vale o esforço. Novidade, interesse, desafio, urgência e companhia acendem esse sinal. Quando ele está fraco, começar e continuar fica mais difícil. Isso não é escolha nem preguiça.",
      ajuda: "Dar um tempero para a tarefa chata: um cronômetro como desafio, uma música, estudar junto, uma recompensa pequena no final. Você empresta motivação de fora para a tarefa que não tem a própria." },
    { t: "Por que alguns dias são tão diferentes", art: "moon", resumo: "A mesma pessoa pode render muito numa terça e quase nada numa quarta. A mente responde ao corpo e ao ambiente.",
      pratica: ["Depois de dormir mal, tudo parece mais difícil e mais irritante.", "Num lugar barulhento, a cabeça cansa rápido.", "Quando você está chateada ou ansiosa, a atenção fica presa no que está sentindo."],
      porque: "Sono, fome, cansaço, emoções, barulho e telas mexem com a atenção de qualquer pessoa. Por isso não dá para tirar conclusões de um dia ruim. Observar o que se repete ao longo de semanas diz muito mais.",
      ajuda: "Reparar no que estava diferente nos dias bons. Essa pista é valiosa para você e para a investigação, porque mostra o que o seu cérebro precisa para funcionar melhor." },
  ],
  mitos: [
    { t: "TDAH é preguiça ou falta de força de vontade.", v: "mito", exp: "O TDAH está ligado ao jeito como o cérebro se desenvolve, com forte influência genética. Muitas pessoas com TDAH se esforçam muito, às vezes mais do que os outros, para fazer a mesma coisa. Cobrar mais esforço, sozinho, raramente resolve; apoio e estratégias costumam ajudar mais." },
    { t: "Quem tem TDAH não consegue prestar atenção em nada.", v: "mito", exp: "A dificuldade está em regular a atenção: colocar no lugar certo, na hora certa. Em algo muito interessante, a pessoa pode até se concentrar demais e perder a noção do tempo, o chamado hiperfoco." },
    { t: "O TDAH aparece do mesmo jeito em todas as pessoas.", v: "mito", exp: "Tem gente mais desatenta, gente mais agitada e impulsiva, e gente com um pouco dos dois. A mesma pessoa também muda com a idade e conforme o lugar: na escola pode ser de um jeito, em casa de outro. Em meninas, os sinais costumam ser mais discretos." },
    { t: "Dá para ter dificuldade de atenção sem ter TDAH.", v: "verdade", exp: "Sono ruim, ansiedade, tristeza, estresse, uma fase difícil, problemas de visão ou audição e dificuldades específicas de aprendizagem também mexem com a atenção. Por isso uma investigação olha a história inteira antes de qualquer conclusão." },
    { t: "Sono, fome e emoções mudam como a atenção funciona num dia.", v: "verdade", exp: "Isso vale para qualquer cérebro. Uma noite mal dormida já deixa a atenção e a paciência mais curtas. Reparar em como você está nos dias bons e nos ruins dá pistas importantes." },
    { t: "TDAH tem a ver com ser menos inteligente.", v: "mito", exp: "Inteligência e TDAH são coisas diferentes. Existem pessoas com TDAH com todos os níveis de inteligência. O que muda é o caminho entre saber e conseguir fazer na hora certa, não a capacidade de aprender e pensar." },
    { t: "Celular e açúcar causam TDAH.", v: "mito", exp: "Não há evidências de que telas ou açúcar causem TDAH. Mas telas antes de dormir atrapalham o sono, e notificações puxam a atenção de qualquer pessoa. Atrapalhar o foco é diferente de causar um transtorno." },
    { t: "Um teste de dez perguntas na internet diz se alguém tem TDAH.", v: "mito", exp: "Testes online podem levantar curiosidade, mas não fazem diagnóstico. Quase todo mundo marca sim em várias perguntas. A avaliação é feita por profissionais, olhando a história desde a infância e diferentes lugares da vida." },
    { t: "Se a pessoa tira notas boas, não pode ter TDAH.", v: "mito", exp: "Algumas pessoas compensam com muito esforço, ajuda ou interesse, e as notas não mostram o cansaço por trás. Do outro lado, notas baixas também podem ter muitas outras explicações." },
    { t: "Pessoas com TDAH sentem as emoções com mais intensidade.", v: "depende", exp: "Muitas pessoas com TDAH contam que a emoção sobe rápido e demora a baixar, mas isso não acontece com todo mundo. E também acontece com quem não tem TDAH: adolescência, cansaço e estresse aumentam a intensidade das emoções." },
    { t: "TDAH é coisa de criança e sempre passa quando cresce.", v: "mito", exp: "Em muitas pessoas os sinais continuam na vida adulta, mas mudam de forma: a agitação visível costuma diminuir e a desorganização ou a cabeça acelerada ficam mais evidentes. Com o tempo, muita gente aprende estratégias que ajudam bastante." },
    { t: "Listas, lembretes e dividir tarefas podem ajudar, com ou sem diagnóstico.", v: "verdade", exp: "Essas ferramentas tiram peso da memória e deixam o próximo passo claro. Funcionam para muita gente, e você vai experimentar várias delas na missão 2." },
    { t: "Se uma pessoa tem TDAH, isso define quem ela é.", v: "mito", exp: "Se existir, o TDAH é uma parte de como a pessoa funciona, não a pessoa inteira. Gostos, valores, talentos, jeito de rir, amizades: tudo isso continua sendo dela." },
  ],
  sintese: ["TDAH não tem a ver com esforço, inteligência ou caráter.", "A atenção depende de interesse, ambiente, sono e emoção, em qualquer pessoa.", "Cada pessoa é de um jeito: não existe um único jeito TDAH.", "Dificuldades parecidas podem ter outras explicações. Por isso se investiga com calma.", "Estratégias e apoio fazem diferença, com ou sem diagnóstico."],
  facil: ["Dormi bem", "O assunto me interessa", "Tem prazo chegando", "Estou com alguém", "Tem música", "Lugar silencioso", "Estou calma", "Celular longe", "É algo novo", "Mexi o corpo antes"],
  dificil: ["Dormi mal", "Estou com fome", "Tarefa longa e repetitiva", "Barulho em volta", "Celular por perto", "Estou chateada ou ansiosa", "Muitas instruções de uma vez", "Não entendi a tarefa", "Estou cansada", "Prazo muito longe"],
  ativ: ["Aula de Matemática", "Ensaio de música", "Patinar", "Ler para a escola", "Conversar com amigas", "Arrumar o quarto"],
};

/* ---------- MISSÃO 2 ---------- */
const M2 = {
  intro: "Às vezes você sabe exatamente o que precisa fazer e, mesmo assim, não consegue fazer. Isso não quer dizer que você não quer. Entre saber e fazer existe uma ponte, e ela pode ser mais firme ou mais frágil dependendo da tarefa, do dia e do cérebro de cada pessoa.",
  chave: "Quando a ponte entre saber e fazer está frágil, querer mais não basta. Funciona melhor construir apoios do lado de fora: lembretes, listas, etapas, rotinas, pessoas. Atletas têm treinador, artistas têm roteiro. Usar apoio não é trapaça: é estratégia.",
  blocos: [
    { t: "Começar", art: "play", resumo: "O mais difícil costuma ser o primeiro minuto.",
      pratica: ["Abrir o caderno, olhar, fechar.", "Arrumar a mesa inteira antes de começar e acabar não começando.", "Pensar no trabalho a semana toda e só fazer no domingo à noite."],
      porque: "Quando a tarefa é grande ou não está clara, o cérebro não sabe por onde entrar e procura algo mais fácil ou mais gostoso.",
      ajuda: "Combinar só um começo mínimo, como abrir o arquivo e escrever o título. Depois de começar, continuar costuma ser mais fácil, porque o cérebro já entrou no assunto." },
    { t: "Lembrar", art: "note", resumo: "A memória de curto prazo é como uma mesinha: cabe pouca coisa, e o que cai, some.",
      pratica: ["Ir até o quarto buscar algo e esquecer o quê.", "Lembrar da tarefa só quando a professora pede.", "Combinar algo com a mãe e esquecer no dia seguinte."],
      porque: "Guardar informação na cabeça gasta energia. Quando chega uma coisa nova, a antiga escorrega.",
      ajuda: "Tirar da cabeça e colocar fora: anotar na hora, lembrete com nome, lista na porta. Assim a memória fica livre para pensar, e a informação não depende de sorte." },
    { t: "Planejar e escolher o que vem primeiro", art: "calendar", resumo: "Planejar é decidir a ordem das coisas e quanto tempo cada uma leva.",
      pratica: ["Achar que dá tempo e descobrir que não dá.", "Fazer primeiro o que é mais fácil ou mais legal, não o que vence antes.", "Travar porque tudo parece urgente ao mesmo tempo."],
      porque: "O tempo é invisível. Sem ver o tempo passando, é muito comum achar que as coisas vão demorar menos do que demoram.",
      ajuda: "Perguntar: o que vence primeiro? O que é importante mesmo? Ver a semana inteira de uma vez e usar um cronômetro à vista. Quando o tempo aparece, fica mais fácil planejar com ele." },
    { t: "Distrações", art: "bell", resumo: "Algumas distrações vêm de fora, como uma notificação. Outras vêm de dentro, como um pensamento que puxa.",
      pratica: ["Só vou ver uma mensagem, e passa meia hora.", "Lembrar de uma música no meio da tarefa e ir procurar.", "Pensar numa conversa do recreio enquanto lê."],
      porque: "Aplicativos são feitos para puxar a atenção. Lutar contra isso só com força de vontade cansa qualquer pessoa.",
      ajuda: "Mudar o ambiente antes de começar: celular em outro cômodo, só a aba necessária aberta, um papel ao lado para estacionar as ideias que aparecem. É mais fácil não ver a tentação do que resistir a ela." },
    { t: "Dividir tarefas", art: "stairs", resumo: "Uma tarefa grande assusta. Dez tarefas pequenas parecem possíveis.",
      pratica: ["Estudar para a prova vira: separar a matéria, ler o resumo, fazer cinco exercícios, revisar os erros.", "Arrumar o quarto vira: roupas, mesa, chão, cama.", "Riscar cada passo dá uma sensação boa que ajuda a continuar."],
      porque: "Passos concretos dizem ao cérebro exatamente o que fazer agora, e cada passo concluído dá um pouco de motivação para o próximo.",
      ajuda: "O primeiro passo deve ser concreto e curto. Estudar é vago; abrir o livro na página 42 é concreto." },
  ],
  caos: {
    cena: "Sábado, 13h. Sua tarde está livre até as 19h: são seis horas. Muita coisa está pedindo espaço. Organize os cartões nas colunas do jeito que faria. Não existe plano certo.",
    twist: { t: "Imprevisto!", txt: "Sua tia ligou: o aniversário da sua avó foi antecipado para hoje, das 16h às 19h, e você vai junto. A sua tarde agora tem só três horas. Quer reorganizar?" },
    cards: {
      c1: { t: "Estudar para a prova de Ciências", h: 2, prazo: "segunda", split: ["c1a", "c1b", "c1c"] },
      c1a: { t: "Ler o resumo do capítulo", h: 0.5, prazo: "segunda", of: "c1" },
      c1b: { t: "Fazer os exercícios do livro", h: 1, prazo: "segunda", of: "c1" },
      c1c: { t: "Revisar o que errei", h: 0.5, prazo: "segunda", of: "c1" },
      c2: { t: "Separar o patins e a mochila para amanhã", h: 0.5, prazo: "amanhã cedo", urg: true },
      c3: { t: "Responder o grupo do trabalho", h: 0.25, prazo: "hoje", urg: true },
      c4: { t: "Lavar a louça (combinado com a mãe)", h: 0.5, prazo: "até 18h", urg: true },
      c5: { t: "Ensaiar a música da aula de canto", h: 1, prazo: "terça" },
      c6: { t: "Assistir dois episódios da série", h: 1, prazo: "quando quiser" },
      c7: { t: "Fazer o trabalho de História", h: 2, prazo: "quarta", split: ["c7a", "c7b", "c7c"] },
      c7a: { t: "Ler as instruções do trabalho", h: 0.25, prazo: "quarta", of: "c7" },
      c7b: { t: "Combinar o tema com o grupo", h: 0.5, prazo: "quarta", of: "c7" },
      c7c: { t: "Pesquisar três fontes", h: 1.25, prazo: "quarta", of: "c7" },
      c8: { t: "Descansar e fazer nada", h: 1, prazo: "para recarregar" },
      c9: { t: "Arrumar a mesa de estudo", h: 0.5, prazo: "sem prazo" },
    },
    base: ["c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8", "c9"],
    cols: [{ id: "hoje", t: "Hoje à tarde" }, { id: "depois", t: "Amanhã ou depois" }, { id: "espera", t: "Pode esperar" }],
  },
  tools: [
    { id: "agenda", nome: "Agenda da semana", icon: "calendar", pq: "Ver a semana inteira mostra o que vem pela frente antes de virar última hora. O tempo fica visível, e dá para espalhar as tarefas grandes em vários dias." },
    { id: "lembretes", nome: "Lembretes com nome", icon: "bell", pq: "Um lembrete funciona quando diz exatamente a ação e toca na hora em que dá para agir. Lembrete genérico vira só mais um barulho que a gente desliga." },
    { id: "lista", nome: "Listas de conferência", icon: "list", pq: "A lista guarda a informação fora da cabeça. Em vez de tentar lembrar tudo, você só confere. E riscar o que já fez dá sensação de progresso." },
    { id: "etapas", nome: "Dividir em etapas", icon: "stairs", pq: "Passos pequenos e concretos tiram o peso da tarefa grande. O cérebro sabe o que fazer agora, e cada passo concluído dá energia para o próximo." },
    { id: "visual", nome: "Quadro visual", icon: "board", pq: "Ver o que está parado, andando e pronto ajuda a escolher o próximo passo e mostra quanto você já fez, o que costuma ficar invisível." },
    { id: "rotina", nome: "Rotina", icon: "route", pq: "Uma sequência repetida todos os dias vira piloto automático. Você gasta menos energia decidindo o que fazer, e sobra energia para o resto." },
    { id: "ajuda", nome: "Pedir ajuda", icon: "hand", pq: "Pedir ajuda é uma habilidade. Pessoas independentes sabem do que precisam e a quem pedir. Um pedido claro tem muito mais chance de dar certo." },
  ],
  listas: { "Mochila de amanhã": ["Estojo", "Caderno do dia", "Garrafinha", "Carregador", "Patins e proteções (se tiver aula)"], "Antes de dormir": ["Celular carregando longe da cama", "Roupa de amanhã separada", "Mochila conferida", "Alarme ligado"], "Sair de casa": ["Chave", "Celular", "Fone", "Lanche"] },
  rotinas: { manha: [["Levantar sem enrolar", 5], ["Banho", 10], ["Me vestir", 10], ["Café da manhã", 15], ["Escovar os dentes", 5], ["Conferir a mochila", 5]], noite: [["Separar a roupa de amanhã", 5], ["Conferir a mochila", 5], ["Banho", 15], ["Celular carregando longe da cama", 2], ["Ler ou ouvir música", 20]] },
  quem: ["Minha mãe", "Meu pai", "Uma professora", "Uma amiga", "A psicóloga"],
  precisa: ["repetir a instrução", "me lembrar no dia", "me ajudar a começar", "dividir a tarefa comigo", "só me ouvir um pouco", "revisar comigo"],
};

/* ---------- MISSÃO 3 ---------- */
const M3 = {
  intro: "O que pensamos sobre uma situação muda o que sentimos, e o que sentimos muda o que fazemos. Isso acontece tão rápido que parece uma coisa só. Quando a gente aprende a separar as partes, aparecem mais escolhas.",
  tri: {
    pens: { t: "Pensamento", txt: "O que eu digo para mim mesma sobre a situação. Pensamentos automáticos aparecem rápido e parecem verdade, mas são interpretações.", ex: "Ela não respondeu. Deve estar brava comigo." },
    emo: { t: "Emoção", txt: "O que eu sinto, no corpo e por dentro. A emoção depende muito da interpretação que fiz do que aconteceu.", ex: "Aperto no peito, ansiedade, um pouco de tristeza." },
    comp: { t: "Comportamento", txt: "O que eu faço, ou tenho vontade de fazer. O que eu faço gera consequências, que viram novas situações e novos pensamentos.", ex: "Fico checando o celular a cada minuto." },
  },
  blocos: [
    { t: "O mesmo acontecimento, caminhos diferentes", art: "route", resumo: "Não é só o que acontece que define como a gente se sente. É também o que a gente pensa sobre o que aconteceu.",
      kPratica: "Na prática fica assim",
      pratica: ["Sua amiga visualizou e não respondeu.", "Pensamento A: ela está brava comigo. Emoção: ansiedade. Reação: ficar checando o celular.", "Pensamento B: ela deve estar ocupada. Emoção: tranquilidade. Reação: seguir o dia e esperar."],
      porque: "O cérebro preenche as lacunas com a primeira explicação que aparece, e essa explicação nem sempre é a mais provável.",
      ajuda: "Antes de reagir, perguntar: que outra explicação poderia existir? Só de procurar outra explicação, a primeira perde um pouco de força." },
    { t: "Emoções são mensageiras", art: "heart", resumo: "Nenhuma emoção é proibida. Cada uma traz um aviso.",
      pratica: ["Raiva avisa que algo parece injusto ou passou de um limite.", "Medo avisa que pode haver perigo ou incerteza.", "Tristeza avisa que algo importante foi perdido.", "Vergonha avisa que você se sentiu exposta ou julgada."],
      porque: "Emoções sobem como ondas, chegam ao pico e descem. Quando a gente age no pico, costuma fazer coisas de que se arrepende depois.",
      ajuda: "Ouvir o aviso da emoção sem obedecer a ela na hora. Dá para sentir raiva e escolher esperar dez minutos antes de responder." },
    { t: "Pensamentos não são fatos", art: "chat", resumo: "Pensar algo não torna isso verdade. Pensamentos são hipóteses.",
      pratica: ["Todo mundo riu de mim. (Será que todo mundo? Ou uma pessoa?)", "Eu nunca consigo nada. (Nunca mesmo? Teve alguma vez que deu certo?)", "Ela me odeia. (Que provas eu tenho? Que outras explicações existem?)"],
      porque: "Quando a emoção está forte, o cérebro tende a pensar em tudo ou nada: sempre, nunca, todo mundo, ninguém.",
      ajuda: "Fazer perguntas de detetive ao pensamento: é fato ou interpretação? Que provas existem? O que eu diria para uma amiga que pensasse isso? Isso ajuda a trocar um pensamento duro por um mais justo." },
    { t: "O corpo avisa primeiro", art: "spark", resumo: "Muitas vezes o corpo percebe a emoção antes de a gente conseguir dar nome a ela.",
      pratica: ["Rosto quente e mãos tensas antes de explodir.", "Frio na barriga e respiração curta antes de uma apresentação.", "Nó na garganta antes de chorar."],
      porque: "As emoções preparam o corpo para agir: lutar, fugir, se proteger. Por isso o coração acelera e os músculos ficam tensos.",
      ajuda: "Conhecer os seus sinais do corpo funciona como um alarme antecipado. Perceber cedo dá tempo de usar uma estratégia antes de a emoção chegar no pico." },
    { t: "Quando a emoção vem forte e rápido", art: "wave", resumo: "Algumas pessoas sentem com mais intensidade e demoram mais para voltar à calma.",
      pratica: ["Uma crítica pequena estraga o dia inteiro.", "Ir de zero a dez em segundos numa discussão.", "Depois que passa, pensar: por que eu reagi assim?"],
      porque: "Isso pode acontecer com quem tem TDAH e com muitas outras pessoas, principalmente na adolescência, quando o cérebro está se reorganizando. Sono, fome e cansaço também deixam as emoções mais intensas.",
      ajuda: "Não se cobrar não sentir. A ideia é ter um plano para quando a onda vier: o que eu faço quando percebo que estou subindo?" },
  ],
  situacoes: [
    { id: "s1", titulo: "Visualizou e não respondeu", cena: "Você mandou uma mensagem longa para a sua melhor amiga contando algo importante. Duas horas depois: visualizado, sem resposta.",
      pens: [
        { t: "Ela não liga pra mim.", emo: ["Tristeza", "Raiva", "Insegurança"], reac: [
          { t: "Mandar um 'tá, entendi' seco e sair da conversa", logo: "Alívio rápido de mostrar que se magoou.", depois: "Ela pode não entender o que aconteceu, e a conversa fica mais difícil." },
          { t: "Ficar checando o celular a cada minuto", logo: "A ansiedade não baixa; cada checada aumenta um pouco.", depois: "O resto da tarde fica preso nessa espera." },
          { t: "Desabafar com outra pessoa de confiança", logo: "Dividir alivia um pouco.", depois: "Com mais calma, fica mais fácil decidir se vale perguntar para ela." } ] },
        { t: "Deve ter acontecido alguma coisa com ela.", emo: ["Preocupação", "Curiosidade"], reac: [
          { t: "Mandar: tá tudo bem por aí?", logo: "Mostra cuidado sem cobrar.", depois: "Ela tende a responder com mais abertura quando puder." },
          { t: "Esperar e seguir o dia", logo: "Ainda fica uma pontinha de dúvida.", depois: "Quando ela responder, você estará mais tranquila para conversar." } ] },
        { t: "Falei demais. Ela deve ter achado chato.", emo: ["Vergonha", "Ansiedade"], reac: [
          { t: "Apagar a mensagem", logo: "Parece que resolve a vergonha.", depois: "Ela fica sem entender, e o que era importante não foi dito." },
          { t: "Lembrar que ela já respondeu outras vezes", logo: "O pensamento perde um pouco de força.", depois: "Você consegue esperar sem se culpar." },
          { t: "Perguntar mais tarde, com calma, se ela viu", logo: "Exige um pouco de coragem.", depois: "Você tira a dúvida com quem sabe a resposta, em vez de adivinhar." } ] },
      ] },
    { id: "s2", titulo: "Desafinei na frente da turma", cena: "Na aula de canto, você desafina no meio da música e escuta uma risadinha no fundo da sala.",
      pens: [
        { t: "Todo mundo está rindo de mim. Sou ridícula.", emo: ["Vergonha", "Raiva", "Tristeza"], reac: [
          { t: "Parar no meio e sair da sala", logo: "Sai da exposição na hora.", depois: "Voltar na próxima aula pode parecer ainda mais difícil." },
          { t: "Responder com uma grosseria para quem riu", logo: "A raiva sai.", depois: "Pode virar briga, e a atenção vai da música para a confusão." },
          { t: "Respirar e terminar a música", logo: "O coração continua acelerado.", depois: "Você percebe que conseguiu seguir, mesmo com vergonha." } ] },
        { t: "Errar faz parte de aprender a cantar.", emo: ["Frustração leve", "Calma"], reac: [
          { t: "Rir junto e recomeçar o trecho", logo: "O clima fica mais leve.", depois: "O erro vira só um momento, não a apresentação inteira." },
          { t: "Pedir para a professora repetir a nota", logo: "Um pouquinho de exposição.", depois: "Você aprende o trecho e fica mais segura." } ] },
        { t: "Ninguém deve ter reparado tanto quanto eu.", emo: ["Alívio", "Vergonha leve"], reac: [
          { t: "Continuar como se nada tivesse acontecido", logo: "O foco fica na música.", depois: "Mais tarde, talvez você até comente o erro com uma amiga e ria." },
          { t: "Ficar repassando o erro na cabeça o dia todo", logo: "A vergonha volta várias vezes.", depois: "Ruminar cansa e não muda o que aconteceu. Vale perceber quando isso começa." } ] },
      ] },
    { id: "s3", titulo: "Desliga esse celular!", cena: "Você está no meio de um vídeo quando sua mãe diz, em tom alto: desliga esse celular agora e vai fazer a lição!",
      pens: [
        { t: "Ela nunca me deixa em paz.", emo: ["Raiva", "Irritação"], reac: [
          { t: "Gritar de volta e bater a porta", logo: "A raiva sai de uma vez.", depois: "O clima pesa, e a lição continua lá, agora com mais tensão." },
          { t: "Fingir que não ouviu", logo: "Ganha mais alguns minutos de vídeo.", depois: "A cobrança volta mais forte." },
          { t: "Dizer: tô irritada, me dá cinco minutos e eu vou", logo: "Exige segurar a raiva.", depois: "Aumenta a chance de um acordo e de menos briga." } ] },
        { t: "Ela deve estar preocupada com a minha prova.", emo: ["Incômodo", "Compreensão"], reac: [
          { t: "Desligar e ir, mesmo contrariada", logo: "Um pouco de irritação.", depois: "A lição sai, e a conversa com ela fica mais leve depois." },
          { t: "Propor um combinado: terminar o vídeo e começar às 17h", logo: "Precisa explicar com calma.", depois: "Vocês duas saem com algo que funciona." } ] },
        { t: "Eu sempre deixo tudo para depois. Sou um desastre.", emo: ["Culpa", "Tristeza"], reac: [
          { t: "Ir para o quarto e ficar mal sem fazer nada", logo: "A tristeza toma conta.", depois: "A autocrítica cresce e a tarefa parece ainda maior." },
          { t: "Trocar por um pensamento mais justo: adiei hoje, posso começar agora", logo: "O peso diminui um pouco.", depois: "Fica mais fácil dar o primeiro passo." } ] },
      ] },
  ],
  emocoesTodas: ["Raiva", "Tristeza", "Medo", "Ansiedade", "Vergonha", "Culpa", "Frustração", "Ciúme", "Insegurança", "Alívio", "Calma", "Alegria"],
  emocoes: [
    { n: "Raiva", avisa: "Algo parece injusto ou passou de um limite.", corpo: "Rosto quente, mandíbula e mãos tensas, coração acelerado." },
    { n: "Tristeza", avisa: "Perdi algo importante, ou algo não saiu como eu queria.", corpo: "Peito apertado, nó na garganta, corpo pesado." },
    { n: "Ansiedade", avisa: "Tem algo incerto pela frente, e meu corpo está se preparando.", corpo: "Frio na barriga, respiração curta, inquietação." },
    { n: "Vergonha", avisa: "Me senti exposta ou julgada.", corpo: "Rosto vermelho, vontade de sumir, olhar para baixo." },
    { n: "Frustração", avisa: "Me esforcei e não deu certo, ou algo me travou.", corpo: "Tensão, suspiros, vontade de largar tudo." },
    { n: "Culpa", avisa: "Acho que fiz algo que feriu alguém ou meus valores.", corpo: "Aperto no estômago, um pensamento que volta toda hora." },
    { n: "Ciúme", avisa: "Tenho medo de perder espaço ou carinho de alguém.", corpo: "Calor, agitação, vontade de conferir." },
    { n: "Alegria", avisa: "Algo é bom para mim e vale repetir.", corpo: "Leveza, energia, vontade de compartilhar." },
    { n: "Tédio", avisa: "Isso não está trazendo sentido ou novidade.", corpo: "Inquietação, sono, mão indo para o celular." },
  ],
  estrategias: [
    { id: "respirar", n: "Respiração lenta", pq: "Soltar o ar mais devagar do que puxa ativa o sistema do corpo que acalma. Não apaga a emoção, mas abaixa o volume para você conseguir pensar.", tryit: "breath" },
    { id: "nomear", n: "Dar nome ao que sinto", pq: "Pesquisas mostram que colocar a emoção em palavras diminui a intensidade dela. Nomear ajuda a parte do cérebro que pensa a entrar em cena.", how: "Complete por dentro: agora eu estou sentindo ___ porque ___." },
    { id: "ancorar", n: "5 · 4 · 3 · 2 · 1", pq: "Quando a cabeça dispara, trazer a atenção para os cinco sentidos puxa você de volta para o agora, onde a situação costuma ser menor do que parece.", tryit: "ground" },
    { id: "pausa", n: "Pausa antes de responder", pq: "A emoção sobe como uma onda e depois desce. Esperar alguns minutos faz você responder depois do pico, não no meio dele.", how: "Combine uma frase pronta: preciso de cinco minutos e já volto." },
    { id: "mover", n: "Mexer o corpo", pq: "Andar, alongar, dançar uma música: o movimento gasta a energia que a emoção acumulou no corpo.", how: "Uma música inteira de movimento. Depois volte e veja como está." },
    { id: "escrever", n: "Escrever ou desenhar", pq: "Tirar da cabeça e pôr no papel organiza o pensamento e diminui a sensação de turbilhão.", how: "Três minutos escrevendo sem se preocupar com a letra ou com o que está certo." },
    { id: "detetive", n: "Detetive do pensamento", pq: "Pensamentos automáticos parecem fatos. Fazer perguntas a eles ajuda a encontrar explicações mais justas e menos duras.", tryit: "detective" },
    { id: "conversar", n: "Falar com alguém de confiança", pq: "Dividir o que sente com alguém que acolhe ajuda o corpo a se acalmar e traz outros pontos de vista.", how: "Pense agora: quem seriam duas pessoas para quem você poderia mandar mensagem?" },
  ],
  frase: "Nem sempre posso escolher o que acontece, mas posso aprender novas maneiras de lidar com isso.",
};

/* ---------- CAPÍTULO FINAL ---------- */
const FIM = {
  momentos: ["Olhar o caminho", "Três cartões", "Minha caixa de ferramentas", "Mural de objetivos", "Carta para o meu eu do futuro"],
  perguntas: [
    { id: "q1", t: "Quando você pensa em como chegou aqui e em como está agora, o que mudou? E o que continua igual?" },
    { id: "q2", t: "Teve algo que foi difícil nesse caminho?" },
    { id: "q3", t: "Como foi, para você, vir às sessões? O que ajudou e o que não ajudou tanto?" },
    { id: "q4", t: "Tem algo que você gostaria que tivesse sido diferente?" },
  ],
  cartoes: [
    { id: "mente", t: "Minha mente", cls: "a", q: "Algo que entendi sobre como eu penso, presto atenção e me motivo." },
    { id: "atitudes", t: "Minhas atitudes", cls: "b", q: "Algo que eu faço, ou quero fazer, no meu dia a dia." },
    { id: "emocoes", t: "Minhas emoções", cls: "c", q: "Algo que aprendi sobre o que sinto e como posso lidar com isso." },
  ],
};

const REFERENCIAS = [
  "American Psychiatric Association. (2022). Diagnostic and statistical manual of mental disorders (5th ed., text rev.; DSM-5-TR).",
  "World Health Organization. (2022). ICD-11: 6A05 Attention deficit hyperactivity disorder.",
  "Faraone, S. V., et al. (2021). The World Federation of ADHD International Consensus Statement: 208 evidence-based conclusions about the disorder. Neuroscience & Biobehavioral Reviews, 128, 789–818.",
  "National Institute for Health and Care Excellence. (2018/2019). ADHD: diagnosis and management (NG87).",
  "Young, S., et al. (2020). Females with ADHD: an expert consensus statement. BMC Psychiatry, 20, 404.",
  "Diamond, A. (2013). Executive functions. Annual Review of Psychology, 64, 135–168.",
  "Shaw, P., Stringaris, A., Nigg, J., & Leibenluft, E. (2014). Emotion dysregulation in ADHD. American Journal of Psychiatry, 171(3), 276–293.",
  "Sibley, M. H. (2017). Parent–teen therapy for executive function deficits and ADHD. Guilford Press.",
  "Gollwitzer, P. M. (1999). Implementation intentions: strong effects of simple plans. American Psychologist, 54(7), 493–503.",
  "Lieberman, M. D., et al. (2007). Putting feelings into words: affect labeling disrupts amygdala activity. Psychological Science, 18(5), 421–428.",
  "Beck, J. S. (2021). Cognitive behavior therapy: basics and beyond (3rd ed.). Guilford Press.",
  "Gross, J. J. (2015). Emotion regulation: current status and future prospects. Psychological Inquiry, 26(1), 1–26.",
];

const GUIA = {
  mente: { obj: "Construir um vocabulário compartilhado sobre atenção, impulsividade, iniciação, motivação e variação contextual, mantendo o caráter investigativo (sem confirmar diagnóstico).", cuidados: ["Reforçar que as situações descritas acontecem com qualquer pessoa.", "No jogo dos mitos não há placar: explore o motivo de cada escolha.", "Use a etapa Conecte para levantar hipóteses sobre contexto (sono, ambiente, emoção)."] },
  acao: { obj: "Trabalhar iniciação, memória de trabalho, planejamento, priorização e flexibilidade, e apresentar estratégias externas como apoio legítimo à autonomia.", cuidados: ["No jogo, o foco é nas trocas e nos motivos, não em um plano ideal.", "Deixe que ela experimente as ferramentas de verdade, com tarefas reais da semana.", "Reforce: ser independente não significa fazer tudo sozinha."] },
  emocoes: { obj: "Apresentar o modelo pensamento-emoção-comportamento, ampliar o vocabulário emocional e o repertório de regulação.", cuidados: ["Todos os caminhos da história são válidos; explore o que cada reação tenta resolver.", "Situações pessoais podem trazer emoção real. Respeite as pausas.", "Use o detetive do pensamento com exemplos dela, se fizer sentido."] },
  caminho: { obj: "Encerramento terapêutico: integrar aprendizagens, reconhecer recursos, abrir espaço para avaliar o processo e projetar o futuro sem obrigação.", cuidados: ["Não induzir respostas positivas sobre a terapia: acolha críticas e ambivalências.", "Os objetivos são opcionais.", "A carta fica neste navegador; combinem juntas como guardá-la."] },
};


/* ---------- GUIA PARA A FAMÍLIA ---------- */
const FAMILIA = {
  intro: "Este material reúne informações sobre atenção, organização e emoções na adolescência, e sobre o TDAH, que está em processo de investigação. Ele não pretende dizer como uma família deve funcionar: cada família tem sua história, seus valores e seus recursos. A ideia é ampliar a compreensão e abrir conversas, inclusive com os profissionais que acompanham sua filha.",
  secoes: [
    { t: "O que é o TDAH", p: ["O Transtorno do Déficit de Atenção e Hiperatividade é um transtorno do neurodesenvolvimento, caracterizado por um padrão persistente de desatenção e/ou hiperatividade-impulsividade, presente em mais de um contexto e com impacto no funcionamento. Estima-se que atinja cerca de 5% das crianças e adolescentes.", "Há forte influência genética e diferenças, em média, no funcionamento de redes cerebrais ligadas à atenção, à motivação e à recompensa. O diagnóstico é clínico, não se baseia em exames isolados e considera outras explicações possíveis, como sono, ansiedade, humor e dificuldades de aprendizagem. O TDAH não é resultado de falta de esforço, de inteligência ou de educação inadequada."] },
    { t: "Como pode aparecer na adolescência", p: ["A adolescência traz mais matérias, prazos mais longos, mais vida social e mais expectativa de autonomia, enquanto as habilidades de planejamento e autorregulação ainda estão em desenvolvimento. É comum que a agitação visível diminua e ganhem destaque a desatenção, a desorganização, a dificuldade com prazos e a intensidade emocional.", "Em meninas, os sinais podem ser mais discretos: menos agitação e mais inquietação interna, distração e esforço para compensar. Esse esforço nem sempre aparece para quem está de fora, mas pode gerar cansaço, ansiedade e autocrítica."] },
    { t: "Entre saber e fazer", p: ["Muitas vezes a adolescente sabe o que precisa fazer; a dificuldade está em fazer no momento certo. Em casa, isso pode aparecer como esquecer combinados, perder objetos, subestimar o tempo das tarefas ou começar várias coisas sem terminar.", "Essa diferença entre saber e executar ajuda a entender por que lembretes, listas e estruturas visíveis tendem a funcionar melhor do que repetir a orientação."] },
    { t: "Emoções e autoestima", p: ["Muitos adolescentes sentem frustração e irritação com intensidade e demoram para voltar à calma, especialmente diante de mudanças inesperadas ou críticas. Em momentos de emoção alta, conversas longas costumam ter pouco efeito; retomar o assunto mais tarde tende a ser mais produtivo.", "Também é comum ter ouvido mais correções do que reconhecimentos. Perceber esforços, valorizar interesses e separar a pessoa do comportamento protegem a autoestima."] },
    { t: "Vida escolar", p: ["Instruções por escrito, divisão de trabalhos longos em etapas, prazos intermediários e confirmação de tarefas na agenda são apoios comuns. A parceria com a escola costuma ajudar mais quando a adolescente participa das decisões sobre o que compartilhar.", "No Brasil, a Lei nº 14.254/2021 prevê o acompanhamento integral de estudantes com TDAH, dislexia ou outros transtornos de aprendizagem na educação básica."] },
  ],
  possibilidades: [
    ["Rotinas visíveis", "Quadros, listas na porta ou lembretes no celular, combinados com a adolescente, reduzem o que precisa ser lembrado. O formato importa menos do que fazer sentido para ela."],
    ["Instruções que cabem na memória", "Pedidos curtos, um de cada vez, feitos quando ela está disponível para ouvir. Pedir que registre ou repita com as próprias palavras também ajuda."],
    ["Tarefas em partes", "Arrumar o quarto pode parecer grande e vago. Partes concretas e prazos intermediários facilitam começar e terminar."],
    ["Autonomia em degraus", "Primeiro fazer junto, depois acompanhar de perto e, por fim, à distância. Reduzir o apoio aos poucos costuma funcionar melhor do que retirá-lo de uma vez."],
    ["Limites combinados", "Poucas regras, claras e conversadas com antecedência. Consequências previsíveis, combinadas fora do momento de tensão."],
    ["Reconhecimento específico", "Você começou a tarefa sozinha tem mais efeito do que elogios gerais. Compare o progresso com o ponto de partida dela, não com outras pessoas."],
  ],
  pares: [
    ["Você nunca presta atenção!", "Preciso te pedir uma coisa importante. Pode olhar para mim um instante?"],
    ["Quantas vezes vou ter que repetir?", "Vamos anotar no quadro, assim não depende só da memória."],
    ["Você é muito desorganizada.", "Essa mochila está difícil de organizar. Quer montar uma lista de conferência comigo?"],
    ["Para de drama!", "Estou vendo que você ficou muito chateada. Quando estiver mais calma, conversamos."],
    ["Esqueceu de novo?!", "Acontece. O que pode te lembrar da próxima vez?"],
  ],
  fecho: "Procure os profissionais que acompanham sua filha sempre que tiver dúvidas, perceber sofrimento emocional intenso, mudanças importantes de humor, sono ou comportamento, ou quando os conflitos em casa estiverem difíceis de manejar. Cuidar de quem cuida também faz parte do processo.",
};
