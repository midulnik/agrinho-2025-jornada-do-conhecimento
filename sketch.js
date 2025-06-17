// Variáveis para os botões do menu inicial
let btnJogar;
let btnInstrucoes;
let btnCreditos;
let btnReiniciarJogo; // Botão de reiniciar na tela de "perdeu"
let btnVoltar; // Botão de voltar genérico

// --- Variáveis de Jogo Geral ---
let telaAtual = "inicio"; // Controla qual tela está ativa
let historiaPasso = 0; // Controla o passo da história

// --- Variáveis de Minigame 1: Onibus ---
let onibusX, onibusY;
let obstaculos = [];
let velocidadeOnibus = 3; // Velocidade inicial do ônibus
let minigame1Perdeu = false;
let minigame1Ganhou = false;
let tempoInicialMinigame1;
let duracaoMinigame1 = 30; // Aumentado para 30 segundos

// --- Variáveis de Minigame 2: Verdadeiro ou Falso ---
let fatosMinigame2 = [
    { texto: "A agricultura familiar é importante para a segurança alimentar do Brasil.", resposta: true },
    { texto: "Sustentabilidade na agricultura significa usar os recursos sem pensar nas gerações futuras.", resposta: false },
    { texto: "A biodiversidade não tem relação com a saúde dos ecossistemas agrícolas.", resposta: false },
    { texto: "O manejo adequado do solo ajuda a manter sua fertilidade e evitar a erosão.", resposta: true },
    { texto: "A conservação hídrica é irrelevante para a agricultura familiar.", resposta: false },
    { texto: "A universidade aprende com o campo a resiliência e a sabedoria ancestral.", resposta: true },
    { texto: "A troca de conhecimentos entre academia e campo gera inovação.", resposta: true },
    { texto: "A soberania dos povos está ligada à segurança alimentar.", resposta: true },
    { texto: "A extensão universitária busca apenas levar conhecimento da universidade para a universidade, e não trazê-lo do campo.", resposta: false }, // Ajustei o texto para ficar mais claro o "FALSO"
    { texto: "A valorização das tradições locais é um pilar da troca de conhecimentos.", resposta: true }
];
let indiceFatoAtual = 0;
let tempoExibicaoFato = 5; // Segundos para cada fato
let tempoUltimaResposta = 0; // Para controlar o tempo entre fatos
let scoreMinigame2 = 0;
let totalFatosCorretosNecessarios = 7; // Quantidade de fatos corretos para vencer
let tempoInicialMinigame2;
let tempoLimiteMinigame2 = 120; // Aumentado para 120 segundos
let minigame2Perdeu = false;
let minigame2Ganhou = false;
let btnVerdadeiro;
let btnFalso;

// --- Variáveis de Minigame 3: Resiliência Agrícola ---
let plantasCampo = []; // Array de objetos { x, y, estado (semente, crescendo, madura, danificada), tipo, tempoPlantio }
let pragas = []; // Array de objetos { x, y, tipo, plantaAlvo }
let metaProducao = 10; // Quantidade de colheitas para vencer
let colheitasFeitas = 0;
let tempoInicialMinigame3;
let tempoLimiteMinigame3 = 60; // 60 segundos
let minigame3Perdeu = false;
let minigame3Ganhou = false;
let nivelSaudeFazenda = 100; // Começa com 100%
let taxaDanoPraga = 0.5; // Dano por segundo de praga na planta
let taxaDanoIntemperie = 1; // Dano por evento climático não tratado (dano base)
let tempoProximaPraga = 0;
let tempoProximoEventoClimatico = 0;
let mensagemClimatica = ""; // Para exibir alertas climáticos
let tempoMensagemClimatica = 0; // Tempo em que a mensagem climática foi exibida
const DURACAO_MSG_CLIMATICA = 3000; // 3 segundos para a mensagem climática

// --- Variáveis de Minigame 4: Separar Itens ---
let comidasCaindo = [];
let lixosCaindo = [];
let caixaComidaX, caixaLixoX; // Posições X das caixas
let caixaY; // Posição Y das caixas (fixa)
let velocidadeQueda = 2;
let itemSpawnRate = 1000; // Tempo em ms para spawnar um novo item
let tempoUltimoItem = 0;
let itemsColetadosComida = 0;
let itemsColetadosLixo = 0;
let metaComida = 10;
let metaLixo = 10;
let caixaLargura = 150;
let caixaAltura = 80;
let minigame4Perdeu = false;
let minigame4Ganhou = false;
let tempoInicialMinigame4;
let tempoLimiteMinigame4 = 90; // 90 segundos

// Variáveis para controlar o movimento das caixas com o mouse
let arrastandoCaixaComida = false;
let arrastandoCaixaLixo = false;
let offsetXCaixaComida, offsetYCaixaComida;
let offsetXCaixaLixo, offsetYCaixaLixo;


function preload() {
    // Nenhuma imagem está sendo carregada no momento, usando apenas formas e emojis.
}

function setup() {
    createCanvas(1000, 600); // Aumentei o tamanho do canvas para mais espaço
    textAlign(CENTER, CENTER);
    textFont('Arial');

    // --- Configuração dos Botões do Menu Inicial ---
    btnJogar = createButton('INICIAR JOGO');
    btnJogar.class('game-button main-button'); // Adiciona classes CSS para estilização
    btnJogar.mousePressed(() => {
        telaAtual = "introducao_historia";
        esconderBotoesMenu();
    });

    btnInstrucoes = createButton('INSTRUÇÕES');
    btnInstrucoes.class('game-button');
    btnInstrucoes.mousePressed(() => {
        telaAtual = "instrucoes";
        esconderBotoesMenu();
    });

    btnCreditos = createButton('CRÉDITOS');
    btnCreditos.class('game-button');
    btnCreditos.mousePressed(() => {
        telaAtual = "creditos";
        esconderBotoesMenu();
    });

    btnReiniciarJogo = createButton('REINICIAR JOGO');
    btnReiniciarJogo.class('game-button restart-button');
    btnReiniciarJogo.mousePressed(reiniciarJogo);
    btnReiniciarJogo.hide();

    btnVoltar = createButton('VOLTAR');
    btnVoltar.class('game-button back-button');
    btnVoltar.mousePressed(() => {
        telaAtual = "inicio";
        posicionarBotoesMenu();
        // Garante que os botões do minigame 2 estejam escondidos ao voltar
        if (btnVerdadeiro) btnVerdadeiro.hide();
        if (btnFalso) btnFalso.hide();
    });
    btnVoltar.hide(); // Escondido por padrão

    posicionarBotoesMenu(); // Posiciona os botões no setup
    aplicarEstilosCSS(); // Aplica estilos CSS aos botões
}

