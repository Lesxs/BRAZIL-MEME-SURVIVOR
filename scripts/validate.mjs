import { readFileSync, existsSync } from "node:fs";
import assert from "node:assert/strict";

const htmlPath = "index.html";
const gamePath = "src/game.js";
assert.ok(existsSync(htmlPath), "index.html não encontrado");
assert.ok(existsSync(gamePath), "src/game.js não encontrado");

const html = readFileSync(htmlPath, "utf8");
const game = readFileSync(gamePath, "utf8");
const css = readFileSync("style.css", "utf8");
const selectors = [...game.matchAll(/document\.querySelector\("#([^"]+)"\)/g)].map(match => match[1]);
const missing = [...new Set(selectors)].filter(id => !html.includes('id="' + id + '"') && !html.includes("id='" + id + "'"));

assert.deepEqual(missing, [], "IDs usados pelo JavaScript e ausentes no HTML: " + missing.join(", "));
assert.ok(html.includes("phaser@3.80.1"), "Biblioteca Phaser 3.80.1 não encontrada");
assert.ok(html.includes('src="./src/game.js?v=0.10.3"'), "Entrada do jogo com cache busting não encontrada no HTML");
assert.ok(game.includes("processLevelUps("), "Rotina de evolução de nível não encontrada");
assert.ok(game.includes("Math.min(42,12+Math.floor(this.elapsed/32)+difficultyTier*2)"), "Limite de inimigos simultâneos não encontrado");
assert.ok(game.includes("for(const e of this.enemies)"), "Loop de inimigos otimizado não encontrado");
assert.ok(game.includes('generateTexture("boss",56,56)'), "Textura do chefe não encontrada");
assert.ok(game.includes("spawnBoss()"), "Rotina de surgimento do chefe não encontrada");
assert.ok(game.includes('generateTexture("caramelo",40,40)'), "Sprite do cachorro caramelo não encontrado");
assert.ok(game.includes('generateTexture("mosquito",40,40)'), "Sprite do pernilongo não encontrado");
assert.ok(game.includes('generateTexture("motoboy",40,40)'), "Sprite do motoboy não encontrado");
assert.ok(game.includes('generateTexture("churrasco",40,40)'), "Sprite do tio do churrasco não encontrado");
assert.ok(game.includes("this.nextBossAt=90;"), "Temporizador de chefes não é reiniciado");
const resetRunBody=game.slice(game.indexOf("  resetRun(){"),game.indexOf("  renderMetaShop(){"));
assert.ok(resetRunBody.includes("this.nextBossAt=90;"), "Temporizador do chefe não é reiniciado em uma nova partida");
assert.ok(!game.includes("this.nextBossAt=90;this.nextBossAt=90;"), "Temporizador do chefe duplicado");
assert.ok(!game.includes("this.nextBossAt=90;this.nextBossAt=90;"), "Inicialização duplicada do chefe encontrada");
assert.ok(game.includes('"Fiscal do Pix"'), "Identidade brasileira do chefe não encontrada");
assert.ok(game.includes("orb.value=e.isBoss?14:e.isElite?6:e.isVendor?5"), "Recompensa especial do chefe não encontrada");

assert.ok(!html.includes("meme-wall") && !html.includes("meme-sticker"), "Tela inicial antiga com mural de emojis ainda está presente");
assert.ok(html.includes('class="title-screen-art"'), "Arte cenográfica da nova tela inicial não encontrada");
assert.ok(html.includes('class="game-logo"'), "Título principal da nova tela inicial não encontrado");
assert.ok(css.includes(".start-screen{") && css.includes(".hero-silhouette{") && css.includes(".skyline-front{"), "Estilos da nova identidade visual não encontrados");
assert.ok(css.includes(".upgrade-card.rarity-epico"), "Estilo de raridade épica não encontrado");
console.log("Validação concluída: arquivos, seletores, Phaser, identidade visual e tela inicial conferidos.");

assert.ok(html.includes('id="boss-wrap"') && html.includes('id="boss-hp"') && html.includes('id="boss-fill"'), "HUD de vida do chefe não encontrado");
assert.ok(game.includes('boss.maxHp=boss.hp'), "Vida máxima do chefe não foi registrada");
assert.ok(game.includes('this.enemies.some(e=>e.active&&e.isBoss)'), "Proteção contra chefes simultâneos não encontrada");
assert.ok(game.includes('ui.bossFill.style.width'), "Atualização da barra de vida do chefe não encontrada");

assert.ok(game.includes('generateTexture("chest",40,40)'), "Sprite do baú brasileiro não encontrado");
assert.ok(game.includes("this.physics.add.overlap(this.player,this.chestGroup,this.collectChest"), "Colisão para abrir baú não encontrada");
assert.ok(game.includes("spawnChest(x,y)"), "Surgimento de baú após chefe não encontrado");
assert.ok(game.includes("showChestRewards()"), "Tela de recompensas do baú não encontrada");
assert.ok(game.includes('rarity:"ÉPICO"'), "Recompensas épicas não encontradas");
assert.ok(css.includes(".upgrade-card.rarity-epico"), "Estilo de raridade épica não encontrado");

assert.ok(game.includes('g.generateTexture("player",40,40)'), "Sprite redesenhado do sobrevivente não encontrado");
assert.ok(game.includes('g.generateTexture("pigeon",40,40)'), "Sprite redesenhado do pombo não encontrado");
assert.ok(game.includes('g.generateTexture("boss",56,56)'), "Sprite redesenhado do Fiscal do Pix não encontrado");
assert.ok(game.includes("Fachadas de comércio brasileiro"), "Cenário urbano brasileiro não encontrado");
assert.ok(game.includes("Postes, árvores, bancos, bueiros"), "Elementos de ambientação da arena não encontrados");
assert.ok(!game.includes("bg.lineStyle(1,0x243047,.65)"), "Grade genérica do cenário antigo ainda está presente");
assert.ok(game.includes("weaponLevel:1"), "Nível inicial da arma não encontrado");
assert.ok(game.includes("count=level===1?1:level===2?3:5"), "Disparos evolutivos não encontrados");
assert.ok(game.includes('generateTexture("bullet_espeto",14,16)'), "Projétil de espeto não encontrado");
assert.ok(game.includes('generateTexture("bullet_rojao",16,18)'), "Projétil de rojão não encontrado");
assert.ok(game.includes('generateTexture("bullet_fogos",16,16)'), "Projétil de fogos de artifício não encontrado");
assert.ok(game.includes('const starter=this.playerStats.startingWeapon==='), "Armas iniciais por personagem não encontradas");
assert.ok(game.includes('const projectile=level===1?starter:level===2?"bullet_rojao":"bullet_fogos"'), "Seleção visual de projéteis por evolução não encontrada");
assert.ok(game.includes("this.player.setScale(1+(moving?breath*.035:breath*.018))"), "Animação de respiração e movimento do jogador não encontrada");
assert.ok(game.includes("e.setScale(e.baseScale*(1+(e.isBoss?pulse*.045:e.isMosquito?pulse*.055:pulse*.025)))"), "Animação procedural dos inimigos não encontrada");
assert.ok(game.includes("spawnHitEffect(x,y,color=0xffd16b)"), "Efeito visual de impacto não encontrado");
assert.ok(game.includes("this.cameras.main.shake(260,.004)"), "Impacto de entrada do chefe não encontrado");
assert.ok(game.includes('generateTexture("saci",40,40)'), "Sprite do Saci não encontrado");
assert.ok(game.includes('generateTexture("boi_bumba",40,40)'), "Sprite do Boi-bumbá não encontrado");
assert.ok(game.includes("triggerAbility(){"), "Habilidade ativa não encontrada");
assert.ok(game.includes("const radius=170"), "Área de efeito não encontrada");
assert.ok(game.includes("this.abilityCooldown=12"), "Recarga da habilidade não encontrada");
assert.ok(game.includes('ui.abilityButton.addEventListener("click",()=>scene().triggerAbility())'), "Clique do botão da habilidade não está conectado");
assert.ok(html.includes('id="ability-btn"') && html.includes('id="ability-cooldown"'), "Botão da habilidade não encontrado");
assert.ok(css.includes(".ability-btn.ready"), "Estilo do botão de habilidade não encontrado");
assert.ok(game.includes('name:"PIPOCA DE CINEMA"'), "Evolução rara da arma não encontrada");
assert.ok(game.includes('name:"CANHÃO DE FESTA JUNINA"'), "Evolução épica da arma não encontrada");
assert.ok(game.includes('const available=chestUpgrades.filter(item=>!["PIPOCA DE CINEMA","CANHÃO DE FESTA JUNINA"].includes(item.name)||this.playerStats.weaponLevel<3);'), "Baú ainda pode oferecer evolução de arma sem efeito no nível máximo");
assert.ok(game.includes('name:"PIX DO MILHÃO",desc:"+15 moedas imediatamente.",rarity:"RARO",apply:p=>{}'), "Pix do Milhão não está limitado ao bônus imediato anunciado");
assert.ok(game.includes('this.coins+=item.name==="PIX DO MILHÃO"?15:20'), "Recompensa imediata de moedas do baú não encontrada");

assert.ok(html.includes('data-character="sobrevivente"') && html.includes('data-character="motoboy"') && html.includes('data-character="capivara"') && html.includes('data-character="saci"') && html.includes('data-character="curupira"') && html.includes('data-character="boto"'), "Seleção dos seis personagens jogáveis não encontrada");
assert.ok(html.includes('id="selected-character-label"') && html.includes('aria-pressed="true"'), "Estado visual e acessível do personagem selecionado não encontrado");
assert.ok(game.includes("function selectCharacter(id)") && game.includes('document.addEventListener("click",event=>'), "Seleção por mouse, toque e teclado não está conectada");
assert.ok(game.includes('this.selectedCharacter=characterProfiles[metaProgress.selectedCharacter]?metaProgress.selectedCharacter:"sobrevivente";this.resetRun();'), "Início da partida não sincroniza o personagem escolhido");
assert.ok(game.includes("function persistMetaProgress()") && game.includes("try{localStorage.setItem(META_KEY"), "Persistência da seleção não trata bloqueio do armazenamento local");
assert.ok(html.includes("./src/game.js?v=0.10.3") && html.includes("./style.css?v=0.10.3"), "Cache busting da versão não encontrado");
assert.ok(game.includes("const characterProfiles="), "Perfis de personagens não encontrados");
assert.ok(game.includes("this.player.setTexture(this.playerTextureKey,0)") && game.includes("this.playerTextureKey=profile.texture"), "Troca de aparência por personagem não encontrada");
assert.ok(game.includes('generateTexture("bullet_chinelo",18,32)'), "Arma Chinelo do Motoboy não encontrada");
assert.ok(game.includes('generateTexture("bullet_estilingue",28,28)'), "Arma Estilingue da Capivara não encontrada");
assert.ok(game.includes('generateTexture("bullet_redemoinho",24,24)'), "Projétil Redemoinho do Saci não encontrado");
assert.ok(game.includes('saci:{name:"Saci-pererê",texture:"char_saci",hp:85,speed:270,damage:.88,fireRate:540,weapon:"redemoinho"'), "Perfil jogável do Saci não encontrado");
assert.ok(game.includes('this.playerStats.startingWeapon==="redemoinho"?"bullet_redemoinho"'), "Arma inicial do Saci não está conectada ao disparo");
assert.ok(html.includes('data-character="saci"'), "Cartão de seleção do Saci não encontrado");
assert.ok(css.includes(".character-options{display:grid;grid-template-columns:repeat(3,minmax(0,1fr))"), "Grade desktop para cinco personagens não encontrada");
assert.ok(css.includes(".character-options{grid-template-columns:repeat(2,minmax(0,1fr))"), "Grade mobile de duas colunas não encontrada");
assert.ok(game.includes("startingWeapon"), "Arma inicial por personagem não encontrada");
assert.ok(html.includes('data-meta-upgrade="hp"') && html.includes('data-meta-upgrade="damage"') && html.includes('data-meta-upgrade="speed"'), "Loja de melhorias permanentes não encontrada");
assert.ok(game.includes("localStorage.setItem(META_KEY"), "Salvamento local da progressão permanente não encontrado");
assert.ok(game.includes("metaProgress.coins+=earned"), "Recompensa permanente ao fim da partida não encontrada");
assert.ok(game.includes('generateTexture("boitata",60,42)'), "Sprite do chefe Boitatá não encontrado");
assert.ok(game.includes('const bossType=this.bossCount%3') && game.includes('name:"Mula-sem-cabeça"'), "Rotação entre os três chefes brasileiros não encontrada");
assert.ok(game.includes('generateTexture("mula",64,48)'), "Sprite da Mula-sem-cabeça não encontrado");
assert.ok(game.includes('generateTexture("ze_gotinha",40,40)') && game.includes('generateTexture("et_varginha",40,40)'), "Novos inimigos brasileiros não encontrados");
assert.ok(game.includes("this.damageEnemy(e,e.hp)"), "Colisão não concede recompensas de eliminação");
assert.ok(html.includes('id="boss-name"'), "Nome dinâmico do chefe não encontrado");
assert.ok(css.includes(".character-card.selected") && css.includes(".meta-shop-options") && css.includes("#start-screen .title-screen-art{pointer-events:none}") && css.includes("#start-screen .character-options{position:relative;z-index:4}"), "Estilos da seleção de personagem e loja não encontrados");
console.log("Mega atualização 0.3.0: personagens, armas exclusivas, loja permanente e rotação de chefes conferidos.");

assert.ok(html.includes('VERSÃO 0.10.3'), 'Versão do jogo não foi atualizada para 0.10.3');

assert.ok(game.includes('damage:1.08'), "Passiva de dano do Sobrevivente não encontrada");
assert.ok(game.includes('coinBonus:1'), "Bônus de moedas do Motoboy não encontrado");
assert.ok(game.includes('damageReduction:.2'), "Redução de dano da Capivara não encontrada");
assert.ok(game.includes('dodgeChance:.15'), "Esquiva do Saci não encontrada");
assert.ok(game.includes('coinBonus:profile.coinBonus||0'), "Passivas não são carregadas nos atributos da partida");
assert.ok(game.includes('Math.random()<this.playerStats.dodgeChance'), "Esquiva do Saci não está aplicada ao receber dano");
assert.ok(game.includes('e.damage*(e.isBoss?.58:.62)*(1-(this.playerStats.damageReduction||0))'), "Redução de dano da Capivara não está aplicada");
assert.ok(html.includes('+8% dano · Espeto') && html.includes('+1 moeda por eliminação · Chinelo') && html.includes('20% menos dano · Estilingue') && html.includes('15% de esquiva · Redemoinho'), "Passivas não estão descritas nos cartões");
assert.ok(html.includes('VERSÃO 0.10.3'), "Versão não foi atualizada para 0.10.3");
console.log("Versão 0.10.3: passivas exclusivas dos seis personagens conferidas.");

assert.ok(game.includes("this.invuln=.45;this.spawnHitEffect(this.player.x,this.player.y,0x9ed8b0)"), "Esquiva não concede breve proteção contra colisões repetidas");

assert.ok(game.includes('curupira:{name:"Curupira",texture:"char_curupira"'), "Perfil jogável do Curupira não encontrado");
assert.ok(game.includes('g.generateTexture("curupira",40,40)'), "Sprite procedural do Curupira não encontrado");
assert.ok(game.includes("regen:profile.regen||0"), "Regeneração não é carregada nos atributos do personagem");
assert.ok(game.includes("this.playerStats.regen>=0") || game.includes("this.playerStats.regen>0&&this.regenClock>=8"), "Regeneração periódica não foi implementada");
assert.ok(game.includes("this.playerStats.hp+=healed"), "Cura periódica não é aplicada à vida do jogador");
assert.ok(html.includes('data-character="curupira"') && html.includes('Recupera 2 de vida a cada 8s'), "Curupira não aparece corretamente na seleção");
assert.ok(html.includes('VERSÃO 0.10.3'), "Versão 0.10.3 não aparece no HTML");
assert.ok(css.includes("grid-template-columns:repeat(3,minmax(0,1fr))"), "Grade desktop de três colunas não foi configurada");
console.log("Versão 0.10.3: Curupira, sprite, seleção e regeneração periódica conferidos.");

assert.ok(resetRunBody.includes("this.shotClock=0;this.regenClock=0;this.invuln=0;this.abilityCooldown=0;"), "Relógios de regeneração, invulnerabilidade e habilidade não são reiniciados em nova partida");
assert.ok(game.includes('boto:{name:"Boto-cor-de-rosa",texture:"char_boto"') && game.includes("xpMultiplier:1.2"), "Personagem Boto-cor-de-rosa e bônus de XP não encontrados");
assert.ok(game.includes('g.generateTexture("boto",40,40)') && game.includes('g.generateTexture("bullet_onda",24,24)'), "Sprites do Boto e da Onda não encontrados");
assert.ok(game.includes("xpMultiplier:profile.xpMultiplier||1") && game.includes("this.xp+=o.value*(this.playerStats.xpMultiplier||1)"), "Bônus de experiência não está conectado à coleta de orbes");
assert.ok(game.includes('this.playerStats.startingWeapon==="onda"?"bullet_onda"'), "Arma Onda não está conectada ao disparo");
assert.ok(html.includes('+20% de XP · Onda'), "Passiva do Boto não aparece no cartão");

// 0.10.3: spritesheets, animações e seleção delegada.
for(const id of ["sobrevivente","motoboy","capivara","saci","curupira","boto"])assert.ok(existsSync(`assets/sprites/characters/${id}.png`),`Spritesheet de ${id} ausente`);
for(const id of ["fiscal-do-pix","boitata","mula-sem-cabeca"])assert.ok(existsSync(`assets/sprites/bosses/${id}.png`),`Spritesheet de ${id} ausente`);
assert.ok(game.includes('this.load.spritesheet("char_"+id'),"Carregamento das spritesheets dos personagens ausente");
assert.ok(game.includes('this.anims.create({key:key+"_"+a.name'),"Animações das spritesheets ausentes");
assert.ok(game.includes('document.addEventListener("click",event=>'),"Seleção delegada ausente");
assert.ok(!game.includes('button.addEventListener("pointerdown",choose'),"Listener antigo de seleção ainda existe");

for(const id of ["pigeon","caramelo","capybara","mosquito","vendor","motoboy","churrasco","saci","boi_bumba","ze_gotinha","et_varginha"])assert.ok(existsSync(`assets/sprites/enemies/${id}.png`),`Spritesheet ${id} ausente`);
assert.ok(game.includes('this.load.spritesheet("enemy_"+id'));
assert.ok(game.includes('this.load.spritesheet("char_"+id') && game.includes('frameWidth:48,frameHeight:48'),"Spritesheet animada do protagonista não encontrada");
assert.ok(game.includes('this.playerTextureKey=profile.texture') && game.includes('this.player.play(this.playerTextureKey+"_idle",true)'),"Animações do personagem selecionado não estão conectadas");
assert.ok(game.includes('assets/sprites/characters/"+id+".png?v=0.10.3') && game.includes('assets/sprites/enemies/"+id+".png?v=0.10.3'),"Cache busting dos sprites não encontrado");
assert.ok(game.includes('const e=this.enemyGroup.create(x,y,"enemy_"+kind).setDepth(2);e.play("enemy_"+kind+"_idle")'),"Inimigos não usam spritesheets consistentes");
assert.ok(!game.includes("pilotTexture") && game.includes('this.enemyGroup.create(x,y,"enemy_"+kind)'),"Inimigos ainda usam sprites piloto inconsistentes");
assert.ok(game.includes("Math.max(820,1900-this.elapsed*3.2-difficultyTier*45)"));
assert.ok(game.includes('roll<25?"ÉPICO":roll<75?"RARO":"COMUM"'));

assert.ok(game.includes('name:"ÁGUA DE COCO GELADA"') && game.includes("p.maxHp*.3"),"Melhoria de recuperação de vida ausente");
assert.ok(game.includes('rarityClass=item.rarity==="ÉPICO"?"epico":item.rarity==="RARO"?"raro":"comum"'),"Raridade visual das melhorias de nível ausente");
assert.ok(game.includes("p.damage*=1.45") && game.includes("p.speed*=1.35") && game.includes("p.maxHp+=45"),"Efeitos dos itens não correspondem às descrições");

assert.ok(game.includes("Math.floor(this.elapsed/90)+Math.floor((this.level-1)/8)"),"Escalonamento da dificuldade por tempo e nível ausente");
assert.ok(game.includes("e.isElite=tier>=1") && game.includes("e.hp=Math.ceil(e.hp*1.8)") && game.includes("orb.value=e.isBoss?14:e.isElite?6"),"Inimigos de elite e recompensa adicional ausentes");
assert.ok(game.includes("bossTier=Math.min(5") && game.includes("boss.damage=Math.round(bossData.damage*.68*(1+bossTier*.09))"),"Escalonamento progressivo dos chefes ausente");

for(const id of ["pilot_hero","pilot_caramelo","pilot_capybara","pilot_mosquito"])assert.ok(existsSync(`assets/sprites/pilot/${id}.png`),`Sprite piloto ${id} ausente`);
