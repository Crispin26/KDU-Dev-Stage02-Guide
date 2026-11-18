/* =====================================================================
   app.js — THE MACHINERY.
   Builds the cumulative files, renders the code pane with the new lines
   highlighted, drives the live preview, the sidebar and the navigation.

   You should not need to edit this to run the workshop.
   ===================================================================== */

/* ---------- build cumulative files ---------- */
var scaffoldAt = -1;
for (var i = 0; i < STEPS.length; i++) if (STEPS[i].scaffold) { scaffoldAt = i; break; }

function buildFiles(upto){
  var head=[], body=[], css=[], js=[];
  for (var i=0;i<=upto;i++){
    var a = STEPS[i].adds || {};
    if (STEPS[i].removeHello) body = body.filter(function(l){ return l.txt.indexOf('Hello, World!')===-1; });
    (a.head||[]).forEach(function(l){ head.push({txt:l, s:i}); });
    (a.body||[]).forEach(function(l){ body.push({txt:l, s:i}); });
    (a.css ||[]).forEach(function(l){ css.push({txt:l, s:i}); });
    (a.js  ||[]).forEach(function(l){ js.push({txt:l, s:i}); });
  }
  var html = [];
  if (scaffoldAt >= 0 && upto >= scaffoldAt){
    var sc = scaffoldAt;
    html.push({txt:'<!DOCTYPE html>', s:sc});
    html.push({txt:'<html lang="en">', s:sc});
    html.push({txt:'', s:sc});
    html.push({txt:'<head>', s:sc});
    html.push({txt:'    <meta charset="UTF-8">', s:sc});
    html.push({txt:'    <meta name="viewport" content="width=device-width, initial-scale=1.0">', s:sc});
    html.push({txt:'    <title>My Portfolio</title>', s:sc});
    head.forEach(function(l){ html.push(l); });
    html.push({txt:'</head>', s:sc});
    html.push({txt:'', s:sc});
    html.push({txt:'<body>', s:sc});
    body.forEach(function(l){ html.push(l); });
    html.push({txt:'', s:sc});
    html.push({txt:'</body>', s:sc});
    html.push({txt:'</html>', s:sc});
  }
  return {'index.html':html, 'style.css':css, 'script.js':js};
}

/* ---------- state ---------- */
var cur = 0, curFile = 'index.html';