function draw() {
    background(220); // Fundo cinza claro padrão

    // Estrutura principal para alternar entre as telas
    switch (telaAtual) {
        case "inicio":
            desenharTelaInicio();
            break;
        case "introducao_historia":
            desenharIntroducaoHistoria();
            break;
        case "historia_pos_mg1":
            desenharHistoriaPosMG1();
            break;
        case "historia_pos_mg2":
            desenharHistoriaPosMG2();
            break;
        case "historia_pos_mg3":
            desenharHistoriaPosMG3();
            break;
        case "minigame1":
            desenharMinigame1();
            break;
        case "minigame2":
            desenharMinigame2();
            break;
        case "minigame3":
            desenharMinigame3();
            break;
        case "minigame4":
            desenharMinigame4();
            break;
        case "instrucoes":
            desenharTelaInstrucoes();
            break;
        case "creditos":
            desenharTelaCreditos();
            break;
        case "parabens":
            desenharTelaParabens();
            break;
        case "perdeu":
            desenharTelaPerdeu();
            break;
        case "final_vitoria":
            desenharFinalVitoria();
            break;
    }
}

// --- Funções Auxiliares de Botões e Estilo ---
function aplicarEstilosCSS() {
    // Adiciona estilos CSS para os botões via JavaScript
    // Isso é uma alternativa se você não tiver um arquivo style.css
    let style = document.createElement('style');
    style.innerHTML = `
        .game-button {
            background-color: #4CAF50; /* Verde */
            border: none;
            color: white;
            padding: 15px 32px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 18px;
            margin: 4px 2px;
            cursor: pointer;
            border-radius: 8px;
            transition-duration: 0.4s;
            box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
        }
        .game-button:hover {
            background-color: #45a049;
            box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
        }
        .main-button {
            background-color: #008CBA; /* Azul */
            font-size: 24px;
            padding: 20px 40px;
        }
        .main-button:hover {
            background-color: #007bb5;
        }
        .restart-button {
            background-color: #f44336; /* Vermelho */
        }
        .restart-button:hover {
            background-color: #da190b;
        }
        .back-button {
            background-color: #555555; /* Cinza escuro */
            position: absolute;
            top: 20px;
            right: 20px;
            font-size: 16px;
            padding: 10px 20px;
        }
        .back-button:hover {
            background-color: #333333;
        }
        input {
            padding: 10px;
            border-radius: 5px;
            border: 1px solid #ccc;
            font-size: 16px;
            box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
        }
    `;
    document.head.appendChild(style);
}

function posicionarBotoesMenu() {
    btnJogar.position(width / 2 - btnJogar.width / 2, height / 3);
    btnInstrucoes.position(width / 2 - btnInstrucoes.width / 2, height / 2);
    btnCreditos.position(width / 2 - btnCreditos.width / 2, height / 2 + 80);
    mostrarBotoesMenu();
    btnVoltar.hide(); // Garante que o botão voltar esteja escondido no menu principal
}

function esconderBotoesMenu() {
    btnJogar.hide();
    btnInstrucoes.hide();
    btnCreditos.hide();
    // Esconde botões específicos do minigame 2 se estiverem ativos
    if (btnVerdadeiro) btnVerdadeiro.hide();
    if (btnFalso) btnFalso.hide();
}

function mostrarBotoesMenu() {
    btnJogar.show();
    btnInstrucoes.show();
    btnCreditos.show();
}

// --- Funções de Inicialização de Minigames ---
function iniciarMinigame1() {
    console.log("Iniciando Minigame 1");
    onibusX = width / 4;
    onibusY = height / 2;
    obstaculos = [];
    velocidadeOnibus = 5; // Velocidade inicial do ônibus
    minigame1Perdeu = false;
    minigame1Ganhou = false;
    tempoInicialMinigame1 = millis();
    for (let i = 0; i < 5; i++) { // Mais obstáculos iniciais
        gerarObstaculo();
    }
}

function iniciarMinigame2() {
    console.log("Iniciando Minigame 2");
    indiceFatoAtual = 0;
    scoreMinigame2 = 0;
    tempoInicialMinigame2 = millis();
    tempoUltimaResposta = millis(); // Reinicia o contador para o primeiro fato
    minigame2Perdeu = false;
    minigame2Ganhou = false;

    // Cria os botões Verdadeiro/Falso
    if (!btnVerdadeiro) { // Garante que o botão só seja criado uma vez
        btnVerdadeiro = createButton('VERDADEIRO');
        btnVerdadeiro.class('game-button');
        btnVerdadeiro.mousePressed(() => verificarRespostaMinigame2(true));
    }
    btnVerdadeiro.position(width / 2 - 150, height - 100);
    btnVerdadeiro.show();

    if (!btnFalso) { // Garante que o botão só seja criado uma vez
        btnFalso = createButton('FALSO');
        btnFalso.class('game-button');
        btnFalso.mousePressed(() => verificarRespostaMinigame2(false));
    }
    btnFalso.position(width / 2 + 50, height - 100);
    btnFalso.show();
}

