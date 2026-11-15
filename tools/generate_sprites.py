#!/usr/bin/env python3
"""Gera spritesheets pixel art para BRASIL: MEME SURVIVORS. Requer Pillow."""
from PIL import Image,ImageDraw
from pathlib import Path
import json
ROOT=Path(__file__).resolve().parents[1]
C=ROOT/"assets/sprites/characters";B=ROOT/"assets/sprites/bosses";E=ROOT/"assets/sprites/enemies"
C.mkdir(parents=True,exist_ok=True);B.mkdir(parents=True,exist_ok=True);E.mkdir(parents=True,exist_ok=True)
def frame(kind,act,n,boss=False):
 size=40 if boss else 24; im=Image.new("RGBA",(size,size),(0,0,0,0));d=ImageDraw.Draw(im);bob=(0,-1,0,1)[n]
 if boss:
  d.ellipse((5,32,35,38),fill=(8,10,12,100))
  if kind=="fiscal-do-pix":
   d.polygon([(9,14+bob),(14,8+bob),(27,8+bob),(32,15+bob),(29,33),(11,33)],fill="#67283b");d.polygon([(13,17+bob),(20,13+bob),(27,17+bob),(29,34),(11,34)],fill="#e6ddc8");d.polygon([(20,17+bob),(16,31),(24,31)],fill="#a52d45");d.ellipse((12,3+bob,28,20+bob),fill="#d8a071");d.rectangle((10,3+bob,30,8+bob),fill="#26232b");d.rectangle((8,7+bob,32,9+bob),fill="#26232b");d.rectangle((13,11+bob,18,13+bob),fill="#17191e");d.rectangle((22,11+bob,27,13+bob),fill="#17191e");d.point((16,12+bob),fill="#ffcc55");d.point((24,12+bob),fill="#ffcc55")
   if act=="attack":d.rectangle((30,17,37,25),fill="#54d7d0")
  elif kind=="boitata":
   d.arc((4,8+bob,36,35+bob),185,350,fill="#612b24",width=9);d.arc((5,7+bob,35,33+bob),185,350,fill="#e6532d",width=6);d.arc((7,8+bob,33,31+bob),185,350,fill="#ffc34e",width=3);d.ellipse((3,7+bob,15,19+bob),fill="#f4a33f");d.ellipse((5,9+bob,13,17+bob),fill="#ffdf8a");d.ellipse((7,11+bob,9,13+bob),fill="#1c1715")
   if act=="attack":d.polygon([(27,6),(31,0),(32,8),(38,2),(35,13)],fill="#fff0a0")
  else:
   d.ellipse((7,12+bob,33,34+bob),fill="#71352a");d.ellipse((9,10+bob,31,31+bob),fill="#a34b31");d.polygon([(8,15+bob),(3,2),(15,12),(20,0),(24,12),(35,3),(30,19+bob)],fill="#e85b2f");d.polygon([(10,21+bob),(1,13),(9,28),(4,34),(15,30)],fill="#ff9c39");d.polygon([(26,19+bob),(38,8),(32,28),(37,34),(24,31)],fill="#ffca50");d.ellipse((24,16+bob,31,22+bob),fill="#f4d47c");d.point((28,18+bob),fill="#261b18")
   if act=="attack":d.polygon([(16,5),(20,0),(22,8),(28,2),(25,12)],fill="#fff0a0")
  return im.resize((80,80),Image.Resampling.NEAREST)
 leg=(n%4)-1 if act=="walk" else 0
 P={"sobrevivente":("#c98d63","#167348","#f3d24d","#252b2a"),"motoboy":("#d7a27a","#273e52","#ffca43","#263039"),"capivara":("#9b7048","#684a32","#d2ad7d","#171615"),"saci":("#a96f4c","#302923","#d63832","#282b27"),"curupira":("#b77c53","#397744","#e65332","#293e2e"),"boto":("#d77f94","#c7657d","#f1c4cc","#864c5a")}
 skin,main,accent,dark=P[kind];d.ellipse((5,18,19,22),fill=(8,12,13,95))
 if kind=="capivara":
  d.ellipse((4,7+bob,20,19+bob),fill=dark);d.ellipse((5,6+bob,19,17+bob),fill=main);d.ellipse((8,11+bob,18,17+bob),fill=accent);d.ellipse((5,4+bob,9,9+bob),fill=main);d.ellipse((15,4+bob,19,9+bob),fill=main);d.ellipse((8,7+bob,10,9+bob),fill="#171615");d.ellipse((15,7+bob,17,9+bob),fill="#171615")
 elif kind=="boto":
  d.ellipse((4,8+bob,20,18+bob),fill=dark);d.ellipse((5,7+bob,19,16+bob),fill=skin);d.ellipse((6,12+bob,15,17+bob),fill=accent);d.polygon([(5,10+bob),(1,5+bob),(8,8+bob)],fill=main);d.polygon([(16,10+bob),(22,6+bob),(19,13+bob)],fill=main);d.ellipse((14,6+bob,21,12+bob),fill=skin);d.ellipse((17,7+bob,18,8+bob),fill="#2a2025")
 else:
  d.rectangle((7,10+bob,17,18+bob),fill=dark);d.rectangle((8,17+bob,11+leg,20+bob),fill="#e9e9d9" if kind=="sobrevivente" else dark);d.rectangle((13-leg,17+bob,16,20+bob),fill="#e9e9d9" if kind=="sobrevivente" else dark);d.polygon([(6,9+bob),(9,7+bob),(16,7+bob),(19,10+bob),(17,17+bob),(7,17+bob)],fill=main)
  if kind=="sobrevivente":d.rectangle((11,8+bob,13,15+bob),fill=accent)
  if kind=="motoboy":d.rectangle((8,10+bob,17,12+bob),fill=accent);d.rectangle((17,10+bob,20,16+bob),fill="#d94e37")
  d.ellipse((8,3+bob,16,11+bob),fill=skin)
  if kind=="sobrevivente":d.rectangle((7,1+bob,17,4+bob),fill=dark);d.rectangle((6,4+bob,18,5+bob),fill=dark)
  if kind=="motoboy":d.pieslice((6,0+bob,18,11+bob),180,360,fill=accent);d.rectangle((7,5+bob,17,7+bob),fill="#263b4b")
  if kind=="saci":d.polygon([(7,5+bob),(8,1+bob),(17,1+bob),(18,5+bob)],fill=accent);d.rectangle((7,5+bob,18,6+bob),fill="#a92327")
  if kind=="curupira":d.polygon([(6,7+bob),(5,1+bob),(10,4+bob),(12,0+bob),(15,4+bob),(19,1+bob),(17,8+bob)],fill=accent);d.rectangle((10,12+bob,15,13+bob),fill="#e9c66d")
  if kind in ("saci","curupira"):d.ellipse((10,7+bob,11,8+bob),fill="#171615");d.ellipse((14,7+bob,15,8+bob),fill="#171615")
 if act=="attack":d.line((15,11+bob,21,7+bob),fill="#ead8b6",width=2);d.point((21,6+bob),fill="#fff0b5")
 else:d.rectangle((5,11+bob,7,14+bob),fill=skin if kind not in ("capivara","boto") else main)
 return im.resize((48,48),Image.Resampling.NEAREST)