function esc(s){ return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function render(keepFile){
  var st = STEPS[cur];
  var files = buildFiles(cur);

  document.getElementById('tag').textContent =
    st.part === 1 ? 'Part 1 · The header — we build this together' : 'Part 2 · The full page — your turn';
  document.getElementById('title').textContent = (cur+1) + '. ' + st.title;
  document.getElementById('blurb').textContent = st.blurb;
  document.getElementById('why').innerHTML = st.why;
  document.getElementById('extra').innerHTML = st.extra || '';
  document.getElementById('changedtxt').innerHTML = st.changed;

  /* which files changed this step */
  var touched = {};
  ['index.html','style.css','script.js'].forEach(function(f){
    touched[f] = files[f].some(function(l){ return l.s === cur; });
  });
  if (!keepFile){
    /* on navigation, jump the tab to whatever this step changed */
    var changedFile = ['index.html','style.css','script.js'].filter(function(f){return touched[f];})[0];
    if (changedFile) curFile = changedFile;
    else if (!files[curFile].length){
      var firstFull = ['index.html','style.css','script.js'].filter(function(f){return files[f].length;})[0];
      if (firstFull) curFile = firstFull;
    }
  }

  /* tabs */
  var tabs = document.getElementById('tabs');
  tabs.innerHTML = '';
  ['index.html','style.css','script.js'].forEach(function(f){
    var b = document.createElement('div');
    b.className = 'tab' + (f===curFile?' on':'');
    b.innerHTML = f + (touched[f] ? '<span class="dot"></span>' : '');
    b.onclick = function(){ curFile = f; render(true); };
    tabs.appendChild(b);
  });

  /* code */
  var pre = document.getElementById('code');
  var lines = files[curFile];
  if (!lines.length){
    pre.innerHTML = '<div class="empty">// ' + curFile + ' is still empty — we get to it soon.</div>';
  } else {
    var h = '', firstNew = -1;
    lines.forEach(function(l, idx){
      var isNew = l.s === cur;
      if (isNew && firstNew < 0) firstNew = idx;
      h += '<div class="ln' + (isNew?' new':'') + '"><span class="num">' + (idx+1) +
           '</span><span class="txt">' + esc(l.txt) + '</span></div>';
    });
    pre.innerHTML = h;
    if (firstNew > 0) setTimeout(function(){
      pre.scrollTop = Math.max(0, firstNew * 21.9 - 110);
    }, 20);
  }

  /* preview */
  var htmlTxt = files['index.html'].map(function(l){return l.txt;}).join('\n')
      .replace('<link rel="stylesheet" href="style.css">','')
      .replace(/<script src="script.js" defer><\/script>/,'')
      .replace('images/profile.jpg', AVATAR);
  var cssTxt = files['style.css'].map(function(l){return l.txt;}).join('\n');
  var jsTxt  = files['script.js'].map(function(l){return l.txt;}).join('\n');
  var doc = htmlTxt
    ? htmlTxt.replace('</head>', '<style>' + cssTxt + '</style></head>')
             .replace('</body>', '<scr'+'ipt>' + jsTxt + '</scr'+'ipt></body>')
    : '<body style="font-family:Arial;color:#94A3B8;padding:40px">Nothing to show yet — index.html is empty.</body>';
  document.getElementById('pv').srcdoc = doc;
  fitPreview();

  /* sidebar */
  document.querySelectorAll('.slink').forEach(function(el, i){
    el.className = 'slink' + (i===cur?' on':'') + (i<cur?' done':'');
  });
  var active = document.querySelectorAll('.slink')[cur];
  if (active) active.scrollIntoView({block:'nearest'});

  /* progress */
  document.getElementById('ptext').textContent = 'Step ' + (cur+1) + ' of ' + STEPS.length;
  document.getElementById('pfill').style.width = ((cur+1)/STEPS.length*100) + '%';
  document.getElementById('prev').disabled = cur===0;
  document.getElementById('next').disabled = cur===STEPS.length-1;
  document.getElementById('next').textContent = cur===STEPS.length-1 ? 'Finished' : 'Next step →';

  try { location.hash = 'step-' + (cur+1); } catch(e){}
}

/* ---------- preview sizing ---------- */
var pvMode = 'desktop';
function fitPreview(){
  var stage = document.getElementById('pvstage'), fr = document.getElementById('pv');
  if (pvMode === 'phone'){ stage.classList.add('phone'); return; }
  stage.classList.remove('phone');
  var w = stage.clientWidth || 600, scale = w / 1200;
  fr.style.width = '1200px';
  fr.style.height = Math.round(520 / scale) + 'px';
  fr.style.transform = 'scale(' + scale + ')';
}
document.getElementById('vbDesk').onclick = function(){
  pvMode='desktop'; this.classList.add('on');
  document.getElementById('vbPhone').classList.remove('on'); fitPreview();
};
document.getElementById('vbPhone').onclick = function(){
  pvMode='phone'; this.classList.add('on');
  document.getElementById('vbDesk').classList.remove('on'); fitPreview();
};
window.addEventListener('resize', fitPreview);

/* sidebar build */
(function(){
  var side = document.getElementById('side'), lastPart = 0;
  STEPS.forEach(function(st, i){
    if (st.part !== lastPart){
      lastPart = st.part;
      var h = document.createElement('div');
      h.className = 'part-h';
      h.innerHTML = st.part===1
        ? 'Part 1 — The header<small>We build this together, live</small>'
        : 'Part 2 — The full page<small>Continue at home</small>';
      side.appendChild(h);
    }
    var a = document.createElement('div');
    a.className = 'slink';
    a.innerHTML = '<span class="n">' + (i+1) + '</span><span>' + st.title + '</span>';
    a.onclick = function(){ cur = i; render(); window.scrollTo({top:0,behavior:'smooth'}); };
    side.appendChild(a);
  });
})();

document.getElementById('next').onclick = function(){ if(cur<STEPS.length-1){cur++;render();window.scrollTo({top:0,behavior:'smooth'});} };
document.getElementById('prev').onclick = function(){ if(cur>0){cur--;render();window.scrollTo({top:0,behavior:'smooth'});} };
document.addEventListener('keydown', function(e){
  if (e.target.tagName === 'INPUT') return;
  if (e.key === 'ArrowRight') document.getElementById('next').click();
  if (e.key === 'ArrowLeft')  document.getElementById('prev').click();
});
document.getElementById('copy').onclick = function(){
  var files = buildFiles(cur);
  var txt = files[curFile].map(function(l){return l.txt;}).join('\n');
  var btn = this;
  if (navigator.clipboard) navigator.clipboard.writeText(txt).then(function(){
    btn.textContent = 'Copied ✓'; setTimeout(function(){ btn.textContent='Copy file'; }, 1400);
  });
};

/* open at the step in the URL, if any */
(function(){
  var m = (location.hash||'').match(/step-(\d+)/);
  if (m){ var n = parseInt(m[1],10)-1; if (n>=0 && n<STEPS.length) cur = n; }
  render();
})();