function iniciarMinigame3() {
    console.log("Iniciando Minigame 3");
    plantasCampo = [];
    pragas = [];
    colheitasFeitas = 0;
    nivelSaudeFazenda = 100;
    tempoInicialMinigame3 = millis();
    minigame3Perdeu = false;
    minigame3Ganhou = false;
    tempoProximaPraga = millis() + random(2000, 5000); // Primeira praga em 2-5 segundos
    tempoProximoEventoClimatico = millis() + random(10000, 20000); // Primeiro evento em 10-20 segundos
    mensagemClimatica = "";

    // Preencher o campo com algumas plantas iniciais
    for (let i = 0; i < 6; i++) {
        // Garante que as plantas nasçam dentro da área jogável
        plantasCampo.push({
            x: random(70, width - 70),
            y: random(120, height - 180),
            estado: 'semente', // 'semente', 'crescendo', 'madura', 'danificada'
            tipo: floor(random(3)), // 0, 1, 2 para diferentes tipos de planta
            tempoPlantio: millis()
        });
    }
    // Esconder botões do minigame 2 se estiverem ativos
    if (btnVerdadeiro) btnVerdadeiro.hide();
    if (btnFalso) btnFalso.hide();
}

function iniciarMinigame4() {
    console.log("Iniciando Minigame 4");
    comidasCaindo = [];
    lixosCaindo = [];
    itemsColetadosComida = 0;
    itemsColetadosLixo = 0;
    minigame4Perdeu = false;
    minigame4Ganhou = false;
    tempoInicialMinigame4 = millis();
    tempoUltimoItem = millis();
    nivelSaudeFazenda = 100; // Reinicia a saúde da fazenda para o minigame 4

    // Posições iniciais das caixas
    caixaY = height - 100;
    caixaComidaX = width / 4 - caixaLargura / 2;
    caixaLixoX = width * 3 / 4 - caixaLargura / 2;

    // Esconder botões do minigame 2 se estiverem ativos
    if (btnVerdadeiro) btnVerdadeiro.hide();
    if (btnFalso) btnFalso.hide();
}

// --- Telas Principais ---
function desenharTelaInicio() {
    background(50, 150, 200); // Azul vibrante
    fill(255);
    textSize(60);
    text("A Jornada do Conhecimento", width / 2, height / 4 - 20);
    textSize(28);
    text("Do Campo à Academia e de Volta!", width / 2, height / 4 + 40);
    btnVoltar.hide(); // Garante que o botão voltar esteja escondido
}

function desenharIntroducaoHistoria() {
    background(180, 220, 250); // Azul claro
    fill(0);
    textSize(32);
    text("A História de Lucas: O Início da Jornada", width / 2, 80); // Corrigido para Lucas

    textSize(18); // Ajuste de tamanho de fonte
    textAlign(LEFT, TOP); // Alinhamento para parágrafos
    let historiaTexto;

    switch (historiaPasso) {
        case 0:
            historiaTexto = "Lucas nasceu e cresceu no campo, sua família nunca recebeu a educação necessária para uma melhoria de vida.";
            break;
        case 1:
            historiaTexto = "Mas Lucas sempre sonhou em ir além, em estudar e trazer uma melhoria para as condições da família.";
            break;
        case 2:
            historiaTexto = "Chegou o dia em que ele precisou embarcar em uma nova jornada, desafiadora e cheia de incertezas: o longo e sinuoso caminho para a universidade, onde o futuro o aguardava.";
            break;
        case 3:
            telaAtual = "minigame1";
            iniciarMinigame1();
            return;
    }

    // A área do texto é definida por (x, y, largura, altura)
    text(historiaTexto, 100, 150, width - 200, height - 200); // Margem de 100px de cada lado

    desenharBotaoContinuarHistoria();
    btnVoltar.hide();
}

function desenharHistoriaPosMG1() {
    background(180, 220, 250);
    fill(0);
    textSize(32);
    text("A Chegada e o Primeiro Grande Tema", width / 2, 80);
    textSize(18); // Ajuste de tamanho de fonte
    textAlign(LEFT, TOP); // Alinhamento para parágrafos

    let historiaTexto;
    switch (historiaPasso) {
        case 0: // Reseta para 0 para a nova parte da história
            historiaTexto = "Após uma viagem turbulenta, Lucas finalmente chegou à metrópole, lar da universidade. O burburinho da cidade era um contraste gritante com a quietude do campo. Ele se sentia um pouco deslocado, mas a sede por conhecimento era maior."; // Corrigido para Lucas
            break;
        case 1:
            historiaTexto = "Nas primeiras aulas, Lucas percebeu que a linguagem acadêmica era complexa e cheia de termos novos. Ele precisava aprender a sintetizar informações e identificar os conceitos-chave rapidamente para acompanhar o ritmo."; // Corrigido para Lucas
            break;
        case 2:
            telaAtual = "minigame2";
            iniciarMinigame2();
            return;
    }
    text(historiaTexto, 100, 150, width - 200, height - 200); // Margem de 100px de cada lado
    desenharBotaoContinuarHistoria();
    btnVoltar.hide();
}

function desenharHistoriaPosMG2() {
    background(180, 220, 250);
    fill(0);
    textSize(32);
    text("O Retorno e o Desafio da Adaptação", width / 2, 80);
    textSize(18); // Ajuste de tamanho de fonte
    textAlign(LEFT, TOP); // Alinhamento para parágrafos

    let historiaTexto;
    switch (historiaPasso) {
        case 0: // Reseta para 0 para a nova parte da história
            historiaTexto = "Com a mente afiada e o coração cheio de ideias, Lucas sentiu que era hora de voltar para casa. Ele queria aplicar o que aprendeu, mas sabia que o campo tinha suas próprias regras e desafios."; // Corrigido para Lucas
            break;
        case 1:
            historiaTexto = "A fazenda, embora familiar, apresentava problemas que o conhecimento acadêmico por si só não resolvia. Pragas, mudanças climáticas e a necessidade de otimizar a produção exigiam resiliência e tomada de decisões rápidas.";
            break;
        case 2:
            telaAtual = "minigame3";
            iniciarMinigame3();
            return;
    }
    text(historiaTexto, 100, 150, width - 200, height - 200); // Margem de 100px de cada lado
    desenharBotaoContinuarHistoria();
    btnVoltar.hide();
}

