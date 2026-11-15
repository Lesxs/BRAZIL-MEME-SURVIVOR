# BRASIL: MEME SURVIVORS

Roguelite de sobrevivência em arena com identidade brasileira: memes, personagens e situações reconhecíveis do cotidiano do Brasil. Desenvolvido em Phaser 3.

## Como jogar
- **WASD / setas:** movimentar.
- **Celular:** use os controles direcionais na arena.
- **Ataque:** automático contra o inimigo mais próximo.
- **Objetivo:** sobreviver, derrotar inimigos, coletar XP e escolher melhorias ao subir de nível.

## Elenco brasileiro
- **Pombo ladrão:** inimigo comum.
- **Cachorro caramelo:** resistente e equilibrado.
- **Capivara braba:** resistente e mais lenta.
- **Pernilongo de madrugada:** muito rápido e irritante.
- **Motoboy do grau:** veloz e perigoso.
- **Tio do churrasco:** resistente e pesado.
- **Vendedor do centro:** inimigo especial, forte e resistente.
- **Fiscal do Pix:** chefe que aparece a cada 60 segundos, possui barra de vida própria e oferece recompensa especial. Apenas um Fiscal do Pix pode ficar ativo por vez.
- **Baú do churrasco:** surge quando um chefe é derrotado. Aproxime-se para escolher uma entre três recompensas de raridade comum, rara ou épica. O baú desaparece após 30 segundos se não for coletado.

Todos os inimigos e chefes devem seguir referências brasileiras, memes, cultura popular ou situações do cotidiano. Evitar personagens genéricos sem identidade temática.

## Progressão
Colete esferas verdes para ganhar XP. Escolha melhorias de dano, velocidade, ataque, projéteis, moedas ou vida. Evoluções acumuladas são processadas uma por vez.

## Desempenho
A quantidade de inimigos comuns aumenta gradualmente e tem limite de 70 simultâneos. O processamento dos inimigos evita cópias desnecessárias da lista a cada quadro.

## Áudio
A trilha sonora original será integrada posteriormente, quando o arquivo de música criado para o jogo estiver disponível.

## Validação automática
O GitHub Actions verifica a sintaxe JavaScript e confere referências essenciais entre HTML e JavaScript, além de validar as mecânicas de desempenho, chefes, baús com raridades e personagens brasileiros.

## Publicação
O workflow em `.github/workflows/pages.yml` publica o projeto no GitHub Pages após push na branch `main`.

Jogue em: https://lesxs.github.io/BRAZIL-MEME-SURVIVOR/
