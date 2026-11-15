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
assert.ok(html.includes('src="./src/game.js"'), "Entrada do jogo não encontrada no HTML");
assert.ok(game.includes("processLevelUps("), "Rotina de evolução de nível não encontrada");
assert.ok(game.includes("Math.min(70,24+Math.floor(this.elapsed/12))"), "Limite de inimigos simultâneos não encontrado");
assert.ok(game.includes("for(const e of this.enemies)"), "Loop de inimigos otimizado não encontrado");
assert.ok(game.includes('generateTexture("boss",40,40)'), "Textura do chefe não encontrada");
assert.ok(game.includes("spawnBoss()"), "Rotina de surgimento do chefe não encontrada");
assert.ok(game.includes('generateTexture("caramelo",32,32)'), "Sprite do cachorro caramelo não encontrado");
assert.ok(game.includes('generateTexture("mosquito",32,32)'), "Sprite do pernilongo não encontrado");
assert.ok(game.includes('generateTexture("motoboy",32,32)'), "Sprite do motoboy não encontrado");
assert.ok(game.includes('generateTexture("churrasco",32,32)'), "Sprite do tio do churrasco não encontrado");
assert.ok(game.includes("this.nextBossAt=60;"), "Temporizador de chefes não é reiniciado");
assert.ok(game.includes('resetRun(){\n    this.active=false;this.level=1;this.xp=0;this.xpNeed=5;this.kills=0;this.coins=0;this.elapsed=0;this.spawnClock=0;this.shotClock=0;this.invuln=0;this.nextBossAt=60;'), "Temporizador do chefe não é reiniciado em uma nova partida");
assert.ok(!game.includes("this.nextBossAt=60;this.nextBossAt=60;"), "Temporizador do chefe duplicado");
assert.ok(!game.includes("this.nextBossAt=60;this.nextBossAt=60;"), "Inicialização duplicada do chefe encontrada");
assert.ok(game.includes('"Fiscal do Pix"'), "Identidade brasileira do chefe não encontrada");
assert.ok(game.includes("e.isBoss?8:e.isVendor?3"), "Recompensa especial do chefe não encontrada");

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

assert.ok(game.includes('generateTexture("chest",32,32)'), "Sprite do baú brasileiro não encontrado");
assert.ok(game.includes("this.physics.add.overlap(this.player,this.chestGroup,this.collectChest"), "Colisão para abrir baú não encontrada");
assert.ok(game.includes("spawnChest(x,y)"), "Surgimento de baú após chefe não encontrado");
assert.ok(game.includes("showChestRewards()"), "Tela de recompensas do baú não encontrada");
assert.ok(game.includes('rarity:"ÉPICO"'), "Recompensas épicas não encontradas");
assert.ok(css.includes(".upgrade-card.rarity-epico"), "Estilo de raridade épica não encontrado");

assert.ok(game.includes("weaponLevel:1"), "Nível inicial da arma não encontrado");
assert.ok(game.includes("count=level===1?1:level===2?3:5"), "Disparos evolutivos não encontrados");
assert.ok(game.includes('name:"PIPOCA DE CINEMA"'), "Evolução rara da arma não encontrada");
assert.ok(game.includes('name:"CANHÃO DE FESTA JUNINA"'), "Evolução épica da arma não encontrada");