function desenharHistoriaPosMG3() {
    background(180, 220, 250);
    fill(0);
    textSize(32);
    text("O Elo Perdido e a Comunicação", width / 2, 80);
    textSize(18); // Ajuste de tamanho de fonte
    textAlign(LEFT, TOP); // Alinhamento para parágrafos

    let historiaTexto;
    switch (historiaPasso) {
        case 0: // Reseta para 0 para a nova parte da história
            historiaTexto = "Lucas conseguiu estabilizar a produção da fazenda, mas percebeu que o verdadeiro impacto da extensão universitária estava em compartilhar o saber. Ele queria criar pontes entre a academia e a sua comunidade."; // Corrigido para Lucas
            break;
        case 1:
            historiaTexto = "Afinal, o conhecimento não deveria ser uma via de mão única. Era preciso valorizar a sabedoria ancestral do campo e levá-la de volta para a universidade, promovendo uma troca rica e contínua.";
            break;
        case 2:
            telaAtual = "minigame4";
            iniciarMinigame4();
            return;
    }
    text(historiaTexto, 100, 150, width - 200, height - 200); // Margem de 100px de cada lado
    desenharBotaoContinuarHistoria();
    btnVoltar.hide();
}

function desenharBotaoContinuarHistoria() {
    fill(50, 180, 100);
    rect(width - 200, height - 80, 150, 50, 10);
    fill(255);
    textSize(20);
    textAlign(CENTER, CENTER);
    text("Continuar", width - 125, height - 55);
}

function desenharTelaInstrucoes() {
    background(255, 200, 100); // Laranja claro
    fill(0);
    textSize(40);
    text("Instruções do Jogo", width / 2, 80);
    textSize(16); // Ajuste de tamanho de fonte para caber mais conteúdo
    textAlign(LEFT, TOP);

    let instrucoesTexto = `
    Objetivo: Ajude Lucas a conectar o saber acadêmico com a sabedoria do campo!

    1.  Minigame 1: O Caminho para a Universidade
        * Controle o ônibus com as setas UP/DOWN (CIMA/BAIXO).
        * Desvie dos cones de trânsito laranja que surgem na estrada, cuja velocidade aumenta!
        * Sobreviva por 30 segundos!

    2.  Minigame 2: Conexão Campo-Educação
        * Uma pessoa virtual apresentará diversos fatos.
        * Você terá que identificar se cada afirmação é VERDADEIRA ou FALSA clicando no botão correspondente.
        * Responda a cada fato em até 5 segundos.
        * Atinja a meta de 7 fatos corretos dentro do tempo limite de 120 segundos para vencer!

    3.  Minigame 3: Resiliência Agrícola
        * Gerencie uma plantação em tempo real. Clique em pontos vazios para plantar sementes (🌱).
        * Fique atento a pragas (☣️) que surgem; clique nelas para removê-las!
        * Eventos climáticos (seca/chuva) exigirão sua atenção; você receberá alertas.
        * Colha as plantas maduras (🌾) clicando nelas para atingir a meta de produção.
        * Gerencie a saúde da fazenda (barra superior). Se zerar, você perde!
        * Sobreviva por 60 segundos e colha o suficiente!

    4.  Minigame 4: Separe os Itens
        * Itens (comidas e lixos) cairão do céu.
        * Arraste os cestos (um para comida, outro para lixo) com o mouse para coletar os itens.
        * Colete todos os itens de comida (🌽, 🍅, 🥦, 🥕) na caixa verde e os itens de lixo (🗑️, 🔋, 🧪) na caixa vermelha.
        * Se um item cair no chão, a saúde da fazenda será penalizada!
        * Atinja a meta de itens coletados dentro de 90 segundos!

    Perdeu? Um botão "Reiniciar Jogo" aparecerá para tentar novamente do início.
    Ganhou? Avance para a próxima etapa da história de Lucas!
    `;
    text(instrucoesTexto, 50, 150, width - 100, height - 150); // Margem de 50px de cada lado
    btnVoltar.show(); // Mostra o botão de voltar
}

function desenharTelaCreditos() {
    background(180, 150, 220); // Roxo claro
    fill(0);
    textSize(40);
    text("Créditos", width / 2, 100);
    textSize(22);
    text("Conceito e Programação: [Seu Nome/Equipe]", width / 2, 200);
    text("Design Visual: [Seu Nome/Equipe]", width / 2, 240);
    text("Música e Efeitos Sonoros: [Mencionar fontes ou criar]", width / 2, 280);
    textSize(20); // Ajuste de tamanho de fonte
    text("Inspirado na conexão Campo-Cidade e Extensão Universitária.", width / 2, 340);
    text("Agradecimento especial aos agricultores familiares por sua sabedoria.", width / 2, 380);

    btnVoltar.show(); // Mostra o botão de voltar
}

function desenharTelaParabens() {
    background(150, 250, 150); // Verde claro
    fill(0);
    textSize(50);
    text("Parabéns!", width / 2, height / 2 - 60);
    textSize(30);
    text("Você concluiu esta etapa!", width / 2, height / 2 + 10);

    fill(50, 180, 100);
    rect(width / 2 - 100, height - 120, 200, 60, 10);
    fill(255);
    textSize(24);
    textAlign(CENTER, CENTER); // Garante que o texto do botão esteja centralizado
    text("Continuar Jornada", width / 2, height - 90);
    btnVoltar.hide();
}

function desenharTelaPerdeu() {
    background(255, 100, 100); // Vermelho
    fill(0);
    textSize(50);
    text("Você Perdeu!", width / 2, height / 2 - 60);
    textSize(28);
    text("A Jornada de Lucas Continua! Tente Novamente!", width / 2, height / 2 + 10); // Corrigido para Lucas

    btnReiniciarJogo.position(width / 2 - btnReiniciarJogo.width / 2, height - 120);
    btnReiniciarJogo.show();
    // Esconder botões de minigames específicos em caso de derrota
    if (btnVerdadeiro) btnVerdadeiro.hide();
    if (btnFalso) btnFalso.hide();
    btnVoltar.hide();
}

