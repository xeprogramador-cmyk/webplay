/* Capa automática do Reels: quando não há imagem, desenha o nome do Reels com um fundo e uma letra que mudam com o gênero. */
function capaReelsSVG(titulo,generos){
  function esc(t){return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
  function norm(t){var s=String(t||'');try{s=s.normalize('NFD').replace(/[\u0300-\u036f]/g,'');}catch(e){}return s.toLowerCase().trim();}
  // [cor 1, cor 2, cor do texto, cor de destaque, estilo: 's' = serifa itálica, 'b' = maiúsculas fortes]
  var P={
    'romance':['#ff6a95','#5e1347','#ffffff','#ffd1e1','s'],
    'drama':['#4a5a94','#10132b','#ffffff','#c7d0ff','s'],
    'comedia':['#ffd23f','#ff7a18','#2a1600','#ffffff','b'],
    'acao':['#ff5a1f','#1b0a05','#ffffff','#ffd23f','b'],
    'suspense':['#2f3b45','#07090d','#ffffff','#4fd1c5','b'],
    'terror':['#2a0000','#000000','#ff3b30','#7a0000','b'],
    'fantasia':['#8b3dff','#150a3a','#ffffff','#f0c6ff','s'],
    'ficcao cientifica':['#00b4ff','#070b36','#ffffff','#7df9ff','b'],
    'aventura':['#16a085','#0a3326','#ffffff','#ffd27a','b'],
    'familia':['#ffd37a','#ff8f70','#2a1600','#ffffff','s'],
    'vinganca':['#a30f00','#1a1411','#ffffff','#ffb199','b'],
    'misterio':['#4b2c7a','#12051f','#ffffff','#7df9ff','s']
  };
  var gs=(generos||[]).filter(Boolean),g0=norm(gs[0]);
  var c=P[g0]||['#f0b429','#3a2400','#1a1300','#ffffff','s'];
  var caps=c[4]==='b';
  var nome=String(titulo||'Reels').trim().replace(/\s+/g,' ');
  if(caps)nome=nome.toUpperCase();
  var pal=nome.split(' '),linhas=[],cur='';
  pal.forEach(function(w){if(!cur)cur=w;else if((cur+' '+w).length<=12)cur+=' '+w;else{linhas.push(cur);cur=w;}});
  if(cur)linhas.push(cur);
  if(linhas.length>5){linhas=linhas.slice(0,5);linhas[4]=linhas[4].slice(0,10)+'…';}
  var maxLen=Math.max.apply(null,linhas.map(function(l){return l.length;}));
  var fs=Math.max(18,Math.min(46,Math.floor(240/(maxLen*0.68))));
  var lh=fs*1.2,y0=190-(lh*linhas.length)/2+fs*0.85;
  var fam=caps?"'Arial Black','Helvetica Neue',Arial,sans-serif":"Georgia,'Times New Roman',serif";
  var est=caps?'font-weight="900"':'font-weight="700" font-style="italic"';
  var txt=linhas.map(function(l,i){
    return '<text x="150" y="'+(y0+i*lh).toFixed(1)+'" text-anchor="middle" font-family="'+fam+'" '+est+' font-size="'+fs+'" fill="'+c[2]+'" filter="url(#sh)">'+esc(l)+'</text>';
  }).join('');
  var rot=gs.slice(0,2).map(function(x){return String(x).toUpperCase();}).join('  ·  ');
  var svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" width="300" height="400">'
   +'<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="'+c[0]+'"/><stop offset="1" stop-color="'+c[1]+'"/></linearGradient>'
   +'<radialGradient id="r" cx=".5" cy=".38" r=".7"><stop offset="0" stop-color="'+c[3]+'" stop-opacity=".35"/><stop offset="1" stop-color="'+c[3]+'" stop-opacity="0"/></radialGradient>'
   +'<filter id="sh" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity=".4"/></filter></defs>'
   +'<rect width="300" height="400" fill="url(#g)"/><rect width="300" height="400" fill="url(#r)"/>'
   +'<circle cx="265" cy="45" r="85" fill="'+c[3]+'" opacity=".12"/><circle cx="25" cy="375" r="105" fill="'+c[3]+'" opacity=".10"/>'
   +'<rect x="14" y="14" width="272" height="372" rx="14" fill="none" stroke="'+c[3]+'" stroke-opacity=".45" stroke-width="1.5"/>'
   +txt
   +'<rect x="125" y="338" width="50" height="2" rx="1" fill="'+c[3]+'" opacity=".8"/>'
   +(rot?'<text x="150" y="362" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="700" font-size="11" letter-spacing="3" fill="'+c[2]+'" opacity=".85">'+esc(rot)+'</text>':'')
   +'</svg>';
  return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
}

if(typeof window!=='undefined')window.capaReelsSVG=capaReelsSVG;
