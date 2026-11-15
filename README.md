# BRASIL: MEME SURVIVORS

Roguelite de sobrevivência em arena com humor e referências à cultura brasileira, desenvolvido em Phaser 3.

## Como jogar
- **WASD / setas:** movimentar.
- **Celular:** use os controles direcionais na arena.
- **Ataque:** automático contra o inimigo mais próximo.
- **Objetivo:** sobreviver, derrotar inimigos, coletar XP e escolher melhorias ao subir de nível.

## Inimigos
- **Pombo:** inimigo básico.
- **Capivara:** resistente, lenta e concede mais experiência.
- **Vendedor:** forte, causa mais dano e concede mais experiência.
- **Chefe:** surge a cada 60 segundos, tem muita vida e oferece recompensa especial de XP e moedas.

## Progressão
Colete esferas verdes para ganhar XP. Escolha melhorias de dano, velocidade, ataque, projéteis, moedas ou vida. Evoluções acumuladas são processadas uma por vez.

## Desempenho
A quantidade de inimigos comuns aumenta gradualmente e tem limite de 70 simultâneos. O processamento dos inimigos evita cópias desnecessárias da lista a cada quadro.

## Validação automática
O GitHub Actions verifica a sintaxe JavaScript e confere referências essenciais entre HTML e JavaScript, além de validar a presença das mecânicas de desempenho e do chefe.

## Publicação
O workflow em `.github/workflows/pages.yml` publica o projeto no GitHub Pages após push na branch `main`.

Jogue em: https://lesxs.github.io/BRAZIL-MEME-SURVIVOR/
