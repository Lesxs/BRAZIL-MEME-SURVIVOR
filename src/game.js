const W = 960, H = 540;
const ui = {
  time: document.querySelector("#time"), level: document.querySelector("#level"),
  kills: document.querySelector("#kills"), coins: document.querySelector("#coins"),
  xp: document.querySelector("#xp-label"), hp: document.querySelector("#hp-label"), hpFill: document.querySelector("#hp-fill"), xpFill: document.querySelector("#xp-fill"),
  start: document.querySelector("#start-screen"), levelScreen: document.querySelector("#level-screen"),
  gameover: document.querySelector("#gameover-screen"), upgrades: document.querySelector("#upgrade-list"),
  final: document.querySelector("#final-stats")
};
const upgrades = [
  {name:"PESO DE RESPEITO",desc:"+25% de dano nos ataques.",apply:p=>p.damage*=1.25},
  {name:"CHINELO TURBO",desc:"+18% de velocidade de movimento.",apply:p=>p.speed*=1.18},
  {name:"CASCA GROSSA",desc:"+25 de vida máxima e cura 25.",apply:p=>{p.maxHp+=25;p.hp=Math.min(p.maxHp,p.hp+25)}},
  {name:"MIRA DE MILHÕES",desc:"+20% de velocidade de ataque.",apply:p=>p.fireRate*=.8},
  {name:"PIX PREMIADO",desc:"+1 moeda extra por eliminação.",apply:p=>p.coinBonus++},
  {name:"ENERGÉTICO DE GUARANÁ",desc:"+15% de velocidade dos projéteis.",apply:p=>p.bulletSpeed*=1.15}
];
class Arena extends Phaser.Scene {
  constructor(){super("arena");this.active=false;this.level=1;this.xp=0;this.xpNeed=5;this.kills=0;this.coins=0;this.elapsed=0;this.spawnClock=0;this.shotClock=0;this.invuln=0;this.nextBossAt=60;this.nextBossAt=60;this.playerStats={};this.enemies=[];this.bullets=[];this.orbs=[];this.keys={};this.touch={up:false,down:false,left:false,right:false};}
  create(){
    this.makeTextures();this.drawArena();
    this.player=this.physics.add.image(W/2,H/2,"player").setDepth(3).setCollideWorldBounds(true);
    this.player.body.setCircle(11,5,5);
    this.enemyGroup=this.physics.add.group();this.bulletGroup=this.physics.add.group();this.orbGroup=this.physics.add.group();
    this.physics.add.overlap(this.bulletGroup,this.enemyGroup,this.hitEnemy,null,this);
    this.physics.add.overlap(this.player,this.enemyGroup,this.hitPlayer,null,this);
    this.physics.add.overlap(this.player,this.orbGroup,this.collectOrb,null,this);
    this.keys=this.input.keyboard.addKeys("W,A,S,D,UP,DOWN,LEFT,RIGHT");
    this.resetRun();this.scene.pause();
  }
  makeTextures(){
    const g=this.make.graphics({x:0,y:0,add:false});
    g.fillStyle(0xb8f36b);g.fillCircle(16,16,14);g.fillStyle(0x26351e);g.fillCircle(11,13,2);g.fillCircle(21,13,2);g.fillStyle(0x26351e);g.fillRect(12,21,8,2);g.generateTexture("player",32,32);g.clear();
    g.fillStyle(0xb8a0ff);g.fillCircle(13,13,11);g.fillStyle(0x211d37);g.fillCircle(9,11,2);g.fillCircle(17,11,2);g.fillRect(10,17,7,2);g.generateTexture("pigeon",26,26);g.clear();
    g.fillStyle(0xffa35c);g.fillRoundedRect(2,2,24,24,7);g.fillStyle(0x442616);g.fillCircle(9,11,2);g.fillCircle(19,11,2);g.fillRect(10,18,8,2);g.generateTexture("vendor",28,28);g.clear();
    g.fillStyle(0x9bc879);g.fillEllipse(16,17,27,21);g.fillStyle(0x334b2b);g.fillCircle(9,12,2);g.fillCircle(21,12,2);g.fillStyle(0x273b24);g.fillEllipse(15,21,9,4);g.generateTexture("capybara",32,32);g.clear();
    g.fillStyle(0x6f273b);g.fillRoundedRect(2,2,36,36,9);g.fillStyle(0xffd166);g.fillCircle(12,14,3);g.fillCircle(28,14,3);g.fillStyle(0x1c1720);g.fillRect(13,25,14,4);g.generateTexture("boss",40,40);g.clear();
    g.fillStyle(0x65e6a3);g.fillCircle(6,6,6);g.generateTexture("orb",12,12);g.clear();
    g.fillStyle(0xffed8a);g.fillCircle(6,6,6);g.generateTexture("bullet",12,12);g.destroy();
  }
  drawArena(){
    const bg=this.add.graphics().setDepth(0);bg.fillStyle(0x121a29);bg.fillRect(0,0,W,H);
    bg.lineStyle(1,0x243047,.65);for(let x=0;x<W;x+=40)bg.lineBetween(x,0,x,H);for(let y=0;y<H;y+=40)bg.lineBetween(0,y,W,y);
    bg.lineStyle(2,0x35435a,.8);bg.strokeRect(8,8,W-16,H-16);
    const deco=this.add.graphics().setDepth(1);for(let i=0;i<24;i++){const x=Phaser.Math.Between(25,W-25),y=Phaser.Math.Between(25,H-25);deco.fillStyle(0x2c3a4c,.55);deco.fillCircle(x,y,Phaser.Math.Between(1,3));}
  }
  resetRun(){
    this.active=false;this.level=1;this.xp=0;this.xpNeed=5;this.kills=0;this.coins=0;this.elapsed=0;this.spawnClock=0;this.shotClock=0;this.invuln=0;
    this.playerStats={hp:100,maxHp:100,speed:220,damage:1,fireRate:650,bulletSpeed:430,coinBonus:0};
    this.player.setPosition(W/2,H/2).setAlpha(1);
    [this.enemyGroup,this.bulletGroup,this.orbGroup].forEach(g=>g.clear(true,true));
    this.enemies=[];this.bullets=[];this.orbs=[];this.updateHud();
  }
  startRun(){this.resetRun();this.active=true;ui.start.classList.add("hidden");ui.gameover.classList.add("hidden");this.scene.resume();}
  update(t,dt){
    if(!this.active)return;
    const d=dt/1000;this.elapsed+=d;this.spawnClock+=dt;this.shotClock+=dt;this.invuln=Math.max(0,this.invuln-d);
    this.movePlayer();this.moveEnemies(d);this.moveBullets(d);this.moveOrbs(d);
    const spawnEvery=Math.max(380,1250-this.elapsed*8);
    if(this.spawnClock>spawnEvery){this.spawnClock=0;const enemyLimit=Math.min(70,24+Math.floor(this.elapsed/12));if(this.enemies.length<enemyLimit)this.spawnEnemy();}
    if(this.elapsed>=this.nextBossAt){this.spawnBoss();this.nextBossAt+=60;}
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
    const roll=Math.random();const kind=this.elapsed>25&&roll<.16?"vendor":this.elapsed>12&&roll<.43?"capybara":"pigeon";
    const e=this.enemyGroup.create(x,y,kind).setDepth(2);e.isVendor=kind==="vendor";e.isCapybara=kind==="capybara";
    e.hp=e.isVendor?4+Math.floor(this.elapsed/30):e.isCapybara?2+Math.floor(this.elapsed/55):1+Math.floor(this.elapsed/70);
    e.speed=e.isVendor?48:e.isCapybara?Phaser.Math.Between(38,52):Phaser.Math.Between(62,88)+Math.min(45,this.elapsed*.4);
    e.damage=e.isVendor?22:e.isCapybara?18:12;e.setScale(e.isVendor?1.15:e.isCapybara?1.2:1);
    this.enemies.push(e);
  }
  spawnBoss(){
    const side=Phaser.Math.Between(0,3);const x=side===0?22:side===1?W-22:Phaser.Math.Between(22,W-22);const y=side===2?22:side===3?H-22:Phaser.Math.Between(22,H-22);
    const boss=this.enemyGroup.create(x,y,"boss").setDepth(2).setScale(1.8);boss.isBoss=true;boss.isVendor=false;boss.isCapybara=false;boss.hp=24+Math.floor(this.elapsed/12);boss.speed=38;boss.damage=25;this.enemies.push(boss);
  }
  moveEnemies(){for(const e of this.enemies){if(!e.active)continue;this.physics.moveToObject(e,this.player,e.speed);}}
  autoShoot(){
    const alive=this.enemies.filter(e=>e.active);if(!alive.length)return;
    alive.sort((a,b)=>Phaser.Math.Distance.Between(this.player.x,this.player.y,a.x,a.y)-Phaser.Math.Distance.Between(this.player.x,this.player.y,b.x,b.y));
    const target=alive[0],b=this.bulletGroup.create(this.player.x,this.player.y,"bullet").setDepth(2);
    this.physics.moveToObject(b,target,this.playerStats.bulletSpeed);b.damage=this.playerStats.damage;this.time.delayedCall(1800,()=>{if(b.active)b.destroy();});
  }
  hitEnemy(b,e){
    if(!b.active||!e.active)return;b.destroy();e.hp-=b.damage;
    if(e.hp<=0){const x=e.x,y=e.y;this.enemyGroup.killAndHide(e);e.body.enable=false;this.enemies=this.enemies.filter(v=>v!==e);this.kills++;this.coins+=(e.isBoss?5:1)+this.playerStats.coinBonus;const orb=this.orbGroup.create(x,y,"orb").setDepth(2);orb.value=e.isBoss?8:e.isVendor?3:e.isCapybara?2:1;orb.body.setCircle(6);this.updateHud();}
  }
  hitPlayer(p,e){
    if(!this.active||this.invuln>0||!e.active)return;this.playerStats.hp-=e.damage;this.invuln=0.75;this.updateHud();
    e.hp=0;this.enemyGroup.killAndHide(e);e.body.enable=false;this.enemies=this.enemies.filter(v=>v!==e);
    if(this.playerStats.hp<=0)this.endRun();
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
    ui.hp.textContent=`${Math.max(0,Math.ceil(this.playerStats.hp))} / ${this.playerStats.maxHp}`;ui.hpFill.style.width=`${Math.max(0,this.playerStats.hp/this.playerStats.maxHp*100)}%`;ui.xp.textContent=`${this.xp} / ${this.xpNeed}`;ui.xpFill.style.width=`${Math.min(100,this.xp/this.xpNeed*100)}%`;
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