# BRASIL: MEME SURVIVORS

Um roguelite de sobrevivência em arena com humor e referências à cultura brasileira, desenvolvido em Phaser 3.

## Como jogar
- **WASD / setas:** movimentar
- **Celular:** use os controles direcionais na arena
- **Ataque:** automático contra o inimigo mais próximo
- **Objetivo:** sobreviver, derrotar inimigos, coletar XP e escolher melhorias ao subir de nível.

## Inimigos
- **Pombo:** inimigo básico.
- **Capivara:** mais resistente, lenta e concede mais experiência.
- **Vendedor:** inimigo resistente, causa mais dano e concede mais experiência.

## Progressão
- Colete esferas verdes para ganhar XP.
- Escolha melhorias de dano, velocidade, ataque, projéteis, moedas ou vida.
- Evoluções acumuladas são processadas uma por vez, sem sobrepor as telas de escolha.

## Desempenho
A quantidade de inimigos simultâneos aumenta gradualmente e tem limite de 70 para evitar acúmulo excessivo em partidas longas.

## Executar localmente
Abra index.html em um servidor estático local ou publique com GitHub Pages. O Phaser 3 é carregado pela CDN.

## Validação automática
O GitHub Actions verifica a sintaxe JavaScript e confere referências essenciais entre HTML e JavaScript a cada push na branch main e em pull requests.

## Publicação
O workflow em .github/workflows/pages.yml publica automaticamente o conteúdo do repositório no GitHub Pages após cada push na branch main.

URL: https://lesxs.github.io/BRAZIL-MEME-SURVIVOR/

## Estado atual
Protótipo jogável com movimentação, inimigos, combate automático, vida, experiência, evolução, melhorias e reinício de partida.
