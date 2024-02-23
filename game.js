// Configurações do jogo
const larguraJogo = 700;
const alturaJogo = 850;

// Configurações gerais do jogo, como largura, altura, tipo de renderização, física etc.
const config = {
    type: Phaser.AUTO,
    width: larguraJogo,
    height: alturaJogo,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 }, // Gravidade aplicada ao mundo do jogo
            debug: true // Ativar o modo de depuração da física
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

// Inicialização do jogo
const game = new Phaser.Game(config);

// Declaração de variáveis globais
var alien; // Variável para armazenar o sprite do personagem alienígena
var teclado; // Variável para armazenar o objeto de teclado
var fogo; // Variável para armazenar o sprite de fogo/turbo
var plataformas; // Variável para armazenar o grupo de plataformas
var moeda; // Variável para armazenar o sprite da moeda
var pontuacao = 0; // Variável para armazenar a pontuação do jogador
var placar; // Variável para armazenar o texto do placar
var posicaox = [100, 200, 800, 200, 900];
var posicaoy = [300, 250, 150, 600, 500];

// Carregamento de recursos
function preload() {
    // Carrega as imagens necessárias para o jogo
    this.load.image('background', 'assets/bg.png');
    this.load.image('alienigena', 'assets/alienigena.png');
    this.load.image('tijolos', 'assets/tijolos.png');
    this.load.image('moeda', 'assets/moeda.png');
    this.load.image('turbo', 'assets/turbo.png');
    this.load.image('coracao', 'assets/coracao.png');
}

// Configuração inicial do jogo
function create() {
    // Adiciona a imagem de fundo
    this.add.image(larguraJogo / 2, alturaJogo / 2, 'background');

    // Configuração do turbo/fogo
    fogo = this.add.sprite(0, 0, 'turbo');
    fogo.setVisible(false);

    // Configuração do personagem alien
    alien = this.physics.add.sprite(larguraJogo / 2, 0, 'alienigena');
    alien.setCollideWorldBounds(true);
    teclado = this.input.keyboard.createCursorKeys();

    // Configuração do coracao
    coracao = this.physics.add.sprite(posicaox[0], posicaoy[1], 'coracao');
    coracao.setCollideWorldBounds(true);
    coracao.setBounce(0.7);


    //teste
     // Configuração da moeda
     moeda = this.physics.add.sprite(larguraJogo/2, 0, 'moeda');
     moeda.setCollideWorldBounds(true);
     moeda.setBounce(0.7);

    // Configuração do grupo de plataformas
    for (let i = 0; i < 3; i++) { // Loop para criar três plataformas
        let posX = Phaser.Math.RND.between(50, 650);
        let posY = Phaser.Math.RND.between(300, 650);

        // Adicionando cada plataforma  ao grupo de física
        let plataforma = this.physics.add.staticImage(posX, posY, 'tijolos');
        
        // Adiciona colisão entre o alien e cada plataforma
        this.physics.add.collider(alien, plataforma);
        this.physics.add.collider(moeda, plataforma); // Adiciona colisão entre moeda e plataforma
        this.physics.add.collider(coracao, plataforma); // Adiciona colisão entre o coracao e plataforma
    }

    // Configuração do texto do placar
    placar = this.add.text(50, 50, 'Moedas:' + pontuacao, { fontSize: '45px', fill: '#495613' });

    // Adiciona um evento de sobreposição (overlap) entre o alien e a moeda
    this.physics.add.overlap(alien, moeda, function () {
        moeda.setVisible(false);
        var posicaoMoeda_Y = Phaser.Math.RND.between(50, 650);
        moeda.setPosition(posicaoMoeda_Y, 100);
        pontuacao += 1;
        placar.setText('Moedas:' + pontuacao);
        moeda.setVisible(true);
    });
}

// Atualização do jogo
function update() {
    // Controle do movimento horizontal do alien
    if (teclado.left.isDown) {
        alien.setVelocityX(-250);
    } else if (teclado.right.isDown) {
        alien.setVelocityX(250);
    } else {
        alien.setVelocityX(0);
    }

    // Controle do movimento vertical do alien e ativação do turbo/fogo
    if (teclado.up.isDown) {
        alien.setVelocityY(-250);
        ativarTurbo();
    } else {
        semTurbo();
    }

    // Posicionamento do turbo/fogo em relação ao alien
    fogo.setPosition(alien.x, alien.y + alien.height / 2);
}

// Função para ativar o turbo/fogo
function ativarTurbo() {
    fogo.setVisible(true);
}

// Função para desativar o turbo/fogo
function semTurbo() {
    fogo.setVisible(false);
}
