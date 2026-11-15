import { readFileSync, existsSync } from "node:fs";
import assert from "node:assert/strict";

const htmlPath = "index.html";
const gamePath = "src/game.js";
assert.ok(existsSync(htmlPath), "index.html não encontrado");
assert.ok(existsSync(gamePath), "src/game.js não encontrado");

const html = readFileSync(htmlPath, "utf8");
const game = readFileSync(gamePath, "utf8");
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
assert.ok(game.includes("e.isBoss?8:e.isVendor?3"), "Recompensa especial do chefe não encontrada");

console.log("Validação concluída: arquivos presentes, Phaser carregado e seletores HTML conferidos.");