function desenharFinalVitoria() {
    background(100, 100, 255); // Azul forte
    fill(255);
    textSize(50);
    text("A Jornada de Lucas Completa!", width / 2, height / 3 - 30); // Corrigido para Lucas
    textSize(28);
    text("Com o conhecimento da universidade e a sabedoria do campo,", width / 2, height / 3 + 30);
    text("a fazenda prosperou e a comunidade se fortaleceu!", width / 2, height / 3 + 70);
    textSize(22);
    text("Obrigado por jogar esta incrível aventura!", width / 2, height - 150);

    textSize(26); // Reduzido para caber melhor
    fill(255, 255, 0); // Amarelo para a frase final
    // Definindo uma área para o texto final
    text("No entrelaçar do saber acadêmico e da sabedoria ancestral do campo,\nfloresce o verdadeiro progresso da humanidade.", width / 2, height - 100, width - 100, 80); // Ajuste a largura e altura da caixa
    // Nota: O \n ainda funcionará para quebra de linha manual dentro da string.

    btnVoltar.show(); // Mostra o botão de voltar ao menu inicial
}

// --- Lógica de Reinício do Jogo ---
function reiniciarJogo() {
    telaAtual = "inicio";
    historiaPasso = 0;

    // Resetar todas as variáveis dos minigames
    minigame1Perdeu = false;
    minigame1Ganhou = false;
    velocidadeOnibus = 5;
    obstaculos = [];

    minigame2Perdeu = false;
    minigame2Ganhou = false;
    indiceFatoAtual = 0;
    scoreMinigame2 = 0;
    if (btnVerdadeiro) btnVerdadeiro.hide();
    if (btnFalso) btnFalso.hide();

    minigame3Perdeu = false;
    minigame3Ganhou = false;
    plantasCampo = [];
    pragas = [];
    colheitasFeitas = 0;
    nivelSaudeFazenda = 100;
    mensagemClimatica = "";

    minigame4Perdeu = false;
    minigame4Ganhou = false;
    comidasCaindo = [];
    lixosCaindo = [];
    itemsColetadosComida = 0;
    itemsColetadosLixo = 0;
    velocidadeQueda = 2;
    itemSpawnRate = 1000;

    btnReiniciarJogo.hide();
    posicionarBotoesMenu();
}

// --- Funções do Minigame 1: Ônibus ---
function desenharMinigame1() {
    background(50, 150, 50); // Verde mais realista para a grama
    fill(150, 150, 150); // Cor da estrada
    rect(0, height / 4, width, height / 2); // Área da estrada
    fill(255, 255, 0); // Linhas da estrada
    for (let i = 0; i < width; i += 50) {
        rect(i, height / 2 - 2, 30, 4);
    }

    // Desenhar o ônibus
    fill(255, 255, 0); // Amarelo vibrante
    rect(onibusX, onibusY, 80, 40, 10); // Corpo do ônibus com cantos arredondados
    fill(0, 0, 255); // Azul para as janelas
    rect(onibusX + 10, onibusY + 12, 15, 15); // Janela menor
    rect(onibusX + 55, onibusY + 12, 15, 15); // Janela menor
    fill(0);
    ellipse(onibusX + 20, onibusY + 40, 15, 15); // Roda
    ellipse(onibusX + 60, onibusY + 40, 15, 15); // Roda

    // Mover o ônibus com as setas UP/DOWN
    if (keyIsDown(UP_ARROW)) {
        onibusY -= velocidadeOnibus;
    }
    if (keyIsDown(DOWN_ARROW)) {
        onibusY += velocidadeOnibus;
    }

    // Limitar o movimento do ônibus dentro da estrada
    onibusY = constrain(onibusY, height / 4, height * 3 / 4 - 40);


    // Desenhar e mover obstáculos (cones)
    for (let i = obstaculos.length - 1; i >= 0; i--) {
        let obs = obstaculos[i];
        fill(255, 100, 0); // Laranja para o cone
        // Desenhar o cone (exemplo simples de forma)
        triangle(obs.x, obs.y - 15, obs.x - 10, obs.y + 15, obs.x + 10, obs.y + 15);
        fill(255); // Faixa branca no cone
        rect(obs.x - 8, obs.y + 5, 16, 5);

        obs.x -= velocidadeOnibus;

        // Verificar colisão (ajustado para o novo tamanho do ônibus)
        // Colisão retangular mais precisa
        if (onibusX < obs.x + 10 &&
            onibusX + 80 > obs.x - 10 &&
            onibusY < obs.y + 15 &&
            onibusY + 40 > obs.y - 15) {
            minigame1Perdeu = true;
            break;
        }

        // Remover obstáculos fora da tela e gerar novos
        if (obs.x < -30) {
            obstaculos.splice(i, 1);
            if (random(1) < 0.7) { // Maior chance de gerar um novo
                gerarObstaculo();
            }
        }
    }

    // Aumentar a velocidade progressivamente
    velocidadeOnibus += 0.005; // Pequeno aumento por frame

    if (minigame1Perdeu) {
        telaAtual = "perdeu";
        return;
    }

    let tempoDecorridoMinigame1 = (millis() - tempoInicialMinigame1) / 1000;
    fill(0);
    textSize(24);
    text("Tempo: " + (duracaoMinigame1 - floor(tempoDecorridoMinigame1)) + "s", width / 2, 50);

    if (tempoDecorridoMinigame1 >= duracaoMinigame1 && !minigame1Ganhou) {
        minigame1Ganhou = true;
        telaAtual = "parabens";
        historiaPasso = 0; // Prepara para a próxima parte da história
    }
}

function gerarObstaculo() {
    obstaculos.push({
        x: width + random(50, 300),
        y: random(height / 4 + 20, height * 3 / 4 - 20)
    });
}

