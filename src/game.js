const W = 960, H = 540;
const ui = {
  time: document.querySelector("#time"), level: document.querySelector("#level"),
  kills: document.querySelector("#kills"), coins: document.querySelector("#coins"),
  xp: document.querySelector("#xp-label"), hp: document.querySelector("#hp-label"), hpFill: document.querySelector("#hp-fill"), xpFill: document.querySelector("#xp-fill"),
  start: document.querySelector("#start-screen"), levelScreen: document.querySelector("#level-screen"),
  gameover: document.querySelector("#gameover-screen"), upgrades: document.querySelector("#upgrade-list"),
  final: document.querySelector("#final-stats"), bossWrap: document.querySelector("#boss-wrap"), bossHp: document.querySelector("#boss-hp"), bossFill: document.querySelector("#boss-fill")
};
const chestUpgrades = [
  {name:"ESPETO DE AÇO",desc:"+35% de dano nos ataques.",rarity:"COMUM",apply:p=>p.damage*=1.35},
  {name:"CALDO DE CANA",desc:"+30% de velocidade de movimento.",rarity:"COMUM",apply:p=>p.speed*=1.3},
  {name:"FARofa REFORÇADA",desc:"+35 de vida máxima e recupera 35.",rarity:"COMUM",apply:p=>{p.maxHp+=35;p.hp=Math.min(p.maxHp,p.hp+35)}},
  {name:"CHURRASCO DE RESPEITO",desc:"+60% de dano nos ataques.",rarity:"RARO",apply:p=>p.damage*=1.6},
  {name:"GÁS DO BOTIJÃO",desc:"+45% de velocidade de ataque.",rarity:"RARO",apply:p=>p.fireRate*=.55},
  {name:"PIX DO MILHÃO",desc:"+8 moedas imediatamente.",rarity:"RARO",apply:p=>{}},
  {name:"BENÇÃO DA CAPIVARA",desc:"Recupera toda a vida e aumenta a vida máxima em 60.",rarity:"ÉPICO",apply:p=>{p.maxHp+=60;p.hp=p.maxHp}},
  {name:"CHINELO LENDÁRIO",desc:"+75% de velocidade e +35% de dano.",rarity:"ÉPICO",apply:p=>{p.speed*=1.75;p.damage*=1.35}},
  {name:"MALA DE DINHEIRO",desc:"+15 moedas e +25% de velocidade de ataque.",rarity:"ÉPICO",apply:p=>{p.fireRate*=.75}},
  {name:"PIPOCA DE CINEMA",desc:"Avança um estágio na evolução do ataque.",rarity:"RARO",apply:p=>p.weaponLevel=Math.min(3,p.weaponLevel+1)},
  {name:"CANHÃO DE FESTA JUNINA",desc:"Evolui o ataque para cinco projéteis por disparo.",rarity:"ÉPICO",apply:p=>p.weaponLevel=3}
];
const upgrades = [
  {name:"PESO DE RESPEITO",desc:"+25% de dano nos ataques.",apply:p=>p.damage*=1.25},
  {name:"CHINELO TURBO",desc:"+18% de velocidade de movimento.",apply:p=>p.speed*=1.18},
  {name:"CASCA GROSSA",desc:"+25 de vida máxima e cura 25.",apply:p=>{p.maxHp+=25;p.hp=Math.min(p.maxHp,p.hp+25)}},
  {name:"MIRA DE MILHÕES",desc:"+20% de velocidade de ataque.",apply:p=>p.fireRate*=.8},
  {name:"PIX PREMIADO",desc:"+1 moeda extra por eliminação.",apply:p=>p.coinBonus++},
  {name:"ENERGÉTICO DE GUARANÁ",desc:"+15% de velocidade dos projéteis.",apply:p=>p.bulletSpeed*=1.15}
];
class Arena extends Phaser.Scene {
  constructor(){super("arena");this.active=false;this.level=1;this.xp=0;this.xpNeed=5;this.kills=0;this.coins=0;this.elapsed=0;this.spawnClock=0;this.shotClock=0;this.invuln=0;this.nextBossAt=60;this.playerStats={};this.enemies=[];this.bullets=[];this.orbs=[];this.keys={};this.touch={up:false,down:false,left:false,right:false};}
  create(){
    this.makeTextures();this.drawArena();
    this.player=this.physics.add.image(W/2,H/2,"player").setDepth(3).setCollideWorldBounds(true);
    this.player.body.setCircle(11,5,5);
    this.enemyGroup=this.physics.add.group();this.bulletGroup=this.physics.add.group();this.orbGroup=this.physics.add.group();this.chestGroup=this.physics.add.group();
    this.physics.add.overlap(this.bulletGroup,this.enemyGroup,this.hitEnemy,null,this);
    this.physics.add.overlap(this.player,this.enemyGroup,this.hitPlayer,null,this);
    this.physics.add.overlap(this.player,this.orbGroup,this.collectOrb,null,this);
    this.physics.add.overlap(this.player,this.chestGroup,this.collectChest,null,this);
    this.keys=this.input.keyboard.addKeys("W,A,S,D,UP,DOWN,LEFT,RIGHT");
    this.resetRun();this.scene.pause();
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
    g.fillStyle(0xffed8a);g.fillCircle(6,6,6);g.fillStyle(0xff9d42);g.fillCircle(6,6,2);g.generateTexture("bullet",12,12);g.destroy();
  }
  drawArena(){
    const bg=this.add.graphics().setDepth(0);
    bg.fillStyle(0x263b38);bg.fillRect(0,0,W,H);
    // Quadras e asfalto com textura discreta, sem grade de protótipo.
    bg.fillStyle(0x52604d);bg.fillRect(0,0,W,72);bg.fillRect(0,H-70,W,70);
    bg.fillStyle(0x303a39);bg.fillRect(0,72,W,H-142);
    bg.fillStyle(0x394544);bg.fillRect(0,80,W,7);bg.fillRect(0,H-78,W,7);
    // Calçadas, guias e faixas de pedestre.
    bg.fillStyle(0x9a927c);bg.fillRect(0,67,W,7);bg.fillRect(0,H-74,W,7);
    bg.fillStyle(0xe4d6ad,.7);for(let i=0;i<8;i++)bg.fillRect(410+i*19,72,10,34);
    bg.fillStyle(0xd9d1b8,.45);for(let i=0;i<8;i++)bg.fillRect(410+i*19,H-106,10,34);
    // Fachadas de comércio brasileiro nas bordas superiores e inferiores.
    const shops=[{x:22,w:150,c:0xc66c43},{x:202,w:128,c:0x527d70},{x:360,w:154,c:0xd1a65f},{x:548,w:135,c:0x6d8290},{x:715,w:210,c:0xb75c48}];
    for(const s of shops){
      bg.fillStyle(0x202a2b);bg.fillRoundedRect(s.x,9,s.w,53,4);
      bg.fillStyle(s.c);bg.fillRect(s.x+4,13,s.w-8,45);
      bg.fillStyle(0xf2d99b);bg.fillRect(s.x+9,20,s.w-18,5);
      bg.fillStyle(0x263b3b);bg.fillRect(s.x+12,31,s.w-24,23);
      bg.fillStyle(0x9ec0ad);for(let x=s.x+17;x<s.x+s.w-18;x+=26)bg.fillRect(x,34,17,17);
      bg.fillStyle(0x332b25);bg.fillRect(s.x+5,57,s.w-10,5);
      bg.fillStyle(0xf0c56b);bg.fillRect(s.x+8,14,s.w-16,3);
    }
    // Casas e quiosques no lado de baixo, mantendo a área central livre.
    const stalls=[{x:35,w:125,c:0x8f4b34},{x:230,w:150,c:0x376b5a},{x:580,w:145,c:0xb67a3f},{x:790,w:130,c:0x42677c}];
    for(const s of stalls){
      bg.fillStyle(0x202929);bg.fillRect(s.x,H-65,s.w,54);
      bg.fillStyle(s.c);bg.fillRect(s.x+4,H-61,s.w-8,46);
      bg.fillStyle(0xe8c47d);bg.fillRect(s.x,H-65,s.w,8);
      bg.fillStyle(0x293c3a);bg.fillRect(s.x+12,H-48,s.w-24,28);
      bg.fillStyle(0x9dc5b1);bg.fillRect(s.x+17,H-45,18,17);
      bg.fillStyle(0x40352b);bg.fillRect(s.x+4,H-15,s.w-8,4);
    }
    // Postes, árvores, bancos, bueiros e marcas de rua.
    const deco=this.add.graphics().setDepth(1);
    for(let i=0;i<18;i++){
      const x=18+i*54;
      deco.fillStyle(0x1d2927);deco.fillCircle(x,91+(i%2)*12,12);
      deco.fillStyle(0x49724f);deco.fillCircle(x-3,87+(i%2)*12,10);
      deco.fillStyle(0x77583b);deco.fillRect(x-2,98+(i%2)*12,4,10);
      if(i%3===0){deco.fillStyle(0x202a2b);deco.fillRect(x+17,104,3,32);deco.fillStyle(0xf3c56b);deco.fillCircle(x+18,103,4);}
    }
    for(let i=0;i<7;i++){
      const x=95+i*125,y=H/2+(i%2?54:-58);
      deco.fillStyle(0x1c2525);deco.fillEllipse(x,y,31,15);
      deco.lineStyle(2,0x77827a,.7);deco.strokeEllipse(x,y,31,15);
      deco.fillStyle(0x69736a);deco.fillCircle(x,y,3);
    }
    // Linhas de pista e pequenos detalhes urbanos.
    deco.lineStyle(2,0xb5a77e,.45);
    for(let x=25;x<W;x+=95){deco.lineBetween(x,270,x+42,270);deco.lineBetween(x,282,x+42,282);}
    deco.fillStyle(0xe6d6a8,.55);deco.fillCircle(480,270,3);
    deco.lineStyle(2,0x152321,.8);deco.strokeRect(7,7,W-14,H-14);
  }
  resetRun(){
    this.active=false;this.level=1;this.xp=0;this.xpNeed=5;this.kills=0;this.coins=0;this.elapsed=0;this.spawnClock=0;this.shotClock=0;this.invuln=0;this.nextBossAt=60;
    this.playerStats={hp:100,maxHp:100,speed:220,damage:1,fireRate:650,bulletSpeed:430,coinBonus:0,weaponLevel:1};
    this.player.setPosition(W/2,H/2).setAlpha(1);
    [this.enemyGroup,this.bulletGroup,this.orbGroup,this.chestGroup].forEach(g=>g.clear(true,true));
    this.enemies=[];this.bullets=[];this.orbs=[];this.updateHud();
  }
  startRun(){this.resetRun();this.active=true;ui.start.classList.add("hidden");ui.gameover.classList.add("hidden");this.scene.resume();}
  update(t,dt){
    if(!this.active)return;
    const d=dt/1000;this.elapsed+=d;this.spawnClock+=dt;this.shotClock+=dt;this.invuln=Math.max(0,this.invuln-d);
    this.movePlayer();this.moveEnemies(d);this.moveBullets(d);this.moveOrbs(d);
    const spawnEvery=Math.max(380,1250-this.elapsed*8);
    if(this.spawnClock>spawnEvery){this.spawnClock=0;const enemyLimit=Math.min(70,24+Math.floor(this.elapsed/12));if(this.enemies.length<enemyLimit)this.spawnEnemy();}
    if(this.elapsed>=this.nextBossAt){if(!this.enemies.some(e=>e.active&&e.isBoss))this.spawnBoss();this.nextBossAt+=60;}
    if(this.shotClock>this.playerStats.fireRate){this.shotClock=0;this.autoShoot();}
    if(Math.floor(this.elapsed)!==Math.floor(this.elapsed-d))this.updateHud();
  }
  movePlayer(){
    let x=0,y=0;const k=this.keys;
    if(k.A.isDown||k.LEFT.isDown||this.touch.left)x--;if(k.D.isDown||k.RIGHT.isDown||this.touch.right)x++;
    if(k.W.isDown||k.UP.isDown||this.touch.up)y--;if(k.S.isDown||k.DOWN.isDown||this.touch.down)y++;
    if(x&&y){x*=.707;y*=.707;}
    this.player.setVelocity(x*this.playerStats.speed,y*this.playerStats.speed);
    if(x)this.player.setFlipX(x<0);
    if(this.invuln>0)this.player.setAlpha(Math.floor(this.invuln*12)%2?.35:1);else this.player.setAlpha(1);
  }
  spawnEnemy(){
    const side=Phaser.Math.Between(0,3);let x=side===0?15:side===1?W-15:Phaser.Math.Between(15,W-15),y=side===2?15:side===3?H-15:Phaser.Math.Between(15,H-15);
    const roll=Math.random();const kind=this.elapsed>35&&roll<.10?"vendor":this.elapsed>28&&roll<.22?"motoboy":this.elapsed>22&&roll<.32?"churrasco":this.elapsed>18&&roll<.43?"mosquito":this.elapsed>12&&roll<.58?"capybara":roll<.78?"caramelo":"pigeon";
    const e=this.enemyGroup.create(x,y,kind).setDepth(2);e.isVendor=kind==="vendor";e.isCapybara=kind==="capybara";e.isMosquito=kind==="mosquito";e.isCaramelo=kind==="caramelo";e.isMotoboy=kind==="motoboy";e.isChurrasco=kind==="churrasco";
    e.enemyName=e.isVendor?"Vendedor do centro":e.isCapybara?"Capivara braba":e.isMosquito?"Pernilongo de madrugada":e.isCaramelo?"Cachorro caramelo":e.isMotoboy?"Motoboy do grau":e.isChurrasco?"Tio do churrasco":"Pombo ladrão";
    e.hp=e.isVendor?4+Math.floor(this.elapsed/30):e.isCapybara?2+Math.floor(this.elapsed/55):e.isMosquito?1+Math.floor(this.elapsed/85):e.isCaramelo||e.isChurrasco?2+Math.floor(this.elapsed/80):e.isMotoboy?3+Math.floor(this.elapsed/65):1+Math.floor(this.elapsed/70);
    e.speed=e.isVendor?48:e.isCapybara||e.isChurrasco?Phaser.Math.Between(38,52):e.isMosquito?Phaser.Math.Between(105,135):e.isMotoboy?Phaser.Math.Between(100,125):e.isCaramelo?Phaser.Math.Between(68,92):Phaser.Math.Between(62,88)+Math.min(45,this.elapsed*.4);
    e.damage=e.isVendor?22:e.isCapybara?18:e.isMosquito?9:e.isCaramelo?14:e.isMotoboy?17:e.isChurrasco?19:12;e.setScale(e.isVendor?1.15:e.isCapybara||e.isChurrasco?1.2:e.isCaramelo?1.12:1);
    this.enemies.push(e);
  }
  spawnBoss(){
    const side=Phaser.Math.Between(0,3);const x=side===0?22:side===1?W-22:Phaser.Math.Between(22,W-22);const y=side===2?22:side===3?H-22:Phaser.Math.Between(22,H-22);
    const boss=this.enemyGroup.create(x,y,"boss").setDepth(2).setScale(1.45);boss.isBoss=true;boss.isVendor=false;boss.isCapybara=false;boss.enemyName="Fiscal do Pix";boss.hp=24+Math.floor(this.elapsed/12);boss.maxHp=boss.hp;boss.speed=38;boss.damage=25;this.enemies.push(boss);this.updateHud();
  }
  moveEnemies(){for(const e of this.enemies){if(!e.active)continue;this.physics.moveToObject(e,this.player,e.speed);}}
  autoShoot(){
    const alive=this.enemies.filter(e=>e.active);if(!alive.length)return;
    alive.sort((a,b)=>Phaser.Math.Distance.Between(this.player.x,this.player.y,a.x,a.y)-Phaser.Math.Distance.Between(this.player.x,this.player.y,b.x,b.y));
    const target=alive[0],base=Phaser.Math.Angle.Between(this.player.x,this.player.y,target.x,target.y);
    const level=Math.min(3,this.playerStats.weaponLevel||1),count=level===1?1:level===2?3:5;
    const spread=level===2 ? 0.18 : 0.16;
    for(let i=0;i<count;i++){
      const angle=base+(i-(count-1)/2)*spread;
      const b=this.bulletGroup.create(this.player.x,this.player.y,"bullet").setDepth(2);
      this.physics.velocityFromRotation(angle,this.playerStats.bulletSpeed,b.body.velocity);
      b.damage=this.playerStats.damage;this.time.delayedCall(1800,()=>{if(b.active)b.destroy();});
    }
  }
  hitEnemy(b,e){
    if(!b.active||!e.active)return;b.destroy();e.hp-=b.damage;if(e.isBoss)this.updateHud();
    if(e.hp<=0){const x=e.x,y=e.y;if(e.isBoss)this.spawnChest(x,y);this.enemyGroup.killAndHide(e);e.body.enable=false;this.enemies=this.enemies.filter(v=>v!==e);this.kills++;this.coins+=(e.isBoss?5:1)+this.playerStats.coinBonus;const orb=this.orbGroup.create(x,y,"orb").setDepth(2);orb.value=e.isBoss?8:e.isVendor?3:e.isCapybara||e.isCaramelo||e.isMotoboy||e.isChurrasco?2:1;orb.body.setCircle(6);this.updateHud();}
  }
  hitPlayer(p,e){
    if(!this.active||this.invuln>0||!e.active)return;this.playerStats.hp-=e.damage;this.invuln=0.75;this.updateHud();
    if(!e.isBoss){e.hp=0;this.enemyGroup.killAndHide(e);e.body.enable=false;this.enemies=this.enemies.filter(v=>v!==e);}
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
      const roll=Math.random()*100,rarity=roll<10?"ÉPICO":roll<40?"RARO":"COMUM";
      let pool=available.filter(item=>item.rarity===rarity);
      if(!pool.length)pool=available;
      const selected=Phaser.Utils.Array.GetRandom(pool);
      choices.push(selected);available.splice(available.indexOf(selected),1);
    }
    for(const item of choices){const btn=document.createElement("button");const rarityClass=item.rarity==="ÉPICO"?"epico":item.rarity==="RARO"?"raro":"comum";btn.className="upgrade-card rarity-"+rarityClass;btn.innerHTML=`<small>${item.rarity}</small><b>${item.name}</b><span>${item.desc}</span>`;btn.addEventListener("click",()=>{item.apply(this.playerStats);if(item.name==="PIX DO MILHÃO"||item.name==="MALA DE DINHEIRO")this.coins+=item.name==="PIX DO MILHÃO"?8:15;ui.levelScreen.classList.add("hidden");heading.textContent="SUBIU DE NÍVEL!";description.textContent="Escolha uma melhoria:";this.updateHud();this.active=true;this.physics.resume();},{once:true});ui.upgrades.append(btn);}
    this.updateHud();
  }
  collectOrb(p,o){if(!o.active)return;this.xp+=o.value;o.destroy();this.processLevelUps();this.updateHud();}
  processLevelUps(){if(this.xp<this.xpNeed)return;this.xp-=this.xpNeed;this.level++;this.xpNeed=Math.ceil(this.xpNeed*1.38+2);this.showLevelUp();}
  moveBullets(){this.bulletGroup.children.each(b=>{if(b.active&&(b.x<0||b.x>W||b.y<0||b.y>H))b.destroy();});}
  moveOrbs(d){this.orbGroup.children.each(o=>{if(!o.active)return;const dist=Phaser.Math.Distance.Between(o.x,o.y,this.player.x,this.player.y);if(dist<105)this.physics.moveToObject(o,this.player,210);});}
  showLevelUp(){
    this.active=false;this.physics.pause();ui.levelScreen.classList.remove("hidden");ui.upgrades.innerHTML="";
    const choices=Phaser.Utils.Array.Shuffle([...upgrades]).slice(0,3);
    for(const item of choices){const btn=document.createElement("button");btn.className="upgrade-card";btn.innerHTML=`<b>${item.name}</b><span>${item.desc}</span>`;btn.addEventListener("click",()=>{item.apply(this.playerStats);ui.levelScreen.classList.add("hidden");this.updateHud();if(this.xp>=this.xpNeed){this.processLevelUps();}else{this.active=true;this.physics.resume();}},{once:true});ui.upgrades.append(btn);}
    this.updateHud();
  }
  updateHud(){
    ui.time.textContent=this.formatTime(this.elapsed);ui.level.textContent=String(this.level).padStart(2,"0");ui.kills.textContent=this.kills;ui.coins.textContent=this.coins;
    ui.hp.textContent=`${Math.max(0,Math.ceil(this.playerStats.hp))} / ${this.playerStats.maxHp}`;ui.hpFill.style.width=`${Math.max(0,this.playerStats.hp/this.playerStats.maxHp*100)}%`;const boss=this.enemies.find(e=>e.active&&e.isBoss);ui.bossWrap.classList.toggle("hidden",!boss);if(boss){ui.bossHp.textContent=`${Math.max(0,Math.ceil(boss.hp))} / ${boss.maxHp}`;ui.bossFill.style.width=`${Math.max(0,boss.hp/boss.maxHp*100)}%`;}ui.xp.textContent=`${this.xp} / ${this.xpNeed}`;ui.xpFill.style.width=`${Math.min(100,this.xp/this.xpNeed*100)}%`;
  }
  formatTime(s){const n=Math.floor(s);return String(Math.floor(n/60)).padStart(2,"0")+":"+String(n%60).padStart(2,"0");}
  endRun(){this.active=false;this.physics.pause();ui.final.textContent=`Você sobreviveu por ${this.formatTime(this.elapsed)} e eliminou ${this.kills} inimigos.`;ui.gameover.classList.remove("hidden");}
}
const game=new Phaser.Game({type:Phaser.AUTO,parent:"game",width:W,height:H,backgroundColor:"#121a29",pixelArt:true,physics:{default:"arcade",arcade:{debug:false}},scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},scene:[Arena]});
const scene=()=>game.scene.getScene("arena");
document.querySelector("#start-btn").addEventListener("click",()=>{scene().startRun();});
document.querySelector("#restart-btn").addEventListener("click",()=>{ui.gameover.classList.add("hidden");scene().startRun();});
const touch={up:false,down:false,left:false,right:false};scene().touch=touch;
document.querySelectorAll("[data-key]").forEach(btn=>{
  const key=btn.dataset.key;
  const down=e=>{e.preventDefault();touch[key]=true;};const up=e=>{e.preventDefault();touch[key]=false;};
  btn.addEventListener("pointerdown",down);btn.addEventListener("pointerup",up);btn.addEventListener("pointerleave",up);btn.addEventListener("pointercancel",up);
});
window.addEventListener("blur",()=>Object.keys(touch).forEach(k=>touch[k]=false));