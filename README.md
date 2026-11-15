# BRASIL: MEME SURVIVORS

**Versão 0.3.0 — Expansão Brasileira**

Roguelite de sobrevivência em arena com identidade brasileira: memes, personagens e situações reconhecíveis do cotidiano do Brasil. Desenvolvido em Phaser 3.

## Como jogar
- **WASD / setas:** movimentar.
- **Celular:** use os controles direcionais na arena.
- **Ataque:** automático contra o inimigo mais próximo.
- **Objetivo:** sobreviver, derrotar inimigos, coletar XP e escolher melhorias ao subir de nível.

## Elenco brasileiro
- **Saci-pererê:** criatura folclórica veloz, aparece após 40 segundos.
- **Boi-bumbá:** inimigo pesado inspirado nas festas populares do Norte, aparece após 50 segundos.
- **Pombo ladrão:** inimigo comum.
- **Cachorro caramelo:** resistente e equilibrado.
- **Capivara braba:** resistente e mais lenta.
- **Pernilongo de madrugada:** muito rápido e irritante.
- **Motoboy do grau:** veloz e perigoso.
- **Tio do churrasco:** resistente e pesado.
- **Vendedor do centro:** inimigo especial, forte e resistente.
- **Fiscal do Pix:** chefe que aparece a cada 60 segundos, possui barra de vida própria e oferece recompensa especial. Apenas um Fiscal do Pix pode ficar ativo por vez.
- **Baú do churrasco:** surge quando um chefe é derrotado. Aproxime-se para escolher uma entre três recompensas de raridade comum, rara ou épica. O baú desaparece após 30 segundos se não for coletado.
- **Evolução de arma:** a arma começa disparando um espeto; a Pipoca de Cinema libera três rojões por disparo; o Canhão de Festa Junina libera cinco disparos com efeito visual de fogos. As evoluções podem ser encontradas nos baús e são cumulativas até o nível máximo. O baú não oferece evoluções de arma quando ela já está no nível máximo; o Pix do Milhão concede oito moedas imediatamente.

Todos os inimigos e chefes devem seguir referências brasileiras, memes, cultura popular ou situações do cotidiano. Evitar personagens genéricos sem identidade temática.

## Progressão
Colete esferas verdes para ganhar XP. Escolha melhorias de dano, velocidade, ataque, projéteis, moedas ou vida. Evoluções acumuladas são processadas uma por vez.

## Habilidade ativa
Use **Espaço** ou o botão **GRITO** para soltar o Grito da Torcida: uma onda de impacto atinge inimigos em um raio de 170 pixels, causa dano e afasta adversários comuns. A habilidade tem recarga de 12 segundos e também funciona no celular pelo botão na arena.

## Movimento e impacto
O sobrevivente tem animação procedural de respiração e deslocamento. Inimigos possuem oscilações de movimento específicas por tipo, com o Pernilongo mais agitado e o Fiscal do Pix com pulsação própria. Acertos exibem clarão, eliminações geram um efeito de impacto e a câmera reage à entrada, ao dano e à derrota do chefe.

## Desempenho
A quantidade de inimigos comuns aumenta gradualmente e tem limite de 70 simultâneos. O processamento dos inimigos evita cópias desnecessárias da lista a cada quadro.

## Áudio
A trilha sonora original será integrada posteriormente, quando o arquivo de música criado para o jogo estiver disponível.

## Validação automática
O GitHub Actions verifica a sintaxe JavaScript e confere referências essenciais entre HTML e JavaScript, além de validar as mecânicas de desempenho, chefes, baús com raridades e personagens brasileiros.

## Publicação
O workflow em `.github/workflows/pages.yml` publica o projeto no GitHub Pages após push na branch `main`.

Jogue em: https://lesxs.github.io/BRAZIL-MEME-SURVIVOR/

## Personagens jogáveis — versão 0.3.0
- **Sobrevivente:** personagem equilibrado, com Espeto de Aço.
- **Motoboy do Grau:** mais veloz, com Chinelo como arma inicial.
- **Capivara Braba:** mais vida e dano, com Estilingue como arma inicial.
- As armas iniciais evoluem para rojões no nível 2 e fogos no nível 3.

## Progressão permanente
Ao terminar uma partida, fichas são calculadas com base nas moedas da rodada, no tempo sobrevivido e nas eliminações. O saldo e os níveis de melhoria são salvos localmente no navegador. A loja permite melhorar vida máxima, dano e velocidade, cada atributo até cinco níveis.

## Rotação de chefes
O Fiscal do Pix e o Boitatá alternam nas aparições de chefe. Cada um possui sprite, vida e velocidade próprios, e ambos deixam o Baú do Churrasco ao serem derrotados.

A progressão permanente usa o armazenamento local do navegador; ela fica vinculada ao navegador/dispositivo utilizado e não sincroniza entre aparelhos.
