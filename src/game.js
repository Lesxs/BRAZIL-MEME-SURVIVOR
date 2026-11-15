const W = 960, H = 540;
const ui = {
  time: document.querySelector("#time"), level: document.querySelector("#level"),
  kills: document.querySelector("#kills"), coins: document.querySelector("#coins"),
  xp: document.querySelector("#xp-label"), hp: document.querySelector("#hp-label"), hpFill: document.querySelector("#hp-fill"), xpFill: document.querySelector("#xp-fill"),
  start: document.querySelector("#start-screen"), levelScreen: document.querySelector("#level-screen"),
  gameover: document.querySelector("#gameover-screen"), upgrades: document.querySelector("#upgrade-list"),
  final: document.querySelector("#final-stats"), bossWrap: document.querySelector("#boss-wrap"), bossHp: document.querySelector("#boss-hp"), bossFill: document.querySelector("#boss-fill"), bossName: document.querySelector("#boss-name"), abilityButton: document.querySelector("#ability-btn"), abilityCooldown: document.querySelector("#ability-cooldown"), metaCoins: document.querySelector("#meta-coins"), metaShop: document.querySelector("#meta-shop")
};
const META_KEY="brasil-meme-survivors-meta-v1";
const characterProfiles={sobrevivente:{name:"Sobrevivente",texture:"char_sobrevivente",hp:100,speed:220,damage:1.08,fireRate:650,weapon:"espeto",desc:"Equilibrado: +8% de dano e Espeto de Aço."},motoboy:{name:"Motoboy do Grau",texture:"char_motoboy",hp:90,speed:255,damage:.9,fireRate:590,weapon:"chinelo",coinBonus:1,desc:"Rápido: +1 moeda por eliminação e Chinelo."},capivara:{name:"Capivara Braba",texture:"char_capivara",hp:145,speed:185,damage:1.2,fireRate:760,weapon:"estilingue",damageReduction:.2,desc:"Resistente: recebe 20% menos dano e usa Estilingue."},saci:{name:"Saci-pererê",texture:"char_saci",hp:85,speed:270,damage:.88,fireRate:540,weapon:"redemoinho",dodgeChance:.15,desc:"Muito veloz: 15% de chance de esquivar e Redemoinho."},curupira:{name:"Curupira",texture:"char_curupira",hp:110,speed:230,damage:.95,fireRate:620,weapon:"espeto",regen:2,desc:"Guardião da mata: recupera 2 de vida a cada 8 segundos."},boto:{name:"Boto-cor-de-rosa",texture:"char_boto",hp:105,speed:245,damage:.94,fireRate:600,weapon:"onda",xpMultiplier:1.2,desc:"Encanto amazônico: recebe 20% mais experiência e ataca com Ondas."}};
function loadMetaProgress(){try{const saved=JSON.parse(localStorage.getItem(META_KEY)||"{}");return {coins:Math.max(0,Number(saved.coins)||0),selectedCharacter:characterProfiles[saved.selectedCharacter]?saved.selectedCharacter:"sobrevivente",upgrades:{hp:Math.max(0,Math.min(5,Number(saved.upgrades?.hp)||0)),damage:Math.max(0,Math.min(5,Number(saved.upgrades?.damage)||0)),speed:Math.max(0,Math.min(5,Number(saved.upgrades?.speed)||0))}};}catch{return {coins:0,selectedCharacter:"sobrevivente",upgrades:{hp:0,damage:0,speed:0}};}}
const metaProgress=loadMetaProgress();
const chestUpgrades = [
  {name:"ESPETO DE AÇO",desc:"+45% de dano nos ataques.",rarity:"COMUM",apply:p=>p.damage*=1.45},
  {name:"CALDO DE CANA",desc:"+35% de velocidade de movimento.",rarity:"COMUM",apply:p=>p.speed*=1.35},
  {name:"FAROFA REFORÇADA",desc:"+45 de vida máxima e recupera 45.",rarity:"COMUM",apply:p=>{p.maxHp+=45;p.hp=Math.min(p.maxHp,p.hp+45)}},
  {name:"CHURRASCO DE RESPEITO",desc:"+75% de dano nos ataques.",rarity:"RARO",apply:p=>p.damage*=1.75},
  {name:"GÁS DO BOTIJÃO",desc:"+80% de velocidade de ataque.",rarity:"RARO",apply:p=>p.fireRate*=.55},
  {name:"PIX DO MILHÃO",desc:"+15 moedas imediatamente.",rarity:"RARO",apply:p=>{}},
  {name:"BENÇÃO DA CAPIVARA",desc:"Recupera toda a vida e aumenta a vida máxima em 80.",rarity:"ÉPICO",apply:p=>{p.maxHp+=80;p.hp=p.maxHp}},
  {name:"CHINELO LENDÁRIO",desc:"+85% de velocidade e +50% de dano.",rarity:"ÉPICO",apply:p=>{p.speed*=1.85;p.damage*=1.5}},
  {name:"MALA DE DINHEIRO",desc:"+15 moedas e +25% de velocidade de ataque.",rarity:"ÉPICO",apply:p=>{p.fireRate*=.8}},
  {name:"PIPOCA DE CINEMA",desc:"Avança um estágio na evolução do ataque.",rarity:"RARO",apply:p=>p.weaponLevel=Math.min(3,p.weaponLevel+1)},
  {name:"CANHÃO DE FESTA JUNINA",desc:"Evolui o ataque para cinco projéteis por disparo.",rarity:"ÉPICO",apply:p=>p.weaponLevel=3}
];
const upgrades = [
  {name:"PESO DE RESPEITO",desc:"+25% de dano nos ataques.",rarity:"COMUM",apply:p=>p.damage*=1.25},
  {name:"CHINELO TURBO",desc:"+18% de velocidade de movimento.",rarity:"COMUM",apply:p=>p.speed*=1.18},
  {name:"CASCA GROSSA",desc:"+25 de vida máxima e cura 25.",rarity:"COMUM",apply:p=>{p.maxHp+=25;p.hp=Math.min(p.maxHp,p.hp+25)}},
  {name:"MIRA DE MILHÕES",desc:"+20% de velocidade de ataque.",rarity:"RARO",apply:p=>p.fireRate*=.8},
  {name:"PIX PREMIADO",desc:"+1 moeda extra por eliminação.",rarity:"RARO",apply:p=>p.coinBonus++},
  {name:"ENERGÉTICO DE GUARANÁ",desc:"+15% de velocidade dos projéteis.",rarity:"COMUM",apply:p=>p.bulletSpeed*=1.15},
  {name:"ÁGUA DE COCO GELADA",desc:"Recupera 30% da vida máxima.",rarity:"RARO",apply:p=>{p.hp=Math.min(p.maxHp,p.hp+p.maxHp*.3)}}
];
class Arena extends Phaser.Scene {
  constructor(){super("arena");this.active=false;this.level=1;this.xp=0;this.xpNeed=5;this.kills=0;this.coins=0;this.elapsed=0;this.spawnClock=0;this.shotClock=0;this.regenClock=0;this.invuln=0;this.nextBossAt=90;this.bossCount=0;this.selectedCharacter=metaProgress.selectedCharacter;this.abilityCooldown=0;this.playerStats={};this.enemies=[];this.bullets=[];this.orbs=[];this.keys={};this.touch={up:false,down:false,left:false,right:false};}
  preload(){
    for(const id of ["sobrevivente","motoboy","capivara","saci","curupira","boto"])this.load.spritesheet("char_"+id,"assets/sprites/characters/"+id+".png?v=0.10.8",{frameWidth:48,frameHeight:48});
    for(const id of ["fiscal-do-pix","boitata","mula-sem-cabeca"])this.load.spritesheet("boss_"+id,"assets/sprites/bosses/"+id+".png?v=0.10.8",{frameWidth:80,frameHeight:80});
    for(const id of ["pigeon","caramelo","capybara","mosquito","vendor","motoboy","churrasco","saci","boi_bumba","ze_gotinha","et_varginha"])this.load.spritesheet("enemy_"+id,"assets/sprites/enemies/"+id+".png?v=0.10.8",{frameWidth:40,frameHeight:40});
  }
  create(){
    this.makeTextures();this.createSpriteAnimations();this.drawArena();
    this.player=this.physics.add.sprite(W/2,H/2,"char_sobrevivente",0).setDepth(3).setCollideWorldBounds(true);
    this.player.body.setCircle(11,5,5);
    this.enemyGroup=this.physics.add.group();this.bulletGroup=this.physics.add.group();this.orbGroup=this.physics.add.group();this.chestGroup=this.physics.add.group();
    this.physics.add.overlap(this.bulletGroup,this.enemyGroup,this.hitEnemy,null,this);
    this.physics.add.overlap(this.player,this.enemyGroup,this.hitPlayer,null,this);
    this.physics.add.overlap(this.player,this.orbGroup,this.collectOrb,null,this);
    this.physics.add.overlap(this.player,this.chestGroup,this.collectChest,null,this);
    this.keys=this.input.keyboard.addKeys("W,A,S,D,UP,DOWN,LEFT,RIGHT");this.abilityKey=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);this.abilityCooldown=0;
    this.resetRun();this.scene.pause();
  }
  createSpriteAnimations(){
    const rows=[{name:"idle",row:0,rate:5,repeat:-1},{name:"walk",row:1,rate:9,repeat:-1},{name:"attack",row:2,rate:12,repeat:0}];
    for(const id of ["pigeon","caramelo","capybara","mosquito","vendor","motoboy","churrasco","saci","boi_bumba","ze_gotinha","et_varginha"]){
      const key="enemy_"+id;
      rows.forEach(a=>this.anims.create({key:key+"_"+a.name,frames:this.anims.generateFrameNumbers(key,{start:a.row*4,end:a.row*4+3}),frameRate:a.rate,repeat:a.repeat}));
    }
    for(const id of ["sobrevivente","motoboy","capivara","saci","curupira","boto","fiscal-do-pix","boitata","mula-sem-cabeca"]){
      const key=(["fiscal-do-pix","boitata","mula-sem-cabeca"].includes(id)?"boss_":"char_")+id;
      rows.forEach(a=>this.anims.create({key:key+"_"+a.name,frames:this.anims.generateFrameNumbers(key,{start:a.row*4,end:a.row*4+3}),frameRate:a.rate,repeat:a.repeat}));
    }
  }
  makeTextures(){
    const g=this.make.graphics({x:0,y:0,add:false});
    // Sobrevivente: boné, camisa verde-amarela, bermuda e tênis.
    g.fillStyle(0x172321);g.fillRoundedRect(5,5,30,33,9);
    g.fillStyle(0xd49a69);g.fillCircle(20,14,10);
    g.fillStyle(0x202b28);g.fillRoundedRect(9,3,22,8,4);g.fillRect(7,9,27,3);
    g.fillStyle(0x176b43);g.fillRoundedRect(7,20,26,15,5);
    g.fillStyle(0xf4d34e);g.fillRect(17,21,6,12);
    g.fillStyle(0x263b31);g.fillRect(10,33,8,5);g.fillRect(23,33,8,5);
    g.fillStyle(0xe9eee0);g.fillRect(8,37,11,2);g.fillRect(22,37,11,2);
    g.fillStyle(0x202321);g.fillCircle(16,14,1.5);g.fillCircle(24,14,1.5);
    g.fillStyle(0x6e382d);g.fillRect(17,19,7,2);g.generateTexture("player",40,40);g.clear();

    // Pombo ladrão: corpo cinza, asa marcada e pescoço iridescente.
    g.fillStyle(0x252b31);g.fillEllipse(19,23,29,20);
    g.fillStyle(0x8795a1);g.fillEllipse(18,19,25,18);
    g.fillStyle(0x596d82);g.fillEllipse(18,23,18,10);
    g.fillStyle(0x2e8b82);g.fillEllipse(25,13,9,13);
    g.fillStyle(0x9eabb3);g.fillCircle(27,8,6);
    g.fillStyle(0xf0c34f);g.fillTriangle(32,8,39,11,32,13);
    g.fillStyle(0x151a1d);g.fillCircle(29,7,1.5);
    g.fillStyle(0xb77c3e);g.fillRect(16,32,2,5);g.fillRect(25,32,2,5);
    g.generateTexture("pigeon",40,40);g.clear();

    // Vendedor do centro: boné, caixa de mercadoria e camiseta.
    g.fillStyle(0x22272a);g.fillRoundedRect(7,11,27,27,6);
    g.fillStyle(0xe0a06c);g.fillCircle(20,13,10);
    g.fillStyle(0x365b8b);g.fillRoundedRect(8,4,24,8,3);g.fillRect(5,10,30,3);
    g.fillStyle(0xf08b45);g.fillRoundedRect(7,22,27,15,4);
    g.fillStyle(0xf6d16b);g.fillRect(10,25,21,8);
    g.fillStyle(0x6c482b);g.fillRect(12,28,17,2);
    g.fillStyle(0x25211d);g.fillCircle(16,14,1.5);g.fillCircle(24,14,1.5);
    g.generateTexture("vendor",40,40);g.clear();

    // Capivara: focinho, orelhas e corpo robusto.
    g.fillStyle(0x28251f);g.fillEllipse(20,24,33,22);
    g.fillStyle(0x9b7047);g.fillEllipse(20,21,30,20);
    g.fillStyle(0x684a32);g.fillEllipse(20,27,19,9);
    g.fillStyle(0xb98959);g.fillCircle(9,12,5);g.fillCircle(30,12,5);
    g.fillStyle(0x3a2c23);g.fillEllipse(20,25,12,7);
    g.fillStyle(0x191714);g.fillCircle(14,17,2);g.fillCircle(26,17,2);
    g.fillStyle(0x30231b);g.fillEllipse(20,29,5,2);
    g.generateTexture("capybara",40,40);g.clear();

    // Cachorro caramelo: orelhas caídas, focinho claro e coleira.
    g.fillStyle(0x3a261d);g.fillEllipse(20,23,29,23);
    g.fillStyle(0xc88745);g.fillEllipse(20,21,25,22);
    g.fillStyle(0x9d5d32);g.fillEllipse(8,14,9,15);g.fillEllipse(32,14,9,15);
    g.fillStyle(0xe8bb83);g.fillEllipse(20,27,13,9);
    g.fillStyle(0x24201c);g.fillCircle(15,19,2);g.fillCircle(25,19,2);g.fillEllipse(20,26,3,2);
    g.fillStyle(0x3975b8);g.fillRect(9,31,22,3);g.fillStyle(0xf4d56b);g.fillRect(18,31,4,4);
    g.generateTexture("caramelo",40,40);g.clear();

    // Pernilongo: pernas, asas translúcidas e probóscide.
    g.lineStyle(2,0xb9d4d6,.9);g.lineBetween(15,15,3,7);g.lineBetween(22,15,36,6);g.lineBetween(15,24,4,34);g.lineBetween(20,25,14,38);g.lineBetween(24,24,35,35);
    g.fillStyle(0x9fc8cb,.55);g.fillEllipse(11,12,17,8);g.fillEllipse(28,12,17,8);
    g.fillStyle(0x273744);g.fillEllipse(20,22,8,20);g.fillCircle(20,10,6);
    g.fillStyle(0xd9e6dc);g.fillCircle(18,9,1);g.fillCircle(22,9,1);
    g.lineStyle(2,0xe3c6a1);g.lineBetween(20,14,30,4);
    g.generateTexture("mosquito",40,40);g.clear();

    // Motoboy do grau: capacete, viseira e mochila de entrega.
    g.fillStyle(0x222a32);g.fillRoundedRect(6,17,29,21,6);
    g.fillStyle(0xe4b184);g.fillCircle(20,15,9);
    g.fillStyle(0xffd04f);g.fillRoundedRect(8,4,25,14,7);
    g.fillStyle(0x263747);g.fillRoundedRect(9,12,23,5,2);
    g.fillStyle(0x263747);g.fillRoundedRect(27,20,10,15,3);
    g.fillStyle(0xf15b42);g.fillRect(29,23,6,3);
    g.fillStyle(0xeff2e9);g.fillCircle(16,17,1.5);g.fillCircle(24,17,1.5);
    g.fillStyle(0x397e55);g.fillRect(11,29,18,4);
    g.generateTexture("motoboy",40,40);g.clear();

    // Tio do churrasco: avental, boné e espeto.
    g.fillStyle(0x25211f);g.fillRoundedRect(5,16,30,23,7);
    g.fillStyle(0xd39a6b);g.fillCircle(20,14,10);
    g.fillStyle(0x9a3d2e);g.fillRoundedRect(8,4,24,8,3);g.fillRect(7,10,26,3);
    g.fillStyle(0xe9e1d0);g.fillRoundedRect(9,22,22,15,3);
    g.fillStyle(0xb94f32);g.fillRect(12,25,16,9);
    g.fillStyle(0x28211b);g.fillCircle(16,14,1.5);g.fillCircle(24,14,1.5);
    g.lineStyle(2,0xd6d2c4);g.lineBetween(31,20,39,6);
    g.generateTexture("churrasco",40,40);g.clear();

    // Fiscal do Pix: chefe de terno, gravata e visor vermelho.
    g.fillStyle(0x1c1722);g.fillRoundedRect(4,7,48,46,10);
    g.fillStyle(0x6b263b);g.fillRoundedRect(7,4,42,47,8);
    g.fillStyle(0xd8a06d);g.fillCircle(28,19,13);
    g.fillStyle(0x20202a);g.fillRoundedRect(13,4,30,10,4);
    g.fillStyle(0xe9d7b0);g.fillRect(12,29,32,19);
    g.fillStyle(0x9e293e);g.fillTriangle(28,30,22,47,34,47);
    g.fillStyle(0x25212a);g.fillRect(15,17,10,4);g.fillRect(31,17,10,4);
    g.fillStyle(0xffd15b);g.fillCircle(20,19,2);g.fillCircle(36,19,2);
    g.fillStyle(0x28212a);g.fillRect(21,24,14,3);
    g.generateTexture("boss",56,56);g.clear();

    // Baú de churrasco com tampa, ferragens e brilho.
    g.fillStyle(0x35251d);g.fillRoundedRect(3,12,34,25,4);
    g.fillStyle(0x9b5c31);g.fillRoundedRect(4,7,32,15,5);
    g.fillStyle(0xd79a4f);g.fillRect(5,17,30,5);
    g.fillStyle(0xf3d17a);g.fillRect(17,9,6,27);
    g.fillStyle(0x5a3422);g.fillRect(15,20,10,8);
    g.fillStyle(0xffe6a0);g.fillCircle(20,24,2);
    g.generateTexture("chest",40,40);g.clear();

    g.fillStyle(0x65e6a3);g.fillCircle(6,6,6);g.lineStyle(2,0xd5ffe8);g.strokeCircle(6,6,4);g.generateTexture("orb",12,12);g.clear();
    // Projéteis brasileiros: espeto, rojão e explosão de festa junina.
    g.fillStyle(0x5b3924);g.fillRoundedRect(5,1,4,14,2);g.fillStyle(0xe5bd78);g.fillRect(6,3,2,9);g.fillStyle(0xf1dfb0);g.fillTriangle(7,0,4,4,10,4);g.generateTexture("bullet_espeto",14,16);g.clear();
    g.fillStyle(0x27313a);g.fillRoundedRect(5,3,6,11,2);g.fillStyle(0xd94b38);g.fillRect(5,5,6,4);g.fillStyle(0xffd36a);g.fillTriangle(8,0,4,5,12,5);g.fillStyle(0xffa34d);g.fillTriangle(8,16,4,12,12,12);g.generateTexture("bullet_rojao",16,18);g.clear();
    g.fillStyle(0xffd66e);g.fillCircle(8,8,3);g.lineStyle(2,0xffa34d);for(let a=0;a<8;a++){const angle=a*Math.PI/4;g.lineBetween(8+Math.cos(angle)*4,8+Math.sin(angle)*4,8+Math.cos(angle)*8,8+Math.sin(angle)*8);}g.fillStyle(0xfff0a0);g.fillCircle(8,8,2);g.generateTexture("bullet_fogos",16,16);g.clear();
    // Chinelo e estilingue como armas iniciais de personagens selecionáveis.
    g.fillStyle(0x263b32);g.fillRoundedRect(3,5,12,25,6);g.fillStyle(0xf2b64e);g.fillRoundedRect(5,7,8,19,4);g.fillStyle(0x4a3024);g.fillRect(7,8,4,15);g.generateTexture("bullet_chinelo",18,32);g.clear();
    g.lineStyle(3,0x80552f);g.lineBetween(5,23,9,5);g.lineBetween(23,23,19,5);g.lineStyle(2,0xd7b37a);g.lineBetween(9,5,19,5);g.lineStyle(2,0xe7d7b5);g.lineBetween(9,5,14,15);g.lineBetween(19,5,14,15);g.fillStyle(0x9a6139);g.fillCircle(14,16,4);g.generateTexture("bullet_estilingue",28,28);g.clear();
    // Redemoinho do Saci: espiral de vento com folhas verdes.
    g.lineStyle(3,0x9ed8b0,.95);g.strokeCircle(12,12,8);g.lineStyle(2,0xd7edc6,.95);g.strokeCircle(12,12,4);g.lineBetween(12,12,22,4);g.lineBetween(5,18,1,22);g.fillStyle(0x8bbf68);g.fillTriangle(3,4,9,2,6,9);g.generateTexture("bullet_redemoinho",24,24);g.clear();
    // Boitatá: serpente de fogo para o segundo chefe da rotação.
    g.fillStyle(0x40251e);g.fillEllipse(28,30,46,18);g.fillStyle(0xe45b2d);g.fillEllipse(28,27,42,14);g.fillStyle(0xffc34f);g.fillEllipse(28,24,35,9);g.fillStyle(0xffe69a);g.fillCircle(10,20,7);g.fillStyle(0x24201d);g.fillCircle(8,19,2);g.fillStyle(0xff8d39);g.fillTriangle(47,20,55,27,46,30);g.generateTexture("boitata",60,42);g.clear();
    // Saci-pererê: gorro vermelho, corpo escuro e uma perna só.
    g.fillStyle(0x28221f);g.fillRoundedRect(7,14,26,23,8);g.fillStyle(0xb8784b);g.fillCircle(20,13,9);g.fillStyle(0xc93632);g.fillTriangle(10,10,29,10,21,0);g.fillRect(10,9,20,4);g.fillStyle(0x181b1b);g.fillCircle(17,13,1.5);g.fillCircle(24,13,1.5);g.fillStyle(0x5c3828);g.fillRect(18,34,5,5);g.fillStyle(0xd8b17a);g.fillRect(15,38,12,2);g.generateTexture("saci",40,40);g.clear();
    // Curupira: cabelos vermelhos, roupa de folhas e pés voltados para trás.
    g.fillStyle(0x263b2b);g.fillEllipse(20,26,28,23);
    g.fillStyle(0x3d7540);g.fillRoundedRect(8,19,24,18,6);
    g.fillStyle(0xe05a32);g.fillEllipse(20,10,22,17);
    g.fillStyle(0xf0783d);g.fillTriangle(7,12,3,3,14,8);g.fillTriangle(26,8,37,2,31,14);
    g.fillStyle(0xb8784b);g.fillCircle(20,16,8);
    g.fillStyle(0x1d211b);g.fillCircle(17,15,1.4);g.fillCircle(23,15,1.4);
    g.fillStyle(0xe7c26e);g.fillRect(18,21,4,5);
    g.fillStyle(0x6b452b);g.fillRect(10,34,8,4);g.fillRect(22,34,8,4);
    g.fillStyle(0xd4b27a);g.fillTriangle(9,37,3,39,13,39);g.fillTriangle(31,37,37,39,27,39);
    g.generateTexture("curupira",40,40);g.clear();
    // Boto-cor-de-rosa: golfinho amazônico em estilo pixel art.
    g.fillStyle(0x70414c);g.fillEllipse(20,24,32,18);
    g.fillStyle(0xd77f91);g.fillEllipse(19,21,29,16);
    g.fillStyle(0xf2c5c9);g.fillEllipse(15,27,16,7);
    g.fillStyle(0xc9667d);g.fillTriangle(7,20,1,10,14,17);g.fillTriangle(28,19,38,12,33,24);
    g.fillStyle(0xe99baa);g.fillEllipse(31,18,14,10);
    g.fillStyle(0x3a2630);g.fillCircle(30,15,1.7);g.fillStyle(0xffe8df);g.fillCircle(30.5,14.5,.7);
    g.generateTexture("boto",40,40);g.clear();
    // Onda amazônica: projétil exclusivo do Boto-cor-de-rosa.
    g.lineStyle(3,0x7ce0e5,.95);g.lineBetween(2,13,7,7);g.lineBetween(7,7,12,13);g.lineBetween(12,13,17,7);g.lineBetween(17,7,22,13);
    g.lineStyle(2,0xc3f4ed,.95);g.lineBetween(2,19,7,15);g.lineBetween(7,15,12,19);g.lineBetween(12,19,17,15);g.lineBetween(17,15,22,19);
    g.generateTexture("bullet_onda",24,24);g.clear();
    // Boi-bumbá: corpo robusto, chifres e manta de festa popular.
    g.fillStyle(0x282321);g.fillEllipse(20,24,34,24);g.fillStyle(0x315e9b);g.fillEllipse(20,22,29,20);g.fillStyle(0xe3bd54);g.fillTriangle(7,14,2,3,14,10);g.fillTriangle(26,10,38,3,33,16);g.fillStyle(0xd64c45);g.fillRect(7,19,26,6);g.fillStyle(0xf4d76b);g.fillCircle(12,22,3);g.fillCircle(28,22,3);g.fillStyle(0xe7e0c8);g.fillEllipse(20,30,17,9);g.fillStyle(0x211c1a);g.fillCircle(16,14,2);g.fillCircle(25,14,2);g.fillStyle(0xf0d9a3);g.fillEllipse(20,33,7,3);g.generateTexture("boi_bumba",40,40);g.clear();
    // Zé Gotinha: mascote brasileiro da vacinação, com gota e jaleco.
    g.fillStyle(0x243c58);g.fillEllipse(20,25,25,23);g.fillStyle(0xf5f5e9);g.fillRoundedRect(9,19,22,18,5);
    g.fillStyle(0x72c9ed);g.fillCircle(20,13,9);g.fillTriangle(20,1,11,14,29,14);
    g.fillStyle(0x1d2935);g.fillCircle(17,12,1.5);g.fillCircle(23,12,1.5);g.fillStyle(0x2f8c62);g.fillRect(18,22,4,10);
    g.generateTexture("ze_gotinha",40,40);g.clear();
    // ET de Varginha: criatura de cabeça grande e olhos escuros.
    g.fillStyle(0x252d31);g.fillEllipse(20,21,29,33);g.fillStyle(0x789b82);g.fillEllipse(20,19,24,29);
    g.fillStyle(0x141c20);g.fillEllipse(13,17,8,12);g.fillEllipse(27,17,8,12);
    g.fillStyle(0xc7e0c5);g.fillCircle(11,14,2);g.fillCircle(25,14,2);g.fillStyle(0x4a6c59);g.fillEllipse(20,29,7,3);
    g.generateTexture("et_varginha",40,40);g.clear();
    // Mula-sem-cabeça: chefe folclórico com crina e labaredas.
    g.fillStyle(0x28211f);g.fillEllipse(30,31,48,23);g.fillStyle(0x8b3c2c);g.fillEllipse(28,27,39,19);
    g.fillStyle(0xe45a2e);g.fillTriangle(8,20,1,2,19,14);g.fillTriangle(25,16,24,0,36,14);
    g.fillStyle(0xffc34f);g.fillTriangle(42,24,59,2,54,31);g.fillTriangle(13,31,2,12,17,22);
    g.fillStyle(0xf5d47b);g.fillEllipse(47,20,13,8);g.generateTexture("mula",64,48);g.destroy();
  }
  drawArena(){
    const bg=this.add.graphics().setDepth(0);
    bg.fillStyle(0x263b38);bg.fillRect(0,0,W,H);
    // Rua principal, asfalto gasto e calçadas de concreto.
    bg.fillStyle(0x52604d);bg.fillRect(0,0,W,72);bg.fillRect(0,H-70,W,70);
    bg.fillStyle(0x303a39);bg.fillRect(0,72,W,H-142);
    bg.fillStyle(0x394544);bg.fillRect(0,80,W,7);bg.fillRect(0,H-78,W,7);
    bg.fillStyle(0x9a927c);bg.fillRect(0,67,W,7);bg.fillRect(0,H-74,W,7);
    bg.fillStyle(0xe4d6ad,.7);for(let i=0;i<8;i++)bg.fillRect(410+i*19,72,10,34);
    bg.fillStyle(0xd9d1b8,.45);for(let i=0;i<8;i++)bg.fillRect(410+i*19,H-106,10,34);
    // Fachadas de comércio e casas com cores variadas.
    const shops=[{x:22,w:150,c:0xc66c43},{x:202,w:128,c:0x527d70},{x:360,w:154,c:0xd1a65f},{x:548,w:135,c:0x6d8290},{x:715,w:210,c:0xb75c48}];
    for(let i=0;i<shops.length;i++){
      const s=shops[i];
      bg.fillStyle(0x202a2b);bg.fillRoundedRect(s.x,9,s.w,53,4);
      bg.fillStyle(s.c);bg.fillRect(s.x+4,13,s.w-8,45);
      bg.fillStyle(0xf2d99b);bg.fillRect(s.x+9,20,s.w-18,5);
      bg.fillStyle(0x263b3b);bg.fillRect(s.x+12,31,s.w-24,23);
      bg.fillStyle(0x9ec0ad);for(let x=s.x+17;x<s.x+s.w-18;x+=26)bg.fillRect(x,34,17,17);
      bg.fillStyle(0x332b25);bg.fillRect(s.x+5,57,s.w-10,5);
      bg.fillStyle(0xf0c56b);bg.fillRect(s.x+8,14,s.w-16,3);
      // Toldos listrados para quebrar grandes blocos de cor.
      bg.fillStyle(i%2?0xe7d5a5:0xf0a45e);
      for(let x=s.x+8;x<s.x+s.w-8;x+=18)bg.fillRect(x,25,9,5);
    }
    const stalls=[{x:35,w:125,c:0x8f4b34},{x:230,w:150,c:0x376b5a},{x:580,w:145,c:0xb67a3f},{x:790,w:130,c:0x42677c}];
    for(let i=0;i<stalls.length;i++){
      const s=stalls[i];
      bg.fillStyle(0x202929);bg.fillRect(s.x,H-65,s.w,54);
      bg.fillStyle(s.c);bg.fillRect(s.x+4,H-61,s.w-8,46);
      bg.fillStyle(0xe8c47d);bg.fillRect(s.x,H-65,s.w,8);
      bg.fillStyle(i%2?0x293c3a:0x34433b);bg.fillRect(s.x+12,H-48,s.w-24,28);
      bg.fillStyle(0x9dc5b1);bg.fillRect(s.x+17,H-45,18,17);
      bg.fillStyle(0x40352b);bg.fillRect(s.x+4,H-15,s.w-8,4);
      bg.fillStyle(0xf0c56b);for(let x=s.x+8;x<s.x+s.w-8;x+=20)bg.fillRect(x,H-57,10,3);
    }
    // Textura da calçada: juntas, rachaduras e remendos.
    const deco=this.add.graphics().setDepth(1);
    deco.lineStyle(1,0x6f7568,.42);
    for(let x=12;x<W;x+=38){deco.lineBetween(x,4,x,64);deco.lineBetween(x,H-64,x,H-5);}
    for(let y=20;y<64;y+=22){deco.lineBetween(0,y,W,y);deco.lineBetween(0,H-y,W,H-y);}
    // Árvores pequenas e postes de iluminação.
    for(let i=0;i<18;i++){
      const x=18+i*54,y=91+(i%2)*12;
      deco.fillStyle(0x77583b);deco.fillRect(x-2,y+7,4,18);
      deco.fillStyle(0x1d2927);deco.fillCircle(x,y,12);
      deco.fillStyle(0x49724f);deco.fillCircle(x-3,y-4,10);
      deco.fillStyle(0x75a45e,.8);deco.fillCircle(x-6,y-8,3);
      if(i%3===0){
        deco.fillStyle(0x202a2b);deco.fillRect(x+17,104,3,32);
        deco.fillStyle(0xf3c56b);deco.fillCircle(x+18,103,4);
        deco.fillStyle(0xffe7a1,.22);deco.fillCircle(x+18,108,9);
      }
    }
    // Bueiros, remendos de asfalto e manchas de uso.
    for(let i=0;i<7;i++){
      const x=95+i*125,y=H/2+(i%2?54:-58);
      deco.fillStyle(0x1c2525);deco.fillEllipse(x,y,31,15);
      deco.lineStyle(2,0x77827a,.7);deco.strokeEllipse(x,y,31,15);
      deco.lineStyle(1,0x68746d,.65);for(let k=-9;k<=9;k+=6)deco.lineBetween(x-10,y+k*.35,x+10,y+k*.35);
      deco.fillStyle(0x69736a);deco.fillCircle(x,y,3);
    }
    for(let i=0;i<12;i++){
      const x=42+i*79,y=145+(i%4)*73;
      deco.fillStyle(i%2?0x3c4843:0x394440,.5);deco.fillEllipse(x,y,18+(i%3)*5,5+(i%2)*2);
      if(i%3===0){deco.lineStyle(1,0x73796a,.4);deco.lineBetween(x-8,y+3,x-2,y+7);deco.lineBetween(x-2,y+7,x+5,y+4);}
    }
    // Fiação aérea, placas, caixas de energia e detalhes de bairro.
    const streetArt=this.add.graphics().setDepth(1.15);
    streetArt.lineStyle(2,0x172523,.85);
    streetArt.lineBetween(0,74,220,83);streetArt.lineBetween(220,83,455,72);streetArt.lineBetween(455,72,710,82);streetArt.lineBetween(710,82,W,74);
    streetArt.lineStyle(1,0x202a28,.7);
    streetArt.lineBetween(0,H-76,240,H-84);streetArt.lineBetween(240,H-84,520,H-74);streetArt.lineBetween(520,H-74,W,H-82);
    for(const x of [92,278,492,674,866]){
      streetArt.fillStyle(0x252f2d);streetArt.fillRect(x,76,5,15);
      streetArt.fillStyle(0x4b6253);streetArt.fillRect(x-3,88,11,7);
      streetArt.fillStyle(0x202a2b);streetArt.fillRoundedRect(x+8,92,13,18,2);
      streetArt.fillStyle(0x7ca16a);streetArt.fillRect(x+11,96,7,3);
    }
    // Pinturas e cartazes estilizados nas paredes, sem texto ilegível.
    for(const x of [72,250,425,620,820]){
      streetArt.fillStyle(0x243638,.85);streetArt.fillRect(x,42,24,10);
      streetArt.fillStyle(0xe7c47a);streetArt.fillRect(x+3,45,18,2);
      streetArt.fillStyle(0xd96e4e,.9);streetArt.fillRect(x+5,48,5,2);
    }
    // Identidade da primeira fase: Quebrada Brasileira.
    // Vielas, escadarias, muros pintados e quadra comunitária nas bordas da arena.
    streetArt.fillStyle(0x263b35,.95);streetArt.fillRoundedRect(14,116,112,40,3);
    streetArt.fillStyle(0xe6c27c,.9);streetArt.fillRect(20,121,100,4);
    streetArt.fillStyle(0x9d5542,.9);streetArt.fillRect(22,130,37,20);
    streetArt.fillStyle(0x315d50,.9);streetArt.fillRect(64,130,50,20);
    streetArt.fillStyle(0xd6b77b,.85);streetArt.fillRect(27,135,27,3);
    streetArt.fillStyle(0xe5a34f,.9);streetArt.fillCircle(43,143,3);
    streetArt.fillStyle(0x263b35,.95);streetArt.fillRoundedRect(W-126,H-160,112,42,3);
    streetArt.fillStyle(0xd7bd83,.9);streetArt.fillRect(W-120,H-154,100,4);
    streetArt.fillStyle(0x8d4c42,.9);streetArt.fillRect(W-116,H-144,42,19);
    streetArt.fillStyle(0x376b58,.9);streetArt.fillRect(W-69,H-144,43,19);
    // Escadarias de concreto e degraus gastos, sem invadir o centro jogável.
    streetArt.fillStyle(0x77796d,.75);
    for(let i=0;i<5;i++){streetArt.fillRect(18+i*7,169+i*5,44-i*5,3);streetArt.fillRect(W-62-i*7,H-192+i*5,44-i*5,3);}
    // Marcações discretas de uma quadra de futebol de bairro.
    streetArt.lineStyle(2,0xb8b18e,.22);streetArt.strokeRect(350,205,260,132);
    streetArt.strokeCircle(480,271,31);streetArt.lineBetween(480,205,480,337);
    streetArt.strokeRect(350,235,30,72);streetArt.strokeRect(580,235,30,72);
    streetArt.lineStyle(3,0x26302b,.85);
    streetArt.lineBetween(12,190,12,340);streetArt.lineBetween(948,190,948,340);
    streetArt.lineBetween(12,190,28,190);streetArt.lineBetween(932,190,948,190);
    // Faixas da pista e contorno de segurança.
    streetArt.lineStyle(2,0xb5a77e,.45);
    for(let x=25;x<W;x+=95){streetArt.lineBetween(x,270,x+42,270);streetArt.lineBetween(x,282,x+42,282);}
    streetArt.fillStyle(0xe6d6a8,.55);streetArt.fillCircle(480,270,3);
    streetArt.lineStyle(2,0x152321,.8);streetArt.strokeRect(7,7,W-14,H-14);
    this.add.text(18,86,"QUEBRADA BRASILEIRA  /  ZONA 01",{fontFamily:"Arial",fontSize:"10px",fontStyle:"bold",color:"#f0d59a",stroke:"#1b2925",strokeThickness:3,letterSpacing:1}).setDepth(1.2).setAlpha(.88);
  }
  resetRun(){
    this.active=false;this.level=1;this.xp=0;this.xpNeed=5;this.kills=0;this.coins=0;this.elapsed=0;this.spawnClock=0;this.shotClock=0;this.regenClock=0;this.invuln=0;this.abilityCooldown=0;this.nextBossAt=90;this.bossCount=0;
    this.selectedCharacter=characterProfiles[this.selectedCharacter]?this.selectedCharacter:"sobrevivente";
    const profile=characterProfiles[this.selectedCharacter],permanent=metaProgress.upgrades;
    const maxHp=profile.hp+permanent.hp*8;this.playerTextureKey=profile.texture;this.playerAttackTimer=0;
    this.playerStats={hp:maxHp,maxHp,speed:profile.speed*(1+permanent.speed*.04),damage:profile.damage*(1+permanent.damage*.06),fireRate:profile.fireRate,bulletSpeed:430,coinBonus:profile.coinBonus||0,damageReduction:profile.damageReduction||0,dodgeChance:profile.dodgeChance||0,regen:profile.regen||0,xpMultiplier:profile.xpMultiplier||1,weaponLevel:1,startingWeapon:profile.weapon};
    this.player.setTexture(this.playerTextureKey,0).setPosition(W/2,H/2).setAlpha(1).setRotation(0);this.player.play(this.playerTextureKey+"_idle",true);
    [this.enemyGroup,this.bulletGroup,this.orbGroup,this.chestGroup].forEach(g=>g.clear(true,true));
    this.enemies=[];this.bullets=[];this.orbs=[];this.updateHud();this.updateAbilityButton();
  }
  renderMetaShop(){
    if(ui.metaCoins)ui.metaCoins.textContent=String(metaProgress.coins);
    document.querySelectorAll("[data-meta-upgrade]").forEach(button=>{const key=button.dataset.metaUpgrade,level=metaProgress.upgrades[key],cost=20+level*15;button.disabled=level>=5||metaProgress.coins<cost;const label=button.querySelector("small");if(label)label.textContent=level>=5?"MÁXIMO":`${cost} MOEDAS · NÍVEL ${level}/5`;});
    document.querySelectorAll("[data-character]").forEach(button=>{const selected=button.dataset.character===this.selectedCharacter;button.classList.toggle("selected",selected);button.setAttribute("aria-pressed",String(selected));});
    const selectedLabel=document.querySelector("#selected-character-label");
    if(selectedLabel)selectedLabel.textContent=`SELECIONADO: ${(characterProfiles[this.selectedCharacter]||characterProfiles.sobrevivente).name.toUpperCase()}`;
  }
  buyMetaUpgrade(key){if(!Object.hasOwn(metaProgress.upgrades,key))return;const level=metaProgress.upgrades[key],cost=20+level*15;if(level>=5||metaProgress.coins<cost)return;metaProgress.coins-=cost;metaProgress.upgrades[key]++;persistMetaProgress();this.renderMetaShop();}
  startRun(){this.selectedCharacter=characterProfiles[metaProgress.selectedCharacter]?metaProgress.selectedCharacter:"sobrevivente";this.resetRun();this.active=true;this.updateAbilityButton();ui.start.classList.add("hidden");ui.gameover.classList.add("hidden");this.scene.resume();}
  update(t,dt){
    if(!this.active)return;
    const d=dt/1000;this.elapsed+=d;this.spawnClock+=dt;this.shotClock+=dt;this.playerAttackTimer=Math.max(0,(this.playerAttackTimer||0)-d);this.invuln=Math.max(0,this.invuln-d);this.regenClock=(this.regenClock||0)+d;if(this.playerStats.regen>0&&this.regenClock>=8){this.regenClock-=8;const healed=Math.min(this.playerStats.regen,this.playerStats.maxHp-this.playerStats.hp);if(healed>0){this.playerStats.hp+=healed;this.updateHud();}}const cooldownBefore=Math.ceil(this.abilityCooldown);this.abilityCooldown=Math.max(0,this.abilityCooldown-d);if(Math.ceil(this.abilityCooldown)!==cooldownBefore)this.updateAbilityButton();if(Phaser.Input.Keyboard.JustDown(this.abilityKey))this.triggerAbility();
    this.movePlayer();this.moveEnemies(d);this.moveBullets(d);this.moveOrbs(d);
    const difficultyTier=Math.min(5,Math.floor(this.elapsed/90)+Math.floor((this.level-1)/8));const spawnEvery=Math.max(820,1900-this.elapsed*3.2-difficultyTier*45);
    if(this.spawnClock>spawnEvery){this.spawnClock=0;const enemyLimit=Math.min(42,12+Math.floor(this.elapsed/32)+difficultyTier*2);if(this.enemies.length<enemyLimit)this.spawnEnemy();}
    if(this.elapsed>=this.nextBossAt){if(!this.enemies.some(e=>e.active&&e.isBoss))this.spawnBoss();this.nextBossAt+=90;}
    if(this.shotClock>this.playerStats.fireRate){this.shotClock=0;this.autoShoot();}
    if(Math.floor(this.elapsed)!==Math.floor(this.elapsed-d))this.updateHud();
  }
  movePlayer(){
    let x=0,y=0;const k=this.keys;
    if(k.A.isDown||k.LEFT.isDown||this.touch.left)x--;if(k.D.isDown||k.RIGHT.isDown||this.touch.right)x++;
    if(k.W.isDown||k.UP.isDown||this.touch.up)y--;if(k.S.isDown||k.DOWN.isDown||this.touch.down)y++;
    if(x&&y){x*=.707;y*=.707;}
    this.player.setVelocity(x*this.playerStats.speed,y*this.playerStats.speed);
    const moving=Boolean(x||y),breath=Math.sin(this.elapsed*(moving?17:3.2));
    this.player.setScale(1+(moving?breath*.035:breath*.018));
    this.player.setRotation(moving?Math.sin(this.elapsed*13)*.025:0);if(this.playerAttackTimer<=0){const anim=this.playerTextureKey+(moving?"_walk":"_idle");if(this.player.anims.currentAnim?.key!==anim)this.player.play(anim,true);}
    if(x)this.player.setFlipX(x<0);
    if(this.invuln>0)this.player.setAlpha(Math.floor(this.invuln*12)%2?.35:1);else this.player.setAlpha(1);
  }
  spawnEnemy(){
    const side=Phaser.Math.Between(0,3);let x=side===0?15:side===1?W-15:Phaser.Math.Between(15,W-15),y=side===2?15:side===3?H-15:Phaser.Math.Between(15,H-15);
    const roll=Math.random();const kind=this.elapsed>150&&roll<.14?"et_varginha":this.elapsed>120&&roll<.25?"boi_bumba":this.elapsed>90&&roll<.36?"saci":this.elapsed>65&&roll<.48?"ze_gotinha":this.elapsed>45&&roll<.58?"vendor":this.elapsed>35&&roll<.68?"motoboy":this.elapsed>25&&roll<.76?"churrasco":this.elapsed>18&&roll<.84?"mosquito":this.elapsed>10&&roll<.91?"capybara":roll<.96?"caramelo":"pigeon";
    const e=this.enemyGroup.create(x,y,"enemy_"+kind).setDepth(2);e.animationKey="enemy_"+kind;e.play(e.animationKey+"_walk");e.isVendor=kind==="vendor";e.isCapybara=kind==="capybara";e.isMosquito=kind==="mosquito";e.isCaramelo=kind==="caramelo";e.isMotoboy=kind==="motoboy";e.isChurrasco=kind==="churrasco";e.isSaci=kind==="saci";e.isBoiBumba=kind==="boi_bumba";e.isZeGotinha=kind==="ze_gotinha";e.isEt=kind==="et_varginha";
    e.enemyName=e.isVendor?"Vendedor do centro":e.isCapybara?"Capivara braba":e.isMosquito?"Pernilongo de madrugada":e.isCaramelo?"Cachorro caramelo":e.isMotoboy?"Motoboy do grau":e.isChurrasco?"Tio do churrasco":e.isSaci?"Saci-pererê":e.isBoiBumba?"Boi-bumbá":e.isZeGotinha?"Zé Gotinha":e.isEt?"ET de Varginha":"Pombo ladrão";
    const tier=Math.min(5,Math.floor(this.elapsed/90)+Math.floor((this.level-1)/8));e.difficultyTier=tier;e.hp=e.isVendor?3+Math.floor(this.elapsed/55):e.isEt?3+Math.floor(this.elapsed/60):e.isBoiBumba?4+Math.floor(this.elapsed/55):e.isSaci?2+Math.floor(this.elapsed/100):e.isCapybara?2+Math.floor(this.elapsed/90):e.isMosquito?1+Math.floor(this.elapsed/130):e.isCaramelo||e.isChurrasco?2+Math.floor(this.elapsed/115):e.isMotoboy?2+Math.floor(this.elapsed/100):1+Math.floor(this.elapsed/110);e.hp=Math.ceil(e.hp*(1+tier*.16));
    e.speed=e.isVendor?48:e.isEt?Phaser.Math.Between(72,92):e.isZeGotinha?Phaser.Math.Between(58,78):e.isBoiBumba?Phaser.Math.Between(34,44):e.isSaci?Phaser.Math.Between(112,142):e.isCapybara||e.isChurrasco?Phaser.Math.Between(38,52):e.isMosquito?Phaser.Math.Between(105,135):e.isMotoboy?Phaser.Math.Between(100,125):e.isCaramelo?Phaser.Math.Between(68,92):Phaser.Math.Between(62,88)+Math.min(45,this.elapsed*.4);
    e.damage=Math.ceil((e.isVendor?15:e.isEt?14:e.isBoiBumba?16:e.isSaci?11:e.isCapybara?12:e.isMosquito?6:e.isCaramelo?9:e.isMotoboy?11:e.isChurrasco?12:8)*(1+tier*.07));e.speed*=1+tier*.035;e.isElite=tier>=1&&Math.random()<Math.min(.18,.06+tier*.025);if(e.isElite){e.hp=Math.ceil(e.hp*1.8);e.damage=Math.ceil(e.damage*1.25);e.speed*=1.12;e.setTint(0xffd36a);}e.setScale((e.isVendor||e.isEt?1.15:e.isBoiBumba?1.28:e.isCapybara||e.isChurrasco?1.2:e.isCaramelo?1.12:1)*(e.isElite?1.18:1));e.baseScale=e.scaleX;
    this.enemies.push(e);
  }
  spawnBoss(){
    const side=Phaser.Math.Between(0,3);const x=side===0?22:side===1?W-22:Phaser.Math.Between(22,W-22);const y=side===2?22:side===3?H-22:Phaser.Math.Between(22,H-22);
    const bossType=this.bossCount%3;this.bossCount++;const bossData=[{texture:"boss_fiscal-do-pix",name:"Fiscal do Pix",hp:24,speed:38,damage:25,scale:1},{texture:"boss_boitata",name:"Boitatá",hp:34,speed:52,damage:29,scale:1},{texture:"boss_mula-sem-cabeca",name:"Mula-sem-cabeça",hp:40,speed:44,damage:31,scale:1}][bossType];
    const boss=this.enemyGroup.create(x,y,bossData.texture).setDepth(2).setScale(bossData.scale);boss.animationKey=bossData.texture;boss.play(boss.animationKey+"_walk");boss.baseScale=bossData.scale;boss.isBoss=true;boss.isVendor=false;boss.isCapybara=false;boss.enemyName=bossData.name;const bossTier=Math.min(5,Math.floor(this.elapsed/180)+Math.floor((this.level-1)/12));boss.hp=Math.round((bossData.hp+Math.floor(this.elapsed/55))*(1+bossTier*.28));boss.maxHp=boss.hp;boss.speed=bossData.speed*.88*(1+bossTier*.035);boss.damage=Math.round(bossData.damage*.68*(1+bossTier*.09));boss.difficultyTier=bossTier;this.enemies.push(boss);this.cameras.main.shake(260,.004);this.updateHud();
  }
  moveEnemies(){
    for(const e of this.enemies){
      if(!e.active)continue;
      this.physics.moveToObject(e,this.player,e.speed);
      if(!e.attackLock&&e.anims.currentAnim?.key!==e.animationKey+"_walk")e.play(e.animationKey+"_walk",true);
      const phase=this.elapsed*(e.isMosquito||e.isSaci?15:e.isBoss?4:6)+e.x*.035;
      const pulse=Math.sin(phase);
      e.setFlipX(this.player.x<e.x);e.setScale(e.baseScale*(1+(e.isBoss?pulse*.045:e.isMosquito?pulse*.055:pulse*.025)));
      e.setRotation(e.isMosquito?Math.sin(phase*.7)*.13:e.isBoss?Math.sin(phase*.45)*.025:Math.sin(phase*.5)*.035);
    }
  }
  spawnHitEffect(x,y,color=0xffd16b){
    const spark=this.add.circle(x,y,7,color,.8).setDepth(5);
    this.tweens.add({targets:spark,scale:2.8,alpha:0,duration:190,ease:"Cubic.Out",onComplete:()=>spark.destroy()});
  }
  autoShoot(){
    const alive=this.enemies.filter(e=>e.active);if(!alive.length)return;
    this.playerAttackTimer=.28;this.player.play(this.playerTextureKey+"_attack",true);
    alive.sort((a,b)=>Phaser.Math.Distance.Between(this.player.x,this.player.y,a.x,a.y)-Phaser.Math.Distance.Between(this.player.x,this.player.y,b.x,b.y));
    const target=alive[0],base=Phaser.Math.Angle.Between(this.player.x,this.player.y,target.x,target.y);
    const level=Math.min(3,this.playerStats.weaponLevel||1),count=level===1?1:level===2?3:5;
    const spread=level===2 ? 0.18 : 0.16;
    const starter=this.playerStats.startingWeapon==="chinelo"?"bullet_chinelo":this.playerStats.startingWeapon==="estilingue"?"bullet_estilingue":this.playerStats.startingWeapon==="redemoinho"?"bullet_redemoinho":this.playerStats.startingWeapon==="onda"?"bullet_onda":"bullet_espeto";
    const projectile=level===1?starter:level===2?"bullet_rojao":"bullet_fogos";
    for(let i=0;i<count;i++){
      const angle=base+(i-(count-1)/2)*spread;
      const b=this.bulletGroup.create(this.player.x,this.player.y,projectile).setDepth(2);
      b.setRotation(angle+Math.PI/2);
      this.physics.velocityFromRotation(angle,this.playerStats.bulletSpeed,b.body.velocity);
      b.damage=this.playerStats.damage;this.time.delayedCall(1800,()=>{if(b.active)b.destroy();});
    }
  }
  hitEnemy(b,e){
    if(!b.active||!e.active)return;b.destroy();this.damageEnemy(e,b.damage);
  }
  showDamageNumber(x,y,damage,isCritical=false){
    const amount=Math.max(1,Math.round(damage));
    const color=isCritical?"#ffe36e":damage>=20?"#ff9c52":"#fff4d6";
    const label=this.add.text(x+Phaser.Math.Between(-9,9),y-13,isCritical?amount+"!":String(amount),{
      fontFamily:"Press Start 2P, monospace",fontSize:isCritical?"15px":damage>=20?"13px":"11px",
      color,stroke:"#241a20",strokeThickness:isCritical?5:4,
      shadow:{offsetX:0,offsetY:2,color:"#000000",blur:4,fill:true}
    }).setOrigin(.5).setDepth(9).setScale(isCritical?1.25:1);
    this.tweens.add({targets:label,y:label.y-(isCritical?54:38),alpha:0,scale:isCritical?1.55:1.2,duration:isCritical?760:620,ease:"Cubic.Out",onComplete:()=>label.destroy()});
    if(isCritical){
      const burst=this.add.circle(x,y,5,0xffd85e,.85).setDepth(8);
      this.tweens.add({targets:burst,scale:3.2,alpha:0,duration:240,ease:"Cubic.Out",onComplete:()=>burst.destroy()});
    }
  }
  damageEnemy(e,damage){
    if(!e.active)return;
    const isCritical=Math.random()<.10;
    const finalDamage=isCritical?damage*1.75:damage;
    e.hp-=finalDamage;
    this.showDamageNumber(e.x,e.y,finalDamage,isCritical);
    e.setTintFill(isCritical?0xffdf72:0xffffff);this.time.delayedCall(65,()=>{if(e.active)e.clearTint();});if(e.isBoss)this.updateHud();
    if(e.hp<=0){const x=e.x,y=e.y;if(e.isBoss){this.spawnChest(x,y);this.cameras.main.shake(360,.007);}this.spawnHitEffect(x,y,e.isBoss?0xff5574:e.isVendor?0xffa45c:0xffd16b);this.enemyGroup.killAndHide(e);e.body.enable=false;this.enemies=this.enemies.filter(v=>v!==e);this.kills++;this.coins+=(e.isBoss?5:e.isElite?3:1)+this.playerStats.coinBonus;const orb=this.orbGroup.create(x,y,"orb").setDepth(2);orb.value=e.isBoss?14:e.isElite?6:e.isVendor?5:e.isCapybara||e.isCaramelo||e.isMotoboy||e.isChurrasco||e.isSaci||e.isBoiBumba||e.isEt?3:2;orb.body.setCircle(6);this.updateHud();}
  }
  triggerAbility(){
    if(!this.active||this.abilityCooldown>0)return;
    this.abilityCooldown=12;this.updateAbilityButton();
    const radius=170,ring=this.add.circle(this.player.x,this.player.y,12).setStrokeStyle(6,0xffd66e,.95).setDepth(5);
    this.tweens.add({targets:ring,scale:14,alpha:0,duration:360,ease:"Cubic.Out",onComplete:()=>ring.destroy()});
    this.cameras.main.shake(180,.0025);
    for(const e of [...this.enemies]){
      if(!e.active)continue;
      const distance=Phaser.Math.Distance.Between(this.player.x,this.player.y,e.x,e.y);
      if(distance>radius)continue;
      this.damageEnemy(e,e.isBoss?2.5:4);
      if(e.active&&!e.isBoss){const angle=Phaser.Math.Angle.Between(this.player.x,this.player.y,e.x,e.y);this.physics.velocityFromRotation(angle,260,e.body.velocity);}
    }
  }
  updateAbilityButton(){
    if(!ui.abilityButton)return;
    const ready=this.abilityCooldown<=0;
    ui.abilityButton.disabled=!this.active||!ready;
    ui.abilityCooldown.textContent=ready?"PRONTO":Math.ceil(this.abilityCooldown)+"s";
    ui.abilityButton.classList.toggle("ready",ready&&this.active);
  }
  hitPlayer(p,e){
    if(!this.active||this.invuln>0||!e.active)return;if(this.playerStats.dodgeChance>0&&Math.random()<this.playerStats.dodgeChance){this.invuln=.45;this.spawnHitEffect(this.player.x,this.player.y,0x9ed8b0);return;}this.playerStats.hp-=e.damage*(e.isBoss?.58:.62)*(1-(this.playerStats.damageReduction||0));this.invuln=1.15;this.cameras.main.shake(110,.0018);this.updateHud();
    if(!e.attackLock&&e.animationKey){e.attackLock=true;e.play(e.animationKey+"_attack",true);this.time.delayedCall(420,()=>{if(e.active){e.attackLock=false;e.play(e.animationKey+"_walk",true);}});}
    if(this.playerStats.hp<=0)this.endRun();
  }
  spawnChest(x,y){const chest=this.chestGroup.create(x,y,"chest").setDepth(2).setScale(1.25);chest.setImmovable(true);chest.opened=false;this.time.delayedCall(30000,()=>{if(chest.active)chest.destroy();});}
  collectChest(p,chest){if(!this.active||!chest.active||chest.opened)return;chest.opened=true;chest.destroy();this.showChestRewards();}
  showChestRewards(){
    this.active=false;this.physics.pause();ui.levelScreen.classList.remove("hidden");
    const heading=ui.levelScreen.querySelector("h2"),description=ui.levelScreen.querySelector("p:not(.eyebrow)");
    heading.textContent="BAÚ DO CHURRASCO!";
    description.textContent="Escolha uma recompensa. Quanto maior a raridade, maior o prêmio.";
    ui.upgrades.innerHTML="";
    const choices=[];
    const available=chestUpgrades.filter(item=>!["PIPOCA DE CINEMA","CANHÃO DE FESTA JUNINA"].includes(item.name)||this.playerStats.weaponLevel<3);
    for(let i=0;i<3&&available.length;i++){
      const roll=Math.random()*100,rarity=roll<25?"ÉPICO":roll<75?"RARO":"COMUM";
      let pool=available.filter(item=>item.rarity===rarity);
      if(!pool.length)pool=available;
      const selected=Phaser.Utils.Array.GetRandom(pool);
      choices.push(selected);available.splice(available.indexOf(selected),1);
    }
    for(const item of choices){const btn=document.createElement("button");const rarityClass=item.rarity==="ÉPICO"?"epico":item.rarity==="RARO"?"raro":"comum";btn.className="upgrade-card rarity-"+rarityClass;btn.innerHTML=`<small>${item.rarity} · RECOMPENSA</small><b>${item.name}</b><span>${item.desc}</span><i>ESCOLHER RECOMPENSA</i>`;btn.addEventListener("click",()=>{item.apply(this.playerStats);if(item.name==="PIX DO MILHÃO"||item.name==="MALA DE DINHEIRO")this.coins+=15;ui.levelScreen.classList.add("hidden");heading.textContent="SUBIU DE NÍVEL!";description.textContent="Escolha uma melhoria:";this.updateHud();this.active=true;this.physics.resume();},{once:true});ui.upgrades.append(btn);}
    this.updateHud();
  }
  collectOrb(p,o){if(!o.active)return;this.xp+=o.value*(this.playerStats.xpMultiplier||1);o.destroy();this.processLevelUps();this.updateHud();}
  processLevelUps(){if(this.xp<this.xpNeed)return;this.xp-=this.xpNeed;this.level++;this.xpNeed=Math.ceil(this.xpNeed*1.22+1);this.showLevelUp();}
  moveBullets(){this.bulletGroup.children.each(b=>{if(b.active&&(b.x<0||b.x>W||b.y<0||b.y>H))b.destroy();});}
  moveOrbs(d){this.orbGroup.children.each(o=>{if(!o.active)return;const dist=Phaser.Math.Distance.Between(o.x,o.y,this.player.x,this.player.y);if(dist<105)this.physics.moveToObject(o,this.player,210);});}
  showLevelUp(){
    this.active=false;this.physics.pause();ui.levelScreen.classList.remove("hidden");ui.upgrades.innerHTML="";
    const choices=Phaser.Utils.Array.Shuffle([...upgrades]).slice(0,3);if(this.playerStats.hp/this.playerStats.maxHp<.4){const heal=upgrades.find(item=>item.name==="ÁGUA DE COCO GELADA");if(heal&&!choices.includes(heal))choices[2]=heal;}
    for(const item of choices){const btn=document.createElement("button");const rarityClass=item.rarity==="ÉPICO"?"epico":item.rarity==="RARO"?"raro":"comum";btn.className="upgrade-card rarity-"+rarityClass;btn.innerHTML=`<small>${item.rarity} · MELHORIA</small><b>${item.name}</b><span>${item.desc}</span><i>ESCOLHER MELHORIA</i>`;btn.addEventListener("click",()=>{item.apply(this.playerStats);ui.levelScreen.classList.add("hidden");this.updateHud();if(this.xp>=this.xpNeed){this.processLevelUps();}else{this.active=true;this.physics.resume();}},{once:true});ui.upgrades.append(btn);}
    this.updateHud();
  }
  updateHud(){
    ui.time.textContent=this.formatTime(this.elapsed);ui.level.textContent=String(this.level).padStart(2,"0");ui.kills.textContent=this.kills;ui.coins.textContent=this.coins;
    ui.hp.textContent=`${Math.max(0,Math.ceil(this.playerStats.hp))} / ${this.playerStats.maxHp}`;ui.hpFill.style.width=`${Math.max(0,this.playerStats.hp/this.playerStats.maxHp*100)}%`;const boss=this.enemies.find(e=>e.active&&e.isBoss);ui.bossWrap.classList.toggle("hidden",!boss);if(boss){ui.bossHp.textContent=`${Math.max(0,Math.ceil(boss.hp))} / ${boss.maxHp}`;ui.bossFill.style.width=`${Math.max(0,boss.hp/boss.maxHp*100)}%`;if(ui.bossName)ui.bossName.textContent=`CHEFE: ${boss.enemyName.toUpperCase()}`;}ui.xp.textContent=`${this.xp} / ${this.xpNeed}`;ui.xpFill.style.width=`${Math.min(100,this.xp/this.xpNeed*100)}%`;
  }
  formatTime(s){const n=Math.floor(s);return String(Math.floor(n/60)).padStart(2,"0")+":"+String(n%60).padStart(2,"0");}
  endRun(){this.active=false;this.updateAbilityButton();this.physics.pause();const earned=this.coins+Math.floor(this.elapsed/30)+Math.floor(this.kills/10);metaProgress.coins+=earned;persistMetaProgress();this.renderMetaShop();ui.final.textContent=`Você sobreviveu por ${this.formatTime(this.elapsed)}, eliminou ${this.kills} inimigos e ganhou ${earned} fichas permanentes.`;ui.gameover.classList.remove("hidden");}
}
const game=new Phaser.Game({type:Phaser.AUTO,parent:"game",width:W,height:H,backgroundColor:"#121a29",pixelArt:true,physics:{default:"arcade",arcade:{debug:false}},scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},scene:[Arena]});
const scene=()=>game.scene.getScene("arena");
function persistMetaProgress(){try{localStorage.setItem(META_KEY,JSON.stringify(metaProgress));return true;}catch{return false;}}
function selectCharacter(id){
  if(!Object.hasOwn(characterProfiles,id))return false;
  metaProgress.selectedCharacter=id;
  const arena=game.scene.getScene("arena");
  if(arena)arena.selectedCharacter=id;
  document.querySelectorAll("[data-character]").forEach(button=>{
    const selected=button.dataset.character===id;
    button.classList.toggle("selected",selected);
    button.setAttribute("aria-pressed",String(selected));
  });
  const label=document.querySelector("#selected-character-label");
  if(label)label.textContent=`SELECIONADO: ${characterProfiles[id].name.toUpperCase()}`;
  persistMetaProgress();
  return true;
}
document.querySelector("#start-btn").addEventListener("click",()=>{scene().startRun();});
document.querySelector("#restart-btn").addEventListener("click",()=>{ui.gameover.classList.add("hidden");scene().startRun();});
const touch={up:false,down:false,left:false,right:false};scene().touch=touch;scene().renderMetaShop();ui.abilityButton.addEventListener("click",()=>scene().triggerAbility());
document.addEventListener("click",event=>{
  const button=event.target.closest?.("[data-character]");
  if(!button)return;
  event.preventDefault();
  selectCharacter(button.dataset.character);
},true);
selectCharacter(metaProgress.selectedCharacter);
document.querySelectorAll("[data-meta-upgrade]").forEach(button=>button.addEventListener("click",()=>scene().buyMetaUpgrade(button.dataset.metaUpgrade)));
document.querySelectorAll("[data-key]").forEach(btn=>{
  const key=btn.dataset.key;
  const down=e=>{e.preventDefault();touch[key]=true;btn.classList.add("is-pressed");try{btn.setPointerCapture(e.pointerId);}catch{}};
  const up=e=>{if(e)e.preventDefault();touch[key]=false;btn.classList.remove("is-pressed");};
  btn.addEventListener("pointerdown",down);btn.addEventListener("pointerup",up);btn.addEventListener("pointercancel",up);btn.addEventListener("lostpointercapture",up);
});
const releaseTouch=()=>{Object.keys(touch).forEach(k=>touch[k]=false);document.querySelectorAll(".dpad button.is-pressed").forEach(btn=>btn.classList.remove("is-pressed"));};
window.addEventListener("blur",releaseTouch);document.addEventListener("visibilitychange",()=>{if(document.hidden)releaseTouch();});