// --- Funções do Minigame 2: Verdadeiro ou Falso ---
function desenharMinigame2() {
    background(200, 200, 255); // Azul claro
    fill(0);
    textSize(32);
    text("Conexão Campo-Educação: Verdadeiro ou Falso?", width / 2, 60);

    // Exibe o fato atual
    if (indiceFatoAtual < fatosMinigame2.length) {
        let fato = fatosMinigame2[indiceFatoAtual];
        textSize(24);
        textAlign(CENTER, CENTER);
        text(fato.texto, width / 2, height / 2 - 50, width - 100); // Ajustado para ter margem

        let tempoDecorridoFato = (millis() - tempoUltimaResposta) / 1000;
        let tempoRestanteFato = max(0, tempoExibicaoFato - floor(tempoDecorridoFato));
        textSize(18);
        text("Tempo para responder: " + tempoRestanteFato + "s", width / 2, height / 2 + 50);

        if (tempoRestanteFato <= 0) {
            // Se o tempo para o fato acabar, penaliza e avança
            scoreMinigame2--; // Penaliza por não responder
            indiceFatoAtual++;
            tempoUltimaResposta = millis(); // Reinicia o tempo para o próximo fato
        }
    } else {
        // Se todos os fatos foram exibidos, verifica o resultado final
        let tempoTotalDecorrido = (millis() - tempoInicialMinigame2) / 1000;
        if (scoreMinigame2 >= totalFatosCorretosNecessarios && tempoTotalDecorrido < tempoLimiteMinigame2) {
            minigame2Ganhou = true;
            telaAtual = "parabens";
            historiaPasso = 0;
            btnVerdadeiro.hide();
            btnFalso.hide();
        } else {
            minigame2Perdeu = true;
            telaAtual = "perdeu";
            btnVerdadeiro.hide();
            btnFalso.hide();
        }
        return; // Sai da função draw para não continuar processando
    }

    // Exibe o tempo restante total do minigame
    let tempoTotalDecorrido = (millis() - tempoInicialMinigame2) / 1000;
    let tempoRestanteTotal = max(0, tempoLimiteMinigame2 - floor(tempoTotalDecorrido));
    textSize(20);
    fill(0);
    text("Tempo Total Restante: " + tempoRestanteTotal + "s", width / 2, height - 150);

    // Exibe o score
    fill(50, 150, 50);
    text("Fatos Corretos: " + max(0, scoreMinigame2) + "/" + totalFatosCorretosNecessarios, width / 2, height - 200);
    // Verifica condições de vitória/derrota com base no tempo total
    if (tempoRestanteTotal <= 0 && !minigame2Ganhou && !minigame2Perdeu) {
        minigame2Perdeu = true;
        telaAtual = "perdeu";
        btnVerdadeiro.hide();
        btnFalso.hide();
    }
}

function verificarRespostaMinigame2(respostaUsuario) {
    if (indiceFatoAtual < fatosMinigame2.length) {
        let fato = fatosMinigame2[indiceFatoAtual];
        if (fato.resposta === respostaUsuario) {
            scoreMinigame2++;
        } else {
            scoreMinigame2--; // Penaliza por resposta errada
        }
        indiceFatoAtual++;
        tempoUltimaResposta = millis(); // Reinicia o tempo para o próximo fato
    }
}

// --- Funções do Minigame 3: Resiliência Agrícola ---
function desenharMinigame3() {
    background(100, 180, 100); // Campo verde
    fill(60, 40, 0); // Cor da terra
    rect(50, 100, width - 100, height - 200, 20); // Área da fazenda

    // Barra de Saúde da Fazenda
    fill(255);
    rect(width / 2 - 150, 20, 300, 30, 10);
    fill(map(nivelSaudeFazenda, 0, 100, 255, 0), map(nivelSaudeFazenda, 0, 100, 0, 255), 0); // Gradiente de vermelho a verde
    rect(width / 2 - 150, 20, map(nivelSaudeFazenda, 0, 100, 0, 300), 30, 10);
    fill(0);
    textSize(18);
    textAlign(CENTER, CENTER);
    text("Saúde da Fazenda: " + floor(nivelSaudeFazenda) + "%", width / 2, 35);

    // Tempo Restante
    let tempoDecorrido = (millis() - tempoInicialMinigame3) / 1000;
    let tempoRestante = max(0, tempoLimiteMinigame3 - floor(tempoDecorrido));
    textSize(24);
    fill(0);
    textAlign(LEFT, CENTER);
    text("Tempo: " + tempoRestante + "s", 100, 50);

    // Meta de Colheita
    textAlign(RIGHT, CENTER);
    text("Colheitas: " + colheitasFeitas + "/" + metaProducao, width - 100, 50);

    // Desenhar e atualizar plantas com emojis
    for (let i = plantasCampo.length - 1; i >= 0; i--) {
        let planta = plantasCampo[i];
        let tempoCrescimento = (millis() - planta.tempoPlantio) / 1000;

        if (planta.estado === 'semente' && tempoCrescimento > 2) {
            planta.estado = 'crescendo';
        } else if (planta.estado === 'crescendo' && tempoCrescimento > 5) {
            planta.estado = 'madura';
        }

        push();
        translate(planta.x, planta.y);
        textSize(30); // Tamanho para o emoji
        if (planta.estado === 'semente') {
            text("🌱", 0, 0); // Semente
        } else if (planta.estado === 'crescendo') {
            text("🌿", 0, 0); // Planta crescendo
        } else if (planta.estado === 'madura') {
            text("🌾", 0, 0); // Planta madura (pode ser outro emoji de colheita)
        } else if (planta.estado === 'danificada') {
            text("🥀", 0, 0); // Planta danificada
        }
        pop();
    }

    // Gerar pragas
    if (millis() > tempoProximaPraga) {
        let plantasVivas = plantasCampo.filter(p => p.estado === 'crescendo' || p.estado === 'madura');
        if (plantasVivas.length > 0) {
            let plantaAlvo = random(plantasVivas);
            pragas.push({
                x: plantaAlvo.x + random(-10, 10),
                y: plantaAlvo.y + random(-10, 10),
                tipo: 'praga',
                plantaAlvo: plantaAlvo,
                tempoAparecimento: millis()
            });
            tempoProximaPraga = millis() + random(1000, 3000); // Próxima praga mais rápida
        }
    }

    // Desenhar e atualizar pragas com emojis
    for (let i = pragas.length - 1; i >= 0; i--) {
        let praga = pragas[i];
        textSize(30); // Tamanho para o emoji
        text("☣️", praga.x, praga.y); // Emoji de praga

        // Dano progressivo na planta alvo se ela não estiver danificada ainda
        if (praga.plantaAlvo && praga.plantaAlvo.estado !== 'danificada') {
            nivelSaudeFazenda -= taxaDanoPraga * (deltaTime / 1000); // Dano baseado no tempo
            nivelSaudeFazenda = max(0, nivelSaudeFazenda);
            if (nivelSaudeFazenda <= 0) {
                minigame3Perdeu = true; // Perde se a saúde zerar
            }
        }
    }

    // Gerar eventos climáticos
    if (millis() > tempoProximoEventoClimatico) {
        let tipoEvento = random(['seca', 'chuva']);
        if (tipoEvento === 'seca') {
            mensagemClimatica = "ALERTA! Seca Extrema! Clique nas plantas para regá-las ou perca saúde!";
            nivelSaudeFazenda -= taxaDanoIntemperie * 10; // Dano maior por seca não tratada
        } else {
            mensagemClimatica = "ALERTA! Chuva Forte! Plantas podem ser danificadas se não forem protegidas!";
            nivelSaudeFazenda -= taxaDanoIntemperie * 5; // Dano menor por chuva não tratada
        }
        nivelSaudeFazenda = max(0, nivelSaudeFazenda);
        tempoMensagemClimatica = millis(); // Guarda o tempo que a mensagem apareceu
        tempoProximoEventoClimatico = millis() + random(15000, 30000); // Próximo evento em 15-30 segundos
    }

    // Exibir mensagem climática
    if (mensagemClimatica !== "" && millis() - tempoMensagemClimatica < DURACAO_MSG_CLIMATICA) {
        fill(255, 0, 0);
        textSize(28);
        textAlign(CENTER, CENTER);
        text(mensagemClimatica, width / 2, height - 50, width - 100); // Adicionei margem para a mensagem
    } else {
        mensagemClimatica = ""; // Limpa a mensagem após o tempo
    }


    // Condições de vitória/derrota
    if (minigame3Perdeu) {
        telaAtual = "perdeu";
        return;
    }
    if (colheitasFeitas >= metaProducao && !minigame3Ganhou) {
        minigame3Ganhou = true;
        telaAtual = "parabens";
        historiaPasso = 0;
        return;
    }
    if (tempoRestante <= 0 && colheitasFeitas < metaProducao) {
        minigame3Perdeu = true;
        telaAtual = "perdeu";
        return;
    }
}

