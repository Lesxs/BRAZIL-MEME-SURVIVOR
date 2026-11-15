import { readFileSync, existsSync } from "node:fs";
import assert from "node:assert/strict";

const htmlPath = "index.html";
const gamePath = "src/game.js";
assert.ok(existsSync(htmlPath), "index.html não encontrado");
assert.ok(existsSync(gamePath), "src/game.js não encontrado");

const html = readFileSync(htmlPath, "utf8");
const game = readFileSync(gamePath, "utf8");
const selectors = [...game.matchAll(/document\\.querySelector\\("#([^"]+)"\\)/g)].map(match => match[1]);
const missing = [...new Set(selectors)].filter(id => !new RegExp('id=["\\']' + id + '["\\']').test(html));

assert.deepEqual(missing, [], "IDs usados pelo JavaScript e ausentes no HTML: " + missing.join(", "));
assert.match(html, /phaser@3\\.80\\.1/, "Biblioteca Phaser 3.80.1 não encontrada");
assert.match(html, /src="\\.\\/src\\/game\\.js"/, "Entrada do jogo não encontrada no HTML");
assert.match(game, /processLevelUps\\(/, "Rotina de evolução de nível não encontrada");

console.log("Validação concluída: arquivos presentes, Phaser carregado e seletores HTML conferidos.");
