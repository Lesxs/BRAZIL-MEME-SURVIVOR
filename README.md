# BRASIL: MEME SURVIVORS

**Versão 0.9.1 — seleção de personagens reforçada**

Roguelite de sobrevivência em arena com identidade brasileira: memes, personagens e situações reconhecíveis do cotidiano do Brasil. Desenvolvido em Phaser 3.

## Como jogar
- **WASD / setas:** movimentar.
- **Celular:** use os controles direcionais na arena.
- **Ataque:** automático contra o inimigo mais próximo.
- **Objetivo:** sobreviver, derrotar inimigos, coletar XP e escolher melhorias ao subir de nível.

## Elenco brasileiro
- **Saci-pererê:** criatura folclórica veloz, aparece após 40 segundos.
- **Boi-bumbá:** inimigo pesado inspirado nas festas populares do Norte, aparece após 50 segundos.
- **Zé Gotinha:** mascote brasileiro da vacinação, surge como inimigo de suporte.
- **ET de Varginha:** criatura veloz inspirada no caso ufológico brasileiro.
- **Pombo ladrão:** inimigo comum.
- **Cachorro caramelo:** resistente e equilibrado.
- **Capivara braba:** resistente e mais lenta.
- **Pernilongo de madrugada:** muito rápido e irritante.
- **Motoboy do grau:** veloz e perigoso.
- **Tio do churrasco:** resistente e pesado.
- **Vendedor do centro:** inimigo especial, forte e resistente.
- **Fiscal do Pix, Boitatá e Mula-sem-cabeça:** chefes brasileiros que se alternam a cada aparição, com barra de vida própria e recompensa especial. Apenas um chefe pode ficar ativo por vez.
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

## Personagens jogáveis — versão 0.8.0
- **Sobrevivente:** personagem equilibrado, com Espeto de Aço.
- **Motoboy do Grau:** mais veloz, com Chinelo como arma inicial.
- **Capivara Braba:** mais vida e dano, com Estilingue como arma inicial.
- **Saci-pererê:** pouca vida, velocidade muito alta e Redemoinho como arma inicial.
- **Curupira:** regenera 2 pontos de vida a cada 8 segundos.
- **Boto-cor-de-rosa:** recebe 20% mais experiência e usa a Onda como arma inicial.
- As armas iniciais evoluem para rojões no nível 2 e fogos no nível 3.

## Progressão permanente
Ao terminar uma partida, fichas são calculadas com base nas moedas da rodada, no tempo sobrevivido e nas eliminações. O saldo e os níveis de melhoria são salvos localmente no navegador. A loja permite melhorar vida máxima, dano e velocidade, cada atributo até cinco níveis.

## Rotação de chefes
O Fiscal do Pix, o Boitatá e a Mula-sem-cabeça alternam nas aparições de chefe. Cada um possui sprite, vida e velocidade próprios, e todos deixam o Baú do Churrasco ao serem derrotados.

A progressão permanente usa o armazenamento local do navegador; ela fica vinculada ao navegador/dispositivo utilizado e não sincroniza entre aparelhos.


## Novidades da versão 0.4.0
- Dois novos inimigos brasileiros: Zé Gotinha e ET de Varginha.
- Terceiro chefe na rotação: Mula-sem-cabeça.
- Inimigos eliminados por colisão agora concedem as recompensas normais de eliminação, moedas e experiência.


## Novidades da versão 0.5.0
- Quarto personagem jogável: Saci-pererê, com sprite próprio, 85 pontos de vida, velocidade 270, dano 0,88 e disparo mais rápido.
- Nova arma inicial: Redemoinho, projétil visual de vento e folhas exclusivo do Saci no primeiro estágio.
- Menu de personagens reorganizado em três colunas no desktop e duas no celular.
- A seleção do Saci é salva junto com a progressão local existente.


## Novidades da versão 0.6.0
- Cada personagem agora possui uma habilidade passiva própria, além de sua arma inicial.
- **Sobrevivente:** causa 8% mais dano.
- **Motoboy do Grau:** recebe uma moeda adicional por eliminação.
- **Capivara Braba:** recebe 20% menos dano.
- **Saci-pererê:** tem 15% de chance de esquivar completamente de um golpe.
- Os cartões de seleção mostram os efeitos passivos antes do início da partida.


## Novidades da versão 0.7.0
- Quinto personagem jogável: **Curupira**, inspirado no folclore brasileiro.
- Sprite procedural próprio com cabelos vermelhos, roupa verde e pés voltados para trás.
- Passiva exclusiva: recupera 2 pontos de vida a cada 8 segundos, sem ultrapassar a vida máxima.
- Seleção reorganizada em três colunas no desktop e duas no celular.

## Novidades da versão 0.8.0
- Sexto personagem jogável: **Boto-cor-de-rosa**, inspirado no folclore amazônico.
- Sprite pixel art procedural próprio e arma inicial exclusiva **Onda**.
- Passiva exclusiva: coleta 20% mais experiência em cada esfera.
- Correção do relógio de regeneração do Curupira e reinício da recarga do Grito da Torcida entre partidas.


## Versão 0.9.0 — seleção de personagens corrigida
- Seleção delegada e validada para os seis personagens.
- Personagem escolhido sincronizado antes de cada partida e reinício.
- Indicador visível do personagem ativo, estados acessíveis e suporte a toque.
- Salvamento protegido caso o navegador bloqueie o armazenamento local.
- JavaScript e CSS com versão na URL para evitar cache antigo.


## Versão 0.9.1
- Seleção dos seis personagens conectada diretamente a cada cartão.
- Suporte reforçado a mouse, toque e teclado.
- Arte de fundo sem captura de eventos e cartões com prioridade de interação.
- Escolha continua sendo salva quando o armazenamento local está disponível.


## Spritesheets e animações (0.9.2)

O projeto gera spritesheets pixel art de forma reproduzível com `tools/generate_sprites.py` (Python + Pillow). São geradas seis folhas de personagens e três de chefes, cada uma com animações idle, walk e attack. Os workflows de validação e GitHub Pages executam o gerador automaticamente antes de validar/publicar, portanto os PNGs são produzidos no build e não precisam ser enviados manualmente ao repositório.

Para gerar localmente: `python -m pip install pillow` e `python tools/generate_sprites.py`.


## Versão 0.9.3
- Spritesheets pixel art animadas para 11 inimigos brasileiros, geradas no build.
- Horda mais controlada: surgimento mais espaçado e limite de inimigos reduzido.
- Dano de contato reduzido e janela de invulnerabilidade ampliada.
- Chefes a cada 90 segundos, mais lentos e com dano e escala de vida menores.
- XP mais acessível, raridades raras/épicas mais frequentes e itens fortalecidos.
- Cartões de recompensa redesenhados com maior destaque visual.