def build(kind,boss=False):
 size=80 if boss else 48;out=Image.new("RGBA",(size*4,size*3),(0,0,0,0))
 for row,act in enumerate(("idle","walk","attack")):
  for n in range(4):out.alpha_composite(frame(kind,act,n,boss),(n*size,row*size))
 return out

ENEMY_PALETTES={"pigeon":("#8998a5","#34414b","#2b9b8c"),"caramelo":("#c88745","#8f522d","#e8bb83"),"capybara":("#9b7047","#684a32","#d2ad7d"),"mosquito":("#91bfc4","#273744","#d9e6dc"),"vendor":("#e0a06c","#365b8b","#f08b45"),"motoboy":("#e4b184","#263747","#ffd04f"),"churrasco":("#d39a6b","#9a3d2e","#e9e1d0"),"saci":("#b8784b","#28221f","#c93632"),"boi_bumba":("#e3bd54","#315e9b","#d64c45"),"ze_gotinha":("#72c9ed","#f5f5e9","#2f8c62"),"et_varginha":("#789b82","#252d31","#141c20")}
def enemy_frame(kind,n,act):
 im=Image.new("RGBA",(40,40),(0,0,0,0));d=ImageDraw.Draw(im);skin,dark,accent=ENEMY_PALETTES[kind]
 bob=(0,-1,0,1)[n] if act!="attack" else (0,-1,1,0)[n]
 # Sombra e base do corpo mantêm o ponto de apoio consistente entre quadros.
 d.ellipse((7,34,33,38),fill=(8,10,12,90))
 if kind=="pigeon":
  d.ellipse((5,15+bob,34,33+bob),fill=dark);d.ellipse((7,13+bob,31,30+bob),fill=skin);d.ellipse((17,12+bob,28,24+bob),fill=accent);d.ellipse((23,5+bob,34,17+bob),fill=skin);d.polygon([(32,9+bob),(39,12+bob),(32,15+bob)],fill="#f0c34f")
  if act=="walk":d.polygon([(11,27+bob),(16,27+bob),(13+(n%2)*3,35),(10+(n%2)*3,35)],fill=dark);d.line((12,19,5+(n%2)*3,14),fill=accent,width=2)
 elif kind=="caramelo":
  d.ellipse((6,12+bob,34,34+bob),fill=dark);d.ellipse((8,10+bob,32,32+bob),fill=skin);d.ellipse((5,6+bob,14,23+bob),fill=dark);d.ellipse((26,6+bob,35,23+bob),fill=dark);d.ellipse((13,20+bob,27,29+bob),fill=accent);d.ellipse((12,17+bob,15,20+bob),fill="#201b18");d.ellipse((25,17+bob,28,20+bob),fill="#201b18")
 elif kind=="capybara":
  d.ellipse((4,11+bob,36,33+bob),fill=dark);d.ellipse((6,9+bob,34,31+bob),fill=skin);d.ellipse((10,19+bob,30,29+bob),fill=accent);d.ellipse((8,6+bob,15,14+bob),fill=skin);d.ellipse((26,6+bob,33,14+bob),fill=skin);d.ellipse((11,15+bob,13,17+bob),fill="#211a15")
 elif kind=="mosquito":
  wing=0 if act=="idle" else (n%2)*2
  d.line((18,18,3,7+wing),fill=accent,width=2);d.line((22,18,37,7-wing),fill=accent,width=2);d.ellipse((2,5+wing,19,15+wing),fill=(145,205,210,140));d.ellipse((21,5-wing,38,15-wing),fill=(145,205,210,140));d.ellipse((15,12+bob,25,31+bob),fill=dark);d.ellipse((16,7+bob,24,17+bob),fill=skin);d.line((20,16,35,2),fill="#e3c6a1",width=2)
 elif kind=="vendor":
  d.rounded_rectangle((7,12+bob,33,36+bob),5,fill=accent);d.rectangle((10,23+bob,30,32+bob),fill="#f6d16b");d.ellipse((11,5+bob,29,23+bob),fill=skin);d.rectangle((7,5+bob,32,11+bob),fill=dark);d.rectangle((5,10+bob,35,13+bob),fill=dark);d.rectangle((15,17+bob,17,19+bob),fill="#241d1a");d.rectangle((24,17+bob,26,19+bob),fill="#241d1a")
 elif kind=="motoboy":
  d.rounded_rectangle((7,17+bob,33,36+bob),6,fill=dark);d.ellipse((11,7+bob,29,25+bob),fill=skin);d.pieslice((7,2+bob,33,23+bob),180,360,fill=accent);d.rectangle((9,14+bob,31,18+bob),fill="#263747");d.rectangle((27,21+bob,36,34+bob),fill="#263747");d.rectangle((14,18+bob,16,20+bob),fill="#201b18")
 elif kind=="churrasco":
  d.rounded_rectangle((6,16+bob,34,37+bob),6,fill=dark);d.ellipse((10,5+bob,30,24+bob),fill=skin);d.rectangle((7,5+bob,33,12+bob),fill=accent);d.rectangle((9,23+bob,31,34+bob),fill="#b94f32");d.line((31,21,38,7),fill="#ddd3bd",width=2)
 elif kind=="saci":
  d.rounded_rectangle((8,14+bob,32,35+bob),7,fill=dark);d.ellipse((11,6+bob,29,24+bob),fill=skin);d.polygon([(8,11+bob),(10,1+bob),(30,1+bob),(33,11+bob)],fill=accent);d.rectangle((8,10+bob,33,14+bob),fill="#a92327");d.rectangle((18,27+bob,22,35+bob),fill="#d9b48a")
 elif kind=="boi_bumba":
  d.ellipse((5,13+bob,35,35+bob),fill=dark);d.ellipse((7,11+bob,33,32+bob),fill=skin);d.polygon([(9,14+bob),(2,1),(15,9+bob)],fill=accent);d.polygon([(26,9+bob),(38,1),(31,16+bob)],fill=accent);d.rectangle((8,20+bob,32,26+bob),fill="#d64c45");d.ellipse((14,15+bob,17,18+bob),fill="#211b18");d.ellipse((24,15+bob,27,18+bob),fill="#211b18")
 elif kind=="ze_gotinha":
  d.ellipse((8,18+bob,32,37+bob),fill=dark);d.rounded_rectangle((9,19+bob,31,35+bob),4,fill=accent);d.ellipse((9,6+bob,31,27+bob),fill=skin);d.polygon([(20,0+bob),(8,17+bob),(32,17+bob)],fill=skin);d.rectangle((17,22+bob,23,29+bob),fill="#2f8c62")
 else:
  d.ellipse((6,13+bob,34,37+bob),fill=dark);d.ellipse((7,5+bob,33,30+bob),fill=skin);d.ellipse((10,10+bob,18,24+bob),fill="#141c20");d.ellipse((22,10+bob,30,24+bob),fill="#141c20");d.point((12,12+bob),fill="#c7e0c5");d.point((24,12+bob),fill="#c7e0c5")
 # Pernas, braços e poses variam por quadro para dar leitura de movimento.
 if kind not in ("mosquito","pigeon","capybara"):
  if act=="walk":
   offset=(n%2)*3
   d.line((13,30+bob,10+offset,37),fill=dark,width=3);d.line((27,30+bob,30-offset,37),fill=dark,width=3)
  else:
   d.line((13,30+bob,12,37),fill=dark,width=3);d.line((27,30+bob,28,37),fill=dark,width=3)
 if act=="attack":
  d.line((28,23+bob,36,17+bob),fill=accent,width=3);d.point((38,15+bob),fill="#fff0b5")
  d.line((31,17+bob,37,10+bob),fill="#ffe08a",width=1)
 elif act=="walk":
  d.line((28,22+bob,34+(n%2)*2,25),fill=accent,width=2)
 return im
