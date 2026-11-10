/* srs.js - Phase 1: spaced repetition (SRS), Error Bank, study stats, dashboard. No AI involved. */
var DAYS = [0, 1, 3, 7, 14, 30, 60], DAY_MS = 86400000;
var srs = load('hm_srs', {}), errs = load('hm_err', []), days = load('hm_days', {});
var srsDirty = {}, errDirty = {}, dayDirty = false, srsTimer = null, rv = null, qr = null, lastInput = Date.now();
var CATL = {spelling: 'املا', recall: 'یادآوری لغت', quiz: 'گرامر (تست)', listening: 'تشخیص شنیداری', 'word count': 'تعداد کلمه', formality: 'رسمی‌بودن (کوتاه‌نویسی)', paragraphing: 'پاراگراف‌بندی', repetition: 'تکرار لغت',
  TA: 'Task Achievement', TR: 'Task Response', CC: 'Coherence & Cohesion', LR: 'Lexical Resource', GRA: 'Grammar (Writing)', 'S-FC': 'Fluency & Coherence (Speaking)', 'S-LR': 'Lexical Resource (Speaking)', 'S-GRA': 'Grammar (Speaking)', 'S-PRON': 'Pronunciation (Speaking)'};
var QRULES = [[/شرطی|conditional|If I/i, 'شرطی‌ها'], [/مجهول|passive/i, 'مجهول'], [/present perfect|since|future/i, 'زمان فعل'], [/مفرد|number of/, 'مطابقت فاعل و فعل'], [/غیرقابل‌شمارش|uncountable/, 'قابل‌شمارش / غیرقابل‌شمارش'], [/collocation/i, 'Collocation'], [/Despite|حرف اضافه/, 'حروف اضافه'], [/-ing|suggest|look forward|مصدر/, 'مصدر و gerund'], [/Never|وارونگی/, 'وارونگی'], [/Not Given|Task 2|Task 1/, 'استراتژی آزمون'], [/اسم|صفت|قید|noun|Which word/, 'ساخت واژه'], [/مترادف|mitigate|means|investigate/, 'انتخاب لغت']];
function quizCat(x){ var t = x.q + ' ' + x.e; for(var i = 0; i < QRULES.length; i++) if(QRULES[i][0].test(t)) return QRULES[i][1]; return 'گرامر (تست)'; }
function speak(text, lang){
  if(!('speechSynthesis' in window)) return false;
  try{ speechSynthesis.cancel(); var u = new SpeechSynthesisUtterance(text); u.lang = lang || 'en-GB'; u.rate = 0.9; speechSynthesis.speak(u); return true; }catch(e){ return false; }
}
function resolveErr(area, item){ var e = errs.filter(function(x){ return x.area === area && x.item === item && !x.res; })[0]; if(e){ e.res = true; e.ok = 2; errDirty[e.id] = 1; sv(); schedSrs(); } }
function selfErr(area, item, cat, label, checked, ex){ if(checked) resolveErr(area, item); else logErr({area: area, cat: cat, item: item, prompt: label, ua: '(تیک نخورد)', ca: '', ex: ex || ''}); }
var VMAP = {}; VOCAB.forEach(function(v){ VMAP[v.w] = v; });
NAVS.splice(2, 0, ['review', 'مرور']);
NAVICON.review = '<path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 4v5h-5"/>';
function navOf(v){ return (v==='grammar'||v==='vocab'||v==='quiz'||v==='acct'||v==='review') ? v : (v==='errors' ? 'review' : 'ielts'); }
function bnav(){
  var cur = navOf(view), dc = queueLen(), h = '<nav class="bnav" aria-label="ناوبری اصلی"><div class="bnav-in">';
  NAVS.forEach(function(n){
    h += '<button class="'+(cur===n[0]?'on':'')+'" data-view="'+n[0]+'" aria-current="'+(cur===n[0]?'page':'false')+'">'+(n[0]==='review'&&dc?'<i class="bdg">'+dc+'</i>':'')+'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+NAVICON[n[0]]+'</svg><span>'+n[1]+'</span></button>';
  });
  return h + '</div></nav>';
}
function sv(){ save('hm_srs', srs); save('hm_err', errs); save('hm_days', days); }
function dkey(d){ d = d || new Date(); return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
function dayRec(){ var k = dkey(); return days[k] || (days[k] = {s: 0, rv: 0, ok: 0, nw: 0}); }
function uuid(){ return (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c){ var r = Math.random()*16|0; return (c==='x' ? r : (r&3|8)).toString(16); }); }
/* ---- scheduling ---- */
function plan(c0, g){
  var isNew = !c0, b = isNew ? 0 : c0.b, now = Date.now(), nb, d;
  if(g === 0){ nb = 0; d = now + 600000; }
  else if(g === 1){ nb = Math.max(1, b); d = now + (isNew ? 1 : Math.max(1, Math.round(DAYS[nb]*0.6))) * DAY_MS; }
  else { nb = Math.min(6, b + (g === 3 ? 2 : 1)); d = now + DAYS[nb] * DAY_MS; }
  return {b: nb, d: d};
}
function rate(w, g){
  var old = srs[w], p = plan(old, g), c = old || {b: 0, r: 0, l: 0, d: 0, t: 0};
  if(g === 0 && old && old.b > 0) c.l++;
  c.b = p.b; c.d = p.d; c.r++; c.t = Date.now(); srs[w] = c; srsDirty[w] = 1;
  var dd = dayRec(); dd.rv++; if(g >= 2) dd.ok++; if(!old) dd.nw = (dd.nw || 0) + 1; dayDirty = true;
  sv(); schedSrs();
}
function newLeft(){ return Math.max(0, (prefs.newPerDay || 10) - (dayRec().nw || 0)); }
function buildQueue(){
  var now = Date.now();
  var due = VOCAB.filter(function(v){ var c = srs[v.w]; return c && c.d <= now; }).sort(function(a, b){ return srs[a.w].d - srs[b.w].d; });
  var fresh = VOCAB.filter(function(v){ return !srs[v.w]; }).sort(function(a, b){ return (vDone[b.w]?1:0) - (vDone[a.w]?1:0); }).slice(0, newLeft());
  return due.concat(fresh);
}
function queueLen(){ return buildQueue().length; }
function ivLabel(c, g){ if(g === 0) return '۱۰ دقیقه'; var d = Math.round((plan(c, g).d - Date.now()) / DAY_MS); return d + ' روز'; }
/* ---- error bank ---- */
function logErr(o){
  var e = errs.filter(function(x){ return x.area === o.area && x.item === o.item && !x.res; })[0];
  if(e){ e.ts = Date.now(); e.ua = o.ua; e.ok = 0; errDirty[e.id] = 1; }
  else { o.id = uuid(); o.ts = Date.now(); o.ok = 0; o.res = false; errs.unshift(o); errs = errs.slice(0, 300); errDirty[o.id] = 1; }
  sv(); schedSrs();
}
function errUpdate(e, ok){ if(ok){ e.ok++; if(e.ok >= 2) e.res = true; } else { e.ok = 0; e.res = false; } errDirty[e.id] = 1; sv(); schedSrs(); }
function onQuizAnswer(q, a){
  var x = QUIZ[q]; if(a === x.a) return;
  logErr({area: 'quiz', cat: quizCat(x), item: 'T' + q, prompt: x.q, ua: x.o[a], ca: x.o[x.a], ex: x.e});
}
function openErrs(){ return errs.filter(function(e){ return !e.res; }); }
/* ---- study time (counts only while the page is visible and recently used) ---- */
['click', 'keydown', 'touchstart', 'scroll'].forEach(function(ev){ window.addEventListener(ev, function(){ lastInput = Date.now(); }, {passive: true}); });
setInterval(function(){
  if(document.visibilityState === 'visible' && Date.now() - lastInput < 60000){ var d = dayRec(); d.s++; dayDirty = true; if(d.s % 20 === 0){ sv(); schedSrs(); } }
}, 1000);
/* ---- sync with Supabase (only when logged in; tables are protected by RLS) ---- */
function schedSrs(){ if(!session) return; clearTimeout(srsTimer); srsTimer = setTimeout(function(){ srsSync().catch(function(){}); }, 2500); }
async function srsSync(){
  var t = await getToken(); if(!t) return;
  var H = {'Prefer': 'resolution=merge-duplicates'};
  var r = await sbFetch('/rest/v1/vocab_progress?select=word,box,due_at,reps,lapses,last_at&limit=1000', {}, t);
  if(r.ok){ (await r.json()).forEach(function(x){ var ts = Date.parse(x.last_at), c = srs[x.word]; if(!c || ts > c.t){ srs[x.word] = {b: x.box, d: Date.parse(x.due_at), r: x.reps, l: x.lapses, t: ts}; delete srsDirty[x.word]; } }); }
  r = await sbFetch('/rest/v1/error_log?select=id,area,category,item,prompt,user_answer,correct_answer,explanation,streak,resolved,created_at&order=created_at.desc&limit=300', {}, t);
  if(r.ok){ (await r.json()).forEach(function(x){ var e = errs.filter(function(y){ return y.id === x.id; })[0];
    if(!e){ errs.push({id: x.id, area: x.area, cat: x.category, item: x.item, prompt: x.prompt, ua: x.user_answer, ca: x.correct_answer, ex: x.explanation, ok: x.streak, res: x.resolved, ts: Date.parse(x.created_at)}); }
    else { if(x.resolved) e.res = true; if(x.streak > e.ok) e.ok = x.streak; } });
    errs.sort(function(a, b){ return b.ts - a.ts; }); errs = errs.slice(0, 300); }
  r = await sbFetch('/rest/v1/study_days?select=day,seconds,reviews,correct&order=day.desc&limit=60', {}, t);
  if(r.ok){ (await r.json()).forEach(function(x){ var d = days[x.day] || (days[x.day] = {s: 0, rv: 0, ok: 0, nw: 0}); d.s = Math.max(d.s, x.seconds); d.rv = Math.max(d.rv, x.reviews); d.ok = Math.max(d.ok, x.correct); }); }
  sv();
  var rows = Object.keys(srsDirty).filter(function(w){ return srs[w]; }).map(function(w){ var c = srs[w]; return {user_id: session.user.id, word: w, box: c.b, due_at: new Date(c.d).toISOString(), reps: c.r, lapses: c.l, last_at: new Date(c.t).toISOString()}; });
  if(rows.length){ var p = await sbFetch('/rest/v1/vocab_progress', {method: 'POST', headers: H, body: rows}, t); if(p.ok) srsDirty = {}; }
  var er = Object.keys(errDirty).map(function(id){ return errs.filter(function(e){ return e.id === id; })[0]; }).filter(Boolean).map(function(e){ return {id: e.id, user_id: session.user.id, area: e.area, category: e.cat, item: String(e.item).slice(0, 120), prompt: String(e.prompt || '').slice(0, 600), user_answer: String(e.ua || '').slice(0, 300), correct_answer: String(e.ca || '').slice(0, 300), explanation: String(e.ex || '').slice(0, 600), streak: e.ok || 0, resolved: !!e.res, created_at: new Date(e.ts).toISOString()}; });
  if(er.length){ var q = await sbFetch('/rest/v1/error_log', {method: 'POST', headers: H, body: er}, t); if(q.ok) errDirty = {}; }
  if(dayDirty){ var d = dayRec(); var s = await sbFetch('/rest/v1/study_days', {method: 'POST', headers: H, body: [{user_id: session.user.id, day: dkey(), seconds: d.s, reviews: d.rv, correct: d.ok}]}, t); if(s.ok) dayDirty = false; }
  if(typeof wSync === 'function') await wSync(t);
}
async function logoutClean(){
  authMsg = 'در حال خروج...'; render();
  try{ await push(); await srsSync(); }catch(e){}
  ['haman_session','haman_done','haman_vocab_done','haman_streak','haman_prefs','haman_qlocal','haman_last_visit','hm_srs','hm_err','hm_days','hm_wsub','hm_wdraft','hm_spk','hm_ex','hm_plan'].forEach(function(k){ try{ localStorage.removeItem(k); }catch(e){} });
  try{ indexedDB.deleteDatabase('hm_audio'); }catch(e){} try{ W = []; WD = {}; SH = []; EXS = {}; PL = {}; ex = null; }catch(e){}
  session = null; gDone = {}; vDone = {}; prefs = {}; qLocal = []; quizHist = []; srs = {}; errs = []; days = {}; srsDirty = {}; errDirty = {}; rv = null; streak = 1;
  authMsg = 'خارج شدید. داده‌های این دستگاه برای حفظ حریم خصوصی پاک شد.'; render();
}
/* ---- review sessions ---- */
function norm(s){ return String(s).toLowerCase().replace(/[.,!?;:]+$/, '').replace(/\s+/g, ' ').trim(); }
function lev(a, b){ var m = [], i, j; for(i = 0; i <= a.length; i++) m[i] = [i]; for(j = 1; j <= b.length; j++) m[0][j] = j;
  for(i = 1; i <= a.length; i++) for(j = 1; j <= b.length; j++) m[i][j] = Math.min(m[i-1][j] + 1, m[i][j-1] + 1, m[i-1][j-1] + (a[i-1] === b[j-1] ? 0 : 1)); return m[a.length][b.length]; }