// --- Funções do Minigame 4: Separar Itens ---
function desenharMinigame4() {
    background(180, 220, 255); // Céu azul claro
    fill(50, 150, 50);
    rect(0, height - 50, width, 50); // Chão verde

    // Desenhar caixas de coleta
    fill(50, 200, 50); // Verde para comida
    rect(caixaComidaX, caixaY, caixaLargura, caixaAltura, 15);
    fill(255);
    textSize(20);
    text("COMIDA", caixaComidaX + caixaLargura / 2, caixaY + caixaAltura / 2);

    fill(200, 50, 50); // Vermelho para lixo
    rect(caixaLixoX, caixaY, caixaLargura, caixaAltura, 15);
    fill(255);
    textSize(20);
    text("LIXO", caixaLixoX + caixaLargura / 2, caixaY + caixaAltura / 2);

    // Gerar novos itens
    if (millis() - tempoUltimoItem > itemSpawnRate) {
        let tipoItem = random(['comida', 'lixo']);
        let emoji;
        if (tipoItem === 'comida') {
            emoji = random(['🌽', '🍅', '🥦', '🥕']);
            comidasCaindo.push({
                x: random(50, width - 50),
                y: 0,
                emoji: emoji
            });
        } else {
            emoji = random(['🗑️', '🔋', '🧪']); // Emojis de lixo
            lixosCaindo.push({
                x: random(50, width - 50),
                y: 0,
                emoji: emoji
            });
        }
        tempoUltimoItem = millis();
        // Aumentar a dificuldade diminuindo o tempo de spawn
        itemSpawnRate = max(300, itemSpawnRate - 10);
    }

    // Mover e desenhar comidas caindo
    for (let i = comidasCaindo.length - 1; i >= 0; i--) {
        let item = comidasCaindo[i];
        item.y += velocidadeQueda;
        textSize(30);
        text(item.emoji, item.x, item.y);

        // Verificar colisão com a caixa de comida
        if (item.y > caixaY && item.x > caixaComidaX && item.x < caixaComidaX + caixaLargura) {
            itemsColetadosComida++;
            comidasCaindo.splice(i, 1);
        }
        // Se cair no chão (fora das caixas)
        else if (item.y > height - 50) {
            nivelSaudeFazenda -= 5; // Penalidade por item perdido
            nivelSaudeFazenda = max(0, nivelSaudeFazenda);
            comidasCaindo.splice(i, 1);
        }
    }

    // Mover e desenhar lixos caindo
    for (let i = lixosCaindo.length - 1; i >= 0; i--) {
        let item = lixosCaindo[i];
        item.y += velocidadeQueda;
        textSize(30);
        text(item.emoji, item.x, item.y);

        // Verificar colisão com a caixa de lixo
        if (item.y > caixaY && item.x > caixaLixoX && item.x < caixaLixoX + caixaLargura) {
            itemsColetadosLixo++;
            lixosCaindo.splice(i, 1);
        }
        // Se cair no chão (fora das caixas)
        else if (item.y > height - 50) {
            nivelSaudeFazenda -= 5; // Penalidade por item perdido
            nivelSaudeFazenda = max(0, nivelSaudeFazenda);
            lixosCaindo.splice(i, 1);
        }
    }

    // Exibir score
    fill(0);
    textSize(24);
    textAlign(LEFT, TOP);
    text("Comida: " + itemsColetadosComida + "/" + metaComida, 50, 30);
    text("Lixo: " + itemsColetadosLixo + "/" + metaLixo, 50, 60);

    // Barra de Saúde da Fazenda (reutilizada do MG3)
    fill(255);
    rect(width - 250, 20, 200, 25, 10);
    fill(map(nivelSaudeFazenda, 0, 100, 255, 0), map(nivelSaudeFazenda, 0, 100, 0, 255), 0);
    rect(width - 250, 20, map(nivelSaudeFazenda, 0, 100, 0, 200), 25, 10);
    fill(0);
    textSize(16);
    textAlign(CENTER, CENTER);
    text("Saúde: " + floor(nivelSaudeFazenda) + "%", width - 150, 32);

    // Tempo restante
    let tempoDecorrido4 = (millis() - tempoInicialMinigame4) / 1000;
    let tempoRestante4 = max(0, tempoLimiteMinigame4 - floor(tempoDecorrido4));
    textSize(20);
    fill(0);
    textAlign(CENTER, TOP);
    text("Tempo: " + tempoRestante4 + "s", width / 2, 30);

    // Condições de vitória/derrota
    if (nivelSaudeFazenda <= 0 || tempoRestante4 <= 0 && (itemsColetadosComida < metaComida || itemsColetadosLixo < metaLixo)) {
        minigame4Perdeu = true;
        telaAtual = "perdeu";
        return;
    }
    if (itemsColetadosComida >= metaComida && itemsColetadosLixo >= metaLixo && !minigame4Ganhou) {
        minigame4Ganhou = true;
        telaAtual = "final_vitoria"; // Última tela, final do jogo
        historiaPasso = 0; // Resetar para garantir
        return;
    }
}

