
var SB_URL = 'https://gchsfdnsmounxnetsawa.supabase.co';
var SB_KEY = 'sb_publishable_GoA-LrYNcHmPrMA5EW-8Ug_GoBGTMEA';
var session = load('haman_session', null);
var prefs = load('haman_prefs', {});
var qLocal = load('haman_qlocal', []);
var authMsg = '';
var quizHist = [];
var syncTimer = null;
function esc(t){ return String(t).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
function sbFetch(path, opts, tok){
  opts = opts || {};
  var h = Object.assign({'apikey': SB_KEY, 'Content-Type': 'application/json'}, opts.headers || {});
  if(tok) h['Authorization'] = 'Bearer ' + tok;
  return fetch(SB_URL + path, {method: opts.method || 'GET', headers: h, body: opts.body ? JSON.stringify(opts.body) : undefined});
}
function setSession(r){
  session = {access_token: r.access_token, refresh_token: r.refresh_token, expires_at: Math.floor(Date.now()/1000) + (r.expires_in || 3600), user: {id: r.user.id, email: r.user.email}};
  save('haman_session', session);
}
async function getToken(){
  if(!session) return null;
  if(session.expires_at - 60 > Date.now()/1000) return session.access_token;
  var r = await sbFetch('/auth/v1/token?grant_type=refresh_token', {method:'POST', body:{refresh_token: session.refresh_token}});
  if(!r.ok){ session = null; save('haman_session', null); return null; }
  setSession(await r.json());
  return session.access_token;
}
function mergeDone(target, src){ if(!src) return; Object.keys(src).forEach(function(k){ if(src[k]) target[k] = true; }); }
async function push(){
  var t = await getToken(); if(!t) return;
  await sbFetch('/rest/v1/progress', {method:'POST', headers:{'Prefer':'resolution=merge-duplicates'}, body:{user_id: session.user.id, data:{g: gDone, v: vDone, streak: streak, p: prefs}, updated_at: new Date().toISOString()}}, t);
}
function scheduleSync(){
  if(!session) return;
  clearTimeout(syncTimer);
  syncTimer = setTimeout(function(){ push().catch(function(){}); }, 1500);
}
async function loadQuiz(){
  var t = await getToken(); if(!t) return;
  var r = await sbFetch('/rest/v1/quiz_results?select=score,total,created_at&order=created_at.desc&limit=10', {}, t);
  if(r.ok) quizHist = await r.json();
}
async function pullMerge(){
  try{
    var t = await getToken(); if(!t){ render(); return; }
    var r = await sbFetch('/rest/v1/progress?select=data', {}, t);
    if(r.ok){
      var rows = await r.json();
      if(rows.length){ var d = rows[0].data || {}; mergeDone(gDone, d.g); mergeDone(vDone, d.v); streak = Math.max(streak, d.streak || 0); if(d.p){ prefs = Object.assign({}, d.p, prefs); } }
    }
    save('haman_done', gDone); save('haman_vocab_done', vDone); save('haman_streak', streak); save('haman_prefs', prefs);
    await push(); await loadQuiz(); try{ await srsSync(); }catch(e){}
  }catch(e){}
  render();
}
async function recordQuiz(score){
  qLocal.unshift({score: score, total: QUIZ.length, created_at: new Date().toISOString()}); qLocal = qLocal.slice(0, 20); save('haman_qlocal', qLocal); render();
  try{
    var t = await getToken(); if(!t) return;
    await sbFetch('/rest/v1/quiz_results', {method:'POST', body:{score: score, total: QUIZ.length}}, t);
    await loadQuiz(); render();
  }catch(e){}
}
async function doAuth(mode){
  var email = (document.getElementById('a_email')||{}).value || '';
  var pw = (document.getElementById('a_pw')||{}).value || '';
  var name = (document.getElementById('a_name')||{}).value || '';
  authMsg = '';
  if(!email || pw.length < 6){ authMsg = 'ایمیل و رمز عبور (حداقل ۶ کاراکتر) را وارد کنید.'; render(); return; }
  try{
    var r, j;
    if(mode === 'up'){
      r = await sbFetch('/auth/v1/signup?redirect_to=' + encodeURIComponent(location.origin + location.pathname), {method:'POST', body:{email: email, password: pw, data:{name: name}}});
    } else {
      r = await sbFetch('/auth/v1/token?grant_type=password', {method:'POST', body:{email: email, password: pw}});
    }
    j = await r.json();
    if(!r.ok){ authMsg = 'خطا: ' + (j.msg || j.error_description || j.message || 'ناموفق'); }
    else if(j.access_token){ setSession(j); authMsg = 'وارد شدید.'; render(); await pullMerge(); return; }
    else { authMsg = 'ثبت‌نام انجام شد. اگر ایمیل تأیید برایتان آمد، آن را تأیید کنید و سپس وارد شوید.'; }
  }catch(e){ authMsg = 'اتصال به سرور برقرار نشد. (در نسخهٔ آرتیفکت Claude اتصال بیرونی مسدود است؛ از نسخهٔ GitHub Pages استفاده کنید.)'; }
  render();
}
function stat(n, l){ return '<div class="stat"><div class="n">'+n+'</div><div class="l">'+l+'</div></div>'; }
function renderAccount(){
  var all = TENSES.concat(TOPICS);
  var gN = all.filter(function(t){ return gDone[t.id]; }).length;
  var vN = VOCAB.filter(function(v){ return vDone[v.w]; }).length;
  var pct = Math.round((gN + vN) / (all.length + VOCAB.length) * 100);
  var lvl = pct < 10 ? 'شروع مسیر' : (pct < 35 ? 'در حال پیشرفت' : (pct < 65 ? 'سطح متوسط به بالا' : 'نزدیک هدف'));
  var hist = (session && quizHist.length) ? quizHist : qLocal;
  var avg = hist.length ? Math.round(hist.reduce(function(a, q){ return a + q.score / q.total; }, 0) / hist.length * 100) : 0;
  var name = prefs.name || (session ? session.user.email.split('@')[0] : 'کاربر مهمان');
  var html = '<div class="daily-card" style="margin-top:6px;display:flex;gap:14px;align-items:center"><div class="avatar">'+esc(name.charAt(0).toUpperCase())+'</div><div><div class="daily-title" style="font-size:18px;margin:0">'+esc(name)+'</div><div class="daily-usage" style="margin:2px 0 0">'+lvl+' &middot; '+pct+'% مسیر</div></div></div>';
  html += '<div class="stats" style="margin-top:12px">'+stat(streak,'روز پیاپی')+stat(vN+' / '+VOCAB.length,'لغت علامت‌خورده')+stat(gN+' / '+all.length,'مبحث گرامر')+stat(hist.length ? avg+'%' : '-','میانگین آزمون ('+hist.length+' بار)')+'</div>';
  html += renderDash();
  html += '<div class="section-title">پیشرفت لغات به تفکیک دسته</div><div class="daily-card" style="margin-top:0;padding:6px 16px">';
  CATS.forEach(function(c){
    var tot = VOCAB.filter(function(v){ return v.cat === c[0]; });
    var dn = tot.filter(function(v){ return vDone[v.w]; }).length;
    html += '<div class="pcat"><span><b>'+c[1]+'</b><span style="direction:ltr">'+dn+' / '+tot.length+'</span></span><div class="bar"><div style="width:'+(tot.length ? Math.round(dn / tot.length * 100) : 0)+'%"></div></div></div>';
  });
  html += '</div>';
  html += '<div class="section-title">هدف و برنامهٔ من</div><div class="daily-card" style="margin-top:0">';
  html += '<div class="daily-eyebrow">نمرهٔ هدف</div><div class="chips" style="padding-top:2px">';
  ['7','7.5','8','8.5'].forEach(function(b){ html += '<button class="chip '+(prefs.band===b?'active':'')+'" data-band="'+b+'">'+b+'</button>'; });
  html += '</div>';
  html += '<div class="daily-eyebrow" style="margin-top:10px">تاریخ آزمون</div><input class="inp" type="date" data-date value="'+esc(prefs.exam || '')+'">';
  if(prefs.exam){
    var days = Math.ceil((new Date(prefs.exam) - new Date()) / 86400000);
    html += '<div class="amsg">'+(days > 0 ? days + ' روز تا آزمون باقی مانده است.' : (days === 0 ? 'آزمون امروز است. موفق باشی!' : 'تاریخ آزمون گذشته است.'))+'</div>';
  }
  html += '<div class="daily-eyebrow" style="margin-top:10px">نام نمایشی</div><input class="inp" id="p_name" placeholder="Name" value="'+esc(prefs.name || '')+'">';
  html += '<button class="daily-btn done" data-auth="name">ذخیرهٔ نام</button></div>';
  html += '<div class="section-title">نمرهٔ آزمون‌های اخیر</div><div class="daily-card" style="margin-top:0;padding:8px 16px">';
  if(!hist.length) html += '<div class="hrow">هنوز آزمونی کامل نکرده‌ای.</div>';
  hist.slice(0, 8).forEach(function(q){ html += '<div class="hrow"><span>'+q.score+' / '+q.total+'</span><span style="direction:ltr">'+esc(String(q.created_at).slice(0,10))+'</span></div>'; });
  html += '</div>';
  html += '<div class="section-title">حساب کاربری</div>';
  if(!session){
    html += '<div class="daily-card" style="margin-top:0"><p class="daily-usage">با ساخت حساب، پیشرفت و نمره‌هایت روی همهٔ دستگاه‌ها ذخیره می‌شود. بدون حساب، داده‌ها فقط روی همین دستگاه می‌مانند.</p>';
    html += '<input class="inp" id="a_name" placeholder="Name (optional)"><input class="inp" id="a_email" type="email" placeholder="Email"><input class="inp" id="a_pw" type="password" placeholder="Password (min 6)">';
    html += '<button class="daily-btn" data-auth="in">ورود</button><button class="daily-btn done" style="margin-top:8px" data-auth="up">ساخت حساب جدید</button><button class="daily-btn done" style="margin-top:8px" data-auth="google">ورود با Google (Gmail)</button>';
    if(authMsg) html += '<div class="amsg">'+esc(authMsg)+'</div>';
    html += '</div>';
  } else {
    html += '<div class="daily-card" style="margin-top:0"><div class="daily-eyebrow">وارد شده با</div><div class="daily-title" style="font-size:15px;direction:ltr;text-align:left">'+esc(session.user.email)+'</div>';
    html += '<p class="daily-usage">پیشرفتت به‌صورت خودکار ذخیره می‌شود.</p>';
    html += '<button class="daily-btn" data-auth="sync">همگام‌سازی همین حالا</button><button class="daily-btn done" style="margin-top:8px" data-auth="out">خروج</button><button class="daily-btn done" style="margin-top:8px;color:var(--danger)" data-auth="wipe">حذف داده‌های ذخیره‌شده روی سرور</button>';
    if(authMsg) html += '<div class="amsg">'+esc(authMsg)+'</div>';
    html += '</div>';
  }
  return html;
}
function emo(v){ return EMO[v.w] || CATEMO[v.cat] || '📘'; }
var quizAns = {};

function load(key, fallback){ try{ var v = localStorage.getItem(key); return v===null? fallback : JSON.parse(v); }catch(e){ return fallback; } }
function save(key, val){ try{ localStorage.setItem(key, JSON.stringify(val)); }catch(e){} if(key==='haman_done'||key==='haman_vocab_done'||key==='haman_streak'||key==='haman_prefs'){ scheduleSync(); } }

function dayIndex(len){
  var d = new Date(); var start = new Date(d.getFullYear(),0,0);
  var diff = d - start; return Math.floor(diff / 86400000) % len;
}
function todayStr(){ var d = new Date(); return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate(); }
function updateStreak(){
  var last = load('haman_last_visit', null); var streak = load('haman_streak', 0); var today = todayStr();
  if(last !== today){
    var y = new Date(Date.now()-86400000);
    var yStr = y.getFullYear()+'-'+(y.getMonth()+1)+'-'+y.getDate();
    streak = (last === yStr) ? streak + 1 : 1;
    save('haman_streak', streak); save('haman_last_visit', today);
  }
  return streak;
}
function exRow(ex){
  var cls = {pos:'pos',neg:'neg',q:'q'}[ex[0]];
  var mark = {pos:'\u2714',neg:'\u2718',q:'?'}[ex[0]];
  return '<div class="ex '+cls+'"><span class="mark">'+mark+'</span><span>'+ex[1]+'</span></div>';
}

var gDone = load('haman_done', {});
var vDone = load('haman_vocab_done', {});
var streak = updateStreak();
var todayTense = TENSES[dayIndex(TENSES.length)];
var todayWord = VOCAB[dayIndex(VOCAB.length)];
var view = 'grammar';
var activeCat = 'all';

function gProgress(){ var all = TENSES.concat(TOPICS); var n = all.filter(function(t){return gDone[t.id];}).length; return {n:n, total:all.length, pct:Math.round(n/all.length*100)}; }
function vProgress(){ var n = VOCAB.filter(function(v){return vDone[v.w];}).length; return {n:n, total:VOCAB.length, pct:Math.round(n/VOCAB.length*100)}; }

function renderGrammar(){
  var html = '';
  html += '<div class="daily-card">';
  html += '<div class="daily-eyebrow">زمان امروز</div>';
  html += '<h1 class="daily-title">'+todayTense.fa+' <span style="font-weight:400;color:var(--fg-mut);font-size:14px">'+todayTense.en+'</span></h1>';
  html += '<p class="daily-usage">'+todayTense.usage+'</p>';
  html += '<div class="ex-list">'+todayTense.ex.map(exRow).join('')+'</div>';
  html += '<button class="daily-btn '+(gDone[todayTense.id]?'done':'')+'" data-today-toggle>'+(gDone[todayTense.id]?'\u2714 امروز رو مرور کردی':'مرور کردم، علامت بزن')+'</button>';
  html += '</div>';
  GROUPS.forEach(function(g){
    var key=g[0], label=g[1];
    html += '<div class="section-title">'+label+'</div><div class="group">';
    TENSES.filter(function(t){return t.group===key;}).forEach(function(t){
      html += '<div class="card" data-card="'+t.id+'">';
      html += '<div class="card-head" data-toggle="'+t.id+'">';
      html += '<div class="title-wrap"><span class="dot '+(gDone[t.id]?'done':'pending')+'"></span><span class="t">'+t.fa+' &middot; '+t.en+'</span></div>';
      html += '<span class="chev">&#9662;</span></div>';
      html += '<div class="card-body"><div class="card-body-inner">';
      html += '<p class="usage">'+t.usage+'</p>';
      html += '<div class="ex-list">'+t.ex.map(exRow).join('')+'</div>';
      html += '<button class="mini-btn '+(gDone[t.id]?'done':'')+'" data-toggle-done="'+t.id+'">'+(gDone[t.id]?'\u2714 تسلط دارم':'علامت به‌عنوان یادگرفته‌شده')+'</button>';
      html += '</div></div></div>';
    });
    html += '</div>';
  });
  html += '<div class="section-title" style="margin-top:34px;font-size:15px;color:var(--accent-fg)">نقشهٔ ذهنی گرامر: ۶ دسته</div>';
  GR.forEach(function(g){
    html += '<div class="section-title">'+g[0]+'</div><div class="group">';
    g[1].forEach(function(id){
      var t = TOPICS.filter(function(x){return x.id===id;})[0]; if(!t) return;
      html += '<div class="card"><div class="card-head" data-toggle="'+t.id+'">';
      html += '<div class="title-wrap"><span class="dot '+(gDone[t.id]?'done':'pending')+'"></span><span class="t">'+t.fa+' &middot; '+t.en+'</span></div><span class="chev">&#9662;</span></div>';
      html += '<div class="card-body"><div class="card-body-inner">';
      html += '<div class="lbl">🧠 قاعدهٔ ذهنی</div><div class="hook">'+(HOOK[t.id]||'')+'</div>';
      html += '<div class="lbl">مفهوم</div><p class="usage" style="margin:0">'+t.usage+'</p>';
      html += '<div class="lbl">فرمول</div><div class="tform" style="margin:0">'+t.form+'</div>';
      html += '<div class="lbl">مثال‌ها</div><div class="ex-list">'+t.ex.map(function(e){return exRow(['pos',e]);}).join('')+'</div>';
      html += '<div class="warn">⚠ اشتباه رایج: '+t.mistake+'</div><div class="tipbox">💡 '+t.tip+'</div>';
      html += '<button class="mini-btn '+(gDone[t.id]?'done':'')+'" style="margin-top:14px" data-toggle-done="'+t.id+'">'+(gDone[t.id]?'\u2714 تسلط دارم':'علامت به‌عنوان یادگرفته‌شده')+'</button>';
      html += '</div></div></div>';
    });
    html += '</div>';
  });
  return html;
}

function renderTips(){
  var html = '<div class="section-title">نکات تستی و استراتژی آزمون</div><div class="group">';
  TIPS.forEach(function(k){
    html += '<div class="card"><div class="card-head" data-toggle="'+k.id+'"><div class="title-wrap"><span class="t">'+k.t+'</span></div><span class="chev">&#9662;</span></div>';
    html += '<div class="card-body"><ul class="tl">'+k.items.map(function(i){return '<li>'+i+'</li>';}).join('')+'</ul></div></div>';
  });
  return html + '</div>';
}

function renderVocab(){
  var html = '';
  html += '<div class="daily-card">';
  html += '<div class="daily-eyebrow">کلمه امروز</div>';
  html += '<h1 class="daily-title">'+emo(todayWord)+' '+todayWord.w+' <span style="font-weight:400;color:var(--fg-mut);font-size:14px">'+todayWord.ipa+'</span></h1>';
  html += '<p class="daily-usage">'+todayWord.fa+' &middot; ('+todayWord.pos+'.)</p>';
  if(PARTS[todayWord.w]) html += '<div class="parts">🧩 '+PARTS[todayWord.w]+'</div>';
  html += '<div class="vex" style="font-size:14px">'+todayWord.ex+'</div>';
  html += '<button class="daily-btn '+(vDone[todayWord.w]?'done':'')+'" data-today-word-toggle>'+(vDone[todayWord.w]?'\u2714 امروز رو یاد گرفتی':'یاد گرفتم، علامت بزن')+'</button>';
  html += '</div>';

  html += '<div class="chips">';
  html += '<button class="chip '+(activeCat==='all'?'active':'')+'" data-cat="all">همه</button>';
  CATS.forEach(function(c){ html += '<button class="chip '+(activeCat===c[0]?'active':'')+'" data-cat="'+c[0]+'">'+c[1]+'</button>'; });
  html += '</div>';

  var list = activeCat==='all' ? VOCAB : VOCAB.filter(function(v){return v.cat===activeCat;});
  html += '<div class="vcount">'+list.length+' کلمه</div>';
  html += '<div class="group">';
  list.forEach(function(v){
    html += '<div class="vcard" data-vcard="'+v.w+'">';
    html += '<div class="vhead" data-vtoggle="'+v.w+'">';
    html += '<div class="vword"><div class="w">'+emo(v)+' '+v.w+(vDone[v.w]?' \u2714':'')+'</div><div class="ipa">'+v.ipa+'</div></div>';
    html += '<span class="vpos">'+v.pos+'.</span></div>';
    html += '<div class="vbody"><div class="vbody-inner">';
    html += '<p class="vfa">'+v.fa+'</p>';
    html += '<button class="mini" style="width:auto;padding:4px 12px" data-say="'+v.w+'" data-lang="en-GB">🔊 British</button> <button class="mini" style="width:auto;padding:4px 12px" data-say="'+v.w+'" data-lang="en-US">🔊 American</button>';
    if(PARTS[v.w]) html += '<div class="parts">🧩 '+PARTS[v.w]+'</div>';
    html += '<p class="vex">'+v.ex+'</p>';
    html += '<button class="mini-btn '+(vDone[v.w]?'done':'')+'" data-vdone="'+v.w+'">'+(vDone[v.w]?'\u2714 بلدم':'یاد گرفتم')+'</button>';
    html += '</div></div></div>';
  });
  html += '</div>';
  return html;
}

function renderAcc(title, list){
  var html = '<div class="section-title">'+title+'</div><div class="group">';
  list.forEach(function(k){
    html += '<div class="card"><div class="card-head" data-toggle="'+k.id+'"><div class="title-wrap"><span class="t">'+k.t+'</span></div><span class="chev">&#9662;</span></div>';
    html += '<div class="card-body"><ul class="tl">'+k.items.map(function(i){return '<li>'+i+'</li>';}).join('')+'</ul></div></div>';
  });
  return html + '</div>';
}
function renderWriting(){ return renderAcc('راهنمای کامل Writing', WRITING); }
function pcard(p){
  return '<div class="vcard"><div class="vhead" data-vtoggle="x"><div class="vword"><div class="w">'+p.p+'</div></div><span class="vpos">'+p.t+'</span></div><div class="vbody"><div class="vbody-inner"><p class="vfa">'+p.fa+'</p><p class="vex">'+p.ex+'</p></div></div></div>';
}
function renderPhrases(){
  var html = '<div class="section-title">Collocations (هم‌نشینی‌های طبیعی)</div><div class="group">';
  html += PHRASES.filter(function(p){return p.t==='collocation';}).map(pcard).join('') + '</div>';
  html += '<div class="section-title">Phrasal Verbs</div><div class="group">';
  html += PHRASES.filter(function(p){return p.t==='phrasal verb';}).map(pcard).join('') + '</div>';
  return html;
}
function renderQuiz(){
  var score = 0, done = 0;
  QUIZ.forEach(function(q,i){ if(quizAns[i]!==undefined){ done++; if(quizAns[i]===q.a) score++; } });
  var html = '<div class="score">امتیاز: '+score+' از '+QUIZ.length+' ('+done+' پاسخ داده‌شده)</div>';
  QUIZ.forEach(function(q,i){
    html += '<div class="qcard"><p class="qq">'+(i+1)+'. '+q.q+'</p>';
    q.o.forEach(function(o,j){
      var cls = '';
      if(quizAns[i]!==undefined){ if(j===q.a) cls=' ok'; else if(j===quizAns[i]) cls=' bad'; }
      html += '<button class="opt'+cls+'" data-q="'+i+'" data-qo="'+j+'">'+o+'</button>';
    });
    if(quizAns[i]!==undefined) html += '<div class="expl">'+q.e+'</div>';
    html += '</div>';
  });
  html += '<button class="daily-btn done" data-qreset>شروع دوباره</button>';
  return html;
}

var NAVS = [['grammar','گرامر'],['vocab','لغات'],['ielts','آیلتس'],['quiz','تست'],['acct','پروفایل']];
var NAVICON = {"grammar": "<path d=\"M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5z\"/><path d=\"M4 21.5v-17\"/>", "vocab": "<path d=\"M3 18 7.5 6 12 18M4.8 14h5.4\"/><circle cx=\"17\" cy=\"15\" r=\"3\"/><path d=\"M20 12v6\"/>", "ielts": "<circle cx=\"12\" cy=\"12\" r=\"9\"/><circle cx=\"12\" cy=\"12\" r=\"5\"/><circle cx=\"12\" cy=\"12\" r=\"1.5\"/>", "quiz": "<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"m8 12.5 3 3 5-6\"/>", "acct": "<circle cx=\"12\" cy=\"8\" r=\"4\"/><path d=\"M4 21c0-4 4-6 8-6s8 2 8 6\"/>"};
var SUBV = ['writing','phrases','tips','speaking','rl','s26','y26'];
var HUB = [['writing','✍️','رایتینگ','Task 1 و 2، ساختار و عبارت‌ها'],['y26','📝','سؤال‌های ۲۰۲۶','موضوع‌های Writing گزارش‌شده'],['speaking','🎤','اسپیکینگ','Part 1 تا 3 و تلفظ'],['s26','🗣️','Speaking ۲۰۲۶','cue cardهای گزارش‌شده'],['rl','📖','ریدینگ و لیسنینگ','روش‌ها و تمرین'],['phrases','🔗','عبارات','collocation و phrasal verb'],['tips','💡','نکات آزمون','استراتژی و نمره‌دهی']];
function navOf(v){ return (v==='grammar'||v==='vocab'||v==='quiz'||v==='acct') ? v : 'ielts'; }
function bnav(){
  var cur = navOf(view), h = '<nav class="bnav"><div class="bnav-in">';
  NAVS.forEach(function(n){
    h += '<button class="'+(cur===n[0]?'on':'')+'" data-view="'+n[0]+'"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+NAVICON[n[0]]+'</svg><span>'+n[1]+'</span></button>';
  });
  return h + '</div></nav>';
}
function backBtn(){ return SUBV.indexOf(view) >= 0 ? '<button class="back" data-view="ielts">&lsaquo; بازگشت به بخش آیلتس</button>' : ''; }
function renderHub(){
  var h = '<div class="section-title">بخش آیلتس</div><div class="hub">';
  HUB.forEach(function(x){ h += '<button class="hubc" data-view="'+x[0]+'"><span class="hi">'+x[1]+'</span><b>'+x[2]+'</b><small>'+x[3]+'</small></button>'; });
  return h + '</div>';
}
function render(){
  var gp = gProgress(), vp = vProgress();
  var pct = view==='vocab' ? vp.pct : gp.pct;
  var lbl = view==='vocab' ? (vp.n+' از '+vp.total+' کلمه یاد گرفتی') : (gp.n+' از '+gp.total+' مبحث گرامر تسلط پیدا کردی');
  var app = document.getElementById('app');
  var html = '';
  html += '<header class="top"><div class="row">';
  html += '<div class="brand">Haman English<small>مرور روزانه‌ی گرامر و لغات آیلتس</small></div>';
  html += '<div style="display:flex;gap:8px;align-items:flex-start"><button class="acctbtn" data-view="acct">👤 '+(session?'پروفایل':'ورود / ثبت‌نام')+'</button><div class="streak"><div class="num">'+streak+'</div><div class="lbl">روز پیاپی</div></div></div>';
  html += '</div>';
  html += '<div class="progressbar"><div style="width:'+pct+'%"></div></div>';
  html += '<div class="progress-lbl">'+lbl+'</div>';
  html += '</header>';
  html += '<div class="wrap">';
  html += backBtn() + (view==='wlab' ? renderWLab() : (view==='slab' ? renderSLab() : (view==='review' ? renderReview() : (view==='errors' ? renderErrors() : (view==='ielts' ? renderHub() : (view==='grammar' ? renderGrammar() : (view==='vocab' ? renderVocab() : (view==='acct' ? renderAccount() : (view==='s26' ? renderAcc('Speaking Part 2: موضوع‌های گزارش‌شده ۲۰۲۶', SPEAK26) : (view==='y26' ? renderAcc('موضوع‌های گزارش‌شده ۲۰۲۶ (Writing Task 2)', Y26) : (view==='speaking' ? renderAcc('راهنمای کامل Speaking', SPEAK) : (view==='rl' ? renderAcc('Reading و Listening', RL) : (view==='writing' ? renderWriting() : (view==='phrases' ? renderPhrases() : (view==='quiz' ? renderQuiz() : renderTips())))))))))))))));
  html += '<footer>Haman English &middot; ساخته‌شده برای مرور روزانه</footer>';
  html += '</div>';
  html += bnav();
  var sy = window.scrollY; app.innerHTML = html;
  bind(); window.scrollTo(0, sy);
}

function bind(){
  var app = document.getElementById('app');
  app.querySelectorAll('[data-view]').forEach(function(el){
    el.addEventListener('click', function(){ view = el.getAttribute('data-view'); render(); window.scrollTo(0, 0); });
  });
  app.querySelectorAll('[data-toggle]').forEach(function(el){
    el.addEventListener('click', function(){ el.closest('.card').classList.toggle('open'); });
  });
  var tBtn = app.querySelector('[data-today-toggle]');
  if(tBtn){ tBtn.addEventListener('click', function(){ gDone[todayTense.id] = !gDone[todayTense.id]; save('haman_done', gDone); render(); }); }
  app.querySelectorAll('[data-toggle-done]').forEach(function(el){
    el.addEventListener('click', function(e){ e.stopPropagation(); var id = el.getAttribute('data-toggle-done'); gDone[id] = !gDone[id]; save('haman_done', gDone); render(); });
  });
  var twBtn = app.querySelector('[data-today-word-toggle]');
  if(twBtn){ twBtn.addEventListener('click', function(){ vDone[todayWord.w] = !vDone[todayWord.w]; save('haman_vocab_done', vDone); render(); }); }
  app.querySelectorAll('[data-cat]').forEach(function(el){
    el.addEventListener('click', function(){ activeCat = el.getAttribute('data-cat'); render(); });
  });
  app.querySelectorAll('[data-vtoggle]').forEach(function(el){
    el.addEventListener('click', function(){ el.closest('.vcard').classList.toggle('open'); });
  });
  app.querySelectorAll('[data-vdone]').forEach(function(el){
    el.addEventListener('click', function(e){ e.stopPropagation(); var w = el.getAttribute('data-vdone'); vDone[w] = !vDone[w]; save('haman_vocab_done', vDone); render(); });
  });
  app.querySelectorAll('[data-qo]').forEach(function(el){
    el.addEventListener('click', function(){ var q = +el.getAttribute('data-q'); if(quizAns[q]===undefined){ quizAns[q] = +el.getAttribute('data-qo'); if(typeof onQuizAnswer === 'function') onQuizAnswer(q, quizAns[q]); render(); if(Object.keys(quizAns).length === QUIZ.length){ var sc = 0; QUIZ.forEach(function(x,i){ if(quizAns[i] === x.a) sc++; }); recordQuiz(sc); } } });
  });
  app.querySelectorAll('[data-auth]').forEach(function(el){
    el.addEventListener('click', function(){
      var m = el.getAttribute('data-auth');
      if(m === 'in' || m === 'up') doAuth(m);
      else if(m === 'google'){ location.href = SB_URL + '/auth/v1/authorize?provider=google&redirect_to=' + encodeURIComponent(location.origin + location.pathname); }
      else if(m === 'name'){ prefs.name = (document.getElementById('p_name') || {}).value || ''; save('haman_prefs', prefs); authMsg = ''; render(); }
      else if(m === 'wipe'){
        if(window.confirm('همهٔ پیشرفت و نمره‌های ذخیره‌شده روی سرور حذف شود؟ (داده‌های روی این دستگاه می‌مانند)')){
          getToken().then(function(t){ if(!t) return; var id = session.user.id; return Promise.all([sbFetch('/rest/v1/progress?user_id=eq.'+id, {method:'DELETE'}, t), sbFetch('/rest/v1/quiz_results?user_id=eq.'+id, {method:'DELETE'}, t)]); }).then(function(){ quizHist = []; authMsg = 'داده‌های سرور حذف شد.'; render(); }).catch(function(){ authMsg = 'حذف انجام نشد.'; render(); });
        }
      }
      else if(m === 'sync'){ authMsg = 'در حال همگام‌سازی...'; render(); pullMerge().then(function(){ authMsg = 'همگام‌سازی شد.'; render(); }); }
      else if(m === 'out'){ logoutClean(); }
    });
  });
  app.querySelectorAll('[data-band]').forEach(function(el){
    el.addEventListener('click', function(){ prefs.band = el.getAttribute('data-band'); save('haman_prefs', prefs); render(); });
  });
  app.querySelectorAll('[data-date]').forEach(function(el){
    el.addEventListener('change', function(){ prefs.exam = el.value; save('haman_prefs', prefs); render(); });
  });
  var qr = app.querySelector('[data-qreset]');
  if(qr){ qr.addEventListener('click', function(){ quizAns = {}; render(); }); }
}
async function handleHash(){
  var h = location.hash ? location.hash.slice(1) : ''; if(!h) return;
  var p = {};
  h.split('&').forEach(function(kv){ var a = kv.split('='); p[a[0]] = decodeURIComponent((a[1] || '').replace(/\+/g, ' ')); });
  if(p.error_description){ authMsg = 'خطا: ' + p.error_description + ' | اگر قبلاً ثبت‌نام کرده‌اید، مستقیم وارد شوید.'; view = 'acct'; history.replaceState(null, '', location.pathname); render(); return; }
  if(p.access_token){
    try{
      var r = await sbFetch('/auth/v1/user', {}, p.access_token);
      if(r.ok){ var u = await r.json(); setSession({access_token: p.access_token, refresh_token: p.refresh_token, expires_in: +p.expires_in || 3600, user: u}); view = 'acct'; authMsg = 'ایمیل تأیید شد و وارد شدید.'; }
    }catch(e){}
    history.replaceState(null, '', location.pathname);
    await pullMerge();
  }
}