def build_enemy(kind):
 out=Image.new("RGBA",(160,120),(0,0,0,0))
 for row,act in enumerate(("idle","walk","attack")):
  for n in range(4):out.alpha_composite(enemy_frame(kind,n,act),(n*40,row*40))
 return out

meta={"frameWidth":48,"frameHeight":48,"columns":4,"animations":{"idle":{"row":0,"frames":4,"frameRate":5,"repeat":-1},"walk":{"row":1,"frames":4,"frameRate":9,"repeat":-1},"attack":{"row":2,"frames":4,"frameRate":12,"repeat":0}}}
for name in ("sobrevivente","motoboy","capivara","saci","curupira","boto"):
 build(name).save(C/(name+".png"),optimize=True);(C/(name+".json")).write_text(json.dumps(meta,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
for name in ("fiscal-do-pix","boitata","mula-sem-cabeca"):
 build(name,True).save(B/(name+".png"),optimize=True);(B/(name+".json")).write_text(json.dumps({**meta,"frameWidth":80,"frameHeight":80},ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
enemy_meta={"frameWidth":40,"frameHeight":40,"columns":4,"animations":{"idle":{"row":0,"frames":4,"frameRate":5,"repeat":-1},"walk":{"row":1,"frames":4,"frameRate":9,"repeat":-1},"attack":{"row":2,"frames":4,"frameRate":12,"repeat":0}}}
for name in ENEMY_PALETTES:
 build_enemy(name).save(E/(name+".png"),optimize=True)
 (E/(name+".json")).write_text(json.dumps(enemy_meta,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
print("Spritesheets geradas: 6 personagens, 3 chefes e 11 inimigos.")