// --- Funções de Interação (Mouse e Teclado) ---
function mousePressed() {
    // Lógica para clicar no botão "Continuar" da história
    if (telaAtual.includes("historia_pos_mg") || telaAtual === "introducao_historia") {
        // Ajuste a área de clique para o botão "Continuar" para ser mais robusta
        if (mouseX > width - 200 && mouseX < width - 50 && mouseY > height - 80 && mouseY < height - 30) {
            historiaPasso++;
        }
    } else if (telaAtual === "parabens") {
        if (mouseX > width / 2 - 100 && mouseX < width / 2 + 100 && mouseY > height - 120 && mouseY < height - 60) {
            // Avança para a próxima parte da história ou para o próximo minigame
            if (minigame1Ganhou) {
                telaAtual = "historia_pos_mg1";
                minigame1Ganhou = false; // Resetar para não reativar
            } else if (minigame2Ganhou) {
                telaAtual = "historia_pos_mg2";
                minigame2Ganhou = false;
            } else if (minigame3Ganhou) {
                telaAtual = "historia_pos_mg3";
                minigame3Ganhou = false;
            }
        }
    } else if (telaAtual === "minigame3") {
        // Clicar para plantar ou interagir no Minigame 3
        if (mouseX > 50 && mouseX < width - 50 && mouseY > 100 && mouseY < height - 100) { // Dentro da área da fazenda
            let clicouEmPlanta = false;
            // Verificar se clicou em uma praga ou planta madura
            for (let i = pragas.length - 1; i >= 0; i--) {
                let praga = pragas[i];
                if (dist(mouseX, mouseY, praga.x, praga.y) < 20) { // Raio de clique para a praga
                    pragas.splice(i, 1); // Remove a praga
                    nivelSaudeFazenda = constrain(nivelSaudeFazenda + 5, 0, 100); // Recompensa por remover praga
                    clicouEmPlanta = true;
                    break;
                }
            }
            if (!clicouEmPlanta) {
                for (let i = plantasCampo.length - 1; i >= 0; i--) {
                    let planta = plantasCampo[i];
                    if (dist(mouseX, mouseY, planta.x, planta.y) < 20) { // Raio de clique para a planta
                        if (planta.estado === 'madura') {
                            colheitasFeitas++;
                            plantasCampo.splice(i, 1); // Remove planta colhida
                            // Adicionar nova semente automaticamente para manter o jogo
                            plantasCampo.push({
                                x: random(70, width - 70),
                                y: random(120, height - 180),
                                estado: 'semente',
                                tipo: floor(random(3)),
                                tempoPlantio: millis()
                            });
                            clicouEmPlanta = true;
                            break;
                        }
                    }
                }
            }

            // Se não clicou em algo existente, tenta plantar uma nova semente
            if (!clicouEmPlanta) {
                // Adiciona uma nova planta onde clicou (desde que não haja outra muito perto)
                let espacoLivre = true;
                for (let planta of plantasCampo) {
                    if (dist(mouseX, mouseY, planta.x, planta.y) < 40) { // Verifica se há espaço
                        espacoLivre = false;
                        break;
                    }
                }
                if (espacoLivre) {
                    plantasCampo.push({
                        x: mouseX,
                        y: mouseY,
                        estado: 'semente',
                        tipo: floor(random(3)),
                        tempoPlantio: millis()
                    });
                }
            }
        }
    } else if (telaAtual === "minigame4") {
        // Verifica se clicou na caixa de comida para arrastar
        if (mouseX > caixaComidaX && mouseX < caixaComidaX + caixaLargura &&
            mouseY > caixaY && mouseY < caixaY + caixaAltura) {
            arrastandoCaixaComida = true;
            offsetXCaixaComida = mouseX - caixaComidaX;
            offsetYCaixaComida = mouseY - caixaY;
        }
        // Verifica se clicou na caixa de lixo para arrastar
        else if (mouseX > caixaLixoX && mouseX < caixaLixoX + caixaLargura &&
            mouseY > caixaY && mouseY < caixaY + caixaAltura) {
            arrastandoCaixaLixo = true;
            offsetXCaixaLixo = mouseX - caixaLixoX;
            offsetYCaixaLixo = mouseY - caixaY;
        }
    }
}

function mouseDragged() {
    if (telaAtual === "minigame4") {
        if (arrastandoCaixaComida) {
            caixaComidaX = mouseX - offsetXCaixaComida;
            // Limita a caixa à metade esquerda da tela
            caixaComidaX = constrain(caixaComidaX, 0, width / 2 - caixaLargura);
        } else if (arrastandoCaixaLixo) {
            caixaLixoX = mouseX - offsetXCaixaLixo;
            // Limita a caixa à metade direita da tela
            caixaLixoX = constrain(caixaLixoX, width / 2, width - caixaLargura);
        }
    }
}

function mouseReleased() {
    if (telaAtual === "minigame4") {
        arrastandoCaixaComida = false;
        arrastandoCaixaLixo = false;
    }
}

function keyPressed() {
    // Lógica de movimento para o minigame 1
    if (telaAtual === "minigame1") {
        // Já está sendo tratado em draw() com keyIsDown() para movimento contínuo
    }
}