function expOf(v){ var m = v.ex.match(/<b>(.*?)<\/b>/); return m ? m[1] : v.w; }
function mkSession(mode, words, errMode){ return {mode: mode, q: words, i: 0, show: false, res: null, err: !!errMode, n: 0, ok: 0, req: {}, done: words.length === 0}; }
function advance(){ rv.i++; rv.show = false; rv.res = null; if(rv.i >= rv.q.length) rv.done = true; }
function applyGrade(g){
  var v = rv.q[rv.i]; rv.n++; if(g >= 2) rv.ok++;
  if(!rv.err) rate(v.w, g);
  if(g === 0){ if(rv.mode === 'flip') logErr({area: 'vocab', cat: 'recall', item: v.w, prompt: v.fa, ua: '(نمی‌دانستم)', ca: v.w, ex: v.fa}); if(!rv.err && !rv.req[v.w]){ rv.req[v.w] = 1; rv.q.push(v); } }
  advance();
}
function checkTyped(){
  var v = rv.q[rv.i], inp = document.getElementById('rv_in'), ans = norm(inp ? inp.value : ''), ex = rv.mode === 'listen' ? v.w : expOf(v);
  if(!ans) return;
  var ok = (ans === norm(ex) || ans === norm(v.w)); rv.res = {ok: ok, ans: ans};
  if(ok){ if(rv.err){ var e = errs.filter(function(x){ return x.area === 'vocab' && x.item === v.w && !x.res; })[0]; if(e) errUpdate(e, true); rv.n++; rv.ok++; } }
  else {
    var cat = lev(ans, norm(ex)) <= 2 ? 'spelling' : (rv.mode === 'listen' ? 'listening' : 'recall');
    logErr({area: 'vocab', cat: cat, item: v.w, prompt: v.ex.replace(/<[^>]+>/g, '').slice(0, 300), ua: ans.slice(0, 100), ca: ex, ex: v.fa});
    if(rv.err){ rv.n++; } else { rate(v.w, 0); rv.n++; if(!rv.req[v.w]){ rv.req[v.w] = 1; rv.q.push(v); } }
  }
}
function renderReview(){
  var h = '<div class="section-title">مرور لغات با تکرار فاصله‌دار (SRS)</div>';
  if(rv && !rv.done) return h + rSession();
  if(rv && rv.done){
    var acc = rv.n ? Math.round(rv.ok / rv.n * 100) : 0;
    h += '<div class="daily-card" style="margin-top:0"><div class="daily-eyebrow">جلسه تمام شد</div><div class="big">'+acc+'%</div><p class="daily-usage">'+rv.ok+' پاسخ درست از '+rv.n+' پاسخ.'+(rv.err ? '' : ' مرورهای بعدی خودکار زمان‌بندی شد.')+'</p><button class="daily-btn" data-rv="end">بازگشت</button></div>';
    return h;
  }
  var n = queueLen(), due = VOCAB.filter(function(v){ var c = srs[v.w]; return c && c.d <= Date.now(); }).length, oe = openErrs().length;
  var seen = Object.keys(srs).length, mast = VOCAB.filter(function(v){ return srs[v.w] && srs[v.w].b >= 5; }).length;
  h += '<div class="daily-card" style="margin-top:0"><div class="daily-eyebrow">امروز</div><div class="big">'+n+' کارت</div><p class="daily-usage">'+due+' مرور سررسید + '+(n - due)+' لغت جدید (سقف روزانه '+(prefs.newPerDay || 10)+')</p>';
  if(n){ h += '<button class="daily-btn" data-rv="start" data-m="flip">شروع فلش‌کارت</button><button class="daily-btn done" style="margin-top:8px" data-rv="start" data-m="type">شروع تمرین تایپی (جای خالی)</button><button class="daily-btn done" style="margin-top:8px" data-rv="start" data-m="listen">شنیدن و نوشتن (املا)</button>'; }
  else h += '<p class="daily-usage">امروز مروری باقی نمانده. فردا دوباره سر بزن، یا سقف لغت جدید را در پروفایل بالا ببر.</p>';
  h += '</div><div class="stats" style="margin-top:12px">'+stat(seen+' / '+VOCAB.length,'کارت دیده‌شده')+stat(mast,'تسلط (فاصله ≥ ۳۰ روز)')+'</div>';
  h += '<div class="daily-card"><div class="daily-eyebrow">بانک خطا</div><p class="daily-usage">'+oe+' اشتباه باز. هر اشتباه با دو پاسخ درست پشت‌سرهم حل‌شده حساب می‌شود.</p><button class="daily-btn done" data-view="errors">باز کردن بانک خطا</button></div>';
  h += '<p class="daily-usage" style="margin:14px 4px">روش کار: هر لغت پس از پاسخ درست با فاصله‌های ۱، ۳، ۷، ۱۴، ۳۰ و ۶۰ روز دوباره می‌آید. با «دوباره» به ابتدا برمی‌گردد. تیک «یادگرفتم» در تب لغات به‌تنهایی به‌معنی تسلط نیست؛ فقط لغت را زودتر در صف مرور می‌گذارد.</p>';
  return h;
}
function rSession(){
  var v = rv.q[rv.i], c = srs[v.w], isNew = !c;
  var h = '<div class="daily-eyebrow" style="margin:0 4px 6px">'+(rv.i + 1)+' / '+rv.q.length+(rv.err ? ' · تمرین اشتباهات' : '')+'</div><div class="daily-card" style="margin-top:0">';
  if(rv.mode === 'flip'){
    h += '<div class="daily-eyebrow">'+(isNew ? 'کلمهٔ جدید' : 'مرور')+' · '+v.pos+'</div><div class="rvf">'+emo(v)+' '+v.fa+'</div>';
    if(!rv.show) h += '<p class="daily-usage">انگلیسی‌اش را به ذهن بیاور، بعد پاسخ را ببین.</p><button class="daily-btn" data-rv="show">نمایش پاسخ</button>';
    else {
      h += '<div class="w" style="font-size:22px;direction:ltr;text-align:left">'+v.w+' <button class="mini" style="width:auto;display:inline;padding:2px 8px" data-say="'+esc(v.w)+'" data-lang="en-GB">🔊</button></div><div class="pl">'+v.ipa+'</div><p class="vex">'+v.ex+'</p>'+(PARTS[v.w] ? '<div class="parts">🧩 '+PARTS[v.w]+'</div>' : '');
      h += '<div class="rate">'+[['دوباره', 0], ['سخت', 1], ['خوب', 2], ['آسان', 3]].map(function(x){ return '<button class="g'+x[1]+'" data-rv="grade" data-g="'+x[1]+'">'+x[0]+'<small>'+ivLabel(c, x[1])+'</small></button>'; }).join('')+'</div>';
    }
  } else {
    var ex = rv.mode === 'listen' ? v.w : expOf(v), cl = v.ex.replace(/<b>.*?<\/b>/, '_____');
    if(rv.mode === 'listen') h += '<div class="daily-eyebrow">گوش بده و بنویس · '+v.pos+'</div><button class="daily-btn" data-say="'+esc(v.w)+'" data-lang="en-GB">🔊 پخش (بریتیش)</button><button class="mini" data-say="'+esc(v.w)+'" data-lang="en-US">🔊 آمریکایی</button><div class="vfa">'+(rv.res ? v.fa : 'کلمه را بشنو و املایش را بنویس ('+ex.length+' حرف)')+'</div>';
    else h += '<div class="daily-eyebrow">جای خالی · '+v.pos+'</div><p class="vex" style="font-size:15px">'+cl+'</p><div class="vfa">'+v.fa+' &middot; با حرف «'+esc(ex.charAt(0))+'» شروع می‌شود ('+ex.length+' حرف)</div>';
    if(!rv.res) h += '<input class="inp" id="rv_in" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="type the word"><button class="daily-btn" data-rv="check">بررسی</button>';
    else if(rv.res.ok){
      h += '<div class="res-ok">درست است ✔ '+esc(ex)+'</div>';
      h += rv.err ? '<button class="daily-btn" data-rv="next">ادامه</button>' : '<div class="rate" style="grid-template-columns:1fr 1fr"><button class="g2" data-rv="grade" data-g="2">خوب<small>'+ivLabel(c, 2)+'</small></button><button class="g3" data-rv="grade" data-g="3">آسان<small>'+ivLabel(c, 3)+'</small></button></div>';
    } else h += '<div class="res-bad">نادرست ✘ پاسخ: '+esc(ex)+'</div><p class="vex">'+v.ex+'</p><div class="pl">'+v.ipa+'</div><button class="daily-btn" data-rv="next">ادامه</button>';
  }
  return h + '</div><button class="daily-btn done" data-rv="end">پایان جلسه</button>';
}
function renderErrors(){
  var oe = openErrs(), cats = {}; oe.forEach(function(e){ cats[e.cat] = (cats[e.cat] || 0) + 1; });
  var h = '<button class="back" data-view="review">&lsaquo; بازگشت به مرور</button><div class="section-title">بانک خطا</div><div class="daily-card" style="margin-top:0"><div class="big">'+oe.length+'</div><p class="daily-usage">اشتباه باز · '+(errs.length - oe.length)+' حل‌شده</p>';
  Object.keys(cats).sort(function(a, b){ return cats[b] - cats[a]; }).forEach(function(k){ h += '<div class="ecat"><span>'+(CATL[k] || k)+'</span><b>'+cats[k]+'</b></div>'; });
  var vw = oe.filter(function(e){ return e.area === 'vocab' && VMAP[e.item]; });
  if(vw.length) h += '<button class="daily-btn" data-rv="errall">تمرین همهٔ لغت‌های اشتباه ('+vw.length+')</button>';
  h += '</div>';
  if(!oe.length) return h + '<p class="daily-usage" style="margin:14px 4px">هنوز اشتباه باز نداری. اشتباه‌های تست و مرور اینجا جمع می‌شوند.</p>';
  h += '<div class="daily-card" style="padding:6px 16px">';
  oe.slice(0, 40).forEach(function(e){
    h += '<div class="eitem"><span class="tag">'+(CATL[e.cat] || e.cat)+'</span> <small>پاسخ درست پشت‌سرهم: '+e.ok+' / 2</small>';
    if(e.area === 'quiz'){
      var qi = +String(e.item).slice(1), x = QUIZ[qi];
      h += '<div class="ex" style="margin-top:6px">'+esc(e.prompt)+'</div>';
      if(qr && qr.id === e.id){
        x.o.forEach(function(o, j){ var c = ''; if(qr.pick !== undefined){ if(j === x.a) c = ' ok'; else if(j === qr.pick) c = ' bad'; } h += '<button class="opt2'+c+'" data-rv="qpick" data-id="'+e.id+'" data-o="'+j+'">'+o+'</button>'; });
        if(qr.pick !== undefined) h += '<div class="vfa">'+x.e+'</div><button class="mini" data-rv="qclose">بستن</button>';
      } else h += '<div class="vfa">پاسخ تو: '+esc(e.ua)+' ← درست: '+esc(e.ca)+'</div><div class="vfa">'+esc(e.ex)+'</div><button class="mini" data-rv="qretry" data-id="'+e.id+'">حل دوباره</button>';
    } else if(e.area === 'writing' || e.area === 'speaking' || e.area === 'exercise'){ h += '<div class="ex" style="margin-top:6px">'+esc(e.prompt || '')+'</div><div class="vfa">'+(e.area === 'exercise' ? 'پاسخ تو: '+esc(e.ua)+' ← درست: '+esc(e.ca)+' · ' : '')+esc(e.ex || '')+(e.area !== 'exercise' && e.ua ? ' · '+esc(e.ua) : '')+'</div>'; } else h += '<div class="ex" style="margin-top:6px"><b>'+esc(e.item)+'</b> ('+esc(e.ex || '')+')</div><div class="vfa">پاسخ تو: '+esc(e.ua)+' ← درست: '+esc(e.ca)+'</div>'+(VMAP[e.item] ? '<button class="mini" data-rv="errword" data-w="'+esc(e.item)+'">تمرین این لغت</button>' : '');
    h += '</div>';
  });
  return h + '</div>';
}
function renderDash(){
  var st = {n: 0, l: 0, y: 0, m: 0}; VOCAB.forEach(function(v){ var c = srs[v.w]; if(!c) st.n++; else if(c.b <= 2) st.l++; else if(c.b <= 4) st.y++; else st.m++; });
  var T = VOCAB.length, wk = [], i, tot = 0, rvs = 0, oks = 0;
  for(i = 6; i >= 0; i--){ var k = dkey(new Date(Date.now() - i * DAY_MS)), r = days[k] || {s: 0, rv: 0, ok: 0}; wk.push({k: k, r: r}); tot += r.s; rvs += r.rv; oks += r.ok; }
  var mx = Math.max.apply(null, wk.map(function(x){ return x.r.s; }).concat([60])), td = days[dkey()] || {s: 0};
  var oe = openErrs(), cats = {}; oe.forEach(function(e){ cats[e.cat] = (cats[e.cat] || 0) + 1; });
  var h = '<div class="section-title">داشبورد یادگیری</div><div class="stats" style="margin-top:0">'+stat(queueLen(),'کارت امروز')+stat(st.m+' / '+T,'لغت مسلط')+stat(Math.round(td.s / 60)+' دقیقه','مطالعهٔ امروز')+stat(rvs ? Math.round(oks / rvs * 100)+'%' : '-','دقت مرور (۷ روز)')+'</div>';
  h += '<div class="daily-card" style="margin-top:12px"><div class="daily-eyebrow">مراحل یادگیری لغات</div><div class="stack"><i style="width:'+(st.m/T*100)+'%;background:#3E8E5A"></i><i style="width:'+(st.y/T*100)+'%;background:#2E6E6B"></i><i style="width:'+(st.l/T*100)+'%;background:#C98A2C"></i></div><div class="leg"><span><b style="background:#3E8E5A"></b>مسلط '+st.m+'</span><span><b style="background:#2E6E6B"></b>در حال تثبیت '+st.y+'</span><span><b style="background:#C98A2C"></b>تازه '+st.l+'</span><span><b style="background:#999"></b>ندیده '+st.n+'</span></div></div>';
  h += '<div class="daily-card" style="margin-top:12px"><div class="daily-eyebrow">زمان مطالعه (۷ روز اخیر): '+Math.round(tot / 60)+' دقیقه</div><div class="wk">'+wk.map(function(x){ return '<div style="height:'+Math.max(5, Math.round(x.r.s / mx * 100))+'%"></div>'; }).join('')+'</div><div class="wkl">'+wk.map(function(x){ return '<span>'+x.k.slice(8)+'</span>'; }).join('')+'</div></div>';
  h += '<div class="daily-card" style="margin-top:12px"><div class="daily-eyebrow">پرتکرارترین خطاها</div>';
  var ks = Object.keys(cats).sort(function(a, b){ return cats[b] - cats[a]; });
  h += ks.length ? ks.slice(0, 5).map(function(k){ return '<div class="ecat"><span>'+(CATL[k] || k)+'</span><b>'+cats[k]+'</b></div>'; }).join('') : '<p class="daily-usage">هنوز خطایی ثبت نشده.</p>';
  h += '<button class="daily-btn done" data-view="errors">بانک خطا</button></div>';
  var np = prefs.newPerDay || 10; h += '<div class="daily-card" style="margin-top:12px"><div class="daily-eyebrow">سقف لغت جدید در روز</div><div class="chips" style="padding-top:2px">'+[5, 10, 15, 20].map(function(n){ return '<button class="chip '+(np === n ? 'active' : '')+'" data-rv="npd" data-v="'+n+'">'+n+'</button>'; }).join('')+'</div></div>';
  var rec = queueLen() ? 'امروز '+queueLen()+' کارت مرور و لغت جدید داری.' : (oe.length ? 'اشتباهات باز را تمرین کن.' : 'لغت جدیدی از تب لغات شروع کن یا تست بزن.');
  h += '<div class="daily-card" style="margin-top:12px"><div class="daily-eyebrow">پیشنهاد بعدی</div><p class="daily-usage" style="margin:0">'+rec+'</p></div>';
  h += '<div class="daily-card" style="margin-top:12px"><div class="daily-eyebrow">تخمین نمرهٔ آیلتس</div><p class="daily-usage" style="margin:0">برای تخمین واقعی باید آزمون‌های شبیه‌سازی Reading و Listening و Writing/Speaking انجام شود (فاز ۴). نمره‌ای از روی درصد لغت‌ها حساب نمی‌کنیم چون گمراه‌کننده است.</p></div>';
  return h;
}
document.getElementById('app').addEventListener('click', function(e){
  var t = e.target.closest('[data-rv]'); if(!t) return;
  var a = t.getAttribute('data-rv');
  if(a === 'start'){ var m = t.getAttribute('data-m'); rv = mkSession(m, buildQueue(), false); }
  else if(a === 'npd'){ prefs.newPerDay = +t.getAttribute('data-v'); save('haman_prefs', prefs); }
  else if(a === 'show'){ rv.show = true; }
  else if(a === 'grade'){ applyGrade(+t.getAttribute('data-g')); }
  else if(a === 'check'){ checkTyped(); }
  else if(a === 'next'){ advance(); }
  else if(a === 'end'){ rv = null; }
  else if(a === 'errall'){ rv = mkSession('type', openErrs().filter(function(x){ return x.area === 'vocab' && VMAP[x.item]; }).map(function(x){ return VMAP[x.item]; }), true); view = 'review'; }
  else if(a === 'errword'){ rv = mkSession('type', [VMAP[t.getAttribute('data-w')]], true); view = 'review'; }
  else if(a === 'qretry'){ qr = {id: t.getAttribute('data-id')}; }
  else if(a === 'qclose'){ qr = null; }
  else if(a === 'qpick'){ if(qr && qr.pick === undefined){ var er = errs.filter(function(x){ return x.id === t.getAttribute('data-id'); })[0], j = +t.getAttribute('data-o'); qr.pick = j; if(er) errUpdate(er, j === QUIZ[+String(er.item).slice(1)].a); } }
  render();
  if(rv && !rv.done && rv.mode === 'listen' && !rv.res && (a === 'start' || a === 'grade' || a === 'next')) speak(rv.q[rv.i].w, 'en-GB');
});
document.getElementById('app').addEventListener('click', function(e){ var t = e.target.closest('[data-say]'); if(t){ if(!speak(t.getAttribute('data-say'), t.getAttribute('data-lang'))) alert('این مرورگر پخش صدا را پشتیبانی نمی‌کند.'); } });
document.getElementById('app').addEventListener('keydown', function(e){ if(e.key === 'Enter' && e.target.id === 'rv_in'){ checkTyped(); render(); } });
